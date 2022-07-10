<?php defined('ABSPATH') || die('Cheatin\' uh?'); ?>
<?php
SQ_Classes_RemoteController::loadJsVars();
SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('slaseo', array('trigger' => true, 'media' => 'all'));
SQ_Classes_ObjController::getClass('SQ_Classes_DisplayController')->loadMedia('slasearch', array('trigger' => true, 'media' => 'all'));

$view->show_view('Blocks/SLASearch');
$view->show_view('Blocks/SLASeo');
