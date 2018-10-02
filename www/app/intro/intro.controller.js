(function() {
  'use strict';

  angular
    .module('app.intro')
    .controller('IntroController', IntroController)
    .controller('IntroMapController', IntroMapController);

  IntroController.$inject = ['$scope','$state'];
  /* @ngInject */
  function IntroController($scope, $state) {
    var vm = this;

    activate();

    function activate(){
      $scope.goTo = goTo;

      function goTo(state, direction){
        $state.go(state);

        // $ionicNativeTransitions.stateGo(state, {}, {
        //   "type": "slide",
        //   "direction": direction, // 'left|right|up|down', default 'left' (which is like 'next')
        //   "duration": 20, // in milliseconds (ms), default 400
        // });

      }
    }
  }

  /* @ngInject */
  function IntroMapController($scope, $http, $rootScope, API_URL){
    var vm = this;

    activate();
    function activate(){
      angular.extend($scope, {
        onLocationChanged: onLocationChanged
      });


    };

    function getAq(location){
      $http.get(API_URL + '/aq', {
        headers: {
          Accept: 'application/vnd.hackair.v1+json'
        },
        params: {
          lat: location.geometry.location.lat(),
          lon: location.geometry.location.lng()
        }
      }).then(function(response){
        var aqi = response.data.data[0].AQI_Index;


        vm.quality = aqi;

      }).catch(function(response){
        console.error(response.data.message);
      })
    }

    function onLocationChanged(location){
      $rootScope.$broadcast('changedLocation', location)
      getAq(location);
    }

  }
})();
