(function() {
  'use strict';  

  angular
    .module('app.map')
    .controller('MapController', MapController);

  MapController.$inject = ['LocationService','MapService', '$scope','$rootScope', '$timeout','$localStorage','API_URL'];
  /* @ngInject */
  function MapController(LocationService, MapService, $scope, $rootScope, $timeout, $localStorage, API_URL) {
    var vm = this;

    activate(); 

    function activate(){
      console.info('Activating Map.Controller');

      vm.timeZoneOffset = new Date().getTimezoneOffset() / (-60);
      console.log(vm.timeZoneOffset);      

      $scope.moveMapTo = moveMapTo;

      $scope.$on('toggleLayer', function(event, layer){
        toggleLayer(layer);
      });

      // $scope.$on('locationChanged', function (event, location){   
      //   moveMapTo(location.coords);
      // })

      $scope.$on('searchChanged', function(event, location){
        moveMapTo(location.coords);
        console.log('Moving map to ', location.city);
      });

      if ($rootScope.searchedCity != undefined){
        // console.log($rootScope.searchedCity);
        var location = angular.copy($rootScope.searchedCity);
        location.coords = L.latLng(location.coords.latitude, location.coords.longitude);
        renderMap(location);
      } else {
        LocationService.getLocation()
        .then(function(location){
          if (location != undefined && location !== false) {
            // console.log(location);

            location.coords = L.latLng(location.coords.latitude, location.coords.longitude);
            renderMap(location);
          } else {
            console.log(location)
            location = {};
            location.coords = L.latLng($rootScope.selectedLocation.coords.latitude, $rootScope.selectedLocation.coords.longitude);
            renderMap(location);
          }
        })
        .catch(function(err){
          console.log('Error from LocationService:', err);
        });
      }
    }

    function renderMap(location){
      // Map configuration
      if (!location){
        var location = {
          city: 'Thessaloniki',
          coords:  L.latLng(40.63,22.949)
        }
      }

      var map = L.map('map', {
            // crs: L.CRS.EPSG4326, // Depends on WMS server, default is EPSG3857. Example WMSLayer uses EPSG4326
            center: location.coords,
            zoom: 15,
            zoomControl: false
      });

      map.on('zoomend', getData);
      map.on('moveend', getData);

      // Create controls
      L.Control.layerPicker = L.Control.extend({
        onAdd: function(map){
          var container = L.DomUtil.create('div', 'map-layer-picker');
          var header = L.DomUtil.create('div', 'header', container);

          L.DomEvent.on(header, 'click', function(){
            var open = L.DomUtil.hasClass(container, 'open');
            if (open){
              L.DomUtil.removeClass(container, 'open');
            } else {
              L.DomUtil.addClass(container, 'open');
            }
          });

          var icon = L.DomUtil.create('div', 'icon', header);
          var title = L.DomUtil.create('div', 'title', header);
          title.innerText = 'Map filter';
          var filtersContainer = L.DomUtil.create('div', 'filters', container);


          var filters = [
            {
              label: 'Fusion',
              class: 'fusion',
            },
            {
              label: 'Cardboard',              // NEW FILTER FOR COTS MEASUREMENTS (MAKIS)
              class: 'cots active',
            },
            {
              label: 'Luftdaten',              // NEW LUFTDATEN
              class: 'luftdaten active',
            },                               
            {
              label: 'Sensors',
              class: 'sensors active'
            },{
              label: 'Photos',
              class: 'photos active'
            },{
              label: 'Open Data',
              class: 'open-data active'
            },{
              label: 'Perceptions',
              class: 'perceptions active'
            },{
              label: 'My sensors',
              class: 'my-sensors active'
            },{
              label: 'My photos',
              class: 'my-photos active'
            }
          ];

          if (vm.intro) {
            // Remove two last filters if map rendered on intro page
            filters.pop();
            filters.pop();
          }

          filters.forEach(function(filter){
            var filterContainer = L.DomUtil.create('div', 'filter ' + filter.class, filtersContainer);
            L.DomUtil.create('div', 'icon', filterContainer);
            L.DomUtil.create('span', 'label', filterContainer).innerText = filter.label;
            var checker = L.DomUtil.create('span', 'checker active', filterContainer);
            L.DomUtil.create('i', 'ion-checkmark', checker);

            L.DomEvent.on(filterContainer, 'click', function(){
              var hasClass = L.DomUtil.hasClass(this, 'active');

              if (hasClass){
                L.DomUtil.removeClass(filterContainer, 'active');
              } else {
                L.DomUtil.addClass(filterContainer, 'active');
              }

              $scope.$emit('toggleLayer', filter.class.split(' ')[0]);
            })
          })


          return container;
        },
        onRemove: function(map){
          //
        }
      });


      vm.layerPicker = new L.Control.layerPicker({position:'topright'}).addTo(map);



      // Create map layers
      var tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      var wmsLayer = L.tileLayer.wms(API_URL + '/map?', { // my local IP, mapped to mapserver container
          layers: 'hackair',
          format: 'image/png',
          transparent: 'true',
          crs: L.CRS.EPSG4326, // Depends on WMS server, default is EPSG3857. Example WMSLayer uses EPSG4326
          opacity: 0.5
      })
      // .addTo(map);

      // WITH CLUSTERING
      // var cotsLayer = L.markerClusterGroup().addTo(map);     // NEW COTS LAYER (MAKIS)
      // var luftdatenLayer = L.markerClusterGroup().addTo(map);     // NEW LUFTDATEN
      // var measurementsLayer = L.markerClusterGroup().addTo(map);
      // var photosLayer = L.markerClusterGroup().addTo(map);
      // var perceptionsLayer = L.markerClusterGroup().addTo(map);
      // var webservicesLayer = L.markerClusterGroup().addTo(map);
      // var mySensorsLayer = L.markerClusterGroup().addTo(map);
      // var myPhotosLayer = L.markerClusterGroup().addTo(map);

      // WITHOUT CLUSTERING
      var cotsLayer = L.featureGroup().addTo(map);     // NEW COTS LAYER (MAKIS)
      var luftdatenLayer = L.featureGroup().addTo(map);     // NEW LUFTDATEN
      var measurementsLayer = L.featureGroup().addTo(map);
      var photosLayer = L.featureGroup().addTo(map);
      var perceptionsLayer = L.featureGroup().addTo(map);
      var webservicesLayer = L.featureGroup().addTo(map);
      var mySensorsLayer = L.featureGroup().addTo(map);
      var myPhotosLayer = L.featureGroup().addTo(map);      

      // Attach them all to the vm
      angular.extend(vm, {
        map: map,
        layers: {
          tileLayer: tileLayer,
          cots: cotsLayer,    // NEW COTS LAYER (MAKIS)
          luftdaten: luftdatenLayer, // NEW LUFTDATEN
          fusion: wmsLayer,
          sensors: measurementsLayer,
          photos: photosLayer,
          webservices: webservicesLayer,
          perceptions: perceptionsLayer,
          'my-sensors': mySensorsLayer,
          'my-photos': myPhotosLayer
        }
      });

      getData();

    }

    function getData(){
      clearTimeout(window.moveTimer);

      window.moveTimer = setTimeout(function(){

        var boundBox = vm.map.getBounds().toBBoxString();

        MapService.getMeasurements(boundBox)
        .then(function(measurements){
          // Add measurement markers to featureLayer
          // Empty it all !


          var markers = filterMeasurements(measurements);

          vm.layers.cots.clearLayers();  // MAKIS NEW
          vm.layers.luftdaten.clearLayers();  // LUFTDATEN NEW
          vm.layers.sensors.clearLayers();
          vm.layers.photos.clearLayers();
          vm.layers.webservices.clearLayers();

          addMarkersToMap(markers);
        })
        .catch(function(err){
          console.log(err);
        });

        MapService.getPerceptions()
        .then(function(perceptions){
          vm.layers.perceptions.clearLayers();
          addPerceptionsToMap(perceptions);
        });

        if (!vm.intro ||  $localStorage.user != undefined){
          MapService.getMyMeasurements(boundBox, $localStorage.user.id).then(function(measurements){
            var filters = {
              sensors: ['sensors_arduino', 'sensors_bleair', 'sensors_cots'],
              photos: ['flickr', 'webcams', 'mobile']
            };

            var myMeasurements = {
              sensors: [],
              photos: []
            };

            measurements.forEach(function(measurement){
              if (measurement.pollutant_i.index == 'perfect') {
                measurement.pollutant_i.index = 'very good';
              }

              if (filters.sensors.indexOf(measurement.source_type) > -1) {
                myMeasurements.sensors.push(measurement);
              }

              if (filters.photos.indexOf(measurement.source_type) > -1) {
                myMeasurements.photos.push(measurement);
              }

              var pollutant = measurement.pollutant_q.name == "PM2.5_AirPollutantValue" ? 'PM 2.5' : 'PM 10'
              measurement.pollutant_v =  'Pollutant value (' + pollutant + '): ' + measurement.pollutant_q.value + ' μg/m3';
            });

            vm.layers['my-sensors'].clearLayers();
            vm.layers['my-photos'].clearLayers();

            addMyMarkersToMap(myMeasurements);
          })
        }

      },3000)


    }
        // Create Icons

    var cotsIcon = L.icon({                           // NEW COTS ICON (MAKIS)
      iconUrl: 'img/icons/cots_icon_pin.png',     // NEW COTS ICON (MAKIS)
      iconSize: [24, 36],                             // NEW COTS ICON (MAKIS)
      iconAnchor: [12.5, 36],                         // NEW COTS ICON (MAKIS)
      popupAnchor: [0, -35],                          // NEW COTS ICON (MAKIS)
    });

    var sensorIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_sensor.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35],
    });

    var webservicesIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_open_data.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35],
    });

    var photoIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_photo.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35],
    });

    var perceptionIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_perception.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35]
    });

    var mySensorIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_my_sensor.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35],
    });

    var myPhotoIcon = L.icon({
      iconUrl: 'img/icons/u_i_pin_my_photo.svg',
      iconSize: [24, 36],
      iconAnchor: [12.5, 36],
      popupAnchor: [0, -35],
    });

    function toggleLayer(layer){
      if (layer === 'open-data') {
        layer = 'webservices';
      }      
      if (vm.layers[layer] == undefined) {
        return;
      }

      if (vm.map.hasLayer(vm.layers[layer])){
        vm.map.removeLayer(vm.layers[layer]);
      } else {
        vm.map.addLayer(vm.layers[layer]);
      }
    }

    function filterMeasurements(measurements){
      var filters = {
        sensors: ['sensors_arduino', 'sensors_bleair', 'sensors_cots'],
        photos: ['flickr', 'webcams', 'mobile'],
        webservices: ['webservices']
      };

      var types = {
        sensors: [],
        sensors_cots: [],   // MAKIS
        sensors_luftdaten: [],
        photos: [],
        webservices: []
      };

      var unique = {};

      measurements.forEach(function(measurement){


          // MAKIS START
          if ( measurement.source_type ==='sensors_cots' ) {  
            console.log('ALERT : SENSOR COTS FOUND IN HOME MAP');  
            types.sensors_cots.push(measurement);

            var pollutant = measurement.pollutant_q.name == "PM2.5_AirPollutantValue" ? 'PM 2.5' : 'PM 10'
            measurement.pollutant_v =  'Pollutant value (' + pollutant + '): ' + measurement.pollutant_q.value + ' μg/m3';
          }  
          // MAKIS END        


          if (measurement.pollutant_i.index == 'perfect') {
            measurement.pollutant_i.index = 'very good';
          }

          if (filters.sensors.indexOf(measurement.source_type) > -1  && measurement.source_info.sensor != undefined){

            // Sensor measurement
            // if ($localStorage.user !== undefined){
            //   if (measurement.source_info.user.id == $localStorage.user.id){ return; } // Dont bring my own measurements if logged in
            // }

            var key = measurement.source_info.sensor.id;
            var pollutant = measurement.pollutant_q.name == "PM2.5_AirPollutantValue" ? 'PM 2.5' : 'PM 10'
            measurement.pollutant_v =  'Pollutant value (' + pollutant + '): ' + measurement.pollutant_q.value + ' μg/m3';

            if (typeof(unique[key] == "undefined")) {
              unique[key] = measurement;
            }

            if (unique[key].datetime < measurement.datetime) {
              unique[key] = m;
            }
          }

          if (filters.photos.indexOf(measurement.source_type) > -1) {
            
            // Photo measurement
            // if ($localStorage.user !== undefined){
            //   if (measurement.source_info.user && measurement.source_info.user.id == $localStorage.user.id){ return; } // Dont bring my own measurements if logged in
            // }

            types.photos.push(measurement)

          }

          if (filters.webservices.indexOf(measurement.source_type) > -1) {
            // Webservice measurement
            var pollutant = measurement.pollutant_q.name == "PM2.5_AirPollutantValue" ? 'PM 2.5' : 'PM 10'
            measurement.pollutant_v =  'Pollutant value (' + pollutant + '): ' + measurement.pollutant_q.value.toFixed(2) + ' μg/m3';

            // LUFTDATEN START
            if(measurement.source_info.source === 'luftdaten')
            {
              console.log('luftdaten found!');
              types.sensors_luftdaten.push(measurement);
            }
            // LUFTDATEN END            

            else { types.webservices.push(measurement); }
          }

        // } else {
        //   console.log(measurement);
        // }
      });

      for (var i in unique) {
        types.sensors.push(unique[i]);
      }

      return {
        cots: types.sensors_cots,   // MAKIS NEW
        luftdaten: types.sensors_luftdaten,   // LUFTDATEN NEW
        arduino: types.sensors,
        flickr: types.photos,
        webservices: types.webservices
      };
    }

    function moveMapTo(location){
      vm.map.whenReady(function(){
        console.log('moveMapTo activated');
        vm.map.panTo([location.latitude, location.longitude]);
      });
    }

    // function addMarkersToMap(markers){

    //   markers.forEach(function(m){
    //     var popup = createPopup(m)
    //     var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
    //       icon: sensorIcon,
    //       title: m.pollutant_i.index
    //     });
    //     marker.bindPopup(popup);
    //     marker.addTo(vm.layers.sensors);

    //   })
    // }

    function addMarkersToMap(markers){

      // MAKIS START 
      markers.cots.forEach(function(m){       
        var popup = createSensorPopup(m);     
        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], { 
          icon: cotsIcon,                                                    
          title: m.pollutant_i.indexOf
        });
        marker.bindPopup(popup);
        marker.addTo(vm.layers.cots);
      });                                     
      // MAKIS END

      markers.arduino.forEach(function(m){
        console.log(m);
        var popup = createSensorPopup(m);
        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
          icon: sensorIcon,
          title: m.pollutant_i.index
        });
        marker.bindPopup(popup);
        marker.addTo(vm.layers.sensors);

      });

      markers.flickr.forEach(function(m){
        var popup = createFlickrPopup(m);
        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
          icon: photoIcon,
          title: m.pollutant_i.index
        });
        marker.bindPopup(popup);
        marker.addTo(vm.layers.photos);
      });

      markers.luftdaten.forEach(function(m){
        var popup = createWebServicesPopup(m);

        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
          icon: sensorIcon,
          title: m.pollutant_i.index
        });   
        marker.bindPopup(popup);
        marker.addTo(vm.layers.luftdaten);                

      });      

      markers.webservices.forEach(function(m){
        var popup = createWebServicesPopup(m);

        if(m.source_info.source === 'luftdaten')
        {
          var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
            icon: sensorIcon,
            title: m.pollutant_i.index
          });   
        marker.bindPopup(popup);
        marker.addTo(vm.layers.sensors);                
        }
        else
        {
          var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
            icon: webservicesIcon,
            title: m.pollutant_i.index
          });
        marker.bindPopup(popup);
        marker.addTo(vm.layers.webservices);          
        } 

        // var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
        //   icon: webservicesIcon,
        //   title: m.pollutant_i.index
        // });


      });
    }

    function addPerceptionsToMap(perceptions){
      perceptions.forEach(function(perception){
        if (perception.location){

          var latlng = perception.location;
          if (latlng.coords) {
            latlng = [latlng.coords.latitude, latlng.coords.longitude];
          }

          if (latlng.length !== 2 ){
            return;
          }

          var popup = createPerceptionPopup(perception);
          var marker = L.marker(latlng, {
            icon: perceptionIcon,
            title: perception.perception
          });

          marker.bindPopup(popup);
          marker.addTo(vm.layers['perceptions']);
        }
      });
    }

    function addMyMarkersToMap(markers){
      markers.sensors.forEach(function(m){
        var popup = createSensorPopup(m)
        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
          icon: mySensorIcon,
          title: m.pollutant_i.index
        });
        marker.bindPopup(popup);
        marker.addTo(vm.layers['my-sensors']);

      });

      markers.photos.forEach(function(m){
        var popup = createFlickrPopup(m);
        var marker = L.marker([m.loc.coordinates[1], m.loc.coordinates[0]], {
          icon: myPhotoIcon,
          title: m.pollutant_i.index
        });
        marker.bindPopup(popup);
        marker.addTo(vm.layers['my-photos']);
      });
    }

    function createPopup(measurement){

      var popup = L.DomUtil.create('div', 'measurement-popup');
      var time =  new Date(measurement.date_str);
      console.log(measurement.date_str);
      L.DomUtil.create('div',   'img-sensor ' + measurement.source_type, popup);
      L.DomUtil.create('h3',   '', popup).innerText = measurement.source_info.user.username || '';
      var timeContainer = L.DomUtil.create('div', 'time-container', popup);
      L.DomUtil.create('span', '', timeContainer).innerText = time.toDateString() + ' @ ';
      L.DomUtil.create('span', '', timeContainer).innerText = time.getHours() + ':' + time.getMinutes();
      L.DomUtil.create('h2',   '', popup).innerText = 'Air quality is ' + measurement.pollutant_i.index;

      return popup;
    }

    function createPerceptionPopup(perception){
      var popup = L.DomUtil.create('div', 'measurement-popup');
      // var time =  moment(perception.real_datetime);
      var time = moment(perception.real_datetime).add(vm.timeZoneOffset, 'hours').format('DD-MM-YYYY hh:mm:ss');
      L.DomUtil.create('h3',   '', popup).innerText = '@' + perception.user.username || '';
      // console.log(perception)
      // L.DomUtil.create('p',   '', popup).innerText = measurement.source_type || '';
      var timeContainer = L.DomUtil.create('div', 'time-container', popup);
      L.DomUtil.create('span', '', timeContainer).innerText = time;
      L.DomUtil.create('h2',   '', popup).innerText = 'Air quality is ' + perception.perception;

      return popup;
    }

    function createSensorPopup(measurement){
      var sensorType;

      switch (measurement.source_type) {
        case 'sensors_arduino':
          sensorType = 'hackAIR home';
          break;
        case 'sensors_bleair':
          sensorType = 'hackAIR mobile';
          break;
        case 'sensors_cots':
          sensorType = 'hackAIR cardboard';
          break;
        default:
          sensorType = 'hackAIR home'
      } 

      var popup = L.DomUtil.create('div', 'measurement-popup');
      // var time =  moment(measurement.real_datetime);
      var time = moment(measurement.real_datetime).add(vm.timeZoneOffset, 'hours').format('DD-MM-YYYY hh:mm:ss');
      L.DomUtil.create('div',   'img-sensor ' + measurement.source_type, popup);
      L.DomUtil.create('h3',   '', popup).innerText = measurement.source_info.user.username || '';
      L.DomUtil.create('p',   '', popup).innerText = sensorType;
      var timeContainer = L.DomUtil.create('div', 'time-container', popup);
      L.DomUtil.create('span', '', timeContainer).innerText = time;
      L.DomUtil.create('h2',   '', popup).innerText = 'Air quality is ' + measurement.pollutant_i.index;

      L.DomUtil.create('p',   '', popup).innerText = measurement.pollutant_v;


      return popup;
    }

    function createFlickrPopup(measurement){

      var popup = L.DomUtil.create('div', 'measurement-popup');
      // var time =  moment(measurement.real_datetime);
      var time = moment(measurement.real_datetime).add(vm.timeZoneOffset, 'hours').format('DD-MM-YYYY hh:mm:ss');
      var a = L.DomUtil.create('a','',popup)
      a.href = measurement.source_info.page_url || measurement.source_info.image_url;
      var img = L.DomUtil.create('img','img-responsive img-thumb',a);
      img.width=100;

      img.src = measurement.source_info.thumb_image_url || measurement.source_info.image_url;

      var username;

      if (measurement.source_info.username != undefined) {
        username = measurement.source_info.username;
      } else if (measurement.source_info.user != undefined ) {
        username = measurement.source_info.user.username;
      } else {
        username = '';
      }

      L.DomUtil.create('h3',   '', popup).innerText = username;
      var timeContainer = L.DomUtil.create('div', 'time-container', popup);
      L.DomUtil.create('span', '', timeContainer).innerText = time;
      L.DomUtil.create('h2',   '', popup).innerText = 'Air quality is ' + measurement.pollutant_i.index;

      return popup;
    }

    function createWebServicesPopup (measurement){
      var popup = L.DomUtil.create('div', 'measurement-popup');
      // var time =  moment(measurement.real_datetime);
      var time = moment(measurement.real_datetime).add(vm.timeZoneOffset, 'hours').format('DD-MM-YYYY hh:mm:ss');
      L.DomUtil.create('h2',   '', popup).innerText = 'Air quality is ' + measurement.pollutant_i.index;
      L.DomUtil.create('p',   '', popup).innerText = measurement.pollutant_v;
      L.DomUtil.create('p',   '', popup).innerText = 'Source: ' + getSource(measurement.source_info.source);

      var timeContainer = L.DomUtil.create('div', 'time-container', popup);
      L.DomUtil.create('span', '', timeContainer).innerText = time;

      return popup;
    }

    function getSource(source){
      switch (source) {
        case 'openaq':
          return 'OpenAQ.org';
          break;
        case 'luftdaten':
          return 'luftdaten.info';
          break;
        default:
          return '';
      }
    }
  }
})();


// Sensors
// · Username
// · Type (Arduino or PSoC)
// · Date & time of the most recent measurement
// · AQ scale for the most recent measurement (bad, good, etc.) both PM2,5 and PM10
// · Value of the most recent measurement (e.g. PM10=…)
