(function() {
  'use strict';

  angular
    .module('app.home')
    .controller('HomeController', HomeController);

  /* @ngInject */
  function HomeController($rootScope, LocationService, $scope, $state) {
    var vm = this;

    activate();

    function activate(){   
      angular.extend(vm, {
        // locationChanged: locationChanged,
        search: search
      });

    }

    // function locationChanged(location){
    //   $rootScope.$broadcast('locationChanged', location);
    //     // console.log('Home address bar search: ',location);
    // }

    function search(){
      $rootScope.$broadcast('clickedSearch');
    }
  }
})();
