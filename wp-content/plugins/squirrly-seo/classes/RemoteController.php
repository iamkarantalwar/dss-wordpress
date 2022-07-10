<?php
defined('ABSPATH') || die('Cheatin\' uh?');

class SQ_Classes_RemoteController
{

    public static $cache = array();
    public static $apimethod = 'get';

    /**
     * Call the Squirrly Cloud Server
     *
     * @param  string $module
     * @param  array  $args
     * @param  array  $options
     * @return string
     */
    public static function apiCall($module, $args = array(), $options = array())
    {
        $parameters = "";

        //Don't make API calls without the token unless it's login or register
        if (!SQ_Classes_Helpers_Tools::getOption('sq_api')) {
            if (!in_array($module, array('api/user/login', 'api/user/register'))) {
                return '';
            }
        }

        //predefined options
        $options = array_merge(
            array(
                'method' => self::$apimethod,
                'sslverify' => SQ_CHECK_SSL,
                'timeout' => 20,
                'headers' => array(
                    'USER-TOKEN' => SQ_Classes_Helpers_Tools::getOption('sq_api'),
                    'URL-TOKEN' => (SQ_Classes_Helpers_Tools::getOption('sq_cloud_connect') ? SQ_Classes_Helpers_Tools::getOption('sq_cloud_token') : false),
                    'USER-URL' => apply_filters('sq_homeurl', get_bloginfo('url')),
                    'LANG' => apply_filters('sq_language', get_bloginfo('language')),
                    'VERSQ' => (int)str_replace('.', '', SQ_VERSION)
                )
            ),
            $options
        );

        try {
            if (!empty($args)) {
                foreach ($args as $key => $value) {
                    if ($value <> '') {
                        $parameters .= ($parameters == "" ? "" : "&") . $key . "=" . urlencode($value);
                    }
                }
            }

            //call it with http to prevent curl issues with ssls
            $url = self::cleanUrl(_SQ_APIV2_URL_ . $module . "?" . $parameters);
            
            if (!isset(self::$cache[md5($url)])) {
                if ($options['method'] == 'post') {
                    $options['body'] = $args;
                }

                self::$cache[md5($url)] = self::sq_wpcall($url, $options);
            }

            return self::$cache[md5($url)];


        } catch (Exception $e) {
            return '';
        }

    }

    /**
     * Clear the url before the call
     *
     * @param  string $url
     * @return string
     */
    private static function cleanUrl($url)
    {
        return str_replace(array(' '), array('+'), $url);
    }

    public static function generatePassword($length = 12)
    {
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        $password = '';
        for ($i = 0; $i < $length; $i++) {
            $password .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }

        return $password;
    }

    /**
     * Get My Squirrly Link
     *
     * @param  $path
     * @return string
     */
    public static function getMySquirrlyLink($path)
    {
        return apply_filters('sq_cloudmenu', _SQ_DASH_URL_, $path);
    }

    /**
     * Get API Link
     *
     * @param  string  $path
     * @param  integer $version
     * @return string
     */
    public static function getApiLink($path)
    {
        return _SQ_APIV2_URL_ . $path . '?token=' . SQ_Classes_Helpers_Tools::getOption('sq_api') . '&url_token='.(SQ_Classes_Helpers_Tools::getOption('sq_cloud_connect') ? SQ_Classes_Helpers_Tools::getOption('sq_cloud_token') : false).'&url=' . apply_filters('sq_homeurl', get_bloginfo('url'));
    }

    /**
     * Use the WP remote call
     *
     * @param  $url
     * @param  $options
     * @return array|bool|string|WP_Error
     */
    public static function sq_wpcall($url, $options)
    {
        $method = $options['method'];
        //not accepted as option
        unset($options['method']);

        switch ($method) {
        case 'get':
            $response = wp_remote_get($url, $options);
            break;
        case 'post':
            $response = wp_remote_post($url, $options);
            break;
        default:
            $response = wp_remote_request($url, $options);
            break;
        }

        if (is_wp_error($response)) {
            SQ_Classes_Error::setError($response->get_error_message(), 'sq_error');
            return false;
        }

        $response = self::cleanResponce(wp_remote_retrieve_body($response)); //clear and get the body

        SQ_Debug::dump('wp_remote_get', $method, $url, $options, $response); //output debug
        return $response;
    }

