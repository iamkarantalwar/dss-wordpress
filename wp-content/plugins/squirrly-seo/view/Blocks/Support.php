<?php defined('ABSPATH') || die('Cheatin\' uh?'); ?>
<div id="sq_options" class="card col-12 p-0 m-0 py-2 my-2 border-0">
    <ul class="p-0 m-0">
        <li id="sq_options_dasboard">
            <?php
            if (SQ_Classes_Helpers_Tools::getMenuVisible('show_panel') && SQ_Classes_Helpers_Tools::userCan('manage_options')) { ?>
                <span class="sq_push" style="display:none;">1</span>
                <span class="sq_text"><a href="<?php echo SQ_Classes_RemoteController::getMySquirrlyLink('dashboard') ?>" title="<?php echo esc_html__("Go to Profile", 'squirrly-seo') ?>" target="_blank"><span><?php echo esc_html__("Profile", 'squirrly-seo') ?></span></a></span>
                <a href="<?php echo SQ_Classes_RemoteController::getMySquirrlyLink('dashboard') ?>" title="<?php echo esc_html__("Profile", 'squirrly-seo') ?>" target="_blank"><span class="sq_icon"></span></a>
                <?php
            } else {
                echo '&nbsp;';
            }
            ?>
        </li>

        <li id="sq_options_support">

            <span class="sq_text"><?php echo esc_html__("Support", 'squirrly-seo') ?></span><span class="sq_icon"></span>
            <ul class="sq_options_support_popup" style="display: none;">
                <div id="sq_options_close">x</div>
                <li><h6><?php echo esc_html__("Need Help with Squirrly SEO?", 'squirrly-seo') ?></h6></li>

                <li> - <?php echo sprintf(esc_html__("10 AM to 4 PM (GMT): Mon-Fri %sby contact form%s.", 'squirrly-seo'), '<a href="' . esc_url(_SQ_SUPPORT_URL_) . '">', '</a>') ?> </li>
                <li> - <?php echo sprintf(esc_html__("How To Squirrly %swebsite%s.", 'squirrly-seo'), '<a href="' . esc_url(_SQ_HOWTO_URL_) . '" target="_blank">', '</a>') ?> </li>
                <li> - <?php echo sprintf(esc_html__("Facebook %sSupport Community%s.", 'squirrly-seo'), '<a href="https://www.facebook.com/groups/SquirrlySEOCustomerService/" target="_blank">', '</a>') ?> </li>
                <li> - <?php echo sprintf(esc_html__("Facebook %sMessenger%s.", 'squirrly-seo'), '<a href="https://www.facebook.com/Squirrly.co/" target="_blank">', '</a>') ?> </li>
                <li> - <?php echo sprintf(esc_html__("Twitter %sSupport%s.", 'squirrly-seo'), '<a href="https://twitter.com/squirrlyhq" target="_blank">', '</a>') ?> </li>

            </ul>
        </li>
        <li id="sq_options_feedback">

            <span class="sq_icon" <?php
            if (!isset($_COOKIE['sq_feedback_face'])) {
                echo 'title="' . esc_html__("How was your Squirrly experience today?", 'squirrly-seo') . '"';
            }
            ?>></span>

            <?php
            $feedbacks = array(
                array(
                    'title' => esc_html__("Annoying", 'squirrly-seo'),
                    'value' => "Angry",
                ),
                array(
                    'title' => esc_html__("Bad", 'squirrly-seo'),
                    'value' => "Sad",
                ),
                array(
                    'title' => esc_html__("Nice", 'squirrly-seo'),
                    'value' => "Happy",
                ),
                array(
                    'title' => esc_html__("Great", 'squirrly-seo'),
                    'value' => "Excited",
                ),
                array(
                    'title' => esc_html__('Love it', 'squirrly-seo'),
                    'value' => "Loveit",
                ),
            );
            ?>

            <?php if (!isset($_COOKIE['sq_feedback_face'])) {
                if (SQ_Classes_Helpers_Tools::getOption('sq_feedback')) { ?>
                    <span class="sq_push">1</span>
                <?php } ?>
                <ul class="sq_options_feedback_popup" style="display: none;">
                    <div id="sq_options_feedback_close">x</div>
                    <li><?php echo esc_html__("How was Squirrly today?", 'squirrly-seo') ?></li>
                    <li>
                        <table width="100%" cellpadding="2" cellspacing="0" border="0">
                            <tr>
                                <?php
                                foreach ($feedbacks as $index => $feedback) { ?>
                                    <td>
                                        <label class="sq_label_feedback_smiley sq_label_feedback_<?php echo (int)$index ?>" for="sq_label_feedback_<?php echo (int)$index ?>"></label>
                                        <input class="sq_feedback_smiley" type="radio" name="sq_feedback_face" id="sq_label_feedback_<?php echo (int)$index ?>" value="<?php echo esc_attr($feedback['value']) ?>"/><?php echo esc_attr($feedback['title']) ?>
                                    </td>
                                <?php } ?>
                            </tr>
                        </table>
                        <div id="sq_options_feedback_error"></div>
                        <p id="sq_feedback_msg" style="display: none;">
                            <input id="sq_feedback_submit" type="button" value="<?php echo esc_html__("Send feedback", 'squirrly-seo') ?>">
                        </p>

                    </li>
                    <li style="margin-top: 10px;"><?php echo esc_html__("For more support:", 'squirrly-seo') ?> </li>
                    <li> - <?php echo sprintf(esc_html__("10 AM to 4 PM (GMT): Mon-Fri %sby contact form%s.", 'squirrly-seo'), '<a href="' . esc_url(_SQ_SUPPORT_URL_) . '" target="_blank">', '</a>') ?> </li>
                    <li> - <?php echo sprintf(esc_html__("How To Squirrly %swebsite%s.", 'squirrly-seo'), '<a href="' . esc_url(_SQ_HOWTO_URL_) . '" target="_blank">', '</a>') ?> </li>
                    <li> - <?php echo sprintf(esc_html__("Facebook %sSupport Community%s.", 'squirrly-seo'), '<a href="https://www.facebook.com/groups/SquirrlySEOCustomerService/" target="_blank">', '</a>') ?> </li>
                    <li> - <?php echo sprintf(esc_html__("Facebook %sMessenger%s.", 'squirrly-seo'), '<a href="https://www.facebook.com/Squirrly.co/" target="_blank">', '</a>') ?> </li>
                    <li> - <?php echo sprintf(esc_html__("New Lessons Mon. and Tue. on %sTwitter%s.", 'squirrly-seo'), '<a href="https://twitter.com/squirrlyhq" target="_blank">', '</a>') ?> </li>
                </ul>
            <?php } else { ?>
                <ul class="sq_options_feedback_popup" style="display: none;">
                    <div id="sq_options_feedback_close">x</div>
                    <li><?php echo esc_html__("Thank you! You can send us a happy face tomorrow too.", 'squirrly-seo') ?></li>
                </ul>
            <?php } ?>
        </li>

    </ul>
</div>
