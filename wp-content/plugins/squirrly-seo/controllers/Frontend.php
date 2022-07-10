<?php
defined('ABSPATH') || die('Cheatin\' uh?');

class SQ_Controllers_Frontend extends SQ_Classes_FrontController
{

    /**
     * 
     *
     * @var SQ_Models_Frontend 
     */
    public $model;

    public function __construct()
    {
        if (is_admin() || is_network_admin() || SQ_Classes_Helpers_Tools::isAjax()) {
            return;
        }

        //load the hooks
        parent::__construct();

        //For favicon and Robots
        $this->hookCheckFiles();

        /* Check if sitemap is on and Load the Sitemap */
        if (SQ_Classes_Helpers_Tools::getOption('sq_auto_sitemap')) {
            add_filter('wp_sitemaps_enabled', '__return_false');
            SQ_Classes_ObjController::getClass('SQ_Controllers_Sitemaps');
        }

        //Check cache plugin compatibility
        SQ_Classes_ObjController::getClass('SQ_Models_Compatibility')->checkCompatibility();

        //Check if late loading is on
        if (!apply_filters('sq_lateloading', SQ_Classes_Helpers_Tools::getOption('sq_laterload'))) {
            //Hook the buffer on both actions in case one fails
            add_action('plugins_loaded', array($this, 'hookBuffer'), 9);
        }

        //In case plugins_loaded hook is disabled
        add_action('template_redirect', array($this, 'hookBuffer'), 1);

        //Set the post so that Squirrly will know which one to process
        add_action('template_redirect', array($this->model, 'setPost'), 9);

        if(SQ_Classes_Helpers_Tools::getOption('sq_auto_links')) {

            //Check if attachment to image redirect is needed
            if (SQ_Classes_Helpers_Tools::getOption('sq_attachment_redirect')) {
                add_action('template_redirect', array($this->model, 'redirectAttachments'), 10);
            }

        }
    }

    /**
     * HOOK THE BUFFER
     */
    public function hookBuffer()
    {
        //remove the action is already hocked in plugins_loaded
        if (!did_action('template_redirect')) {
            remove_action('template_redirect', array($this, 'hookBuffer'), 1);
        }

        //Check if there is an editor loading
        //Don't load Squirrly METAs while in frontend editors
        if(!SQ_Classes_ObjController::getClass('SQ_Models_Compatibility')->isBuilderEditor()) {
            $this->model->startBuffer();
        }
    }

    /**
     * Called after plugins are loaded
     */
    public function hookCheckFiles()
    {
        //Check for sitemap and robots
        if ($basename = $this->getFileName($_SERVER['REQUEST_URI'])) {
            if (SQ_Classes_Helpers_Tools::getOption('sq_auto_robots') == 1) {
                if ($basename == "robots.txt") {
                    SQ_Classes_ObjController::getClass('SQ_Models_Services_Robots');
                    apply_filters('sq_robots', false);
                    exit();
                }
            }

            if (SQ_Classes_Helpers_Tools::getOption('sq_auto_favicon') && SQ_Classes_Helpers_Tools::getOption('favicon') <> '') {
                if ($basename == "favicon.icon") {
                    SQ_Classes_Helpers_Tools::setHeader('ico');
                    @readfile(_SQ_CACHE_DIR_ . SQ_Classes_Helpers_Tools::getOption('favicon'));
                    exit();
                } elseif ($basename == "touch-icon.png") {
                    SQ_Classes_Helpers_Tools::setHeader('png');
                    @readfile(_SQ_CACHE_DIR_ . SQ_Classes_Helpers_Tools::getOption('favicon'));
                    exit();
                } else {
                    $appleSizes = preg_split('/[,]+/', _SQ_MOBILE_ICON_SIZES);
                    foreach ($appleSizes as $appleSize) {
                        if ($basename == "touch-icon$appleSize.png") {
                            SQ_Classes_Helpers_Tools::setHeader('png');
                            @readfile(_SQ_CACHE_DIR_ . SQ_Classes_Helpers_Tools::getOption('favicon') . $appleSize);
                            exit();
                        }
                    }
                }
            }

        }

    }

    /**
     * Hook the Header load
     */
    public function hookFronthead()
    {

        if (is_admin() || (defined('SQ_NOCSS') && SQ_NOCSS)) {
            return;
        }

        if (SQ_Classes_Helpers_Tools::isPluginInstalled('elementor/elementor.php')) {
            if (SQ_Classes_Helpers_Tools::getValue('elementor-preview', false)) {
                SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('elementor');
            }
        }

        if(SQ_Classes_Helpers_Tools::getOption('sq_load_css')) {
            if (!SQ_Classes_Helpers_Tools::isAjax()) {
                SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('frontend');
            }
        }
    }

    /**
     * Hook the footer function
     */
    public function hookFrontfooter()
    {
        //Show the analytics code in footer
        echo $this->model->getFooter();
    }

    /**
     * Get the File Name if itțs a file in URL
     *
     * @param  null $url
     * @return bool|string|null
     */
    public function getFileName($url = null)
    {
        if (isset($url) && $url <> '') {
            $url = basename($url);
            if (strpos($url, '?') <> '') {
                $url = substr($url, 0, strpos($url, '?'));
            }

            $files = array('ico', 'icon', 'txt', 'jpg', 'jpeg', 'png', 'bmp', 'gif', 'webp',
                'css', 'scss', 'js',
                'pdf', 'doc', 'docx', 'csv', 'xls', 'xslx',
                'mp4', 'mpeg',
                'zip', 'rar');

            if (strrpos($url, '.') !== false) {
                $ext = substr($url, strrpos($url, '.') + 1);
                if (in_array($ext, $files)) {
                    return $url;
                }
            }
        }

        return false;

    }
}
