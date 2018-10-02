(function(){
    angular.module('app.components') 

    .directive('citySearch', citySearch);

    citySearch.$inject = ['$timeout','$localStorage', 'LocationService', '$rootScope'];

    function citySearch($timeout, $localStorage, LocationService, $rootScope){
        var directive = {
            require: '?ngModel',
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/citySearch/citySearch.html',
            scope: {
                searchQuery: '=ngModel',
                locationChanged: '&',
                radius: '=',
                intro: '=',
                editprofile: '=',
                sensoraddress: '=',
                mapaddress: '='
            },
            link: link        
        };

        return directive;

        function link(scope, element, attrs, ngModel) {
            var map = new google.maps.Map(document.createElement('div'), {
                center: {lat: -33.8688, lng: 151.2195},
                zoom: 13
            });
            scope.dropDownActive = false;
            scope.selectLocationFired = false;
            var service = new google.maps.places.AutocompleteService();
            var placesService = new google.maps.places.PlacesService(map);
            var searchEventTimeout = undefined;
            var latLng = null;

            if(scope.sensoraddress === true) 
            { 
                scope.searchQuery = ''; 
            }            

            else if(scope.editprofile === true) // this occurs only in edit profile view
            { 
                console.log('scope.editprofile === true'); 
                var profile = angular.copy($localStorage.user);
                console.log('angular.copy($localStorage.user) =>',  profile);
                scope.searchQuery = profile.location_str; 
            }

            else if (scope.$root.searchedCity != undefined) 
            {
              scope.searchQuery = scope.$root.searchedCity.city;
            } 

            else 
            {
              if ($localStorage.selectedLocation != undefined) 
              {
                scope.$root.searchedCity = angular.copy($localStorage.selectedLocation);
                scope.searchQuery = scope.$root.searchedCity.city;
              } 
              else 
              {
                console.log('naaaa');
              }
            }            

            // navigator.geolocation.getCurrentPosition(function (position) {
            //     latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            // });

            var searchInputElement = angular.element(element.find('input'));

            scope.selectLocation = function(location) {

                console.log(location);

                scope.selectLocationFired = true;
                scope.dropDownActive = false;
                scope.searchQuery = location.description;

                placesService.getDetails({
                    placeId: location.place_id
                }, function(place, status){
                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        if (scope.locationChanged && scope.editprofile === true) {
                            scope.locationChanged()(place);
                        }

                      LocationService.getCity(place).then(function(location){
                        
                        // if sensoraddress is true then we need to broadcast only sensorAddressChanged and not the rest 
                        if (scope.sensoraddress === true) 
                        {
                            console.log('It broadcasts sensorAddressChanged');
                            $rootScope.$broadcast('sensorAddressChanged', location);                            
                        }
                        else
                        {
                            console.log('It broadcasts locationChanged & searchChanged');
                            $rootScope.searchedCity = location;
                            $rootScope.selectedLocation = location;
                            $rootScope.$broadcast('locationChanged', location);
                            $rootScope.$broadcast('searchChanged', location);
                        }
                      });
                    }
                })
                $timeout(function() {scope.selectLocationFired = false;}, 700);
            };

            if (!scope.radius) {
                scope.radius = 1500000;
            }

            scope.locations = [];

            scope.loseFocus = function() {
                console.log(scope.selectLocationFired);
                if(!scope.selectLocationFired) { scope.searchQuery = ''; }
            }

            scope.$watch('searchQuery', function(query) {
                if (angular.isUndefined(query)){
                    query = '';
                }

                scope.dropDownActive = (query.length >= 3 && scope.locations.length);

                if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                searchEventTimeout = $timeout(function() {
                    if(!query) return;
                    if (query.length < 3) {
                        scope.locations = [];
                        return;
                    };

                    var req = {
                        input: query,
                        language: 'en',
                        types: '(cities)'
                    };

                    if (latLng) {
                        req.location = latLng;
                        req.radius = scope.radius;
                    }


                    service.getQueryPredictions(req, function (predictions, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            // if sensoraddress element exists then bring all kind of places including addresses otherwise filter and get only cities
                            if (scope.sensoraddress === true || scope.mapaddress === true) 
                            { 
                                var newPred = predictions;
                            }
                            else
                            {
                                var newPred = predictions.filter(function(el){
                                  if (el.types != undefined){
                                    return (el.types[0] === 'locality' ||  el.types[0] ==='administrative_area_level_3');
                                  }
                                })
                            }
                            scope.locations = newPred;
                            // console.log(newPred);
                            scope.$apply();
                        }
                    });

                    return true;
                }, 350); // we're throttling the input by 350ms to be nice to google's API
            });

            var onClick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                scope.dropDownActive = true;
                searchInputElement[0].focus();
                scope.$digest();
                setTimeout(function(){
                    searchInputElement[0].focus();
                },0);
            };

            var onCancel = function(e){
                setTimeout(function () {
                    scope.dropDownActive = false;
                    scope.$digest();
                }, 200);
            };

            element.find('input').bind('click', onClick);
            element.find('input').bind('blur', onCancel);
            element.find('input').bind('touchend', onClick);

            scope.$on('clickedSearch', function(e){
              scope.dropDownActive = true;
              // scope.$digest();
              searchInputElement[0].focus();
              setTimeout(function(){
                  searchInputElement[0].focus();
              },0);
            });

            if(attrs.placeholder){
                element.find('input').attr('placeholder', attrs.placeholder);
            }
        }
    }
})();


