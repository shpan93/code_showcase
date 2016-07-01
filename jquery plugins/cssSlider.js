/*
 *  Project:
 *  Description:
 *  Author:
 *  License:
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {
    pluginName = "cssSlider",
    dataKey = "plugin_" + pluginName;

    var privateMethod = function () {
        // ...
    };

    var Plugin = function (element, options) {
        this.element = element;

        this.config = {
            prevSlide: null,
            nextSlide: null,
            throttle: false,
            slides: [],
            currentSlide: {
                el: null,
                id: null
            },
            sliderHeight: null,
            initialized: false
        };
        //defaults
        //dynamicTitle: {
        //        enabled: false,
        //        titleContainer: '.title'
        //},

        //navigation: {
        //    enabled: false,selectorSetHeight
        //    navContainer: '.slider-nav',
        //    listTpl: '<ul class="slick-dots"> </ul>',
        //    navTpl: '<li></li>',
        //    navSelector: 'li'
        //}
        this.options = {
            //container: '.slider-wr > .area-visible',
            slider: '.slider-wr',
            itemSelector: '.slide-i',
            onSwitch: null,
            //packSlides: {
            //    containerTpl: '<div class="slide-triple-i"></div>',
            //    innerSelector:'.case-wr',
            //    slidesToPack: 3,
            //    responsive: [
            //        {
            //            breakpoint: [768,1024],
            //            slidesToPack: 2
            //        },
            //        {
            //            breakpoint: [320,768],
            //            slidesToPack: 1
            //        },
            //    ]
            //},
            packSlides: false,
            controls: '.controls',
            duration: 500,
            adaptiveHeight: true,
            hasSliderInside: false,
            selectorSetHeight: null,

            dynamicTitle: {
                enabled: false,
                titleObject: {
                    c: '.slide-title',
                    title: 'span'
                },
                citeObject: {
                    c: '',
                    imgSrc: null,
                    name: null,
                },
                fadeBlock: false
            },

            navigation: {
                enabled: false,
                enabledCreation: false,

                navContainer: '.slider-nav',
                listTpl: '<ul class="slick-dots"> </ul>',
                navTpl: '<li></li>',
                navSelector: 'li'
            },

            ajaxSlides: false,

            useSlick: false,

            slickBefore: function() {},
            slickAfter: function() {},

            slickOptions: {
                dots: false,
                arrows: false,
                variableWidth: true,
                centerMode: true,
                centerPadding:'0px'
            }
            // canSwipe: true
        };

        //
        var _self = this;

        /*
         * Initialization
         */
        $.extend(this.options, options);

        this.element = $(this.element);
        this.slider = this.element.find(this.options.slider);
        this.controls = this.element.find(this.options.controls);


        this.init(options);
    };

    Plugin.prototype = {
        // initialize options
        showConfig: function() {
            return this.config;
        },

        bindVars: function() {
            var _scope = this;
            // init vars

            this.sliderItem = this.slider.find(this.options.itemSelector);


            //custom styling

            this.slider.addClass('avellum-slider');
            this.sliderItem.addClass('avellum-slider-item');
            // if title
            if (this.options.dynamicTitle.enabled) {

                if (this.options.dynamicTitle.titleObject) {
                    this.titleContainer = this.element.find(this.options.dynamicTitle.titleObject.c);
                    this.titleContainer.addClass('avellum-slider-title')
                    this.titleText = this.titleContainer.find(this.options.dynamicTitle.titleObject.title);
                }
                if (this.options.dynamicTitle.citeObject) {
                    this.citeContainer = this.element.find(this.options.dynamicTitle.citeObject.c);
                    this.citeContainer.addClass('avellum-slider-title');
                    this.citeImg = this.citeContainer.find('img');
                    this.citeName = this.citeContainer.find(this.options.dynamicTitle.citeObject.name);
                }
            }

            if (this.options.navigation.enabled) {
                this.navContainer = this.element.find(this.options.navigation.navContainer);
                this.listTpl = $(this.options.navigation.listTpl);
                this.navTpl = $(this.options.navigation.navTpl);
            }


        },
        iterator: function(a, n) {
            var _scope = this;
            var current = 0,
                l = a.length;
            return function() {
                end = current + n;
                var part = a.slice(current, end);
                //if(end > l) {
                //    end = end % l;
                //    part = part.concat(a.slice(0, end));
                //}
                current = end;
                return part;
            };
        },

        //getSlides: function (el, number) {
        //    var current = 0,
        //        l = a.length;

        //},


        packSlider: function() {
            var _scope = this;
            var currentWidth = $(window).width();
            //if (currentWidth < 769 && _scope.options.responsive) {
            //    _scope.config.isSimple = true;
            //    _scope.slider.addClass('simple-slider');
            //}
            $.each(_scope.options.packSlides.responsive,
                function(i) {

                    if (currentWidth >= this.breakpoint[0] && currentWidth <= this.breakpoint[1]) {
                        _scope.slidesToPack = this.slidesToPack;

                        return false;
                    }


                });

            //var slidesToPack = _scope._scope;

            _scope.slideCont = $(_scope.options.packSlides.containerTpl);

            _scope.innerSlide = $(_scope.element).find(_scope.options.packSlides.innerSelector);

            var getNext = _scope.iterator(_scope.innerSlide, _scope.slidesToPack);

            //var iterationLength = Math.floor(_scope.innerSlide.length / slidesToPack);
            var currentPack = getNext();

            while (currentPack.length) {
                var currentCont = _scope.slideCont.clone();
                currentCont.appendTo(_scope.slider);
                $.each(currentPack,
                    function(i, el) {

                        if (_scope.options.packSlides.containerInner) {
                            $(el).appendTo(currentCont.find(_scope.options.packSlides.containerInner));
                        } else {
                            $(el).appendTo(currentCont);
                        }


                    });
                currentPack = getNext();
            }
            // this.sliderItem = this.slider.find(this.options.itemSelector);
            //for (var i = 0; i < iterationLength; i++) {
            //    var currentPack = getNext();

            //}

            //$.each(_scope.innerSlide, function(i, el) {
            //if (i % 3) {

            //}
            //});

        },
        useSlick: function () {
            var _scope = this;
            _scope.config.isSimple = true;
            _scope.slider.addClass('simple-slider');
            if (_scope.options.slickBefore && typeof _scope.options.slickBefore === 'function') {
                _scope.options.slickBefore(_scope);
            }

            var defaultOptions = {
                dots: false,
                arrows: false,
                variableWidth: true,
                centerMode: true
            }
            _scope.slider.slick(Object.assign(defaultOptions, _scope.options.slickOptions));
        },

        init: function (options) {
            var _scope = this;


            var currentWidth = $(window).width();
            if (currentWidth < 769 && (_scope.options.packSlides.responsive || _scope.options.useSlick)) {
                _scope.useSlick();
            } else {
                if (_scope.options.packSlides) {
                    _scope.packSlider();
                }
                _scope.bindVars();
                //
                _scope.fillSliderConfig();
                _scope.fillNavigator();

                if (_scope.options.randomFirst) {
                    var max = _scope.config.slides.length - 1;
                    var min = 0;
                    var randSlide = Math.floor(Math.random() * (max - min + 1)) + min;
                    //var practiceSlides = [];
                    //$.each(_scope.config.slides, function() {
                    //    practiceSlides.push(this.el.filter('[data-type=practice]'));
                    //});

                    _scope.config.currentSlide = _scope.config.slides[randSlide];
                } else {
                    _scope.config.currentSlide = _scope.config.slides[0];
                }




                if (_scope.config.slides.length > 1) {
                    //  _scope.config.disabled = true;
                    _scope.switchSlide();
                    _scope.bindEvents();
                } else {
                    _scope.sliderItem.addClass('current');
                    _scope.controls.attr('disabled', 'disabled');
                }
                $(window).load(function () {
                    if (!_scope.options.resizeHeight) {
                        _scope.setHeight();
                    }


                });

                $(window).resize(function () {
                    if (!bowser.tablet && !bowser.mobile) {
                        _scope.setHeight(true);
                    }
                });
            }




        },

        loadAjax: function (before, after) {
            var _scope = this;

            var currentSlide = _scope.config.currentSlide.el;

            var url = currentSlide.attr('data-url');
            //var id = currentSlide.attr('data-slide-id');

            if (!currentSlide.attr('ajax-loaded') && url) {
                if (before) {
                    before();
                }

                if (_scope.options.ajaxSlides.beforeLoad) {
                    _scope.options.ajaxSlides.beforeLoad(_scope, currentSlide);
                }

                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: 'html',
                    //       data: 'id=' + id,
                    success: function (data) {

                        currentSlide.html(data);
                        currentSlide.attr('ajax-loaded', true);

                        //if (window['tabs'][id]) {
                        //    window['tabs'][id]();
                        //}
                        if (after) {
                            after();
                        }
                        if (_scope.options.ajaxSlides.afterLoad) {
                            _scope.options.ajaxSlides.afterLoad(_scope, currentSlide);
                        }
                    }
                });
            }
            else {
                after();
            }


        },

        sliderPositions: function (direction) {
            var _scope = this;
            _scope.config.throttle = true;

            //reset this
            _scope.sliderItem.removeClass('current left-offset right-offset');
            if (direction === "left") {

                _scope.config.nextSlide.el.addClass('current');
                setTimeout(function () {
                    _scope.config.nextSlide.el.addClass('right-offset animation');

                }, 10);


                setTimeout(function () {
                    $.each(_scope.config.slides, function (i, slide) {

                        switch (slide.id) {

                            case _scope.config.nextSlide.id:
                                //  el.addClass('right-offset').removeClass('current left-offset animation');
                                slide.el.removeClass('current left-offset animation');
                                break;
                            case _scope.config.currentSlide.id:
                                slide.el.addClass('left-offset');
                                setTimeout(function () {
                                    slide.el.addClass('current animation').removeClass('right-offset left-offset');
                                }, 10);
                                break;
                            case _scope.config.prevSlide.id:
                                if (_scope.config.slides.length >= 3) {
                                    slide.el.addClass('left-offset').removeClass('currsent right-offset animation');
                                }


                                break;
                            default:
                                break;
                        }
                    });


                }, _scope.options.duration);
            } else if (direction === "right") {
                _scope.config.prevSlide.el.addClass('current');
                setTimeout(function () {
                    _scope.config.prevSlide.el.addClass('left-offset animation');

                }, 10);
                setTimeout(function () {
                    $.each(_scope.config.slides, function (i, slide) {

                        switch (slide.id) {

                            case _scope.config.prevSlide.id:
                                //  el.addClass('right-offset').removeClass('current left-offset animation');
                                slide.el.removeClass('current right-offset  animation');
                                break;
                            case _scope.config.currentSlide.id:
                                slide.el.addClass('right-offset');
                                setTimeout(function () {
                                    slide.el.addClass('current animation').removeClass('right-offset left-offset');
                                }, 10);

                                break;
                            case _scope.config.nextSlide.id:
                                if (_scope.config.slides.length >= 3) {
                                    slide.el.addClass('right-offset').removeClass('current left-offset animation');
                                }

                                break;
                            default:
                                break;
                        }
                    });

                    //  
                }, _scope.options.duration);
            }



            setTimeout(function () {
                _scope.config.throttle = false;
                _scope.sliderItem.removeClass('current left-offset right-offset');
                _scope.config.currentSlide.el.addClass('current');
                _scope.config.prevSlide.el.addClass('left-offset');
                _scope.config.nextSlide.el.addClass('right-offset');
                _scope.sliderItem.removeClass('animation');
            }, _scope.options.duration * 2);
            //console.log(_scope.config.currentSlide.id);
        },
        fillNavigator: function () {

            var _scope = this;
            if (this.options.navigation.enabled) {

                if (this.options.navigation.enabledCreation) {
                    _scope.listTpl.appendTo(_scope.navContainer);


                    $.each(_scope.config.slides, function (i, slide) {
                        this.navItem = _scope.navTpl.clone();
                        this.navItem
                            .html(slide.title)
                            .attr('data-slide-id', i);

                        _scope.listTpl.append(this.navItem);
                    });

                }
                this.navItem = this.navContainer.find(this.options.navigation.navSelector);
                ///this.navContainer = this.element.find(this.options.navigation.navContainer);
            }
        },
        thumbnailNavigator: function (id) {

            var _scope = this;
            var navDirection = (id > _scope.config.currentSlide.id) ? 'right' : 'left';
            _scope.config.currentSlide = this.config.slides[id];

            _scope.switchSlide(false, navDirection);
        },
        switchTitle: function () {
            var _scope = this;
            if (this.options.dynamicTitle.enabled) {
                if (this.options.dynamicTitle.titleObject) {
                    _scope.titleContainer.addClass('fade-out animation');
                    //setTimeout(function () {
                    //}, _scope.options.duration);
                    setTimeout(function () {

                        _scope.titleText.html(_scope.config.currentSlide.title);
                        _scope.resizeHeight('init');

                        if (!_scope.config.initialized) {
                            _scope.config.initialized = true;
                        }

                        setTimeout(function () {
                            _scope.titleContainer.addClass('fade-in').removeClass('fade-out');
                        }, 10);
                    }, _scope.options.duration);
                    setTimeout(function () {
                        _scope.titleContainer.removeClass('fade-in animation');
                    }, _scope.options.duration * 2);
                } else if (this.options.dynamicTitle.citeObject) {
                    _scope.citeContainer.addClass('fade-out animation');
                    //setTimeout(function () {
                    //}, _scope.options.duration);

                    setTimeout(function () {
                        _scope.resizeHeight('init');
                        _scope.citeImg.attr('src', _scope.config.currentSlide.citeImg);
                        _scope.citeName.text(_scope.config.currentSlide.citeName);
                        setTimeout(function () {
                            _scope.citeContainer.addClass('fade-in').removeClass('fade-out');
                        }, 10);
                    }, _scope.options.duration);
                    setTimeout(function () {
                        _scope.citeContainer.removeClass('fade-in animation');
                    }, _scope.options.duration * 2);
                } else if (_scope.options.dynamicTitle.fadeBlock) {
                    _scope.element.find(_scope.options.dynamicTitle.fadeBlock).addClass('fade-out animation');
                    setTimeout(function () {



                        setTimeout(function () {
                            _scope.element.find(_scope.options.dynamicTitle.fadeBlock).addClass('fade-in').removeClass('fade-out');
                        }, 300);
                    }, _scope.options.duration);
                    setTimeout(function () {
                        _scope.element.find(_scope.options.dynamicTitle.fadeBlock).removeClass('fade-in animation');
                    }, _scope.options.duration * 2);
                }


            }

        },
        setActiveDot: function () {
            var _scope = this;
            if (this.options.navigation.enabled) {
                _scope.navItem.removeClass('slick-active');
                _scope.navItem.filter('[data-slide-id=' + _scope.config.currentSlide.id + ']').addClass('slick-active');
            }

        },
        fillConfig: function (id, next, prev) {
            this.config.currentSlide = this.config.slides[id];
            this.config.prevSlide = this.config.slides[prev];
            this.config.nextSlide = this.config.slides[next];

        },
        switchSlide: function (direction, customDirection) {
            var _scope = this;
            var next, prev;
            var id = this.config.currentSlide.id;
            this.config.prevSlide = this.config.currentSlide;
            var lastIndex = this.config.slides.length - 1;

            if (lastIndex < 3) {

            }

            if (direction === "left") {
                id = id - 1;
                if (id < 0) {
                    id = lastIndex;
                }
            }
            else if (direction === "right") {
                id = id + 1;
                if (id > lastIndex) {
                    id = 0;
                }
            }

            switch (id) {
                case 0:
                    next = 1;
                    prev = lastIndex;
                    break;
                case lastIndex:
                    next = 0;
                    prev = lastIndex - 1;
                    break;
                default:
                    next = id + 1;
                    prev = id - 1;
                    break;
            }

            _scope.fillConfig(id, next, prev);

            var posDirection = direction || customDirection;


            var afterAjax = function () {
                _scope.sliderPositions(posDirection);
                //purpose
                _scope.switchTitle();
                _scope.setActiveDot();
                //onSwitch
                if (_scope.options.onSwitch) {
                    _scope.options.onSwitch(_scope);
                }

            }




            //adopt Height
            if (_scope.options.ajaxSlides) {
                _scope.loadAjax(false, afterAjax);
            } else {
                afterAjax();
            }

        },
        setHeight: function (resize) {
            var _scope = this;
            if (resize) {
                _scope.config.sliderHeight = 0;
            }

            $.each(_scope.sliderItem, function (i, el) {
                _scope.config.sliderHeight = ($(el).height() > _scope.config.sliderHeight) ? $(el).height() : _scope.config.sliderHeight;
            });
            if (_scope.options.adaptiveHeight) {
                _scope.heightSelector = (!_scope.options.selectorSetHeight) ? _scope.options.slider : _scope.options.selectorSetHeight;
                _scope.element.find(_scope.heightSelector).height(_scope.config.sliderHeight);
            }

        },
        resizeHeight: function (type) {
            var _scope = this;
            if (_scope.options.resizeHeight) {
                var currentHeight;
                //if (type == 'init') {
                //    if (_scope.config.currentSlide.openedHeight) {
                //        currentHeight = _scope.config.currentSlide.elHeight + _scope.config.currentSlide.fullHeight + _scope.config.additionalHeight;
                //    } else {
                //        currentHeight = _scope.config.currentSlide.elHeight + _scope.config.currentSlide.shortHeight + _scope.config.additionalHeight;
                //    }
                //    _scope.element.find(_scope.heightSelector).height(currentHeight);
                //    var topOffset = _scope.element.offset().top;
                //    $("html, body").stop().animate({
                //        scrollTop: topOffset
                //    }, 300);
                //} else if (type = 'accordeon') {
                //    currentHeight = _scope.config.currentSlide.elHeight + _scope.config.currentSlide.fullHeight + _scope.config.additionalHeight;
                //    _scope.config.slides[_scope.config.currentSlide.id].openedHeight = true;
                //     _scope.element.find(_scope.heightSelector).height(currentHeight);
                //}
                var topOffset = _scope.element.offset().top;
                //   var descOffset = _scope.config.currentSlide.el.find('.parnter-title').offset().top;

                var addH = $(_scope.titleContainer).height();
                var h = _scope.config.currentSlide.el.height() + addH;
                _scope.element.find(_scope.options.selectorSetHeight).height(h);

                if (type === 'init') {
                    if (_scope.config.initialized) {
                        setTimeout(function () {
                            $("html, body").stop().animate({
                                scrollTop: topOffset
                            }, 500);
                        }, 500);

                    }

                } else if (type === 'accordeon') {

                    setTimeout(function () {
                        $("html, body").stop().animate({
                            scrollTop: topOffset
                        }, 500);
                    }, 500);
                }
                //bugfix
                //      _scope.config.sliderHeight = _scope.config.sliderHeight + 800;
            }
        },



        fillSliderConfig: function () {
            var _scope = this;
            if (_scope.options.resizeHeight) {
                _scope.config.additionalHeight = _scope.options.resizeHeight.additional; // _scope.element.find(_scope.options.resizeHeight.additional).height(),

                //$.each(_scope.sliderItem, function (i, el) {}
            }

            $.each(_scope.sliderItem, function (i, el) {
                var title = $(el).attr('data-title'),
                    citeImg = $(el).attr('data-img'),
                    citeName = $(el).attr('data-name'),
                    elHeight,
                    shortHeight,
                    fullHeight;
                if (_scope.options.resizeHeight) {

                    shortHeight = $(el).find(_scope.options.resizeHeight.short).height(),

                   fullHeight = $(el).find(_scope.options.resizeHeight.full).height();
                    elHeight = $(el).height() - shortHeight;
                }


                //     var height = $(el).height();
                $(el).attr('data-slide-id', i);
                _scope.config.slides.push({
                    el: $(el),
                    id: i,
                    title: title,
                    citeImg: citeImg,
                    citeName: citeName,
                    elHeight: elHeight,
                    shortHeight: shortHeight,
                    fullHeight: fullHeight
                    //     height:height
                });


            });


        },

        swipeHandler: function (_scope) {
            var _scope = this;
            var touches = {
                "touchstart": { "x": -1, "y": -1 },
                "touchmove": { "x": -1, "y": -1 },
                "touchend": false,
                "direction": "undetermined",
                isHorizontal: false
            }
            var scrollTop = 0;
            var swipeFunc = {

                touchHandler: function (event) {
                    var touch;
                    if (typeof event !== 'undefined') {
                        //event.preventDefault();

                        if (typeof event.touches !== 'undefined') {
                            touch = event.touches[0];
                            switch (event.type) {
                                case 'touchstart':
                                    //scrollTop = $(window).scrollTop();
                                case 'touchmove':
                                    touches[event.type].x = touch.pageX;
                                    touches[event.type].y = touch.pageY;
                                    //  console.log(touches);

                                    if (touches.touchstart.x > -1 && touches.touchmove.x > -1) {
                                        touches.direction = touches.touchstart.x < touches.touchmove.x ? "left" : "right";

                                        var vertical = Math.abs(touches.touchstart.y - touches.touchmove.y);
                                        var horizontal = Math.abs(touches.touchstart.x - touches.touchmove.x);

                                        touches.isHorizontal = horizontal > vertical ? true : false;


                                        if (touches.isHorizontal) {
                                            //  console.log('H');
                                            event.preventDefault();
                                            if (!_scope.config.throttle && horizontal > _scope.element.width() / 4) {

                                                _scope.switchSlide(touches.direction);
                                            }
                                        }
                                        else {
                                            //  console.log('V');

                                        }


                                    }
                                    break;
                                case 'touchend':
                                    touches[event.type] = true;


                                default:
                                    break;
                            }
                        }
                    }
                },

            }
            return function () {
                return swipeFunc;
            };
        },

        bindEvents: function () {
            var _scope = this;
            this.controls.bind('click touchstart', function () {
                var direction = $(this).attr('data-direction');

                if (!_scope.config.throttle) {
                    _scope.switchSlide(direction);
                }
                return false;
            });
            if (_scope.options.navigation.enabled) {
                var opened = false;

                var touchmoved;
                _scope.navItem.bind('click', function () {
                    var id = parseFloat($(this).attr('data-slide-id'));
                    if (bowser.mobile && !_scope.config.throttle && !touchmoved) {

                        var toggleOpen = function () {

                            if (!opened) {
                                _scope.element.addClass('opened');
                            } else {
                                _scope.element.removeClass('opened');
                            }
                            opened = !opened;
                        }


                        toggleOpen();


                    }
                    if (!_scope.config.throttle && id !== _scope.config.currentSlide.id) {
                        _scope.thumbnailNavigator(id);



                    }


                    //       console.log(_scope.config.currentSlide.id)
                    return false;
                });
                _scope.navContainer.on('touchmove', function (e) {
                    touchmoved = true;
                }).on('touchstart', function () {
                    touchmoved = false;
                });;
                //  _scope.navContainer = this.element.find(this.options.navigation.navContainer);
            }


            //_scope.element.on('touchstart touchmove touchend', function(e) {
            //    _scope.swipeHandler.touchHandler(e);
            //});

            if (!_scope.options.resizeHeight) {
                var handler = _scope.swipeHandler();
                _scope.element[0].addEventListener('touchstart', handler().touchHandler, false);
                _scope.element[0].addEventListener('touchmove', handler().touchHandler, false);
                _scope.element[0].addEventListener('touchend', handler().touchHandler, false);
            }
        }

    };
    $.fn[pluginName] = function (options) {

        var plugin = this.data(dataKey);
        if (plugin instanceof Plugin) {
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