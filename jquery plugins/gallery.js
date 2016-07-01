/*
 *  Project:
 *  Description:
 *  Author:
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {
    pluginName = "gallerySlider",
    dataKey = "plugin_" + pluginName;

    var privateMethod = function () {
        // ...
    };

    var Plugin = function (element, options) {
        this.element = element;

        this.config = {
            galleryInited: false,
            prevId: null,
            duration: 500,
            throttle: {
                view: false,
                slider: false,
                gallery: false
            },
            prevOpened: false,
            slides: [],
            currentSlide: {
                el: null,
                id: null,
                isVideo: false,
                source: null,
                video: null
            },
            positions: [],
            sizes: {
                base: null,
                cont: null,
                small: null,
                medium: null,
                large: null,
            },
            itemLength: null,
            gallery: {
                scrollWidth: 0,
                offset: null,
                windowWidth: null,
                shift: null,
                opened: true
            },


        };

        this.options = {
            container: '.slider-wr > .area-visible',
            gallery: '.gallery-view',
            gridWrapper: '.gallery-view > .grid-wr',

            slider: '.slider-view',
            itemSelector: '.slide-item',


            tempWr: '.temp-wr',

            playBtn: '.open-video-btn',

            //    $('.frame-6').find('.gallery-view > .grid-wr')
            hiddenContainer: '.slides-images-src',

            controls: '.control',
            gridButton: '.show-grid',
            classes: ['small', 'medium', 'large'],

            duration: {
                slide: 300,
                overlay: 1000,
                overlayOpacity: 500,
                gallerySliding: 500,

                tempCenter: 500,
                tempSize: 500

            },
            galleryShift: 200,
            galleryParallax: 20
        };

        //
        var _self = this;

        /*
         * Initialization
         */

        this.init(options);
    };

    Plugin.prototype = {
        // initialize options
        showConfig: function () {
            return this.config;
        },

        bindVars: function () {
            var _scope = this;
            // init vars
            this.element = $(this.element);
            this.container = this.element.find(this.options.container);
            //   this.slide = this.container.find(' .slide-item');

            this.gallery = this.element.find(this.options.gallery);
            this.gridWrapper = this.element.find(this.options.gridWrapper);
            this.gridItem = null;
            this.galleryControls = this.gallery.find(this.options.controls);

            this.tempWr = this.element.find(this.options.tempWr);

            this.slider = this.element.find(this.options.slider);
            this.sliderItem = this.slider.find();
            this.controls = this.slider.find(this.options.controls);

            this.getVideoElement = function (id) {
                return _scope.slide.eq(id).find('video')[0];
            }

            //this.video =  this.slide.find('video')[0];

            this.buttons = this.element.find(this.options.buttons);
            this.gridButton = this.element.find(this.options.gridButton);
        },
        init: function (options) {
            var _scope = this;
            $.extend(this.options, options);

            this.bindVars()
            this.bindEvents();

            //first Initialize
            _scope.fillSlider();
            //setTimeout(function () {
            //    _scope.runIsotope(true);
            //}, 500)
            // 
            $(window).resize(function () {

                if (_scope.config.galleryInited) {
                    _scope.handleResize();
                }

            });

        },
        hideOverlay: function () {
        },

        fixItemsWidth: function (el, size) {
            var _scope = this;
            if (size == 'medium') {
                height = _scope.config.sizes.base;
                width = _scope.config.sizes.base * 2;
                //  $(el).width();
            } else if (size == 'large') {

                height = _scope.config.sizes.base * 2;
                width = _scope.config.sizes.base * 2;
            }

            else if (size == 'small') {

                height = _scope.config.sizes.base;
                width = _scope.config.sizes.base;

            }
            //$(el)
            //$(el).css('width', width);
            //$(el).css('height', height);

            $(el).css({
                height: height,
                width: width
            });

        },
        //fixGrid: function () {
        //    var _scope = this;
        //    var img = _scope.slide.find('img');
        //    img.height(0);
        //    img.attr('style','')
        //},


        //closeOverlay: function (callback) {
        //    var _scope = this;

        //    _scope.container.removeClass('overlay');
        //    if (callback) {
        //        setTimeout(function () {
        //            callback
        //        }, _scope.options.duration.overlay);
        //    }
        //},

        showOverlay: function (callback) {
            var _scope = this;
            _scope.container.addClass('overlay animation');

            _scope.config.throttle.view = true;

            setTimeout(function () {
                if (callback) {
                    callback();
                }
                _scope.container.addClass('loaded');
                setTimeout(function () {
                    _scope.config.throttle.view = false;
                    _scope.container.removeClass('overlay loaded animation');
                }, _scope.options.duration.overlayOpacity);

            }, _scope.options.duration.overlay);


        },
        showGalleryView: function () {
            var _scope = this;

            var onBeforeOverlay = function () {
                _scope.stopVideo(_scope.config.currentSlide);
                _scope.config.gallery.opened = true;
            };

            var onAfterOverlay = function () {
                _scope.gallery.addClass('active');
                _scope.slider.removeClass('active');
                _scope.tempWr.removeClass('active');
            }

            onBeforeOverlay();

            //     _scope.showOverlay(onAfterOverlay);
            _scope.tempHandler(null, 'close', false, false)
        },

        galleryScroll: function (direction, mouseEvent) {
            var _scope = this;
            if (mouseEvent) {
                if (direction > _scope.config.gallery.windowWidth / 2) {
                    var currentX = ((direction - _scope.config.gallery.windowWidth / 2) / _scope.config.gallery.windowWidth) * _scope.options.galleryParallax;
                    _scope.gridWrapper.css({
                        '-webkit-transform': 'translateX(' + (_scope.config.gallery.offset - currentX) + 'px)',
                        '-moz-transform': 'translateX(' + (_scope.config.gallery.offset - currentX) + 'px)',
                        '-ms-transform': 'translateX(' + (_scope.config.gallery.offset - currentX) + 'px)',
                        '-o-transform': 'translateX(' + (_scope.config.gallery.offset - currentX) + 'px)',
                        'transform': 'translateX(' + (_scope.config.gallery.offset - currentX) + 'px)',

                    });


                    //console.log(currentX);
                } else {
                    var currentX = (((_scope.config.gallery.windowWidth / 2) - direction) / _scope.config.gallery.windowWidth) * _scope.options.galleryParallax;
                    _scope.gridWrapper.css({
                        '-webkit-transform': 'translateX(' + (_scope.config.gallery.offset + currentX) + 'px)',
                        '-moz-transform': 'translateX(' + (_scope.config.gallery.offset + currentX) + 'px)',
                        '-ms-transform': 'translateX(' + (_scope.config.gallery.offset + currentX) + 'px)',
                        '-o-transform': 'translateX(' + (_scope.config.gallery.offset + currentX) + 'px)',
                        'transform': 'translateX(' + (_scope.config.gallery.offset + currentX) + 'px)',
                    });
                    //console.log(currentX);
                }
            }
            else {
                _scope.gridWrapper.addClass('animation');
                _scope.config.throttle.gallery = true;
                setTimeout(function () {
                    _scope.config.throttle.gallery = false;
                    _scope.gridWrapper.removeClass('animation');
                }, _scope.options.duration.gallerySliding);

                if (direction == "right") {

                    if (_scope.config.gallery.offset > (_scope.config.gallery.scrollWidth) * (-1)) {
                        _scope.gridWrapper.css({
                            transform: 'translateX(' + (_scope.config.gallery.offset -= _scope.config.gallery.shift) + 'px)',
                        })
                    }

                } else if (direction == "left") {

                    if (_scope.config.gallery.offset < 0) {
                        _scope.gridWrapper.css({
                            transform: 'translateX(' + (_scope.config.gallery.offset += _scope.config.gallery.shift) + 'px)',
                        })
                    }
                }
            }


        },

        tempHandler: function (selected, state, before, after) {
            var _scope = this;
            _scope.config.throttle.view = true;
            if (state == 'open') {
                _scope.gridItem.addClass('fade-out fade-anim');

                _scope.tempWr.addClass('active');
                _scope.gallery.currentSelected = _scope.gridItem.eq(selected);
                _scope.gallery.tempSlide = _scope.gallery.currentSelected.clone();
                _scope.gallery.currentSelected.addClass('current-hide');
                _scope.gallery.tempSlide.appendTo(_scope.tempWr);
                var currentLeft = parseFloat(_scope.gallery.tempSlide.css('left'));
                _scope.gallery.tempSlide.css('left', (currentLeft - _scope.config.gallery.offset * (-1)) + 'px')

                setTimeout(function () {
                    _scope.gallery.tempSlide.addClass('open');
                }, 10);


                if (before) before();

                setTimeout(function () {
                    _scope.gallery.removeClass('active');

                    setTimeout(function () {
                        _scope.tempWr.removeClass('active');
                        _scope.slider.addClass('active');
                        if (after) after();
                        _scope.config.throttle.view = false;
                    }, _scope.options.duration.tempSize)
                }, _scope.options.duration.tempCenter);
            }
            else if (state == 'hidden-switch') {
                //clear div
                _scope.tempWr.empty();
                // get div with current id and append

                _scope.gallery.currentSelected = _scope.gridItem.eq(selected)
                _scope.gallery.tempSlide = _scope.gallery.currentSelected.clone();
                _scope.gridItem.removeClass('current-hide').addClass('fade-out');
                _scope.gallery.currentSelected.addClass('current-hide');
                _scope.gallery.tempSlide.appendTo(_scope.tempWr);
                var currentLeft = parseFloat(_scope.gallery.tempSlide.css('left'));
                _scope.gallery.tempSlide.css('left', (currentLeft - _scope.config.gallery.offset * (-1)) + 'px')

                setTimeout(function () {
                    _scope.gallery.tempSlide.addClass('open');

                    _scope.config.throttle.view = false;
                }, 10)

            }
            else if (state == 'close') {
                if (before) before();


                //  _scope.config.throttle.view = true;
                //       _scope.gallery.tempSlide = _scope.gallery.currentSelected.clone();
                _scope.slider.removeClass('active');
                _scope.gallery.addClass('active');
                _scope.tempWr.addClass('active');
                _scope.gallery.tempSlide.removeClass('open').addClass('close-size');


                setTimeout(function () {
                    _scope.gridItem.addClass('fade-in').removeClass('fade-out');



                    _scope.gallery.tempSlide.removeClass('close-size');
                    //       setTimeout(function () {

                    _scope.gallery.tempSlide.addClass('close-position');
                    //   }, 10)


                    setTimeout(function () {
                        _scope.tempWr.removeClass('active');
                        _scope.gridItem.removeClass('fade-anim fade-in');
                        //    _scope.tempWr.html('');
                        _scope.gallery.currentSelected.removeClass('current-hide');
                        _scope.slider.removeClass('active');
                        _scope.tempWr.empty();
                        _scope.gallery.currentSelected = null;
                        _scope.gallery.tempSlide = null;
                        if (after) after();
                        _scope.config.throttle.view = false;
                    }, _scope.options.duration.tempSize)
                }, _scope.options.duration.tempCenter);
            }




        },

        //tempClose: function () {

        //},

        showSliderView: function (id, isContainVideo) {
            var _scope = this;
            _scope.config.gallery.opened = false;
            //_scope.config.throttle = true;
            //if (this.config.prevId) {
            //    this.config.prevId = id;
            //}
            //else {
            //    this.config.prevId = this.config.currentSlide.id;
            //}

            //    _scope.fillConfig(id);

            var onBeforeOverlay = function () {

                //_scope.sliderPositions({current:id});
                _scope.config.currentSlide = _scope.config.slides[id];

             
                _scope.switchSlide();



                //_scope.tempWr.addClass('active');
                //_scope.gallery.removeClass('active');
            }

            var onAfterOverlay = function () {
                //  _scope.gallery.removeClass('active');
                //  _scope.slider.addClass('active');


                //if (isContainVideo) {
                //    var vid = _scope.getVideoElement(id);
                //    vid.play();
                //    _scope.config.videoLoaded = true;
                //}

            }


            //     onBeforeOverlay();
            //   onAfterOverlay();
            _scope.tempHandler(id, 'open', onBeforeOverlay)
            //adding animated overlay on container
            // _scope.showOverlay(onAfterOverlay);



        },

        sliderPositions: function () {
            var _scope = this;
            _scope.config.throttle.slider = true;
            _scope.sliderItem.removeClass('current left-offset right-offset');
            _scope.config.currentSlide.el.addClass('current');

            _scope.config.prevSlide.el.addClass('left-offset');
            _scope.config.nextSlide.el.addClass('right-offset');

            setTimeout(function () {
                _scope.config.throttle.slider = false;
            }, _scope.options.duration.slide);
            //console.log(_scope.config.currentSlide.id);
        },
        fillConfig: function (id, next, prev) {
            this.config.currentSlide = this.config.slides[id];
            this.config.prevSlide = this.config.slides[prev];
            this.config.nextSlide = this.config.slides[next];
        },
        switchSlide: function (direction) {
            var _scope = this;

            var id = this.config.currentSlide.id;
            this.config.prevSlide = this.config.currentSlide;
            var lastIndex = this.config.itemLength;




            if (direction === "left") {
                id = id - 1;
                if (id < 0) {
                    id = lastIndex;
                }



            }
            else if (direction == "right") {


                id = id + 1;
                if (id > lastIndex) {
                    id = 0;
                }
            }

            switch (id) {
                case 0:
                    //  id = this.config.itemLength;
                    next = 1;
                    prev = lastIndex;
                    //  console.log('exception')
                    break;
                    //case 1:
                    //    next = 2;
                    //    prev = this.config.itemLength;
                    //    break;
                case lastIndex:
                    next = 0;
                    prev = lastIndex - 1;
                    // console.log('exception')
                    break;

                default:
                    next = id + 1;
                    prev = id - 1;
                    break;
                    //case (this.config.itemLength - 1):

                    //    break;
            }

            if (!_scope.config.slides[id].el.attr('img-loaded')) {

                var imgUrl = _scope.config.slides[id].el.attr('data-big-image');
                _scope.config.slides[id].el.css('background-image', imgUrl);
                _scope.config.slides[id].el.attr('img-loaded', true);

            }
            _scope.fillConfig(id, next, prev);

            //optionsGenerator = function () {
            //    var obj = {};

            //    obj.current = id;
            //    obj.next = next;
            //    obj.prev = prev;
            //    return obj;
            //};

            _scope.tempHandler(id, 'hidden-switch');
            this.sliderPositions();
            this.handleVideo(direction);
        },
        detectVideo: function () {
            //    console.log(_scope.slides)
            //  console.log(_scope.currentSlide)
            var current = _scope.sliderItem.eq(this.config.currentSlide.id);
            //  if(current.find('video'))
        },

        stopVideo: function (previous, pauseOnly) {
            if (previous.isVideo) {

                if (previous.external) {

                    if (pauseOnly) {
                        previous.video.pauseVideo();
                        //previous.video.seekTo(0);
                    }
                    else {
                        previous.video.pauseVideo();
                        previous.video.seekTo(0);
                    }

                }
                else {
                    if (pauseOnly) {
                        previous.video.pause();
                    }
                    else {
                        previous.video.pause();
                        previous.video.currentTime = 0;
                    }


                }
            }
        },
        handleGlobalSlider: function () {
            this.stopVideo(this.config.currentSlide, true);
        },
        handleVideo: function (direction) {
            var _scope = this;

            var previous = null;
            if (direction == "left") {
                previous = _scope.config.nextSlide;
            }
            else if (direction == "right") {
                previous = _scope.config.prevSlide;
            }


            if (previous != null) {
                _scope.stopVideo(previous);

            }


            //playing

            if (_scope.config.currentSlide.isVideo) {
                // _scope.config.currentSlide.video.load();

                if (_scope.config.currentSlide.external) {

                    if (!_scope.config.currentSlide.video) {
                        _scope.config.currentSlide.ytWrapper.YTPlayer({
                            fitToBackground: false,
                            //sourceHere
                            videoId: _scope.config.currentSlide.sourceVideo,
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
                        function onPlayerReady(event) {
                            _scope.config.currentSlide.video = _scope.config.currentSlide.ytWrapper.data('ytPlayer').player;
                            _scope.config.currentSlide.video.playVideo();
                        }
                    }
                    else {
                        _scope.config.currentSlide.video.playVideo();
                    }


                }
                else {
                    _scope.config.currentSlide.video.play();
                }

            }

            // method external or internal
        },


        hideSlides: function () {
            var _scope = this;
            //if (_scope.config.videoLoaded) {
            //    _scope.video.pause();
            //    _scope.video.currentTime = 0;
            //}
            //    this.container.addClass('overlay');
            this.slide.removeClass('active');

            setTimeout(function () {
                //     _scope.container.removeClass('overlay');
                _scope.runIsotope();
                _scope.slide.removeClass('z-indexed');

            }, 500);
        },
        // showGallery: function () {
        //     this.container.removeClass('slider-view').addClass('gallery-view');
        ////     this.runIsotope();

        // },

        fillSlider: function () {
            var _scope = this;
            var $items = $(_scope.options.hiddenContainer).find(_scope.options.itemSelector).clone();
            _scope.slider.append($items);
            this.sliderItem = _scope.slider.find(_scope.options.itemSelector);


            var videoTpl = $('<video controls><source type="video/mp4"></video>');

            var ytTpl = $('<div class="yt-wrapper"></div>');

            $.each(this.sliderItem, function (i, el) {
                var $this = $(el);
                var sourceVideo = $this.attr('data-video');
                var videoExternal = $this.attr('data-external') ? JSON.parse($this.attr('data-external').toLowerCase()) : null;



                if (sourceVideo) {



                    if (videoExternal) {
                        var $ytWrapper = ytTpl.clone();
                        $this.append($ytWrapper);

                        var ytPlayer = null;

                        _scope.config.slides.push({
                            el: $this,
                            id: i,
                            isVideo: true,
                            external: videoExternal,
                            source: sourceVideo,
                            video: null,
                            ytWrapper: $ytWrapper
                        })

                    }
                    else {
                        $this.append(videoTpl.clone());
                        //  console.log($this);
                        var thisVideo = $this.find('video')[0];
                        $(thisVideo).find('source').attr('src', sourceVideo);

                        _scope.config.slides.push({
                            el: $this,
                            id: i,
                            isVideo: true,
                            external: videoExternal,
                            source: sourceVideo,
                            video: thisVideo

                        })
                    }




                }
                else {
                    _scope.config.slides.push({
                        el: $this,
                        id: i,
                        isVideo: false,
                        source: null,
                        video: null
                    })
                }


            })


        },
        handleResize: function () {
            var _scope = this;
            _scope.config.sizes.base = Math.floor((_scope.container.height() - 5) / 3);
            _scope.gridWrapper.find('.sizer').css('height', _scope.config.sizes.base);
            _scope.element.find('.triangle').css('left', _scope.config.sizes.base);
            $.each(_scope.gridItem, function (i, el) {

                var size = $(el).data('size');
                _scope.fixItemsWidth(el, size);
            });


        },
        runIsotope: function (init) {
            var _scope = this;
            var options = {
                layoutMode: 'masonryHorizontal',
                itemSelector: ".slide-item",
                masonryHorizontal: {
                    rowHeight: '.sizer',
                },
                animationOptions: {
                    duration: 2000,
                    easing: 'linear',
                    queue: true
                }
            };
            this.gridWrapper.isotope(options);
            if (init) {
                _scope.config.galleryInited = true;
                $items = $(_scope.options.hiddenContainer).find(_scope.options.itemSelector).clone();
                _scope.config.itemLength = $items.length - 1;
                this.gridWrapper.append($items)
                    .isotope('appended', $items);
                _scope.gridItem = this.gridWrapper.find(_scope.options.itemSelector);


                //console.log(_scope.config.sizes.base);


                $.each(_scope.gridItem, function (i, el) {
                    $(el).filter('[data-video]').append(_scope.element.find(_scope.options.playBtn).clone());
                });

                _scope.handleResize();


                if (GLOBAL.isMobile) {
                    _scope.showSliderView(0);
                }
                //_scope.gridItem
            }

            setTimeout(function () {


                _scope.gridWrapper.isotope("layout");


                _scope.config.gallery.scrollWidth = _scope.gridWrapper.width() - $(window).width();
                _scope.config.gallery.windowWidth = $(window).width();
                _scope.config.gallery.shift = _scope.container.height() * 2 / 3;

            }, 100);

        },



        destroyIsotope: function () {
            this.gridWrapper.isotope('destroy');
        },
        closeMenu: function () {
            var _scope = this;
            _scope.config.prevOpened = false;
            _scope.menuContainer.removeClass('active');
            setTimeout(function () {
                _scope.resetTab();
            }, _scope.config.duration);
        },
        //setPosition: function (i) {
        //    var _scope = this;
        //    _scope.menuContainer.css({
        //        'left': _scope.config.positions[i].left + 'px'
        //    });
        //},

        galleryShowAnimation: function () {

        },

        bindEvents: function () {
            var touchmoved = false;
            var _scope = this;
            this.gridWrapper.on('click touchstart', '> .slide-item', function (e) {
                var index = $(this).index() - 1;
                if (!_scope.config.throttle.view && !touchmoved) {
                    _scope.showSliderView(index);
                }
                //  _scope.config.throttle = true;
                return false;

            });
            this.gridButton.bind('click touchstart', function () {
                if (!_scope.config.throttle.view && !_scope.config.gallery.opened) {
                    _scope.showGalleryView();
                    //_scope.showGallery();
                }
                //  _scope.config.throttle = true;
                return false;

            });
            this.controls.bind('click touchstart', function () {
                var direction = $(this).attr('data-direction');

                if (!_scope.config.throttle.slider) {
                    _scope.switchSlide(direction);
                }
                return false;
            });
            this.galleryControls.bind('click touchstart', function () {
                var direction = $(this).attr('data-direction');

                if (!_scope.config.throttle.gallery) {
                    _scope.galleryScroll(direction);
                }
                return false;
            });
            this.gallery.on('mousemove', function (e) {
                //var direction = $(this).attr('data-direction');
                //   console.log(e.clientX +  ' ' + e.clientY );
                if (!_scope.config.throttle.gallery) {
                    _scope.galleryScroll(e.clientX, true);
                }
                return false;
            });


            //_scope.gallery.on('touchmove', function (e) {
            //    touchmoved = true;
            //}).on('touchstart', function () {
            //    touchmoved = false;
            //});

        }
        //publicMethod: function () {
        //}

    };

    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * return plugin instance.
     */
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

}(jQuery, window, document));