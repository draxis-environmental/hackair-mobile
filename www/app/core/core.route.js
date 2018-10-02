(function() {
  'use strict';

  angular
    .module('app.core')
    .run(appRun);

  /* @ngInject */
  function appRun(routerHelper, $ionicPlatform, $rootScope, $cordovaGlobalization, $translate, tmhDynamicLocale, availableLanguages, defaultLanguage, $localStorage, $state, $ionicSideMenuDelegate, LocationService) {
    var otherwise = 'intro-welcome';
    routerHelper.configureStates(getStates(), otherwise);

    $ionicPlatform.ready(function() {

      setLanguage();

      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if(window.StatusBar) {
        StatusBar.styleDefault();
      }

      if (cordova.plugins.permissions){
        checkPermissions();
      }

      if ($localStorage.credentials) {
        $rootScope.loggedIn = true;
        $state.go('home');
      }

      function checkPermissions(){
        //only if v6 or greater
        if (ionic.Platform.version() >= 6) {
          // console.log(ionic.Platform.version())
          var permissions = cordova.plugins.permissions;
          permissions.checkPermission(permissions.ACCESS_FINE_LOCATION, function(status){
            if (!status.hasPermission){
              permissions.requestPermission(permissions.ACCESS_FINE_LOCATION, function(status){
                console.log(status);
              });
            }
          }, function(status){
            console.log('Error', status)
          });

        } else {
          console.log('Android version ' + ionic.Platform.version() + '. No permission request required');
        }
        // permissions.checkPermission(permission, function(){}, function(){});

      }

      // Location logic
      LocationService.getGPSLocation()
      .then(function(result){
        if (!result) {
          console.error('GPS failed, checking other sources..');
        }
        $rootScope.searchedCity = result;
        $rootScope.selectedLocation = result;
        $rootScope.gpsLocation = result;
      })
      .catch(function(error){
        console.error(error);
      });

      $rootScope.$on('gpsError', function(){
        LocationService.selectCity();
      });

      $rootScope.locationChanged = function(location){
        console.log('locationChanged FIRED');
        LocationService.getCity(location).then(function(location){
          console.log('locationChanged FIRED #2');
          $rootScope.searchedCity = location;
          // $rootScope.selectedLocation = location;
          $rootScope.$broadcast('locationChanged', location);
          $rootScope.$broadcast('searchChanged', location);
        });
      };

      // TODO: Fix this
      $rootScope.route = 'intro-welcome';
      $rootScope.next = '#/intro-step2';
      // Attach current route to rootScope
      $rootScope.$on('$stateChangeStart', function(evt, toState, toParams, fromState, fromParams) {

        $ionicSideMenuDelegate.toggleLeft(false); // Close the menu if open

        $rootScope.route = toState.name;
        $rootScope.next = (function(){
          switch (toState.name){
            case 'intro-welcome':
              return '#/intro-step2';
            case 'intro-step2':
              return '#/intro-step3';
            case 'intro-step3':
              return '#/auth';
          }
        })()
      });

    });

    function setLanguage(){
      if (typeof(navigator.globalization) !== 'undefined') {
        $cordovaGlobalization.getPreferredLanguage().then(function (result){
          var language = getSuitableLanguage(result.value);
          $rootScope.global_language = language;
          console.log('GLOBAL LANGUAGE = ', $rootScope.global_language);
          applyLanguage(language);
          $translate.use(language);
        })
      } else {
        applyLanguage(defaultLanguage);
      }
    }

    function applyLanguage(language){
      tmhDynamicLocale.set(language.toLowerCase());
    }

    function getSuitableLanguage(language){
      var ln = language.toLowerCase().slice(0,2);

      for (var i=0; i< availableLanguages.length; i++) {
        if (availableLanguages[i].toLowerCase() === ln) {
          return availableLanguages[i];
        }
      }
      return defaultLanguage;
    }
  }

  function getStates() {
    return [
      {
        state: '404',
        config: {
          url: '/404',
          templateUrl: 'app/core/404.html',
          title: '404'
        }
      }
    ];
  }

})();
