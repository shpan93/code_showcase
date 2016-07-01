/*!
 * jQuery lightweight plugin boilerplate
 * Original author: @ajpiano
 * Further changes, comments: @addyosmani
 * Licensed under the MIT license
 */


// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
; (function ($, window, document, undefined) {

    // undefined is used here as the undefined global 
    // variable in ECMAScript 3 and is mutable (i.e. it can 
    // be changed by someone else). undefined isn't really 
    // being passed in so we can ensure that its value is 
    // truly undefined. In ES5, undefined can no longer be 
    // modified.

    // window and document are passed through as local 
    // variables rather than as globals, because this (slightly) 
    // quickens the resolution process and can be more 
    // efficiently minified (especially when both are 
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = 'tabSlider',
         dataKey = "plugin_" + pluginName;


    // The actual plugin constructor
    function Plugin(element, options) {
        var _scope = this;


        this.options = {
            bgSlider: false,
            hashRouter: false,
            controls: '.tabs__buttons',
            slidesHolder: '.tabs__wr',
            switchClass: 'active',
            buttonSelector: '> div, > li',
            fatImage: false,
            beforeSwitch: function(id) {}

        };

        $.extend(this.options, options);

        this.container = $(element);
        this.controls = this.container.find(this.options.controls);
        this.slidesHolder = this.container.find(this.options.slidesHolder);

        this.duration = this.options.duration;
        this.modalDuration = this.options.modalDuration;
        this.config = {
            firstSwitch: true,
            prev: null,
            current: null,
            throttle: false,
            video: {
                ytWrapper: null,
                player: null,
                source: null,
                videoExternal: null
            },
            //  degree: null,
            //  gipotenuza: null,
            //countDegree: function () {
            //    this.degree = Math.atan($(window).width() / $(window).height());
            //    this.gipotenuza = $(window).width() / Math.sin(this.degree);
            //}
        };
        //this.config.countDegree();
        //console.log(this.config);
        this.button = this.controls.find(this.options.buttonSelector);
        this.slide = this.slidesHolder.find(' > div');

        this.active = this.options.switchClass;

        if (this.options.bgSlider) {
            this.bgSlider = this.container.find(this.options.bgSlider.bg);
            this.bgSlide = this.bgSlider.find(' > div');

            this.tabs = this.container.find('.tabs');


            this.videoModal = this.container.find('.video-modal');
            this.videoBtn = this.container.find('.open-video-btn');
            this.closeBtn = this.container.find('.close-btn');
            this.videoControl = this.container.find('.video-control-btn');
            this.buttons = {};
            this.buttons.group = $(this.container).find(_scope.options.bgSlider.btn.group).find('li');
            this.buttons.subgroup = $(this.container).find(_scope.options.bgSlider.btn.subgroup).find('li');

            this.buttons.subgroupTab = $(this.container).find(_scope.options.bgSlider.btn.tab);


            //    this.initSlick();
            // var $c = $('.frame-3')
            //   var $buttonsWr = $c.find('.tabs__buttons');

            // this.overlaySlider = this.container.find(options.bgSlider.overlay);
            // this.overlaySlide = this.overlaySlider.find(' > div');
        }

        this.init(options);
    }

    var methods = {
        init: function () {
            this.setData();
            this.bindEvents();

            if (this.options.bgSlider) {
                this.switchGroupTab(parseFloat(this.buttons.group.first().attr('data-group-id')));
            } else {
                if (!this.options.leaveDefault) {
                    this.showSlide(0);
                }

            }


        },
        setData: function () {
            if (!this.options.bgSlider) {
                $.each(this.button, function (i, el) {
                    $(el).attr('data-tab-id', $(el).index());
                });

                $.each(this.slide, function (i, el) {
                    $(el).attr('data-tab-id', $(el).index());
                });
            }
        },
        initSlick: function () {
            var elLength = this.container.find('.tech-group').length;
            var count;
            if (elLength > 5) {
                count = 5;
            }
            else if (elLength <= 5 && elLength > 3) {
                count = 3;
            }
            else if (elLength < 3) {
                count = 1;
            }
            this.controls.slick({
                dots: false,
                controls: false,
                infinite: false,
                autoplay: false,
                centerMode: true,
                draggable: false,
                speed: 300,
                centerPadding: 0,
                slidesToShow: count,
                slidesToScroll: count,
                // centerMode:true,
                //  variableWidth: true
            });
        },
        hashSwitch: function (hash) {
            var _scope = this;
            var id = hash.replace('\#', '');
            //if(_scope.element.hasClass()){

            //}
            //var index = parseFloat(this.button.find('a').filter('[href=' + hash + ']').parent('li').attr('data-tab-id'));
            console.log(id);
            var index = parseFloat(this.slide.filter('[id=' + id + ']').attr('data-tab-id'));
            // _scope.controls.parents('nav').lavaLamp().setActive(index);

            // var index = parseFloat(this.slider.filter('[data-hash=' + hash + ']').parent('li').attr('data-tab-id'));
            _scope.hideSlides();
            _scope.showSlide(index, id);
        },




        showSlide: function (index, hash) {

            var _scope = this;
            if (this.config.firstSwitch) {
                this.config.prev = index;
            }
            else {
                this.config.prev = this.config.current;
            }
            // get current 
            if (!this.bgSlide) {



                if (_scope.options.hashRouter) {
                    this.button.find('a').filter('[href*=' + hash + '],[data-href*=' + hash + ']').parent().addClass('active');
                } else {
                    this.button.filter('[data-tab-id=' + index + ']').addClass('active');
                 
                }

            }
            this.config.current = index;
            //   console.log(this.config.current);

            if (this.bgSlide) {

                _scope.button.filter('[data-id=' + index + ']').addClass('active');
                _scope.buttons.subgroup.filter('[data-id=' + index + ']').addClass('active');

                var theme = _scope.slide.filter('[data-id=' + index + ']').attr('data-theme');


                _scope.config.throttle = true;
                //_scope.bgSlide.eq(index).addClass(_scope.active);
                //_scope.slide.eq(index).addClass(_scope.active);
                _scope.bgSlide.filter('[data-id=' + index + ']').addClass('active');
                _scope.slide.filter('[data-id=' + index + ']').addClass('active');

                //preload BG
                var imgEl = _scope.bgSlide.filter('[data-id=' + index + ']');
                if (!imgEl.attr('img-loaded')) {
                    var imgUrl = imgEl.attr('data-big-image');
                    imgEl.css({
                        'background-image': imgUrl
                    });
                    imgEl.attr('img-loaded', true);
                }



                _scope.container.addClass(theme);
                _scope.container.parent().find('.nextslide-btn').addClass(theme);
                //    _scope.overlaySlide.eq(index).addClass('current');
                setTimeout(function () {
                    //_scope.bgSlide.eq(index).addClass(this.active);
                    //  _scope.overlaySlide.eq(index).removeClass('current').addClass('move-left');

                    //  setTimeout(function () {
                    //  _scope.overlaySlide.eq(index).removeClass('move-left');
                    //setTimeout(function () {
                    _scope.config.throttle = false;
                    //    }, _scope.duration);
                    //   }, _scope.duration);
                }, _scope.duration);


            }
            else {

                var currentSlide = this.slide.filter('[data-tab-id=' + index + ']');
                currentSlide.addClass(this.active);
                if (this.options.beforeSwitch) {
                    this.options.beforeSwitch(this.config.current);
                }
                if (_scope.options.fatImage) {
                    var imgEl = currentSlide.find('[data-big-image]');

                    if (!imgEl.attr('img-loaded')) {


                        var imgUrl = imgEl.attr('data-big-image');
                        imgEl.css({
                            'background-image': imgUrl
                        });
                        imgEl.attr('img-loaded', true);
                    }
                }
            }
        },
        hideSlides: function () {
            var _scope = this;
            this.button.removeClass(this.active);

            if (this.bgSlide) {
                _scope.bgSlide.removeClass(_scope.active);
                _scope.slide.removeClass(_scope.active);
                _scope.container.find('.nextslide-btn').removeClass('white blue');
                _scope.container.removeClass('white blue');
                _scope.buttons.subgroup.removeClass('active');
                //setTimeout(function () {

                //}, _scope.duration);
                // this.overlaySlide.removeClass(this.active);
            }
            else {
                this.slide.removeClass(this.active);
            }
        },
        animateVideoModal: function (state, callbackOpen, callbackClose) {
            var _scope = this;
            if (state == 'open') {
                //
                _scope.videoModal.removeClass('active');
                _scope.videoModal.addClass('active');

                setTimeout(function () {
                    if (callbackOpen) callbackOpen();
                    _scope.videoModal.addClass('loaded');
                }, _scope.options.modalDuration);
            }
            else if (state == 'close') {
                var cur = _scope.videoModal;

                cur.removeClass('loaded');
                cur.addClass('closing');
                cur.removeClass('active');

                setTimeout(function () {
                    cur.removeClass('closing');
                    if (callbackClose) {
                        callbackClose();
                    }
                }, _scope.options.modalDuration);
            }


        },
        showVideo: function (source, videoExternal) {
            var _scope = this, onBeforeOpen, onAfterOpen;

            _scope.videoModal.attr('data-external', videoExternal);
            _scope.config.video.videoExternal = videoExternal;
            _scope.config.video
            if (videoExternal) {
                function onPlayerReady(event) {
                    _scope.config.video.player = _scope.config.video.ytWrapper.data('ytPlayer').player;
                    //  onAfterOpen = function () {
                    _scope.config.video.player.playVideo();
                    //}
                }

                onBeforeOpen = function () {
                    console.log(_scope.config.video);
                    _scope.config.video.ytWrapper = _scope.videoModal.find('.yt-wrapper');
                    _scope.config.video.ytWrapper.YTPlayer({
                        fitToBackground: false,
                        //sourceHere
                        videoId: source,
                        pauseOnScroll: false,
                        playerVars: {
                            modestbranding: 0,
                            autoplay: 0,
                            controls: 1,
                            showinfo: 0,
                            wmode: 'transparent',
                            branding: 0,
                            rel: 0,
                            playsinline: 1,
                            autohide: 0,
                            fs: 0,
                            origin: window.location.origin
                        }, events: {
                            'onReady': onPlayerReady,
                            //'onStateChange': onPlayerStateChange
                        }
                    });

                }
                // onBeforeOpen = function () {
                //    _scope.config.video.player = _scope.videoModal.find('video')[0];
                //    $(_scope.config.video.player).find('source').attr('src', source);
                //    _scope.config.video.load();

                //}

            }
            else {
                onBeforeOpen = function () {
                    _scope.config.video.player = _scope.videoModal.find('video')[0];
                    $(_scope.config.video.player).find('source').attr('src', source);

                    _scope.config.video.player.load();

                }
                onAfterOpen = function () {
                    _scope.config.video.player.play();
                    $(_scope.config.video.player).parent().addClass('loaded');
                }
            }





            onBeforeOpen();
            _scope.animateVideoModal('open', onAfterOpen);
        },
        stopVideo: function (previous, pauseOnly) {
            //    if (previous.isVideo) {

            if (previous.videoExternal) {

                if (pauseOnly) {
                    previous.player.pauseVideo();
                    //previous.video.seekTo(0);
                }
                else {
                    previous.player.pauseVideo();
                    previous.player.seekTo(0);
                }

            }
            else {
                if (pauseOnly) {
                    previous.player.pause();
                }
                else {
                    previous.player.pause();
                    previous.player.currentTime = 0;
                    $(previous.player).parent().removeClass('loaded');
                }


            }
            //  }
        },
        closeVideo: function (source) {

            var _scope = this, onAfterClose;


            onBeforeClose = function () {
                _scope.stopVideo(_scope.config.video);
            }
            if (_scope.config.video.videoExternal) {
                onAfterClose = function () {
                    _scope.config.video.ytWrapper.data('ytPlayer').destroy();
                    //   _scope.config.video = null;
                }
            }
            else {
                onAfterClose = function () {

                    $(_scope.config.video.player).find('source').attr('src', '');
                    _scope.config.video.player.currentTime = 0;
                    _scope.config.video.player = null;
                    //    _scope.config.video = null;

                }
            }






            onBeforeClose();
            _scope.animateVideoModal('close', false, onAfterClose);

        },
        stopImmidiateVideo: function () {
            var _scope = this;
            if (_scope.config.video.player) {
                _scope.stopVideo(_scope.config.video, true)
                //  _scope.config.video.currentTime(0);
            }
        },
        switchGroupTab: function (index) {
            var _scope = this;


            _scope.buttons.group.removeClass('active');
            _scope.buttons.group.filter('[data-group-id=' + index + ']').addClass('active');

            _scope.buttons.subgroupTab.removeClass('active');
            _scope.buttons.subgroupTab.filter('[data-group-id=' + index + ']').addClass('active');
            _scope.buttons.subgroupTab.filter('[data-group-id=' + index + ']').find('li').first().click();
        },
        bindEvents: function () {
            var _scope = this;


            if (!_scope.options.hashRouter && !_scope.options.bgSlider) {

                this.button.on('click touchstart', function () {
                    //   var id = parseFloat($(this).attr('data-tab-id'));
                    if (!$(this).attr('disabled')) {
                        var id = parseFloat($(this).attr('data-tab-id')) || $(this).index();


                        // var theme = $(this).data('theme');
                        if (!_scope.config.throttle) {
                            _scope.hideSlides();
                            _scope.showSlide(id);
                        }
                        //    $(this).addClass('active');
                    }
                });
            }


            if (_scope.options.bgSlider) {
                var touchmoved = {
                    group: false,
                    subgroup: false

                };
                _scope.buttons.group.parents('ul').on('touchmove', function (e) {
                    touchmoved.group = true;
                }).on('touchstart', function () {
                    touchmoved.group = false;
                });

                _scope.buttons.subgroup.parents('ul').on('touchmove', function (e) {
                    touchmoved.subgroup = true;
                }).on('touchstart', function () {
                    touchmoved.subgroup = false;
                });


                this.buttons.group.on('click touchstart', function () {

                    if (!touchmoved.group) {
                        var groupId = parseFloat($(this).attr('data-group-id'));
                        if (!_scope.config.throttle) {

                            _scope.switchGroupTab(groupId);
                        }


                        return false;
                    }


                });
                //this.buttons.subgroup.on('click touchstaмшвуrt', function () {

                //});



                this.buttons.subgroup.on('click touchstart', function () {


                    if (!touchmoved.subgroup) {
                        var id = parseFloat($(this).attr('data-id'));
                        //var theme = $(this).data('theme');



                        if (!_scope.config.throttle) {
                            _scope.hideSlides();
                            _scope.showSlide(id);
                        }

                        return false;
                    }





                });

                this.videoBtn.on('click touchstart', function () {
                    //var $this = $(this);
                    var src = $(this).parents('.tab').attr('data-video');
                    var videoExternal = $(this).parents('.tab').attr('data-external') ? JSON.parse($(this).parents('.tab').attr('data-external').toLowerCase()) : null;

                    _scope.showVideo(src, videoExternal);
                    return false;
                });
                this.closeBtn.on('click touchstart', function () {
                    //  var src = $(this).parents('.tab').attr('data-video');
                    _scope.closeVideo();
                    return false;
                });
                //$('.tech-group').on('click touchstart', '.group-name, .btntab', function(e) {
                //    // console.log(e);
                //    var slickId = parseFloat($(e.delegateTarget).attr('data-slick-index'));
                //    _scope.controls.slick('slickGoTo', slickId, false);


                //    if ($(e.delegateTarget).is('[active-clicked=false]')) {
                //        $('.tech-group').attr('active-clicked', 'false');
                //        $(e.delegateTarget).attr('active-clicked', 'true');
                //    } else {
                //        $('.tech-group').attr('active-clicked', 'false');
                //        //$(this).removeClass('active-clicked');
                //    }


                //});
            }
        }
    }


    Plugin.prototype = methods;

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);

        // has plugin instantiated ?
        if (plugin instanceof Plugin) {
            // if have options arguments, call plugin.init() again
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }

        return plugin;
    };

})(jQuery, window, document);

