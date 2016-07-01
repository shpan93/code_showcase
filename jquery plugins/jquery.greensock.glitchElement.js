; (function ($, window, document, undefined) {


    // Create the defaults once
    pluginName = "glitchElement",
    dataKey = "plugin_" + pluginName;


    // The actual plugin constructor
    function Plugin(element, options) {
        var _scope = this;


        this.options = {
            // default options go here       
            keyframes: [],
            colors: false, // typeof array -> colors array, save keyframes index
            onMouseEnter: function (el) { },
            onMouseLeave: function (el) { },

            isGift: false,  //isGift : typeof string -> parent selector
            isText: false,  //isText : typeof number ->  durationDelay
            isButton: false, // isButton: typeof boolean
        };

        $.extend(this.options, options);


        _scope.element = $(element);

        // private Config
        this.config = {
            path: null,
            timeline: null,
            isAnimated: false,
            mouseLeft: false
        };

        this.init(options);
    }

    var methods = {
        init: function () {
            this.createTimeline();


            this.setVariables();
            this.bindEvents();

        },
        createTimeline: function () {
            var _scope = this;


            if (_scope.options.isGift) {

                this.config.path = _scope.element.find('.gift-title > .glitch-element path');
            } else {

                this.config.path = _scope.element.find('path');
            }


            this.config.timeline = new TimelineMax({
                //autoplay: this.options.isText ? true : false,
                paused: this.options.isText || this.options.isImage ? false : true,
                yoyo: false,
                delay: this.options.startDelay || 0,
                repeat: this.options.isText || this.options.isImage ? -1 : 0,
                repeatDelay: this.options.iterationDelay ? this.options.iterationDelay : 0,
                onUpdate: function () { },
                onComplete: function () {
                    _scope.config.isAnimated = false;
                    if (_scope.options.isGift) _scope.config.timeline.pause().progress(0);
                    //     if (_scope.config.mouseLeft) {
                    //        _scope.config.timeline.reverse();
                    //    }
                },
                onReverseComplete: function () {
                    //     _scope.config.mouseLeft = false;
                }
            });


            var duration = this.options.totalDuration / this.options.keyframes.length;




            this.options.keyframes.map(function (pathString, index) {
                var cssOption = {};
                var tweenDelay = '+=0';
                if (_scope.options.colors ) {
                    cssOption.fill = _scope.options.colors[index];

                } else {
                    cssOption = {}
                }
                if (_scope.options.isMainText && index === 12) {
                    tweenDelay = '+=' + 25 * duration;
                }

                _scope.config.timeline.to(_scope.config.path, duration, { attr: { d: pathString }, css: cssOption, ease: SteppedEase.config(1) }, tweenDelay);


            });

            //_scope.config.timeline.progress(0.99);
            //_scope.config.timeline.pause().progress(0.01);
            //            tl.from(logo, 0.5, { css: { left: '-=60px' }, ease: Back.easeOut })

        },
        setVariables: function () {
            var _scope = this;
        },

        bindEvents: function () {
            var _scope = this;

            if (_scope.options.isButton) {

                _scope.element.on('mouseenter', function () {
                    _scope.config.timeline.play();
                    if (_scope.options.onMouseEnter) _scope.options.onMouseEnter(_scope.element);

                }).on('mouseleave', function () {
                    _scope.config.timeline.reverse();
                    if (_scope.options.onMouseLeave) _scope.options.onMouseLeave(_scope.element);
                });
            }

            if (_scope.options.isGift) {
                _scope.element.on('mouseenter', function () {
                    _scope.config.timeline.play();
                    if (_scope.options.onMouseEnter) _scope.options.onMouseEnter(_scope.element);
                });
            }

        }
    }


    Plugin.prototype = methods;

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    // $.fn[pluginName] = function (options) {

    //return this.each(function() {

    //        var plugin = $.data(this,dataKey);

    //        // has plugin instantiated ?
    //        if (plugin instanceof Plugin) {
    //            // if have options arguments, call plugin.init() again
    //            if (typeof options !== 'undefined') {
    //                plugin.init(options);
    //            }
    //        } else {
    //            plugin = new Plugin(this, options);
    //            $.data(this,dataKey, plugin);
    //        }

    //        return plugin;
    //   });


    //};

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }


})(jQuery, window, document);