    /**
     * Get the Json from responce if any
     *
     * @param  string $response
     * @return string
     */
    private static function cleanResponce($response)
    {
        return trim($response, '()');
    }

    /**********************
     * 
     * USER 
     ******************************/
    /**
     * @param  array $args
     * @return array|mixed|object|WP_Error
     */
    public static function connect($args = array())
    {
        self::$apimethod = 'post'; //call method
        $json = json_decode(self::apiCall('api/user/connect', $args));

        if (isset($json->error) && $json->error <> '') {

            if ($json->error == 'invalid_token') {
                SQ_Classes_Helpers_Tools::saveOptions('sq_api', false);
            }
            if ($json->error == 'disconnected') {
                SQ_Classes_Helpers_Tools::saveOptions('sq_api', false);
            }
            if ($json->error == 'banned') {
                SQ_Classes_Helpers_Tools::saveOptions('sq_api', false);
            }
            return (new WP_Error('api_error', $json->error));
        }

        //Refresh the checkin on login
        delete_transient('sq_checkin');

        return $json;
    }

    /**
     * Login user to API
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function login($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/user/login', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        //Refresh the checkin on login
        delete_transient('sq_checkin');

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Register user to API
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function register($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/user/register', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        //Refresh the checkin on login
        delete_transient('sq_checkin');

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function getCloudToken($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/user/token', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * User Checkin
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function checkin($args = array())
    {
        self::$apimethod = 'get'; //call method

        if (get_transient('sq_checkin')) {
            return get_transient('sq_checkin');
        }

        $json = json_decode(self::apiCall('api/user/checkin', $args));

        if (isset($json->error) && $json->error <> '') {

            //prevent throttling on API
            if ($json->error == 'too_many_requests') {
                SQ_Classes_Error::setError(esc_html__("Too many API attempts, please slow down the request.", 'squirrly-seo'));
                SQ_Classes_Error::hookNotices();
                return (new WP_Error('api_error', $json->error));
            } elseif ($json->error == 'maintenance') {
                SQ_Classes_Error::setError(esc_html__("Squirrly Cloud is down for a bit of maintenance right now. But we'll be back in a minute.", 'squirrly-seo'));
                SQ_Classes_Error::hookNotices();
                return (new WP_Error('maintenance', $json->error));
            }

            self::connect(); //connect the website
            return (new WP_Error('api_error', $json->error));

        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (isset($json->data->offer) && $json->data->offer <> '') {
            SQ_Classes_Helpers_Tools::saveOptions('sq_offer', $json->data->offer);
        } else {
            SQ_Classes_Helpers_Tools::saveOptions('sq_offer', false);
        }

        //Save the connections into database
        if (isset($json->data->connection_gsc) && isset($json->data->connection_ga)) {
            $connect = SQ_Classes_Helpers_Tools::getOption('connect');
            $connect['google_analytics'] = $json->data->connection_ga;
            $connect['google_search_console'] = $json->data->connection_gsc;
            SQ_Classes_Helpers_Tools::saveOptions('connect', $connect);
        }

        if(isset($json->data->subscription_devkit)) {
            SQ_Classes_Helpers_Tools::saveOptions('sq_auto_devkit', (int)$json->data->subscription_devkit);
        }

        set_transient('sq_checkin', $json->data, 60);
        return $json->data;
    }

    /********************************
     * 
     * NOTIFICATIONS 
     *********************/
    /**
     * Get the Notifications from API for the current blog
     *
     * @return array|WP_Error
     */
    public static function getNotifications()
    {
        self::$apimethod = 'get'; //call method

        $notifications = array();
        if ($json = json_decode(self::apiCall('api/audits/notifications', array()))) {

            if (isset($json->error) && $json->error <> '') {
                return (new WP_Error('api_error', $json->error));
            } elseif (!isset($json->data)) {
                return (new WP_Error('api_error', 'no_data'));
            }

            $notifications = $json->data;

        }

        return $notifications;
    }

