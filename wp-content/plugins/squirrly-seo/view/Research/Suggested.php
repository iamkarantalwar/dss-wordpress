<?php defined('ABSPATH') || die('Cheatin\' uh?'); ?>
<div id="sq_wrap">
    <?php SQ_Classes_ObjController::getClass('SQ_Core_BlockToolbar')->init(); ?>
    <?php do_action('sq_notices'); ?>
    <div class="d-flex flex-row my-0 bg-white" style="clear: both !important;">
        <?php
        if (!apply_filters('sq_load_snippet', true) || !SQ_Classes_Helpers_Tools::userCan('sq_manage_snippet')) {
            echo '<div class="col-12 alert alert-success text-center m-0 p-3">' . esc_html__("You do not have permission to access this page. You need Squirrly SEO Editor role.", 'squirrly-seo') . '</div>';
            return;
        }
        ?>
        <?php echo SQ_Classes_ObjController::getClass('SQ_Models_Menu')->getAdminTabs(SQ_Classes_Helpers_Tools::getValue('tab', 'suggested'), 'sq_research'); ?>
        <div class="d-flex flex-row flex-nowrap flex-grow-1 bg-white px-1 m-0">
            <div class="flex-grow-1 px-1 sq_flex">
                <?php do_action('sq_form_notices'); ?>

                <div class="card col-12 p-0">
                    <div class="card-body p-2 bg-title rounded-top">
                        <div class="sq_icons_content p-3 py-4">
                            <div class="sq_icons sq_suggested_icon m-2"></div>
                        </div>
                        <h3 class="card-title"><?php echo esc_html__("Suggested Keywords", 'squirrly-seo'); ?>
                            <div class="sq_help_question d-inline">
                                <a href="https://howto.squirrly.co/kb/keyword-research-and-seo-strategy/#suggestions" target="_blank"><i class="fa fa-question-circle"></i></a>
                            </div>
                        </h3>
                        <div class="card-title-description m-2"><?php echo esc_html__("See the trending keywords suitable for your website's future topics. We check for new keywords weekly based on your latest researches.", 'squirrly-seo'); ?></div>
                    </div>
                    <div id="sq_suggested" class="card col-12 p-0 tab-panel border-0">
                        <?php do_action('sq_subscription_notices'); ?>

                        <div class="card-body p-0">
                            <div class="col-12 m-0 p-0">
                                <div class="card col-12 my-4 py-0 px-1 border-0 ">
                                    <?php if (is_array($view->suggested) && !empty($view->suggested)) { ?>
                                        <table class="table table-striped table-hover">
                                            <thead>
                                            <tr>
                                                <th style="width: 30%;"><?php echo esc_html__("Keyword", 'squirrly-seo') ?></th>
                                                <th scope="col" title="<?php echo esc_html__("Country", 'squirrly-seo') ?>"><?php echo esc_html__("Co", 'squirrly-seo') ?></th>
                                                <th style="width: 150px;">
                                                    <i class="fa fa-users" title="<?php echo esc_html__("Competition", 'squirrly-seo') ?>"></i>
                                                    <?php echo esc_html__("Competition", 'squirrly-seo') ?>
                                                </th>
                                                <th style="width: 80px;">
                                                    <i class="fa fa-search" title="<?php echo esc_html__("SEO Search Volume", 'squirrly-seo') ?>"></i>
                                                    <?php echo esc_html__("SV", 'squirrly-seo') ?>
                                                </th>
                                                <th style="width: 135px;">
                                                    <i class="fa fa-comments-o" title="<?php echo esc_html__("Recent discussions", 'squirrly-seo') ?>"></i>
                                                    <?php echo esc_html__("Discussion", 'squirrly-seo') ?>
                                                </th>
                                                <th style="width: 20px;"></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <?php
                                            foreach ($view->suggested as $key => $row) {
                                                $research = '';
                                                $keyword_labels = array();

                                                if ($row->data <> '') {
                                                    $research = json_decode($row->data);

                                                    if (isset($research->sv->absolute) && is_numeric($research->sv->absolute)) {
                                                        $research->sv->absolute = number_format((int)$research->sv->absolute, 0, '.', ',');
                                                    }
                                                }

                                                $in_briefcase = false;
                                                if (!empty($view->keywords))
                                                foreach ($view->keywords as $krow) {
                                                    if (trim(strtolower($krow->keyword)) == trim(strtolower($row->keyword))) {
                                                        $in_briefcase = true;
                                                        break;
                                                    }
                                                }
                                                ?>
                                                <tr id="sq_row_<?php echo (int)$row->id ?>" class="<?php echo($in_briefcase ? 'bg-briefcase' : '') ?>">
                                                    <td style="width: 280px;">
                                                        <span style="display: block; clear: left; float: left;"><?php echo esc_html($row->keyword) ?></span>
                                                    </td>
                                                    <td>
                                                        <span style="display: block; clear: left; float: left;"><?php echo esc_html($row->country) ?></span>
                                                    </td>
                                                    <td style="width: 20%; color: <?php echo esc_attr($research->sc->color) ?>"><?php echo(isset($research->sc->text) ? '<span data-value="' . esc_attr($research->sc->value) . '">' . esc_attr($view->getReasearchStatsText('sc', $research->sc->value)) . '</span>' : '') ?></td>
                                                    <td style="width: 13%; "><?php echo(isset($research->sv) ? '<span data-value="' . (int)$research->sv->absolute . '">' . (is_numeric($research->sv->absolute) ? number_format($research->sv->absolute, 0, '.', ',') . '</span>' : esc_html($research->sv->absolute)) : '') ?></td>
                                                    <td style="width: 15%; "><?php echo(isset($research->tw) ? '<span data-value="' . esc_attr($research->tw->value) . '">' . esc_attr($view->getReasearchStatsText('tw', $research->tw->value)) . '</span>' : '') ?></td>
                                                    <td class="px-0 py-2" style="width: 20px">
                                                        <div class="sq_sm_menu">
                                                            <div class="sm_icon_button sm_icon_options">
                                                                <i class="fa fa-ellipsis-v"></i>
                                                            </div>
                                                            <div class="sq_sm_dropdown">
                                                                <ul class="text-left p-2 m-0 ">
                                                                    <?php if ($in_briefcase) { ?>
                                                                        <li class="bg-briefcase m-0 p-1 py-2 text-black-50">
                                                                            <i class="sq_icons_small sq_briefcase_icon"></i>
                                                                            <?php echo esc_html__("Already in briefcase", 'squirrly-seo'); ?>
                                                                        </li>
                                                                    <?php } else { ?>
                                                                        <li class="sq_research_add_briefcase m-0 p-1 py-2" data-keyword="<?php echo  SQ_Classes_Helpers_Sanitize::escapeKeyword($row->keyword) ?>">
                                                                            <i class="sq_icons_small sq_briefcase_icon"></i>
                                                                            <?php echo esc_html__("Add to briefcase", 'squirrly-seo'); ?>
                                                                        </li>
                                                                    <?php } ?>
                                                                    <?php if (SQ_Classes_Helpers_Tools::userCan('sq_manage_settings')) { ?>
                                                                        <li class="sq_delete_found m-0 p-1 py-2" data-id="<?php echo (int)$row->id ?>" data-keyword="<?php echo SQ_Classes_Helpers_Sanitize::escapeKeyword($row->keyword) ?>">
                                                                            <i class="sq_icons_small fa fa-trash-o"></i>
                                                                            <?php echo esc_html__("Delete Keyword", 'squirrly-seo') ?>
                                                                        </li>
                                                                    <?php } ?>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <?php
                                            }
                                            ?>

                                            </tbody>
                                        </table>
                                    <?php } else { ?>
                                        <div class="card-body">
                                            <h4 class="text-center"><?php echo esc_html__("Welcome to Suggested Keywords", 'squirrly-seo'); ?></h4>
                                            <h5 class="text-center mt-4"><?php echo esc_html__("Once a week, Squirrly checks all the keywords from your briefcase.", 'squirrly-seo'); ?></h5>
                                            <h5 class="text-center"><?php echo esc_html__("If it finds better keywords, they will be listed here", 'squirrly-seo'); ?></h5>
                                            <h6 class="text-center text-black-50 mt-3"><?php echo esc_html__("Until then, add keywords in Briefcase", 'squirrly-seo'); ?>:</h6>
                                            <div class="col-12 my-4 text-center">
                                                <a href="<?php echo SQ_Classes_Helpers_Tools::getAdminUrl('sq_research', 'research') ?>" class="btn btn-lg btn-primary">
                                                    <i class="fa fa-plus-square-o"></i> <?php echo esc_html__("Go Find New Keywords", 'squirrly-seo'); ?>
                                                </a>
                                            </div>
                                        </div>
                                    <?php } ?>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sq_col_side sticky">
                <div class="card col-12 p-0">
                    <?php echo SQ_Classes_ObjController::getClass('SQ_Core_BlockSupport')->init(); ?>
                    <?php echo SQ_Classes_ObjController::getClass('SQ_Core_BlockAssistant')->init(); ?>
                </div>
            </div>
        </div>
    </div>
</div>
