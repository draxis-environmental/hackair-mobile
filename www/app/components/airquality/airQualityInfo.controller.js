(function() {
  'use strict'; 

  angular
    .module('app.components')
    .controller('AirQualityInfoController', AirQualityInfoController);

  AirQualityInfoController.$inject = ['$scope', '$rootScope', '$ionicPopup', '$cordovaSocialSharing', 'LocationService', '$http', '$localStorage', 'API_URL', '$ionicPopover'];
  /* @ngInject */
  function AirQualityInfoController($scope, $rootScope, $ionicPopup, $cordovaSocialSharing, LocationService, $http, $localStorage, API_URL, $ionicPopover) {
    var vm = this;
    var active;
    activate();

    $scope.selectedCity;
    $scope.texts;

    $scope.$on("gpsError", function(event){
      // selectCity();
    });

    var template_measurements = '<ion-popover-view class="measurements"><ion-content><p class="disclaimer-text">{{ "air_quality.disclaimers.disclaimer_measurements" | translate }}</p></ion-content></ion-popover-view>';
    var template_recommendations = '<ion-popover-view class="recommendations"><ion-content><p class="disclaimer-text">{{ "air_quality.disclaimers.disclaimer_recommendations" | translate }}</p></ion-content></ion-popover-view>';

    $scope.popover_measurements = $ionicPopover.fromTemplate(template_measurements, {
        scope: $scope
    });

    $scope.openPopoverMeasurements = function($event) {
        $scope.popover_measurements.show($event);
    };

    $scope.closePopoverMeasurements = function() {
        $scope.popover_measurements.hide();
    };

    $scope.popover_recommendations = $ionicPopover.fromTemplate(template_recommendations, {
      scope: $scope
    });

    $scope.openPopoverRecommendations = function($event) {
        $scope.popover_recommendations.show($event);
    };

    $scope.closePopoverRecommendations = function() {
        $scope.popover_recommendations.hide();
    };

    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover_measurements.remove();
      $scope.popover_recommendations.remove();
    });

    $scope.$on('locationChanged', function(event, location){
      $rootScope.searchedLocation = location;
      vm.selectedCity = location.city;
      getAq(location.coords);
      console.log('Getting AQ for ', location.city);
      getRecommendations();      
    })

    // $scope.$on('searchChanged', function(event, location){
    //   $rootScope.searchedLocation = location;
    //   getAq(location.coords);
    //   getRecommendations();
    //   console.log('Getting AQ for ', location.city);
    // })

    function activate(){
      console.info('Activating AQI.Controller');

      vm.image = '/img/airquality/'+vm.quality+'.png';
      vm.isActive = isActive;
      vm.setActive = setActive;
      vm.shareTwitter = shareTwitter;
      vm.shareFacebook = shareFacebook;
      vm.twitterWebShare = twitterWebShare;
      vm.setActive = setActive;
      vm.selectedCity = $localStorage.selectedLocation;

      console.log('vm.selectedCity', vm.selectedCity);

      // vm.quality = '...';
      // vm.selectCity = selectCity;
      // LocationService.getLocation().then(function(location){
      // console.log('Location service loaded from AQcontrol:', location);

      if ($rootScope.searchedLocation != undefined){
        console.log('Getting AQ from search bar on load');
        console.log($rootScope.searchedLocation);
        getAq($rootScope.searchedLocation.coords);
      } else if ($localStorage.selectedLocation != undefined) {
        console.log($localStorage.searchedLocation);
        console.log('Getting AQ from localstorage on load');
        $rootScope.searchedLocation = $localStorage.selectedLocation;
        getAq($localStorage.selectedLocation.coords);
      }

      getRecommendations();

    }

    function isActive(activity) {
      return activity == active;
    }

    function setActive(activity) {

      active = activity;

      if(vm.texts[activity].indexOf('-') > -1)
        vm.quote = vm.texts[activity].substr(0, vm.texts[activity].indexOf('-')); //gia na deiksei mono to keimeno, xoris ta -bad ktl
      else
        vm.quote = vm.texts[activity];

      console.log(vm.quote);

      // vm.quote = vm.texts[activity].substr(0, vm.texts[activity].indexOf('-')); //gia na deiksei to recommendation xoris ta -bad ktl
      // if (vm.texts[activity].charAt(vm.texts[activity].indexOf('-')+1)=='b') {
      //   document.getElementsByClassName('recommendation-colour')[0].innerHTML = 'Bad: ';
      //   document.getElementsByClassName('recommendation-colour')[0].style.color='#ff6666';
      // }
      // else {
      //   document.getElementsByClassName('recommendation-colour')[0].innerHTML = 'Good: ';
      //   document.getElementsByClassName('recommendation-colour')[0].style.color='#00a3ac';
      // }
      // document.getElementsByClassName('recommendation-colour')[0].style.fontWeight='bold';

    }


    function getAq(location){
      vm.unsupported = false;
        return $http.get(API_URL + '/aq', {
          headers: {
            Accept: 'application/vnd.hackair.v1+json'
          },
          params: {
            lat: location.latitude || location.lat, 
            lon: location.longitude || location.lng 
          }
        }).then(function(response){
          var aqi = response.data.data[0].AQI_Index;

          if (aqi === 'perfect'){
            aqi = 'very good';
          }

          vm.quality = aqi;
          vm.image = 'img/airquality/' + vm.quality + '.png';


        }).catch(function(response){
          vm.quality = undefined;
          vm.unsupported = true;
          vm.image = null;
          vm.recommendations = undefined;
          vm.showRecommendations = null;
          console.error(response.data.message);
        });

    }

    function getRecommendations(){

      var cityText = $rootScope.searchedLocation.city.substring(0, $rootScope.searchedLocation.city.indexOf(','));
      var latq = $rootScope.searchedLocation.coords.latitude;
      var lonq = $rootScope.searchedLocation.coords.longitude;
      console.log(cityText, latq, lonq);

        $http.get(API_URL + '/users/recommendations', {
          params: {
            city: cityText,
            lat: latq,
            lon: lonq
          }
        })
        .then(function(response){

          var recommendations = response.data.data.results[0];
          vm.texts = recommendations.isProvidedWithRecommendation.LimitExposureRecommendation;

          if(vm.texts){
            vm.showRecommendations = true;
            var key = Object.keys(vm.texts)[0];
            vm.setActive(key);
          }
        })

    }

    function shareTwitter(){
      vm.image = 'http://hackair.draxis.gr/img/airquality/excellent.png';
      var quote = 'The air quality in ' + vm.selectedCity + ' is ' + vm.quality +'! #hackAIR ';
      var cityName = (vm.selectedCity.slice(0, vm.selectedCity.indexOf(','))).toLowerCase();
      window.plugins.socialsharing.shareViaTwitter(quote, vm.image, 'https://platform.hackair.eu/'+cityName, null, twitterWebShare);
    }

    function twitterWebShare(){
      var cityName = (vm.selectedCity.slice(0, vm.selectedCity.indexOf(','))).toLowerCase();
      var quote = 'The air quality in ' + vm.selectedCity + ' is ' + vm.quality +'! https://platform.hackair.eu//'+cityName +' #hackAIR';
      location.href = "https://twitter.com/intent/tweet?text="+quote;
    }

    function shareError(e){
      console.log(e);
    }

    function shareFacebook(){
      vm.image = 'https://platform.hackair.gr/img/airquality/excellent.png';
      var cityName = (vm.selectedCity.slice(0, vm.selectedCity.indexOf(','))).toLowerCase();
      var url = 'https://platform.hackair.eu/'+cityName;
      var quote = 'The air quality in ' + vm.selectedCity + ' is ' + vm.quality +'! '+ url;
      window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(quote,  vm.image /* img */, null /* url */, 'Paste message!', function() {console.log('share ok')}, function(errormsg){alert("No facebook app detected!")})
    }
  }
})();