    /**
     * Get the API stats for this blog
     *
     * @return array|WP_Error|false
     */
    public static function getStats()
    {
        self::$apimethod = 'get'; //call method

        if (get_transient('sq_stats')) {
            return get_transient('sq_stats');
        }

        $args = array();
        $json = json_decode(self::apiCall('api/user/stats', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            set_transient('sq_stats', $json->data, 60);
            return $json->data;
        }

        return false;

    }

    /**
     * Get audits from API
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getBlogAudits($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/audits/get-audits', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!isset($json->data->audits)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        return $json->data->audits;
    }

    public static function saveFeedback($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/user/feedback', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }


    /********************************
     * 
     * BRIEFCASE 
     *********************/
    public static function getBriefcaseStats($args = array())
    {
        self::$apimethod = 'get'; //call method

        if (get_transient('sq_briefcase_stats')) {
            return get_transient('sq_briefcase_stats');
        }

        $json = json_decode(self::apiCall('api/briefcase/stats', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            set_transient('sq_briefcase_stats', $json->data, 60);
            return $json->data;
        }

        return false;
    }

    public static function getBriefcase($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/briefcase/get', $args, ['timeout' => 60]));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function importBriefcaseKeywords($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/briefcase/import', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function addBriefcaseKeyword($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/briefcase/add', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function removeBriefcaseKeyword($args = array())
    {
        self::$apimethod = 'post'; //call method

        if ($json = json_decode(self::apiCall('api/briefcase/hide', $args))) {
            return $json;
        }

        return false;
    }

    public static function saveBriefcaseKeywordLabel($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/briefcase/label/keyword', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function addBriefcaseLabel($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/briefcase/label/add', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function saveBriefcaseLabel($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/briefcase/label/save', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function removeBriefcaseLabel($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/briefcase/label/delete', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function saveBriefcaseMainKeyword($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/briefcase/main', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }


    /********************************
     * 
     * KEYWORD RESEARCH 
     ****************/

    /**
     * Get KR Countries
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getKrCountries($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/kr/countries', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function getKROthers($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/kr/other', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Set Keyword Research
     *
     * @param  array $args
     * @return array|bool|mixed|object|WP_Error
     */
    public static function setKRSuggestion($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_stats');
        delete_transient('sq_briefcase_stats');

        $json = json_decode(self::apiCall('api/kr/suggestion', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function getKRSuggestion($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/kr/suggestion', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /********************************
     * 
     * KEYWORD HISTORY & FOUND  
     ****************/

    /**
     * Get Keyword Research History
     *
     * @param  array $args
     * @return array|bool|mixed|object|WP_Error
     */
    public static function getKRHistory($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/kr/history', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Get the Kr Found by API
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getKrFound($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/kr/found', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * 
     * Remove Keyword from Suggestions
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function removeKrFound($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/kr/found/delete', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }
    /********************
     * 
     * WP Posts 
     ***************************/
    /**
     * Save the post status on API
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function savePost($args = array())
    {
        self::$apimethod = 'post'; //call method

        //clear the briefcase stats
        delete_transient('sq_stats');

        $json = json_decode(self::apiCall('api/posts/update', $args, ['timeout' => 5]));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /**
     * Get the post optimization
     *
     * @param  array $args
     * @return array|mixed|object
     */
    public static function getPostOptimization($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/posts/optimizations', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /********************
     * 
     * RANKINGS 
     ***************************/

    /**
     * Add a keyword in Rank Checker
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function addSerpKeyword($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/briefcase/serp', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Delete a keyword from Rank Checker
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function deleteSerpKeyword($args = array())
    {
        self::$apimethod = 'post'; //call method

        $json = json_decode(self::apiCall('api/briefcase/serp-delete', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Get the Ranks for this blog
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getRanksStats($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/serp/stats', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Get the Ranks for this blog
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getRanks($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/serp/get-ranks', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Refresh the rank for a page/post
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function checkPostRank($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/serp/refresh', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /********************
     * 
     * FOCUS PAGES 
     ***********************/

    /**
     * Get all focus pages and add them in the SQ_Models_Domain_FocusPage object
     * Add the audit data for each focus page
     *
     * @param  array $args
     * @return SQ_Models_Domain_FocusPage|WP_Error|false
     */
    public static function getFocusPages($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/posts/focus', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Get the focus page audit
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getFocusAudits($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/audits/focus', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Add Focus Page
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function addFocusPage($args = array())
    {
        self::$apimethod = 'post'; //post call

        $json = json_decode(self::apiCall('api/posts/set-focus', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function updateFocusPage($args = array())
    {
        self::$apimethod = 'post'; //post call

        $json = json_decode(self::apiCall('api/posts/update-focus', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Delete the Focus Page
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function deleteFocusPage($args = array())
    {
        self::$apimethod = 'post'; //post call

        if (isset($args['user_post_id']) && $args['user_post_id'] > 0) {
            $json = json_decode(self::apiCall('api/posts/remove-focus/' . $args['user_post_id']));

            if (isset($json->error) && $json->error <> '') {
                return (new WP_Error('api_error', $json->error));
            } elseif (!isset($json->data)) {
                return (new WP_Error('api_error', 'no_data'));
            }

            return $json->data;
        }

        return false;
    }

    /**
     * Get all focus pages and add them in the SQ_Models_Domain_FocusPage object
     * Add the audit data for each focus page
     *
     * @param  array $args
     * @return SQ_Models_Domain_FocusPage|WP_Error|false
     */
    public static function getInspectURL($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/posts/crawl', $args, ['timeout' => 60]));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }
    /****************************************
     * 
     * CONNECTIONS 
     */
    /**
     * Disconnect Google Analytics account
     *
     * @return bool|WP_Error
     */
    public static function revokeGaConnection()
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/ga/revoke'));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        //Refresh the checkin on login
        delete_transient('sq_checkin');

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    public static function getGAToken($args = array())
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/ga/token', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    public static function getGAProperties($args = array())
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/ga/properties', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    public static function saveGAProperties($args = array())
    {
        self::$apimethod = 'post'; //post call

        $json = json_decode(self::apiCall('api/ga/properties', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /**
     * Disconnect Google Search Console account
     *
     * @return bool|WP_Error
     */
    public static function revokeGscConnection()
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/gsc/revoke'));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        //Refresh the checkin on login
        delete_transient('sq_checkin');

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    public static function syncGSC($args = array())
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/gsc/sync/kr', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    public static function getGSCToken($args = array())
    {
        self::$apimethod = 'get'; //post call

        $json = json_decode(self::apiCall('api/gsc/token', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /********************
     * 
     * AUDITS 
     *****************************/

    public static function getAuditPages($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/posts/audits', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /**
     * Get the audit page
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function getAudit($args = array())
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/audits/audit', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /**
     * Add Audit Page
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function addAuditPage($args = array())
    {
        self::$apimethod = 'post'; //post call

        $json = json_decode(self::apiCall('api/posts/set-audit', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    public static function updateAudit($args = array())
    {
        self::$apimethod = 'post'; //post call

        $json = json_decode(self::apiCall('api/posts/update-audit', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;
    }

    /**
     * Delete the Audit Page
     *
     * @param  array $args
     * @return bool|WP_Error
     */
    public static function deleteAuditPage($args = array())
    {
        self::$apimethod = 'post'; //post call

        if (isset($args['user_post_id']) && $args['user_post_id'] > 0) {

            $json = json_decode(self::apiCall('api/posts/remove-audit/' . $args['user_post_id']));

            if (isset($json->error) && $json->error <> '') {
                return (new WP_Error('api_error', $json->error));
            } elseif (!isset($json->data)) {
                return (new WP_Error('api_error', 'no_data'));
            }

            if (!empty($json->data)) {
                return $json->data;
            }

        }
        return false;
    }

    /********************
     * 
     * OTHERS 
     *****************************/
    public static function saveSettings($args)
    {
        self::$apimethod = 'post'; //call method

        self::apiCall('api/user/settings', array('settings' => wp_json_encode($args)));
    }

    /**
     * Get the Facebook APi Code
     *
     * @param  $args
     * @return bool|WP_Error
     */
    public static function getFacebookApi($args)
    {
        self::$apimethod = 'get'; //call method

        $json = json_decode(self::apiCall('api/tools/facebook', $args));

        if (isset($json->error) && $json->error <> '') {
            return (new WP_Error('api_error', $json->error));
        } elseif (!isset($json->data)) {
            return (new WP_Error('api_error', 'no_data'));
        }

        if (!empty($json->data)) {
            return $json->data;
        }

        return false;

    }

    /**
     * Load the JS for API
     */
    public static function loadJsVars()
    {
        global $post;
        $referer = '';

        $metas = json_decode(wp_json_encode(SQ_Classes_Helpers_Tools::getOption('sq_metas')));
        $sq_postID = (isset($post->ID) ? $post->ID : 0);

        //Load Squirrly Live Assistant for Elementor builder
        if (SQ_Classes_Helpers_Tools::isPluginInstalled('elementor/elementor.php')) {
            if (SQ_Classes_Helpers_Tools::getOption('sq_sla_frontend')) {
                $referer = get_post_meta($sq_postID, '_sq_sla', true);
            }
        }

        echo '<script>
                    var SQ_DEBUG = ' . (int)SQ_DEBUG . ';
                    (function($){
                        $.sq_config = {
                            sq_use: ' . (int)SQ_Classes_Helpers_Tools::getOption('sq_use') . ',
                            sq_version: "' . esc_attr(SQ_VERSION) . '",
                            sq_sla_type: "' . esc_attr(SQ_Classes_Helpers_Tools::getOption('sq_sla_type')) . '",
                            token: "' . esc_attr(SQ_Classes_Helpers_Tools::getOption('sq_api')) . '",
                            url_token: "' . (SQ_Classes_Helpers_Tools::getOption('sq_cloud_connect') ? esc_attr(SQ_Classes_Helpers_Tools::getOption('sq_cloud_token')) : false) . '",
                            sq_baseurl: "' . esc_url(_SQ_STATIC_API_URL_) . '", 
                            sq_uri: "' . esc_attr(SQ_URI) . '", 
                            sq_apiurl: "' . esc_url(_SQ_APIV2_URL_) . '",
                            user_url: "' . esc_url(apply_filters('sq_homeurl', get_bloginfo('url'))) . '",
                            language: "' . esc_attr(apply_filters('sq_language', get_bloginfo('language'))) . '",
                            referer: "' . esc_attr($referer) . '",
                            sq_keywordtag: ' . (int)SQ_Classes_Helpers_Tools::getOption('sq_keywordtag') . ',
                            sq_keyword_help: ' . (int)SQ_Classes_Helpers_Tools::getOption('sq_keyword_help') . ',
                            frontend_css: "' . esc_url(_SQ_ASSETS_URL_ . 'css/frontend' . (SQ_DEBUG ? '' : '.min') . '.css') . '",
                            postID: "' . (int)$sq_postID . '",
                            prevNonce: "' . esc_attr(wp_create_nonce('post_preview_' . $sq_postID)) . '",
                            __keyword: "' . esc_html__('Keyword:', 'squirrly-seo') . '",
                            __date: "' . esc_html__('date', 'squirrly-seo') . '",
                            __noconnection: "' . esc_html__("To load the Live Assistant and optimize this page, click to connect to Squirrly Cloud.", 'squirrly-seo') . '",
                            __saved: "' . esc_html__('Saved!', 'squirrly-seo') . '",
                            __readit: "' . esc_html__('Read it!', 'squirrly-seo') . '",
                            __insertit: "' . esc_html__('Insert it!', 'squirrly-seo') . '",
                            __reference: "' . esc_html__('Reference', 'squirrly-seo') . '",
                            __insertasbox: "' . esc_html__('Insert as box', 'squirrly-seo') . '",
                            __addlink: "' . esc_html__('Insert Link', 'squirrly-seo') . '",
                            __notrelevant: "' . esc_html__('Not relevant?', 'squirrly-seo') . '",
                            __insertparagraph: "' . esc_html__('Insert in your article', 'squirrly-seo') . '",
                            __ajaxerror: "' . esc_html__(':( An error occurred while processing your request. Please try again', 'squirrly-seo') . '",
                            __nofound: "' . esc_html__('No results found!', 'squirrly-seo') . '",
                            __sq_photo_copyright: "' . esc_html__('[ ATTRIBUTE: Please check: %s to find out how to attribute this image ]', 'squirrly-seo') . '",
                            __has_attributes: "' . esc_html__('Has creative commons attributes', 'squirrly-seo') . '",
                            __no_attributes: "' . esc_html__('No known copyright restrictions', 'squirrly-seo') . '",
                            __noopt: "' . esc_html__('You haven`t used Squirrly SEO to optimize your article. Do you want to optimize for a keyword before publishing?', 'squirrly-seo') . '",
                            __subscription_expired: "' . esc_html__('Your Subscription has Expired', 'squirrly-seo') . '",
                            __no_briefcase: "' . esc_html__('There are no keywords saved in briefcase yet', 'squirrly-seo') . '",
                            __fulloptimized: "' . esc_html__('Congratulations! Your article is 100% optimized!', 'squirrly-seo') . '",
                            __toomanytimes: "' . esc_html__('appears too many times. Try to remove %s of them', 'squirrly-seo') . '",
                            __writemorewords: "' . esc_html__('write %s more words', 'squirrly-seo') . '",
                            __keywordinintroduction: "' . esc_html__('Add the keyword in the %s of your article', 'squirrly-seo') . '",
                            __clicktohighlight: "' . esc_html__('Click to keep the highlight on', 'squirrly-seo') . '",
                            __introduction: "' . esc_html__('introduction', 'squirrly-seo') . '",
                            __morewordsafter: "' . esc_html__('Write more words after the %s keyword', 'squirrly-seo') . '",
                            __orusesynonyms: "' . esc_html__('or use synonyms', 'squirrly-seo') . '",
                            __addmorewords: "' . esc_html__('add %s more word(s)', 'squirrly-seo') . '",
                            __removewords: "' . esc_html__('or remove %s word(s)', 'squirrly-seo') . '",
                            __addmorekeywords: "' . esc_html__('add the selected keyword %s more time(s) ', 'squirrly-seo') . '",
                            __addminimumwords: "' . esc_html__('write %s more words to start calculating', 'squirrly-seo') . '",
                            __add_to_briefcase: "' . esc_html__('Add to Briefcase', 'squirrly-seo') . '",
                            __add_keyword_briefcase: "' . esc_html__('Add Keyword to Briefcase', 'squirrly-seo') . '",
                            __usekeyword: "' . esc_html__('Select', 'squirrly-seo') . '",
                            __new_post_title: "' . esc_html__('Auto Draft') . '",
                            __enter_keyword: "' . esc_html__('Enter keyword above and press ENTER', 'squirrly-seo') . '",
                            __add_keyword: "' . esc_html__('Add Keywords from Briefcase', 'squirrly-seo') . '",
                            __frontend_optimized: "' . esc_html__('Live Assistant was used to optimize this page with the Page Builder. Please go back and resume your optimization work there.', 'squirrly-seo') . '",
                        };
                        $.sq_params = {
                              max_length_title: ' . (int)$metas->title_maxlength . ',
                              max_length_description: ' . (int)$metas->description_maxlength . ',
                        };
                        

                    })(jQuery);
                     </script>';

        echo '<script src="' . esc_url(_SQ_STATIC_API_URL_ . SQ_URI . '/js/squirrly' . (SQ_DEBUG ? '' : '.min') . '.js?ver=' . SQ_VERSION) . '"></script>';

    }

}
