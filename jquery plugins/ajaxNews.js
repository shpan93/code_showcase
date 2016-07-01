; (function ($, window, document, undefined) {


    // Create the defaults once
    pluginName = "ajaxNews",
    dataKey = "plugin_" + pluginName;


    // The actual plugin constructor
    function Plugin(element, options) {
        var _scope = this;


        this.options = {
            // default options go here
            //url: '/ua/customer/actionDescription/',
            //  url:'',
            newslist: '.news-list',
            newsSelector: '> div',
            popup: '.popup',
            currentNews: '.popup-wr',
            moreBtn: '.btn-more',
            closeBtn: 'a.close-popup',
            packer: {
                count: 3,
                rows: 2,
            },
            externalUrl: false
        };

        $.extend(this.options, options);
        // private Config
        this.config = {
            current: null,
            throttle: false,
            newsLoaded: false,
            filters: {
                all: [],
                selected:[]
            }
        };
        //this.config.countDegree();
        //console.log(this.config);

        _scope.element = $(element);
        this.init(options);
    }

    var methods = {
        init: function () {
            this.setVariables();
            this.bindEvents();
            this.getMore(true);
            // this.showNews(1);

        },
        iterator: function (a, n) {
            var _scope = this;
            var current = 0,
                l = a.length;
            _scope.config.counter = 0;
            return function () {
                _scope.config.counter++;
                end = current + n;

                if (end > l) _scope.itemsLoaded(true);
                var part = a.slice(current, end);
                current = end;
                return part;
            };
        },

        updateFilters: function () {
            var _scope = this;
            //reset
            _scope.newsListEl.removeClass('active');
            _scope.itemsLoaded(false);

            _scope.config.filters.currentItems = _scope.newsListEl.filter(function (i) {
                var el = $(this);
                return (function() {
                    var state = true;
                    _scope.config.filters.selected.forEach(function(item, i, arr) {
                        state = (state === JSON.parse(el.attr('data-' + item).toLowerCase())) ? state : false;
                    });
                    return state;
                })();
            })


         //   _scope.config.filters.currentItems.addClass('active');
            _scope.getMore(true, _scope.config.filters.currentItems);

//            console.log(_scope.config.filters.selected);

        },
        itemsLoaded: function (boolean) {
            var _scope = this;
       //   $(_scope.options.moreBtn).attr('disabled', 'true');

            if (boolean) {
                _scope.config.newsLoaded = true;
                _scope.newsList.parent().addClass('news-loaded');
            } else {
                _scope.config.newsLoaded = false;
                _scope.newsList.parent().removeClass('news-loaded');
            }

            
        },
        getMore: function (first, elementsList) {
            var _scope = this;
            if (!elementsList) elementsList = _scope.newsListEl;

            
            if (first) {
                _scope.getNext = _scope.iterator(elementsList, _scope.options.packer.rows * _scope.options.packer.count);
                _scope.directionHeight = (_scope.options.packer.horizontal) ? _scope.options.packer.rows : _scope.options.packer.count;
            }
            var nextItems = _scope.getNext();
            nextItems.addClass('active');
            _scope.newsList.scrollTop((_scope.config.counter - 1) * (_scope.newsListEl.outerHeight() * _scope.directionHeight));
        },

        setVariables: function () {
            var _scope = this;


            _scope.newsList = _scope.element.find(_scope.options.newslist);
            _scope.newsListEl = _scope.newsList.find(_scope.options.newsSelector);

            _scope.currentNews = _scope.element.find(_scope.options.currentNews);
            _scope.popup = _scope.element.find(_scope.options.popup);
            _scope.options.url = _scope.element.attr('data-url');

            if (_scope.options.filters) {
                _scope.filterHolder = _scope.element.find(_scope.options.filters.holder);
                _scope.filterNav = _scope.filterHolder.find(_scope.options.filters.filterSelector);

                $.each(_scope.filterNav, function(i) {
                    _scope.config.filters.all.push($(this).attr('data-filter'));
                });

                
            }
        },
        closePopup: function () {
            var _scope = this;
            _scope.popup.removeClass('active');
            _scope.newsList.addClass('active');
            $(_scope.options.moreBtn).removeClass('hidden');
            if (_scope.options.filters) {

            _scope.filterHolder.removeClass('hidden');
            }
            _scope.currentNews.empty();
            _scope.config.current = null;


            var index = GLOBAL.isHome ? 4 : 3;

            var arr = window.location.hash.split('/');
            arr[index] = '';
            var str = arr.join('/');
            window.location.hash = str;
            $('.modal .modal__tabs').scrollTop(0);
        },

        showNews: function (id) {
            var _scope = this;
            if (id == _scope.config.current || _scope.config.throttle) return false;
            //   _scope.currentNews.empty();
            _scope.config.throttle = true;



            _scope.config.current = id;
            //    _scope.newsListEl.removeClass('active');
            //  _scope.newsListEl.filter('[data-id=' + id + ']').addClass('active');

            $.ajax({
                type: "GET",
                url: _scope.options.url,
                data: 'id=' + id,
                success: function (data) {
                    // console.log(data);
                    _scope.popup.addClass('active');
                    _scope.newsList.removeClass('active');
                    $(_scope.options.moreBtn).addClass('hidden');

                    if (_scope.options.filters) {
                    _scope.filterHolder.addClass('hidden');

                    }

                    _scope.currentNews.html(data);


                    _scope.config.throttle = false;

                    $('.modal .modal__tabs').scrollTop(0);


                    //_scope.currentNews.removeClass('fade-in').addClass('fade-out');
                    //setTimeout(function() {
                    //    _scope.currentNews.html(data);
                    //    _scope.currentNews.scrollTop(0);
                    //    setTimeout(function() {
                    //        _scope.currentNews.removeClass('fade-out').addClass('fade-in');
                    //        setTimeout(function() {
                    //            _scope.config.throttle = false;
                    //        }, 300);
                    //    }, 10);
                    //}, 300);


                }
            });
        },

        setFilter: function (filter) {
            var _scope = this;
            console.log(filter);
            var _thisNav = _scope.filterNav.filter('[data-filter='+ filter +']');


            if(filter.indexOf)

            //if (!$(_thisNav).attr('checked')) {
            //    $(_thisNav).attr('checked', true);
            //    $(_thisNav).addClass('active');
            //    _scope.config.filters.selected.push(filter);
             
            //} else {
            //    $(_thisNav).attr('checked', false);
            //    $(_thisNav).removeClass('active');
            //    var i = _scope.config.filters.selected.indexOf(filter);
            //    if (i != -1) {
            //        _scope.config.filters.selected.splice(i, 1);
            //    }
               
                //}
                var i = _scope.config.filters.selected.indexOf(filter);
            if (i != -1) {
                $(_thisNav).attr('checked', false);
                 $(_thisNav).removeClass('active');
                    _scope.config.filters.selected.splice(i, 1);
                } else {
                    $(_thisNav).attr('checked', true);
                        $(_thisNav).addClass('active');
                    _scope.config.filters.selected.push(filter);
                }

            _scope.updateFilters();
            console.log(_scope.config.filters.selected);
        },


        bindEvents: function () {
            var _scope = this;

            if (!_scope.options.externalUrl) {
                _scope.newsListEl.on('click touchstart', 'a', function (e) {

                    if (!_scope.config.throttle) {
                        var id = parseFloat($(e.delegateTarget).attr('data-id'));
                        var index = GLOBAL.isHome ? 4 : 3;
                        var currentHash = window.location.hash.split('/');
                        currentHash[index] = id;

                        var newHash = currentHash.join('/');
                        window.location.hash = newHash;


                //        _scope.showNews(id);
                        //window.location.hash = '#/buyers/promotion' + '/' + id;
                    }

                    return false;

                });
                _scope.popup.on('click touchstart', '.close-popup', function (e) {
                    if (!_scope.config.throttle) {
                        _scope.closePopup();
                        //window.location.hash = '#/buyers/promotion' + '/' + id;
                    }

                    return false;
                });
            }


            if (_scope.options.filters) {
                _scope.filterNav.on('click touchstart', function (e) {

                    var filter = $(this).attr('data-filter');
                    _scope.setFilter(filter);
                  
                    //$(this).checked
                    
                    return false;
                });
            }


            $(_scope.options.moreBtn).on('click touchstart', function (e) {
                if (!_scope.config.throttle && !_scope.config.newsLoaded) {
                    _scope.getMore();
                    //window.location.hash = '#/buyers/promotion' + '/' + id;
                }

                return false;
            });


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

