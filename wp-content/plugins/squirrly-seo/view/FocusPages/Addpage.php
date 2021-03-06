<?php defined('ABSPATH') || die('Cheatin\' uh?'); ?>
<?php $patterns = SQ_Classes_Helpers_Tools::getOption('patterns'); ?>
<div id="sq_wrap">
    <?php SQ_Classes_ObjController::getClass('SQ_Core_BlockToolbar')->init(); ?>
    <?php do_action('sq_notices'); ?>
    <div class="d-flex flex-row my-0 bg-white" style="clear: both !important;">
        <?php
        if (!SQ_Classes_Helpers_Tools::userCan('sq_manage_focuspages')) {
            echo '<div class="col-12 alert alert-success text-center m-0 p-3">' . esc_html__("You do not have permission to access this page. You need Squirrly SEO Admin role.", 'squirrly-seo') . '</div>';
            return;
        }
        ?>
        <?php echo SQ_Classes_ObjController::getClass('SQ_Models_Menu')->getAdminTabs(SQ_Classes_Helpers_Tools::getValue('tab', 'boost'), 'sq_focuspages'); ?>
        <div class="sq_row d-flex flex-row bg-white px-3">
            <div class="flex-grow-1 px-1 sq_flex">
                <?php do_action('sq_form_notices'); ?>

                <div class="card col-12 p-0">
                    <div class="card-body p-2 bg-title rounded-top">
                        <div class="sq_icons_content p-3 py-4">
                            <div class="sq_icons sq_addpage_icon m-2"></div>
                        </div>
                        <h3 class="card-title"><?php echo esc_html__("Add a page in Focus Pages", 'squirrly-seo'); ?>
                            <div class="sq_help_question d-inline">
                                <a href="https://howto.squirrly.co/kb/focus-pages-page-audits/#add_new_focus_page" target="_blank"><i class="fa fa-question-circle m-0 p-0"></i></a>
                            </div>
                        </h3>
                        <div class="card-title-description m-2"><?php echo esc_html__("Focus Pages bring you clear methods to take your pages from never found to always found on Google. Rank your pages by influencing the right ranking factors. Turn everything that you see here to Green and you will win.", 'squirrly-seo'); ?></div>
                    </div>
                    <div id="sq_focuspages" class="card col-12 p-0 tab-panel border-0">
                        <div class="row px-2">
                            <form id="sq_auditpage_form" method="get" class="form-inline col-12 ignore">
                                <input type="hidden" name="page" value="<?php echo SQ_Classes_Helpers_Sanitize::escapeGetValue('page') ?>">
                                <input type="hidden" name="tab" value="<?php echo SQ_Classes_Helpers_Sanitize::escapeGetValue('tab') ?>">
                                <div class="sq_filter_label col-12 row p-2">
                                    <?php if (isset($view->labels) && !empty($view->labels)) {
                                        $keyword_labels = SQ_Classes_Helpers_Sanitize::escapeGetValue('slabel', array());
                                        foreach ($view->labels as $category => $label) {
                                            if ($label->show) {
                                                ?>
                                                <input type="checkbox" name="slabel[]" onclick="jQuery('input[type=submit]').trigger('click');" id="search_checkbox_<?php echo esc_attr($category) ?>" style="display: none;" value="<?php echo esc_attr($category) ?>" <?php echo(in_array((string)$category, (array)$keyword_labels) ? 'checked' : '') ?> />
                                                <label for="search_checkbox_<?php echo esc_attr($category) ?>" class="sq_circle_label fa <?php echo(in_array((string)$category, (array)$keyword_labels) ? 'sq_active' : '') ?>" data-id="<?php echo esc_attr($category) ?>" style="background-color: <?php echo esc_attr($label->color) ?>" title="<?php echo esc_attr($label->name) ?>"><?php echo esc_html($label->name) ?></label>
                                                <?php
                                            }
                                        }
                                    } ?>
                                </div>

                                <div class="col-12 row px-0 mx-0">

                                    <div class="col-5 py-2 pl-0 pr-1 mx-0">

                                        <select name="stype" class="d-inline-block m-0 p-1" onchange="jQuery('form#sq_auditpage_form').submit();">
                                            <?php
                                            foreach ($patterns as $pattern => $type) {
                                                if (in_array($pattern, array('custom', 'tax-category', 'search', 'archive', '404'))) continue;
                                                if (strpos($pattern, 'product') !== false || strpos($pattern, 'shop') !== false) {
                                                    if (!SQ_Classes_Helpers_Tools::isEcommerce()) continue;
                                                }

                                                ?>
                                                <option <?php echo(($pattern == SQ_Classes_Helpers_Tools::getValue('stype', 'post')) ? 'selected="selected"' : '') ?> value="<?php echo esc_attr($pattern) ?>"><?php echo esc_html(ucwords(str_replace(array('-', '_'), ' ', $pattern))); ?></option>
                                                <?php
                                            }

                                            $filter = array('public' => true, '_builtin' => false);
                                            $types = get_post_types($filter);
                                            foreach ($types as $pattern => $type) {
                                                if (in_array($pattern, array_keys($patterns))) {
                                                    continue;
                                                }
                                                ?>
                                                <option <?php echo(($pattern == SQ_Classes_Helpers_Tools::getValue('stype', 'post')) ? 'selected="selected"' : '') ?> value="<?php echo esc_attr($pattern) ?>"><?php echo esc_html(ucwords(str_replace(array('-', '_'), ' ', $pattern))); ?></option>
                                                <?php
                                            }

                                            $filter = array('public' => true,);
                                            $taxonomies = get_taxonomies($filter);
                                            foreach ($taxonomies as $pattern => $type) {
                                                //remove tax that are already included in patterns
                                                if (in_array($pattern, array('post_tag', 'post_format', 'product_cat', 'product_tag', 'product_shipping_class'))) continue;
                                                if (in_array($pattern, array_keys($patterns))) continue;
                                                ?>
                                                <option <?php echo(($pattern == SQ_Classes_Helpers_Tools::getValue('stype', 'post')) ? 'selected="selected"' : '') ?> value="<?php echo esc_attr($pattern) ?>"><?php echo esc_html(ucwords(str_replace(array('-', '_'), ' ', $pattern))); ?></option>
                                                <?php
                                            }
                                            ?>
                                        </select>


                                        <?php if (!empty($view->pages)) {
                                            foreach ($view->pages as $index => $post) {
                                                if (isset($post->ID)) {
                                                    ?>
                                                    <select name="sstatus" class="d-inline-block m-0 p-1" onchange="jQuery('form#sq_auditpage_form').submit();">
                                                        <option <?php echo((!SQ_Classes_Helpers_Tools::getValue('sstatus', false)) ? 'selected="selected"' : 'all') ?> value=""><?php echo esc_html__("Any status", 'squirrly-seo'); ?></option>
                                                        <?php

                                                        $statuses = array('publish');
                                                        foreach ($statuses as $status) { ?>
                                                            <option <?php echo(($status == SQ_Classes_Helpers_Tools::getValue('sstatus', 'publish')) ? 'selected="selected"' : '') ?> value="<?php echo esc_attr($status) ?>"><?php echo esc_html(ucfirst($status)); ?></option>
                                                            <?php
                                                        }
                                                        ?>
                                                    </select>
                                                    <?php
                                                    break;
                                                }
                                            }
                                        } ?>

                                    </div>
                                    <div class="col-7 p-0 py-2 mx-0">
                                        <div class="d-flex flex-row justify-content-end p-0 m-0">
                                            <input type="search" class="d-inline-block align-middle col-7 p-1 mr-1" id="post-search-input" autofocus name="skeyword" value="<?php echo SQ_Classes_Helpers_Sanitize::escapeKeyword(SQ_Classes_Helpers_Tools::getValue('skeyword')) ?>"/>
                                            <input type="submit" class="btn btn-primary" value="<?php echo esc_html__("Search", 'squirrly-seo') ?>"/>
                                            <?php if ((SQ_Classes_Helpers_Tools::getIsset('skeyword') && SQ_Classes_Helpers_Tools::getValue('skeyword') <> '#all') || SQ_Classes_Helpers_Tools::getIsset('slabel') || SQ_Classes_Helpers_Tools::getIsset('sid') || SQ_Classes_Helpers_Tools::getIsset('sstatus')) { ?>
                                                <button type="button" class="btn btn-info ml-1 p-v-xs" onclick="location.href = '<?php echo SQ_Classes_Helpers_Tools::getAdminUrl('sq_focuspages', 'addpage', array('stype=' . SQ_Classes_Helpers_Sanitize::escapeGetValue('stype', 'post'))) ?>';" style="cursor: pointer"><?php echo esc_html__("Show All", 'squirrly-seo') ?></button>
                                            <?php } ?>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>


                        <?php if (!empty($view->pages)) { ?>
                            <div class="card-body p-0 position-relative">
                                <div class="col-12 m-0 p-2">
                                    <div class="card col-12 my-1 p-0 border-0 " style="display: inline-block;">

                                        <table class="table table-striped table-hover">
                                            <thead>
                                            <tr>
                                                <th><?php echo esc_html__("Title", 'squirrly-seo') ?></th>
                                                <th><?php echo esc_html__("Option", 'squirrly-seo') ?></th>

                                            </tr>
                                            </thead>
                                            <tbody>
                                            <?php
                                            foreach ($view->pages as $index => $post) {
                                                if (!$post instanceof SQ_Models_Domain_Post) {
                                                    continue;
                                                }

                                                $active = false;
                                                if (!empty($view->focuspages)) {
                                                    foreach ($view->focuspages as $focuspage) {
                                                        if ($focuspage->hash == $post->hash) {
                                                            $active = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                                ?>
                                                <tr>
                                                    <td>
                                                        <div class="col-12 px-0 mx-0 font-weight-bold" style="font-size: 15px"><?php echo esc_html($post->sq->title) ?></div>
                                                        <div class="small " style="font-size: 11px"><?php echo '<a href="' . $post->url . '" class="text-link" rel="permalink" target="_blank">' . urldecode($post->url) . '</a>' ?></div>

                                                    </td>
                                                    <td style="width: 140px; text-align: center; vertical-align: middle">
                                                        <?php if (!$active) {
                                                            if (isset($post->ID) && $post->ID > 0) {
                                                                ?>
                                                                <form method="post" class="p-0 m-0">
                                                                    <?php SQ_Classes_Helpers_Tools::setNonce('sq_focuspages_addnew', 'sq_nonce'); ?>
                                                                    <input type="hidden" name="action" value="sq_focuspages_addnew"/>

                                                                    <input type="hidden" name="url" value="<?php echo esc_url($post->url); ?>">
                                                                    <input type="hidden" name="post_id" value="<?php echo (int)$post->ID; ?>">
                                                                    <input type="hidden" name="type" value="<?php echo esc_attr($post->post_type); ?>">
                                                                    <input type="hidden" name="term_id" value="<?php echo (int)$post->term_id; ?>">
                                                                    <input type="hidden" name="taxonomy" value="<?php echo esc_attr($post->taxonomy); ?>">

                                                                    <button type="submit" class="btn btn-sm text-white btn-success" style="width: 150px;">
                                                                        <?php echo esc_html__("Set Focus Page", 'squirrly-seo') ?>
                                                                    </button>
                                                                </form>
                                                            <?php } else { ?>
                                                                <span class="text-danger font-weight-bold text-center" title="<?php echo esc_html__("Only pages with IDs can be added as Focus Page", 'squirrly-seo') ?>"><?php echo esc_html__("Can't be added", 'squirrly-seo') ?> <a href="https://howto.squirrly.co/kb/focus-pages-page-audits/#add_new_focus_page" target="_blank" ><i class="fa fa-question-circle"></i></a></span>
                                                            <?php } ?>
                                                        <?php } else { ?>
                                                            <a href="<?php echo SQ_Classes_Helpers_Tools::getAdminUrl('sq_focuspages', 'pagelist', array('sid=' . $focuspage->id)) ?>" class="btn btn-sm text-white bg-success bg-green text-center" style="width: 150px;"><?php echo esc_html__("See Tasks", 'squirrly-seo') ?></a>
                                                        <?php } ?>
                                                    </td>

                                                </tr>
                                            <?php } ?>

                                            </tbody>
                                        </table>
                                        <div class="nav-previous alignleft"><?php the_posts_pagination(
                                            array(
                                                'mid_size' => 3,
                                                'base' => 'admin.php%_%',
                                                'format' => '?spage=%#%',
                                                'current' => (int)SQ_Classes_Helpers_Tools::getValue('spage', 1),
                                                'prev_text' => esc_html__("Prev Page", 'squirrly-seo'),
                                                'next_text' => esc_html__("Next Page", 'squirrly-seo'),
                                            )
                                                                            );; ?></div>
                                    </div>

                                </div>
                            </div>
                        <?php } else { ?>
                            <div class="card-body">
                                <h4 class="text-center"><?php echo esc_html__("No page found. Try other post types.", 'squirrly-seo'); ?></h4>
                            </div>
                        <?php } ?>
                    </div>
                </div>
            </div>
            <div class="sq_col sq_col_side ">
                <div class="card col-12 p-0">
                    <?php echo SQ_Classes_ObjController::getClass('SQ_Core_BlockSupport')->init(); ?>
                    <?php //echo SQ_Classes_ObjController::getClass('SQ_Core_BlockAssistant')->init(); ?>
                </div>
            </div>
        </div>
    </div>
</div>
