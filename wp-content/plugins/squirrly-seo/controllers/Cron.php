<?php
defined('ABSPATH') || die('Cheatin\' uh?');

class SQ_Controllers_Cron extends SQ_Classes_FrontController {

    public function processSEOCheckCron() {
        //make sure the classes are loaded
        SQ_Classes_ObjController::getClass('SQ_Classes_Helpers_Tools');

        //Check the SEO and save the Report
        if ($report_time = SQ_Classes_Helpers_Tools::getOption('seoreport_time')) {
            if ((time() - (int)$report_time) < (3600 * 12)) {
                return false;
            }
        }

        SQ_Classes_ObjController::getClass('SQ_Models_CheckSeo')->checkSEO();
    }


}
