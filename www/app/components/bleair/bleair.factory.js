(function(){
    'use strict';

    angular
        .module('app.components')
        .factory('BLE', bleAirFactory);

        bleAirFactory.$inject = ['$q', '$cordovaBluetoothLE', 'LocationService', '$http', 'API_URL', '$rootScope'];
        /* @ngInject */
        function bleAirFactory($q, $cordovaBluetoothLE, LocationService, $http, API_URL, $rootScope) {

            var bleair = {

            				getSensorID: function() { return $rootScope.bleair_sensor_id; },

							isInitialized: function () {
								var deferred = $q.defer();

								$cordovaBluetoothLE.isInitialized().then(function (obj) {
									// console.info("Is Initialized Success : " + JSON.stringify(obj));
									deferred.resolve(obj);
								});

								return deferred.promise;
							},
							initialize: function () {
								// console.log("BLE Initializing");
								var deferred = $q.defer();

								var params = {
									request: true,
									//restoreKey: "bluetooth-test-app"
								};

								$cordovaBluetoothLE.initialize(params).then(null, function (error) {
									// console.info("Initialize Error : " + JSON.stringify(error)); //Should only happen when testing in browser
									deferred.reject(error);
								}, function (obj) {
									// console.info("Initialize Success : " + JSON.stringify(obj));
									deferred.resolve(obj);
								});

								return deferred.promise;
							},
							isEnabled: function () {
								var deferred = $q.defer();

								$cordovaBluetoothLE.isEnabled().then(function (obj) {
									// console.info("Is Enabled Success : " + JSON.stringify(obj));
									deferred.resolve(obj);
								});

								return deferred.promise;
							},
							enable: function () {
								var deferred = $q.defer();

								$cordovaBluetoothLE.enable().then(null, function (error) {
									// console.info("Enable Error : " + JSON.stringify(error));
									deferred.reject(error);
								});

								return deferred.promise;
							},
							isScanning: function() {
								var deferred = $q.defer();

								$cordovaBluetoothLE.isScanning().then(function(obj) {
									deferred.resolve(obj);
								});

								return deferred.promise;
							},
							isLocationEnabled: function() {
								var deferred = $q.defer();

								$cordovaBluetoothLE.isLocationEnabled().then(
									function(obj) {
										// console.info("Location Enabled Success : " + JSON.stringify(obj));
										deferred.resolve(obj);
								}, function(error) {
											// console.info("Location Enabled Error : " + JSON.stringify(error));
										deferred.reject(error);
								});

								return deferred.promise;
							},
							requestLocation: function() {
								var deferred = $q.defer();

								$cordovaBluetoothLE.requestLocation().then(
									function(obj) {
									// console.info("Request Location Success : " + JSON.stringify(obj));
									deferred.resolve(obj);
								}, function(error) {
									// console.info("Request Location Error : " + JSON.stringify(error));
									deferred.reject(error);
								});

								return deferred.promise;
							},
							startScan: function () {
                var deferred = $q.defer();

								var params = {
									services: [],
									allowDuplicates: false,
									scanTimeout: 30000
                };

								if (window.cordova) {
									params.scanMode = bluetoothle.SCAN_MODE_LOW_POWER;
									params.matchMode = bluetoothle.MATCH_MODE_STICKY;
									params.matchNum = bluetoothle.MATCH_NUM_ONE_ADVERTISEMENT;
									//params.callbackType = bluetoothle.CALLBACK_TYPE_FIRST_MATCH;
								}

								// console.info("Start Scan : " + JSON.stringify(params));

								$cordovaBluetoothLE.startScan(params).then(null,
									function (error) {
										// console.info("Start Scan Error : " + JSON.stringify(error));
										deferred.reject(error);
									}, function (obj) {
                    // This callback runs each time a device is detected

										if (obj.name == 'Air Beacon' && obj.status == "scanResult") {
											if (obj.advertisement) {
												if (typeof obj.advertisement == 'string') {
                          // Android
                          var advertisement = obj.advertisement;
                          var scanRecord = $cordovaBluetoothLE.encodedStringToBytes(advertisement);
													var reading = {
														// "PM1_AirPollutantValue": scanRecord[21] * 256 + scanRecord[22],
														"PM2.5_AirPollutantValue": scanRecord[23] * 256 + scanRecord[24],
														"PM10_AirPollutantValue": scanRecord[25] * 256 + scanRecord[26]
                          };
													var checkKey = 18;
												} else {
													// iOS
													var advertisement = obj.advertisement.manufacturerData;
													var scanRecord = $cordovaBluetoothLE.encodedStringToBytes(advertisement);
													var reading = {
														// "PM1_AirPollutantValue": scanRecord[4] * 256 + scanRecord[5],
														"PM2.5_AirPollutantValue": scanRecord[6] * 256 + scanRecord[7],
														"PM10_AirPollutantValue": scanRecord[8] * 256 + scanRecord[9]
													};
													checkKey = 2;
												}


												if (scanRecord[checkKey] == 1) {
													// console.log("Start Scan Success : ");
													// console.log("Start Scan Success : " + JSON.stringify(obj), obj, scanRecord);

													// Stop scan
													bleair.stopScan();

													// get sensor id selected by user
													var sensorID = bleair.getSensorID();
													// console.log('getSensorID() >>>> =', sensorID);

													// console.log('sendReading sensorID >>', sensorID);

													// Send reading to server
													bleair.sendReading(reading, sensorID);
												}
											}
										}

										deferred.resolve(obj);
								});

								return deferred.promise;
							},
							stopScan: function() {
								var deferred = $q.defer();

								$cordovaBluetoothLE.stopScan().then(function(obj) {
									// console.info("Stop Scan Success : " + JSON.stringify(obj));
									deferred.resolve(obj);
								}, function(error) {
									// console.info("Stop Scan Error : " + JSON.stringify(error));
									deferred.reject(error);
								});

								return deferred.promise;
							},
							scan: function() {
								// console.log("Ble.Scan() activated");
								bleair.isScanning().then(function(obj) {
									if (obj.isScanning == false) {
										// console.info('Scanning...');
										bleair.startScan();
									}
								});
							},
							sendReading: function(reading, sensor_id) {
								// TODO check address on iOS
								LocationService.getLocation().then(function(location){
									var data = {
										reading: reading,
										location: {
											type: 'Point',
											coordinates: [location.coords.longitude, location.coords.latitude]
										},
										sensor_id: sensor_id
									};

									// Send data to server
                  // console.info('^^^ Sending ble measurement to server.... ^^^:', data);
                  $rootScope.$broadcast('sendReading', data);
									// $http.post(API_URL + '/sensors/bleair/measurements', data);
								});
							},
							encodedStringToBytes: function (string) {
								return $cordovaBluetoothLE.encodedStringToBytes(string);
							}
						};

						return bleair;
        }
})();


