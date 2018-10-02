(function() {
  'use strict';

  angular
    .module('app.components')
    .controller('TipNotificationController', TipNotificationController);

  TipNotificationController.$inject = ['$http', 'API_URL', '$scope', '$localStorage'];
  /* @ngInject */
  function TipNotificationController($http, API_URL, $scope, $localStorage) {
    var vm = this;
    var active ;

    activate();

    $scope.$on("locationChanged", function(event, location) {
      angular.extend(vm, {
        selectedCity: location
      });
      getTipOfTheDay();
    });

    function activate(){
      if (vm.selectedCity == undefined) {
        vm.selectedCity = $localStorage.selectedLocation;
      }
      getTipOfTheDay();
      vm.isActive = isActive;
      vm.setActive = setActive;
    }

    function isActive(activity){
      return activity == active;
    }

    function setActive(activity){
      active = activity;

    }

    function getTipOfTheDay(){
      $http.get(API_URL + '/users/recommendations', {
        params: {
          city: vm.selectedCity.city.split(",")[0],
          lat: vm.selectedCity.coords.latitude,
          lon: vm.selectedCity.coords.longitude
        }
      })
      .then(function(response){
        var recommendations = response.data.data.results[0];
        vm.notification = {message: recommendations.isProvidedWithRecommendation.TipOfTheDay, icon: 'img/ui/illustration_tip.png'};
      })
      .catch(function(error) {
        vm.notification = undefined;
      });
    }

  }
})();
