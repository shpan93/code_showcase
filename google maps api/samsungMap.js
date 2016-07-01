var MapModule = (function () {
    var _ = {
        OPTIONS: {
            mapSelector: '#map',
            markerImage: '/assets/images/shape-marker.png',
            locationImage: '/assets/images/2-layers.png',
            cityContainer: '#map-select-city',
            addressContainer: '#map-select-address',
            searchContainer: '#map-search',
            locationAnchor: '#getLocation',
            resultsContainer: '.results'
        },
        CONFIG: {
            API_URL: '',
            markerBounds: '',
            LOCAL: {
                allCities: '',
                allAddreses: ''
            },
            selectedCity: null
        },
        DATA: {
            adressesArray: [],
            citiesArray: [],
            filteredArray: [],
            markersArray: [],
            infowindowArray: [],
            locationMarker: null
        },
        OBJECTS: {
            map: null,
            $citySelect: null,
            $addressSelect: null,

        }
    };
    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    _.searchAddress = function (query) {
        var $resultContainer = $(_.OPTIONS.searchContainer).find(_.OPTIONS.resultsContainer);
        var $li = $resultContainer.find('li');
        $resultContainer.find('.tab').removeClass('active');
        var $noresults = $resultContainer.find('.no-results');
        var $resultWr = $resultContainer.find('.results-wr');


        if (!query) {
            $resultContainer.removeClass('active');
        }
        else {
            $resultContainer.addClass('active');

            var $filteredLi = $li.attr('hidden', true).filter(function (i, item) {
                return $(item).text().toLowerCase().indexOf(query.toLowerCase()) !== -1;
            }).attr('hidden', false);


            if ($filteredLi.length === 0) {
                $noresults.addClass('active');
            }
            else {
                $resultWr.addClass('active');
            }
        }


    };
    _.fillControls = function (callback) {
        //add default values


        _.OBJECTS.$citySelect = $('<select name=city />');
        $(_.OPTIONS.cityContainer).append(_.OBJECTS.$citySelect);
        function addCityOption(item, selected) {
            selected = selected === true;
            var $option = $('<option  />');
            $option.attr({
                'value': item.Id,
                'selected': selected
            }).text(item.Title)
            _.OBJECTS.$citySelect.append($option);
        }

        addCityOption({
            Id: 0,
            Title: _.CONFIG.LOCAL.allCities
        }, true);

        _.DATA.citiesArray.map(addCityOption);


        _.OBJECTS.$addressSelect = $('<select name=address />')
        $(_.OPTIONS.addressContainer).append(_.OBJECTS.$addressSelect);
        var $resultsUl = $(_.OPTIONS.searchContainer).find(_.OPTIONS.resultsContainer).find('ul');

        function addAddressOption(item, selected) {
            selected = selected === true;
            var hidden = selected ? '' : 'hidden';
            var $option = $('<option ' + hidden + ' />');
            $option.attr({
                'value': item.Id,
                'data-cityid': item.CityId,
                'selected': selected
            }).text(item.Title)
            _.OBJECTS.$addressSelect.append($option);

            if (!selected) {
                var $li = $('<li hidden/>').text(item.Title);
                $li.attr('data-id', item.Id);
                $resultsUl.append($li);
            }


        }

        addAddressOption({
            Id: 0,
            cityID: 0,
            Title: _.CONFIG.LOCAL.allAddreses,
        }, true);
        _.DATA.adressesArray.map(addAddressOption);
        if (callback && (typeof callback === 'function')) {
            callback();
        }
    };
    _.createMap = function (callback) {
        _.OBJECTS.map = new google.maps.Map(document.querySelector(_.OPTIONS.mapSelector), {
            zoom: 13,
            center: {
                lat: 50.448853,
                lng: 30.513346
            },
            disableDefaultUI: true,
            scrollwheel: true,
        });
        google.maps.event.addListenerOnce(_.OBJECTS.map, 'idle', function () {
            if (callback && (typeof callback === 'function')) {
                callback();
            }

        });
    };
    _.getAdresses = function (callback) {
        $.ajax({method: "post", url: _.CONFIG.API_URL}).done(function (response) {
            _.DATA.adressesArray = response;
            if (callback && typeof callback === 'function') {
                callback();
            }
        }).fail(function (error) {
            console.log(error)
        });
    };

//     _.handleMarkerClick = function () {
// console.log(this)
//     };

    _.updateMap = function () {
        _.filterData();


        _.DATA.markersArray.map(function (marker) {
            marker.setMap(null);
        });
        _.DATA.markersArray = [];
        _.DATA.infowindowArray.map(function (infowindow) {
            infowindow.close();
        })
        //  _.DATA.infowindowArray.length === 1 && _.DATA.infowindowArray[0].close();
        _.DATA.infowindowArray = [];

        _.DATA.filteredArray.map(function (item) {
            var marker = new google.maps.Marker({
                position: {
                    lat: +item.Latitude,
                    lng: +item.Longitude,
                },
                map: _.OBJECTS.map,
                icon: _.OPTIONS.markerImage,
                //animation: google.maps.Animation.DROP,

            });
            //marker.addListener('click', _.handleMarkerClick);

            var realPhone = function (phone) {


                phone = phone.replace(/[^\d]/g, '');

                if (phone.length == 10) {
                    phone = '+38' + phone;
                }
                else if (phone.length == 12 && phone[0] == '3') {
                    phone = '+' + phone;
                }
                return phone;


            };
            var beautifyPhone = function (phone) {
                var space = ' ';
                var def = '-';
                return phone.substr(0, 3) + ' (' + phone.substr(3, 3) + ') ' + space + phone.substr(6, 3) + def + phone.substr(9, 2) + def + phone.substr(11, 2);
            }
            var phone = item.Phone ? realPhone(item.Phone) : '';

            var phoneString = item.Phone ?
            '<p class="phone"><label>' + _.CONFIG.LOCAL.popupPhone + ': </label> <a href=tel:' + phone + '>' + beautifyPhone(phone) + '</a></p>'
                : '';
            var workingTimeString = item.Time ?
            '<p class="working-time"><label>' + _.CONFIG.LOCAL.popupWorkingTime + ': </label> <span>' + item.Time + '</span></p>'
                : '';


            var infowindow = new google.maps.InfoWindow({
                content: '<div class="map-infowindow">' +
                '<p class="city"><span>' + (_.DATA.citiesArray.filter(function (city) {
                    return city.Id === item.CityId;
                }))[0].Title + '</span></p>' +
                '<p class="type"><span>' + item.TypeM + '</span></p>' +
                '<p class="address"><label>' + _.CONFIG.LOCAL.popupAddress + ': </label> <span>' + item.Title + '</span></p>' +
                phoneString +
                workingTimeString +
                '</div>'
            });
            marker.addListener('click', function () {
                _.CONFIG.infowindow && _.CONFIG.infowindow.close();
                infowindow.open(_.OBJECTS.map, marker);
                //console.log(this)
                _.OBJECTS.map.panTo({
                    lng: this.position.lng(),
                    lat: this.position.lat(),
                });
                _.CONFIG.infowindow = infowindow;
            });

            _.DATA.markersArray.push(marker);
            _.DATA.infowindowArray.push(infowindow);
        });
        _.DATA.infowindowArray.length === 1 && _.DATA.infowindowArray[0].open(_.OBJECTS.map, _.DATA.markersArray[0]);

        var tempData = [];
        _.DATA.filteredArray.map(function (item) {
            tempData.push({
                latitude: item.Latitude,
                longitude: item.Longitude,
            })
        });

        _.CONFIG.markerCenter = {
            lng: +geolib.getCenter(tempData).longitude,
            lat: +geolib.getCenter(tempData).latitude
        };
        _.OBJECTS.map.setCenter(_.CONFIG.markerCenter);

        _.CONFIG.markerBounds = new google.maps.LatLngBounds();
        _.DATA.markersArray.map(function (item) {
            _.CONFIG.markerBounds.extend(item.getPosition());
        });


        if (_.DATA.markersArray.length > 1) {
            _.OBJECTS.map.fitBounds(_.CONFIG.markerBounds);
        } else {
            _.OBJECTS.map.setZoom(16);
        }
        // var options = {
        //     imagePath: "/assets/images/marker"
        // };
        //
        // var style = {
        //     url: '/assets/images/cluster-marker.png',
        //
        //     height: 42,
        //     width: 30,
        //     textColor: 'white',
        //     textSize: 18,
        //     anchor: [-12, 0]
        //
        // };
        //
        // var clusterStyles = [style, style, style];
        //
        //
        // var mcOptions = {
        //     gridSize: 50,
        //     styles: clusterStyles,
        //     maxZoom: 15,
        //     zoomOnClick: true
        // };
        // _.OBJECTS.markerCluster = new MarkerClusterer(_.OBJECTS.map, _.DATA.markersArray, mcOptions);
    }
    _.filterData = function () {
        if (!!_.CONFIG.selectedCity) {
            _.DATA.filteredArray = _.DATA.adressesArray.filter(function (address) {
                return address.CityId === _.CONFIG.selectedCity;
            });

            if (!!_.CONFIG.selectedAddress) {
                _.DATA.filteredArray = _.DATA.adressesArray.filter(function (address) {
                    return address.Id === _.CONFIG.selectedAddress;
                });
            }


        }
        else if (!!_.CONFIG.selectedAddress) {

            _.DATA.filteredArray = _.DATA.adressesArray.filter(function (address) {
                return address.Id === _.CONFIG.selectedAddress;
            });

        }
        else {
            _.DATA.filteredArray = _.DATA.adressesArray;
        }

    }
    _.filterAddresses = function (selectedCity, condition) {
        var $option = _.OBJECTS.$addressSelect.find('option').not('[value=0]');
        var $filteredOptions = $option.attr('hidden', true).filter('[data-cityid=' + selectedCity + ']')
            .attr('hidden', false);
        //$filteredOptions.length > 1 ?
        if (condition) _.OBJECTS.$addressSelect.val(0);
        //:  _.OBJECTS.$addressSelect.val($filteredOptions.value);

    };
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation && _.CONFIG.LOCAL.locationError);
    }

    _.findClosest = function (position) {
        function arrayMin(arr) {
            return arr.reduce(function (p, v) {
                return ( p.distance < v.distance ? p : v );
            });
        }

        _.DATA.adressesArray.forEach(function (item, i, arr) {

            arr[i].distance =
                geolib.getDistance(
                    {latitude: +item.Latitude, longitude: +item.Longitude},
                    position
                );
        });
        var closestAddress = arrayMin(_.DATA.adressesArray);

        (function () {
            var id = parseFloat(closestAddress.Id);
            var cityId = _.getCityValById(id);


            _.updateSelects(id, cityId);
            //   _.(value);
            _.updateMap();
        })();


    };
    _.getLocation = function () {
        // Try HTML5 geolocation.
      //  _.OBJECTS.locationWindow = _.OBJECTS.locationWindow || new google.maps.InfoWindow({map: _.OBJECTS.map});
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function (position) {
    //             var pos = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude
    //             };
    //             console.log(pos);
    //             if (_.DATA.locationMarker) {
    //                 _.DATA.locationMarker.setMap(null);
    //             }
    //             _.DATA.locationMarker = new google.maps.Marker({
    //                 position: pos,
    //                 map: _.OBJECTS.map,
    //                 icon: _.OPTIONS.locationImage,
    //                 //animation: google.maps.Animation.DROP,
    //
    //             });
    //
    //             _.findClosest(pos);
    //
    //             // var circle = new google.maps.Circle({
    //             //     map: map,
    //             //     radius: 16093,    // 10 miles in metres
    //             //     fillColor: '#AA0000'
    //             // });
    //
    //             //  circle.bindTo('center', _.DATA.locationMarker, 'position');
    //             infoWindow.setPosition(pos);
    //             infoWindow.setContent('Your location.');
    //             // _.OBJECTS.map.setCenter(pos);
    //             // _.OBJECTS.map.setZoom(16);
    //         }, function () {
    //
    //             handleLocationError(true, _.OBJECTS.locationWindow, _.OBJECTS.map.getCenter());
    //         });
    // }
        $.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAOpJPfSP7FX4xcm0uV7GCn3T-TEBi6ax4", function (success) {
            var pos = {
                lat: success.location.lat,
                lng: success.location.lng
            };
            if (_.DATA.locationMarker) {
                _.DATA.locationMarker.setMap(null);
            }
            _.DATA.locationMarker = new google.maps.Marker({
                position: pos,
                map: _.OBJECTS.map,
                icon: _.OPTIONS.locationImage,
                //animation: google.maps.Animation.DROP,

            });

            _.findClosest(pos);
            // infoWindow.setPosition(pos);
            // infoWindow.setContent('Your location.');
        })
            .fail(function (err) {
             //   handleLocationError(true, _.OBJECTS.locationWindow, _.OBJECTS.map.getCenter());
                alert('Помилка геолокації')
            });

    };
    _.resetSelects = function () {
        _.OBJECTS.$citySelect.val(0).trigger('change');
        _.filterAddresses(0);
        _.OBJECTS.$addressSelect.val(0).trigger('change');

    };

    _.bindEvents = function () {
        _.OBJECTS.$citySelect.on('change', function (e) {
            var value = parseFloat($(this).val());
            $(_.OPTIONS.searchContainer).find('input').val('');


            if (value !== _.CONFIG.selectedCity) {
                _.OBJECTS.$addressSelect.val(0).trigger('change');
                _.CONFIG.selectedCity = value;
                _.CONFIG.selectedAddress = '';
                _.filterAddresses(value);
                _.updateMap();
            }

            // _.updateMap();
        });
        _.OBJECTS.$addressSelect.on('change', function (e) {
            var value = $(this).val();
            $(_.OPTIONS.searchContainer).find('input').val('');
            _.CONFIG.selectedAddress = parseFloat(value);

            //   _.(value);
            _.updateMap();
        });
        $(_.OPTIONS.locationAnchor).on('click', function (e) {
            _.getLocation();

            return false;
        });
        $(_.OPTIONS.searchContainer).find('input').on('keyup change', function (e) {
            var value = $(this).val().trim();
            // console.log(value)
            _.searchAddress(value);
        });
        $(_.OPTIONS.searchContainer).find('input').on('blur', function (e) {
            var value = $(this).val();
            if (!value && _.CONFIG.formTouched) {
                _.CONFIG.formTouched = false;
                // _.CONFIG.selectedCity = null;
                // _.CONFIG.selectedAddress = null;
                _.resetSelects();
                _.updateMap();

            }
            else {
                //$_)
                $(_.OPTIONS.searchContainer).find(_.OPTIONS.resultsContainer).removeClass('active');
            }

        });
        $(_.OPTIONS.searchContainer).find('input').on('focus', function (e) {
            $(_.OPTIONS.searchContainer).find(_.OPTIONS.resultsContainer).addClass('active');
        });
        $(_.OPTIONS.searchContainer).find('form').on('submit', function (e) {
            return false;

        });
        $(_.OPTIONS.searchContainer).on('click touchstart', 'li', function () {
            var value = $(this).attr('data-id');
            _.CONFIG.formTouched = true;
            if (_.CONFIG.selectedAddress !== parseFloat(value)) {


                // $(_.OPTIONS.searchContainer).find('input').val('');
                $(_.OPTIONS.searchContainer).find(_.OPTIONS.resultsContainer).removeClass('active');
                var cityId = _.getCityValById(value);


                _.updateSelects(value, cityId)

                //   _.(value);
                _.updateMap();
            }
        });
    };
    _.updateSelects = function (id, cityId) {
        _.OBJECTS.$citySelect.val(cityId);
        _.filterAddresses(cityId);
        _.OBJECTS.$addressSelect.val(id);
        _.CONFIG.selectedCity = parseFloat(cityId);
        _.CONFIG.selectedAddress = parseFloat(id);
    };
    _.getCityValById = function (value) {
        return _.DATA.adressesArray.filter(function (item) {
            return item.Id === +value;
        })[0].CityId;
    }
    _.checkBrowserLocation = function () {
        if (navigator.geolocation) {
            $(_.OPTIONS.locationAnchor).attr('disabled', false);
        } else {
            $(_.OPTIONS.locationAnchor).attr('disabled', true);
        }

    }
    _.init = function () {
        _.CONFIG.API_URL = window.Bs.urls["allAddresses"];
        _.CONFIG.LOCAL = window.Bs.localization;
        _.DATA.citiesArray = window.Bs.cities;
        _.checkBrowserLocation();

        _.getAdresses(function () {
            _.DATA.filteredArray = _.DATA.adressesArray;
            _.createMap(function () {
                _.fillControls(_.bindEvents);

                _.updateMap();
            });
        });


    };
    return _;
})();