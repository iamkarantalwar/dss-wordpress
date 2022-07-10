<?php
defined('ABSPATH') || die('Cheatin\' uh?');

class SQ_Core_BlockToolbar extends SQ_Classes_BlockController
{

    function init()
    {
        $this->show_view('Blocks/Toolbar');
    }

}
