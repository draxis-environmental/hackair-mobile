(function() {
  'use strict';

  angular
    .module('app.sensors')
    .controller('SensorsController', SensorsController);

  SensorsController.$inject = ['$state', '$rootScope', '$localStorage', '$cordovaToast', 'DataService', '$http', '$filter', '$timeout', '$stateParams', '$ionicModal', '$scope', '$ionicPopup'];
  /* @ngInject */
  function SensorsController($state, $rootScope, $localStorage, $cordovaToast, DataService, $http, $filter, $timeout, $stateParams, $ionicModal, $scope, $ionicPopup) {
    var vm = this;

    vm.sensorAddress;

    $scope.$on('sensorAddressChanged', function(event, location){
      console.log(location.coords);
      moveMapTo(location.coords);
    });    

    function moveMapTo(location){
      vm.map.whenReady(function(){
        console.log('moving sensor popup map to input address');
        vm.map.panTo([location.latitude, location.longitude]);
      });
    }    

    activate();

    function setSensorMapModal() {
      $scope.sensorMapModal = $ionicModal.fromTemplate( 
        '<ion-modal-view>' +

          '<ion-header-bar>' +
              '<city-search placeholder="Type a city or address..." sensoraddress="true" ng-model="vm.sensorAddress" required name="address" radius="1500000" class=""/>' +
          '</ion-header-bar>' +

          '<ion-content' + ' class="overflow-scroll"' + '>' +       
            '<button class = "cancelmap ion-ios-close-outline" ng-click = "closeSensorMap()"> CANCEL</button>'  +
            '<div class="map" style="margin:0px 0; width:100%; height:100%;" id="sensormap"></div>' +
          '</ion-content>' +
        '</ion-modal-view>',
      {
        scope: $scope,
        animation: 'slide-in-up'
      });
    }


    $scope.$on('modal.shown', function() {

      activate();

      function activate(){
        renderMap();
      }

      function renderMap() {

        // var loc = {};
        vm.loc = {};

        // var center = L.latLng(40.63,22.949);  // Thessaloniki

        console.log($rootScope.searchedCity.city); 
        console.log($rootScope.gpsLocation);

        var center = L.latLng($rootScope.gpsLocation.coords.latitude, $rootScope.gpsLocation.coords.longitude);

        var sensorMap = L.map('sensormap', {
              // crs: L.CRS.EPSG4326, // Depends on WMS server, default is EPSG3857. Example WMSLayer uses EPSG4326
              center: center,
              zoom: 15,
              // zoomControl: false,
              attributionControl: false
        });

        vm.map = sensorMap;
        var tileLayer = L.tileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png').addTo(sensorMap);
        var geocoder = new google.maps.Geocoder;

        var locationLayer = L.featureGroup().addTo(sensorMap);
        var clickedPoint = L.marker();

        sensorMap.on('click', function(e){
          var label = L.latLng(e.latlng).toString();

          // Remove old save buttons
          var className = 'save-location leaflet-control';
          var elements = document.getElementsByClassName(className);
          console.log(elements);
          while(elements.length > 0){
              elements[0].parentNode.removeChild(elements[0]);
          }

          geocoder.geocode({'location': e.latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {

                // Save button
                L.Control.save = L.Control.extend({
                  onAdd: function(map){
                    var container = L.DomUtil.create('div', 'save-location');
                    L.DomEvent.disableScrollPropagation(container);

                    var header = L.DomUtil.create('div', 'header', container);

                    var title = L.DomUtil.create('div', 'title', header);
                    title.innerText = 'SAVE LOCATION';

                    L.DomEvent.on(container, 'click', function(){
                      console.log('save button clicked');
                      // vm.sensor.location = results[0].formatted_address;
                      // vm.sensor.loc = results[0].formatted_address;
                      vm.loc = clickedPoint.toGeoJSON();
                      vm.loc.properties.label = label;
                      if (results[1])
                      {
                        vm.loc.properties.label_short = results[1].formatted_address;
                      }
                      vm.sensor.loc = vm.sensor.location = vm.loc;

                      $scope.closeSensorMap();
                    });

                    return container;
                  },
                  onRemove: function(map){}
                })
                var saveMarkers = [];
                var saveButton = new L.Control.save({position:'topright'}).addTo(sensorMap);
                // Save Button:end

                label = results[0].formatted_address;
                clickedPoint.removeFrom(sensorMap);
                clickedPoint.setLatLng(e.latlng);
                clickedPoint.bindPopup(label);
                clickedPoint.addTo(sensorMap);
                clickedPoint.openPopup();


              } else {
                vm.loc.properties.label = label;
                console.error('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }
          });
        })

      }// renderMap():end

    })

    $scope.openSensorMap = function() {
      setSensorMapModal();
      $scope.sensorMapModal.show();
    };

    $scope.closeSensorMap = function() {
      $scope.sensorMapModal.remove();
      // $scope.sensorMapModal.hide();
    };


    function activate(){
        switch($state.current.name){
            case 'sensors.list':
                getSensors();
                break;
            case 'sensors.create':
                initSensorViewModel();
                break;
            case 'sensors.view':
                getSensor($stateParams.id);
                break;
            case 'sensors.edit':
                initSensorEditModel();
                break;
            default:
                break;
        }
    };

    function getSensors(){
      DataService.Sensors.get('', {user_id: $localStorage.user.id })
      .then(function(res){
          vm.sensors = res.data;
      });
    }

    function getSensor(id){
      DataService.Sensors.one(id).get().then(function(res){
          vm.sensor = res.data;
          DataService.Measurements
          .get('', {
            sensor: id,
            timestampStart: new Date(0),
            show: 'all'
          })
          .then(function(result){
            vm.sensor.measurements = result.data;
          });
      });
    }

    function initSensorViewModel(){

      vm.sensor = { };

      vm.locationTypes = [
        {
            id: 1,
            name: "Indoor",
            value: "Indoor",
            selected: "Indoor" == vm.sensor.locationType ? true : false
        },
        {
            id: 2,
            name: "Building entrance",
            value: "Building entrance",
            selected: "Building entrance" == vm.sensor.locationType ? true : false
        },
        {
            id: 3,
            name: "Garden",
            value: "Garden",
            selected: "Garden" == vm.sensor.locationType ? true : false
        },{
            id: 4,
            name: "Terrace",
            value: "Terrace",
            selected: "Terrace" == vm.sensor.locationType ? true : false
        },{
            id: 5,
            name: "Balcony",
            value: "Balcony",
            selected: "Balcony" == vm.sensor.locationType ? true : false
        },{
            id: 6,
            name: "Street",
            value: "Street",
            selected: "Street" == vm.sensor.locationType ? true : false
        },{
            id: 7,
            name: "Other outdoor",
            value: "Other outdoor",
            selected: "Other outdoor" == vm.sensor.locationType ? true : false
        },
        {
            id: 8,
            name: "None",
            value: "",
            selected: "None" == vm.sensor.locationType ? true : false
        }
      ];

      vm.types = [
        {
            id: 1,
            name: "hackAIR home",
            value: "arduino",
            selected: false
        },
        {
            id: 2,
            name: "hackAIR mobile",
            value: "bleair",
            selected: false
        }
      ];

      vm.getOptionsSelected = getOptionsSelected;
      vm.createSensor = createSensor;
      vm.back = back;

      function back(){
        $state.go('sensors.list');
      }
    }


    function initSensorEditModel(){
      DataService.Sensors.one($stateParams.id).get().then(function(res){
        vm.sensor = res.data;
        vm.getOptionsSelected = getOptionsSelected;
        vm.updateSensor = updateSensor;
        vm.back = back;

        vm.types = [
          {
              id: 1,
              name: "hackAIR home",
              value: "arduino",
              selected: "arduino" == vm.sensor.type ? true : false
          },
          {
              id: 2,
              name: "hackAIR mobile",
              value: "bleair",
              selected: "bleair" == vm.sensor.type ? true : false
          }
        ];

        vm.locationTypes = [
          {
              id: 1,
              name: "Indoor",
              value: "Indoor",
              selected: "Indoor" == vm.sensor.location_type ? true : false
          },
          {
              id: 2,
              name: "Building entrance",
              value: "Building entrance",
              selected: "Building entrance" == vm.sensor.location_type ? true : false
          },
          {
              id: 3,
              name: "Garden",
              value: "Garden",
              selected: "Garden" == vm.sensor.location_type ? true : false
          },{
              id: 4,
              name: "Terrace",
              value: "Terrace",
              selected: "Terrace" == vm.sensor.location_type ? true : false
          },{
              id: 5,
              name: "Balcony",
              value: "Balcony",
              selected: "Balcony" == vm.sensor.location_type ? true : false
          },{
              id: 6,
              name: "Street",
              value: "Street",
              selected: "Street" == vm.sensor.location_type ? true : false
          },{
              id: 7,
              name: "Other outdoor",
              value: "Other outdoor",
              selected: "Other outdoor" == vm.sensor.location_type ? true : false
          },
          {
              id: 8,
              name: "None",
              value: "",
              selected: "None" == vm.sensor.location_type ? true : false
          }
        ];

        vm.getOptionsSelected = getOptionsSelected;
        vm.updateSensor = updateSensor;

        vm.back = back;

        function back(){
          $state.go('sensors.view', {id: $stateParams.id});
        }

      });
    }

    function createSensor(){
      var sensor = {
          name: vm.sensor.name,

          loc: vm.sensor.location,
          location: vm.sensor.location,    
          type: vm.getOptionsSelected(vm.types, 'value', 'selected'),
          location_type: vm.getOptionsSelected(vm.locationTypes, 'value', 'selected'),
          floor: vm.sensor.floor
      };

      DataService.Sensors
      .post(sensor)
      .then(function(response){
          $state.go('sensors.view', {id: response.resources.id});
      })
      .catch(function(response){
          console.error(response);
      })
    }

    function updateSensor(){
      var sensor = DataService.Sensors.one(vm.sensor.id);
      angular.extend(sensor, {
        name: vm.sensor.name,
        loc: vm.sensor.location,  // TODO: Check this
        location: vm.sensor.location,
        location_type: vm.getOptionsSelected(vm.locationTypes, 'value', 'selected'),
        user_id: $localStorage.user.id,
        type: vm.getOptionsSelected(vm.types, 'value', 'selected'),
        floor: vm.sensor.floor
      });
      sensor.put()
      .then(function(response){
        getSensor($stateParams.id);
        getSensors();
        $state.go('sensors.view', {id: vm.sensor.id});
      })
    }



    function getOptionsSelected (options, valueProperty, selectedProperty){
      var optionsSelected = $filter('filter')(options, function(option) {
        return option[selectedProperty] == true;
      });
      return optionsSelected.map(function(group){
        return group[valueProperty];
      }).join(", ");
    }
  }
})();
