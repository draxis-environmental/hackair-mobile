(function() {
  'use strict';

  angular.module('hackair', [
    'ionic',
    'ngCordova',
    'ngStorage',
    'ngSanitize',
    'ngMessages',
    'tmh.dynamicLocale',
    'pascalprecht.translate',
    // 'ionic-native-transitions',

    'app.core',
    'app.auth',
    'app.intro',
    'app.layout',
    'app.services',
    'ngCordovaBluetoothLE'
  ])
  .config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.transition('none');
  })
  .config(localeConfig)
  .config(tabsConfig)
  // .config(transitionsConfig)
  .run(onRun)
  .run(['$ionicPlatform', '$state', function($ionicPlatform, $state) {
    $ionicPlatform.ready(function() {
      analytics.startTrackerWithId('UA-11231189-2');
      // analytics.trackView('home');
      analytics.trackView($state.current.name);
    });
  }])

  function GoogleAnalytics($ionicPlatform, $cordovaGoogleAnalytics) {
    $ionicPlatform.ready(function() {
        if(window.cordova) {
            $cordovaGoogleAnalytics.startTrackerWithId('UA-11231189-2');
            window.ga.startTrackerWithId('UA-11231189-2', 30);
        }
    });
  }

  function localeConfig(tmhDynamicLocaleProvider, $translateProvider, defaultLanguage){
    tmhDynamicLocaleProvider
    .localeLocationPattern('app/locales/angular-locale_{{locale}}.js');
    $translateProvider.useStaticFilesLoader({
      prefix: 'app/i18n/',
      suffix: '.json'
    });
    $translateProvider.preferredLanguage(defaultLanguage);
    $translateProvider.useSanitizeValueStrategy(null); // keeping the value to null is the only way for german characters to display properly
  }

  function tabsConfig($ionicConfigProvider){
    $ionicConfigProvider.tabs.position('bottom');
  }

  function transitionsConfig($ionicNativeTransitionsProvider){
    $ionicNativeTransitionsProvider.enable(true);
  }

  function onRun($ionicPlatform, $interval, $timeout, DataService,$localStorage, $q, BLE, $rootScope){
      $ionicPlatform.ready(function() {
        $timeout(function() {
          if ($localStorage.user != undefined) {
            // Scan for measurements and repeat every x minutes
            var promise = $q.when()
                // .then( getSensors )
                // .then( bleSensorExists )
                // .then( $rootScope.$broadcast('setSensorId') )
                // .then( bleInitialize )
                // .then( bleIsLocationEnabled )
                // .then( bleCheckLocation )
                // .then( bleRequestLocation )
                // .then( bleScan )
                // .then( bleRepeatScan )
                .catch( function handleReject(reason) {
                  console.log(reason);
                });

            return promise;
          }
        }, 30*1000);
      });

      function getSensors() {
      	return DataService.Sensors.get('', {user_id: $localStorage.user.id });
			}

			function bleSensorExists(res) {
				var sensors = res.data;
				var bleairSensorExists = false;

				sensors.forEach(function(sensor) {
					if (sensor.type === 'bleair') {
						bleairSensorExists = true;
					}
				});

				if (bleairSensorExists === false) {
					return $q.reject( { message: 'User does not have any bleair sensors.' } );
        }

				return bleairSensorExists;
			}

			function bleInitialize() {
				return BLE.initialize();
      }

			// function bleIsLocationEnabled() {
			// 	return BLE.isLocationEnabled();
			// }
			//
			// function bleCheckLocation(obj) {
			// 	return obj.isLocationEnabled;
			// }
			//
			// function bleRequestLocation(isLocationEnabled) {
			// 	if (isLocationEnabled === true) {
			// 		return;
			// 	}
			//
			// 	return BLE.requestLocation();
			// }

			function bleScan() {
				BLE.scan();
			}

        // $interval(BLE.scan, 5*60*1000);
			function bleRepeatScan() {
			}
  }
})();
