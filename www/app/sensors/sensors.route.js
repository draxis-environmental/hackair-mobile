(function() {
  'use strict';

  angular
    .module('app.sensors')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
        {
            state: 'sensors',
            config: {
                url: '/sensors',
                template: '<ion-nav-view></ion-nav-view>',
                abstract: true,
                cache: false
            }
        },
        {
            state: 'sensors.list',
            config: {
                url: '/',
                templateUrl: 'app/sensors/list-sensors.html',
                controller: 'SensorsController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
            state: 'sensors.create',
            config: {
                url: '/create',
                templateUrl: 'app/sensors/create-sensor.html',
                controller: 'SensorsController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
            state: 'sensors.view',
            config: {
                url: '/:id',
                templateUrl: 'app/sensors/view-sensor.html',
                controller: 'SensorsController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
            state: 'sensors.edit',
            config: {
                url: '/:id/edit',
                templateUrl: 'app/sensors/edit-sensor.html',
                controller: 'SensorsController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
          state: 'sensors.measure',
          config: {
            url: '/',
            controller: 'BleairSensorsController',
            controllerAs: 'vm',
            cache: false,
            bindToController: true,
            onEnter: function(DataService, NotificationService, $localStorage, $rootScope, $state, $timeout) {
              DataService.Sensors.get('', {user_id: $localStorage.user.id })
              .then(function(res) {
                var sensors = res.data;
                var bleairSensorExists = false;

                sensors.forEach(function(sensor) {
                  if (sensor.type === 'bleair') {
                    bleairSensorExists = true;
                  }
                });

                if (bleairSensorExists === false) {
                  NotificationService.show("You don't have any hackAIR mobile sensors");
                } else {
                  NotificationService.show("hackAIR mobile sensors found");
                  $timeout($state.go('sensors.bleair'), 3*1000); // wait 3 seconds for the notification to appear and then go to next state
                }
              })

            }
          }
        },
        {
          state: 'sensors.bleair',
          config: {
              url: '/sensor-choice',
              templateUrl: 'app/sensors/bleair-sensor-choose.html',
              controller: 'BleairSensorsController',
              controllerAs: 'vm',
              cache: false,
              bindToController: true
              }
        },
        {
          state: 'sensors.bluetooth-monitor',
          config: {
            url: '/bluetooth',
            templateUrl: 'app/sensors/bleair-sensor-monitor.html',
            controller: 'BleairSensorsController',
            controllerAs: 'vm',
            cache: false,
            bindToController: true,
            params: {
              stopSendMeasurementsInterval: null,
              stopScanningInterval: null
            }
          }
        }
    ];
  }
})();
