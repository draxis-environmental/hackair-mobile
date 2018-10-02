(function(){
    'use strict';

    angular.module('app.services')
    .factory('LocationService', LocationService);

    LocationService.$inject = ['$cordovaGeolocation', '$q', '$ionicPopup', '$localStorage', '$rootScope', 'NotificationService'];

    function LocationService($cordovaGeolocation, $q, $ionicPopup, $localStorage, $rootScope, NotificationService){
        var service = {
            getLocation: getGPSLocation,
            getGPSLocation: getGPSLocation,
            reverseGeocode: reverseGeocode,
            geocodeCity: geocodeCity,
            getCity: getCityCoords,
            setLocation: setLocation,
            selectCity: selectCity
        };

        return service;

        function getLocation(){
          if ($rootScope.GPSLocation) {
            return getGPSLocation();
          } else {

            if ($localStorage.selectedLocation != undefined) {
              return $localStorage.selectedLocation;
            } else {
              console.log('No location set!');
              console.log($localStorage);
            }
          }
        }

        function getGPSLocation(){
            var posOptions = {
                timeout: 5000,
                enableHighAccuracy: true
            };

            return $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(gpsSuccess, gpsError);
        }

        // gets city name from coords and saves the location to localstorage
        function gpsSuccess(position) {

          return reverseGeocode(position).then(function(city){

            var location = {
              city: city,
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              gps: true
            };

            $rootScope.GPSLocation = true;

            setLocation(location);

            return location;

          });

        }

        function gpsError(err){
          $localStorage.GPSLocation = undefined;

          if ($localStorage.selectedLocation != undefined && $localStorage.selectedLocation.coords != undefined){
            $rootScope.searchedCity = $localStorage.selectedLocation;
            return $localStorage.selectedLocation;
            // console.log("got location from localstorage");
          } else {
            $rootScope.$broadcast('gpsError', err);  // Opens popup
          }
          // console.error(err);
          return false;
        }

        function setLocation(location){
          $localStorage.selectedLocation = location;
        }

        function reverseGeocode(location){
            var deferred = $q.defer();
            var geocoder = new google.maps.Geocoder(),
                request = {
                    latLng: new google.maps.LatLng(location.coords.latitude, location.coords.longitude)
                };

            geocoder.geocode(request, function(data, status){
                if (status == google.maps.GeocoderStatus.OK) {
                    if (data[2] != null){
                        deferred.resolve(data[2].formatted_address); // Not sure about the first key, needs testing;
                    } else {
                        deferred.reject('No city found');
                    }
                } else {
                    deferred.reject('Geocoder error');
                }
            });

            return deferred.promise;
        }

        function geocodeCity(address){
          var deferred = $q.defer();
          var geocoder = new google.maps.Geocoder();


          geocoder.geocode({address:address}, function(data, status){
            if (status == google.maps.GeocoderStatus.OK) {
              if (data[0] != null){
                var coords= {latitude: data[0].geometry.location.lat(), longitude:data[0].geometry.location.lng()};
                $rootScope.cityLoc = {
                  city: address,
                  coords: coords
                };
                deferred.resolve(coords); // Not sure about the first key, needs testing;

              } else {
                deferred.reject('No coords found');
              }
            } else {
                deferred.reject('Geocoder error');
            }
          });

          return deferred.promise;
        }

        // gets coords from city name and saves the location to localstorage
        function getCityCoords(location){
          var address = location.formatted_address;

          return geocodeCity(address).then(function(coords){

            return {
              city: address,
              coords: coords
            }

          })
        }

        function selectCity () {
          var options = {
            template: 'We could not find your location!<br> Please enable your GPS for optimal results or enter your city.<div class="popup-city-search"> <city-search placeholder="Search city" ng-model="$rootScope.selectedLocation" required name="address" location-changed="locationChanged" radius="1500000" class="header-search"/> <br>We could not find your location!<br> Please enable your GPS for optimal results or search for your city.</div>',
            title: 'Location not found',
            buttons: [
              {
                text: '<b>Go to settings</b>',
                type: 'button-assertive',
                onTap: function(e) {
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }
              },
              {
                text: '<b>Add location</b>',
                type: 'button-calm',
                onTap: function(e){

                  // console.log($rootScope.searchedCity);

                  // if(!$rootScope.searchedCity.city) { console.log('$rootScope.searchedCity.city undefined') }
                  // if(!$rootScope.searchedCity.coords.latitude) { console.log('$rootScope.searchedCity.coords.latitude undefined') }
                  // if(!$rootScope.searchedCity.coords.longitude) { console.log('$rootScope.searchedCity.coords.longitude undefined') }

                  // console.log($rootScope.searchedCity.city);
                  // console.log($rootScope.searchedCity.coords.latitude);
                  // console.log($rootScope.searchedCity.coords.longitude);

                  if($rootScope.searchedCity.city && $rootScope.searchedCity.coords.latitude && $rootScope.searchedCity.coords.longitude)
                  {
                    $localStorage.selectedLocation = angular.copy($rootScope.searchedCity);
                    $rootScope.selectedLocation = angular.copy($rootScope.searchedCity);
                    $rootScope.gpsLocation = angular.copy($rootScope.searchedCity);
                  }
                  else
                  {
                    NotificationService.show('Please start typing your city and choose from the dropdown list that will show up');
                    selectCity();
                  }

                  // console.log('Location: ', $localStorage);
                  // LocationService.getCity(location).then(function(location){
                  //   $rootScope.$broadcast('locationChanged', location);
                  //   $rootScope.searchedCity = location;
                  // });
                  //$localStorage.location = vm.selectedCity.city;
                  // vm.selectedCity = $localStorage.location;
                  // getAq(vm.selectedCity);
                }
              }
            ]
          }
          var locationPopup = $ionicPopup.show(options);

          // locationPopup.then(function(res) {
          //   vm.selectedCity = $localStorage.location
          //   console.log(vm.selectedCity);
          // });
        }


    }
})();
