(function() {
  'use strict';

  angular
    .module('app.sensors')
    .controller('BleairSensorsController', BleairSensorsController);

    BleairSensorsController.$inject = ['DataService', '$localStorage', '$rootScope', 'BLE', '$state', '$interval', '$scope', '$http', 'API_URL', '$timeout', '$stateParams'];
  /* @ngInject */
  function BleairSensorsController(DataService, $localStorage, $rootScope, BLE, $state, $interval, $scope, $http, API_URL, $timeout, $stateParams) {
    var vm = this;

    activate();

    function activate(){
      angular.extend(vm, {
        setSensorId: setSensorId,
        sendReading: sendReading,
        stopMeasurements: stopMeasurements
      });
      $rootScope.total_sent = 0;
      $rootScope.pm2_5_value = null;
      $rootScope.pm10_value = null;
      getBleairSensors();
      $scope.$on('sendReading', function(event, data) {
        $rootScope.measurements.push(data);
      });
    }

    function getBleairSensors() {
      DataService.Sensors.get('', {user_id: $localStorage.user.id })
      .then(function(response) {
        var sensors = response.data;
        vm.sensors = [];
        sensors.forEach(function(sensor) {
          if (sensor.type === "bleair") {
            vm.sensors.push(sensor);
          }
        });
      });
    }

    function setSensorId(id) {
      $rootScope.bleair_sensor_id = id;
      BLE.initialize();
      BLE.scan();
      $rootScope.measurements = [];
      var stopSendMeasurementsInterval = $interval(vm.sendReading, 30*1000);
      var stopScanningInterval = $interval(BLE.scan, 500);
      $state.go('sensors.bluetooth-monitor',
      {
        stopSendMeasurementsInterval: stopSendMeasurementsInterval,
        stopScanningInterval: stopScanningInterval
      });
    }

    function sendReading() {
      var current_measurement = $rootScope.measurements.pop();
      if (current_measurement) {
        $http.post(API_URL + '/sensors/bleair/measurements', current_measurement)
        .then(function(response) {
          $rootScope.total_sent += 1;
          $rootScope.pm2_5_value = current_measurement.reading['PM2.5_AirPollutantValue'];
          $rootScope.pm10_value = current_measurement.reading.PM10_AirPollutantValue;
          $rootScope.measurements = [];
        })
        .catch(function(error) {
          console.log("Something went wrong!");
        });
      } else {
        // console.log("No measurements yet!");
      }
    }

    function stopMeasurements() {
      BLE.stopScan();
      $interval.cancel($stateParams.stopSendMeasurementsInterval);
      $interval.cancel($stateParams.stopScanningInterval);
      $state.go('home');
    }
  }

})();
