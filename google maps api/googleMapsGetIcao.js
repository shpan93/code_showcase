 (function ($,document,google,geolib) {
    'use strict';


    var App = (function () {
        var _ = {},
            API_URL = "http://ice.nifler.vizl.org/shpan/apiSOAP.php",
            $form = $('#icao'),
            ICAO_ARR = [
                "KLAX ",
                "EGGW",
                "UKLL",
                "EGLF",
                "EGHI",
                "EGKA",
                "EGMD",
                "EGMC"
            ];
        _.config = {
            data: [],
            markersArr: [],
            parsedData: [],
            markerBounds: null,
            markerCenter: null,
            map: null,
            currentICAO: null
        };
        _.formValid = false;
        _.$status = $('.input-row .status');

        function initMap(callback) {

            _.config.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: {lng: -1.8388097174072549, lat: 52.48146155551946}
            });
            google.maps.event.addListenerOnce(_.config.map, 'idle', function () {
                if (callback && (typeof callback === 'function')) {
                    callback();
                }

            });
        }

        function updateMap() {

            _.config.markersArr.map(function (marker) {
                marker.setMap(null);
            });
            _.config.markersArr = [];

            _.config.parsedData.map(function (item) {
                var marker = new google.maps.Marker({
                    position: item,
                    map: _.config.map,
                    icon: 'assets/images/marker-small.png'
                });
                var contentString = '';
                item.description.forEach(function (text) {
                    contentString += '<p>' + text + '</p>';
                });
                var infowindow = new google.maps.InfoWindow({
                    content: '<div class="map-infowindow"><div class="title"><span>' + _.config.currentICAO + '</span></div>' + contentString + '</div>'
                });
                marker.addListener('click', function () {
                    infowindow.open(_.config.map, marker);
                });

                _.config.markersArr.push(marker);
            });

            _.config.markerCenter = {
                lng: +geolib.getCenter(_.config.parsedData).longitude,
                lat: +geolib.getCenter(_.config.parsedData).latitude
            };
            _.config.map.setCenter(_.config.markerCenter);

            _.config.markerBounds = new google.maps.LatLngBounds();
            _.config.markersArr.map(function (item) {
                _.config.markerBounds.extend(item.getPosition());
            });


            if (_.config.markersArr.length > 1) {
                _.config.map.fitBounds(_.config.markerBounds);
            }
        }

        var convertToDD = function (string) {
            var lat = string.substr(0, 4);
            var lat_sign = string.substr(4, 1) == "N" ? 1 : -1;
            var ltd = parseFloat(lat.substr(0, 2) * 1000000);
            var ltm = parseFloat(lat.substr(2, 2) * 1000000);


            var long = string.substr(5, 5);
            var long_sign = string.substr(10, 1) == "E" ? 1 : -1;
            var lgd = parseFloat(long.substr(0, 3) * 1000000);
            var lgm = parseFloat(long.substr(3, 2) * 1000000);

            return {
                lat: Math.round(ltd + (ltm / 60)) * lat_sign / 1000000,
                lng: Math.round(lgd + (lgm / 60)) * long_sign / 1000000
            }
        };

        function uniq(a) {
            var obj = {};
            var arr = [];
            a.forEach(function (notam) {
                if (!obj.hasOwnProperty('' + notam.lat + notam.lng)) {
                    obj['' + notam.lat + notam.lng] = $.extend(notam, {description: [notam.description]})
                } else {
                    obj['' + notam.lat + notam.lng].description.push(notam.description);
                }
            });
            for (var key in obj) {
                arr.push(obj[key]);
            }
            return arr;
        }

        var parseData = function () {
            _.config.parsedData = [];
            if (!Array.isArray(_.config.data.NOTAMSET.NOTAM)) {

                var singleNotam = _.config.data.NOTAMSET.NOTAM;
                _.config.data.NOTAMSET.NOTAM = [singleNotam];

            }
            [].map.call(_.config.data.NOTAMSET.NOTAM, function (item) {
                var description = item.ItemE;
                var coord = item.ItemQ;
                var parsedItemQ = coord.substring(coord.lastIndexOf('/') + 1, coord.length);
                if (parsedItemQ) {
                    var coordinates = convertToDD(parsedItemQ);
                    _.config.parsedData.push({
                        lat: coordinates.lat,
                        lng: coordinates.lng,
                        description: description
                    })
                }
            });
            _.config.parsedData = uniq(_.config.parsedData);
        }
        _.setResponse = function (condition) {

            switch (condition) {
                case 'CLEAR':
                    _.$status.removeClass('success error').addClass('loading');
                    _.$status.find('span').text('');
                    break;
                case 'SUCCESS':
                    _.$status.addClass('success').removeClass('loading');
                    _.$status.find('span').text('Map was updated for ICAO: ' + _.config.currentICAO);
                    break;
                case 'FAIL':
                    _.$status.removeClass('loading').addClass('error');
                    _.$status.find('span').text('NOTAMs were not found for  ICAO: ' + _.config.currentICAO);
                    break;
            }
        };
        var getNotam = function (query) {
            _.setResponse('CLEAR');
            _.config.currentICAO = query;
            $.post(API_URL, {icao: query}, function (data) {
                 data = JSON.parse(data);
                if (data && data.NOTAMSET.NOTAM) {
                    _.config.data = data;

                    _.setResponse('SUCCESS');
                    parseData();
                    updateMap();
                }

            }).fail(function () {
                _.setResponse('FAIL');
            });

        };


        _.updateValidity = function () {
            if (_.formValid) {
                $form.find('input').removeClass('uk-button-danger');
                $form.find('button').attr('disabled', false);
            }
            else {
                $form.find('input').addClass('uk-button-danger');
                $form.find('button').attr('disabled', true);
            }
        };
        var bindEvents = function () {
            $form.find('input').on('keyup', function() {
                var value = $(this).val();
                $(this).val(value.replace(/[^a-zA-Z0-9]/g, ''))
                value = $(this).val();
                _.formValid = !!(value.length === 4 && (/[a-zA-Z0-9]/).test(value));
                _.updateValidity();

            });
            $form.on('submit', function (e) {
                e.preventDefault();

                var queryValue = $(this).find('input').val().toUpperCase();

                _.formValid && getNotam(queryValue);

            });
        };
        var getRandomIcao = function () {
            return ICAO_ARR[Math.floor(Math.random() * ICAO_ARR.length)];

        };
        _.init = function () {

            initMap(function () {
                getNotam(getRandomIcao());
            });
            bindEvents();


        };

        // _.getSoapIcao = function () {
        //     $.soap({
        //         url: 'https://apidev.rocketroute.com/notam/v1/',
        //         method: 'request',
        //         SOAPAction:'urn:xmethods-notam#getNotam',
        //         noPrefix: true,
        //         data: {
        //             REQWX: {
        //                 USR: "shpan93@gmail.com",
        //                 PASSWD: "a0582343629e93ff99a3284ca3560fe1",
        //                 ICAO: "EGKA"
        //             }
        //         },
        //         // HTTPHeaders: {                                  // additional http headers send with the $.ajax call, will be given to $.ajax({ headers: })
        //         //    // "Content-Length" : 280
        //         // },
        //         success: function (soapResponse) {
        //             console.log(soapResponse)
        //             // do stuff with soapResponse
        //             // if you want to have the response as JSON use soapResponse.toJSON();
        //             // or soapResponse.toString() to get XML string
        //             // or soapResponse.toXML() to get XML DOM
        //         },
        //         error: function (SOAPResponse) {
        //             console.log(SOAPResponse)
        //             // show error
        //         }
        //     });
        // }

        return _;
    })();
    $(document).ready(function () {
        App.init();
    });
   // return App;
}($,document,google,geolib));
