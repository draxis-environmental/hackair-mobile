(function() {
  'use strict';

  angular
    .module('app.photo')
    .controller('PhotoController', PhotoController);

  PhotoController.$inject = ['$rootScope' ,'AuthService', '$ionicLoading', 'CameraService','$scope','LocationService', '$ionicPopup', 'UploadService','DataService','$state','$stateParams','$localStorage','$cordovaToast'];

  /* @ngInject */
  function PhotoController($rootScope, AuthService, $ionicLoading, CameraService, $scope, LocationService, $ionicPopup, UploadService, DataService, $state, $stateParams, $localStorage, $cordovaToast) {

    var vm = this;
    $scope.data = {
      selectedCity:{ city:null , coords: {latitude: null, longitude:null}, timestamp: new Date()}
    };

    activate();

    function activate(){
      angular.extend(vm, {
          takePhoto: takePhoto,
          takeCotsPhoto: takeCotsPhoto,
          // chooseSensor: chooseSensor,
          takeSensorPhoto: takeSensorPhoto,
          uploadPhoto: uploadPhoto,
          uploadSensorPhoto: uploadSensorPhoto,
          closeHowTo: closeHowTo
      });

      if ($stateParams.photo){
        angular.extend(vm, {
            photo: $stateParams.photo.image_uri,
            photoData: $stateParams.photo.meta
        });
      };

      if ($stateParams.sensors){
        angular.extend(vm,{
          sensors: $stateParams.sensors
        });
      }

      if ($stateParams.aq){
        if ($stateParams.aq == "very_good") {
          $stateParams.aq = "very good";
        }
        angular.extend(vm,{
          image: 'img/airquality/' + $stateParams.aq + '.png',
          quality: $stateParams.aq
        });
      }
    }

    function takeCotsPhoto(){ 
        $state.go('photo-cots-howto');
    }

    function takePhoto(){ // snap! ٩(͡๏̯͡๏)۶
        vm.photo = '';
        
        // // if it's the first time taking a photo, then show how-to card
        // if (isItYourFirstPhoto()){
        //     $state.go('photo-howto');
        // }
        // // else take the photo
        // else {
        //   $ionicLoading.show();
        //   actuallyTakePhoto();
        // }

        $state.go('photo-howto');

    }

    function isItYourFirstPhoto(){
      if ($localStorage.firstPhoto == undefined) {
            return true;
      }
      return false;
    }

    // finds your city and opens camera
    function actuallyTakePhoto(){
      // Making promises...
      // if getting location fails, then selectCity() is executed

      LocationService.getLocation()
      .then(function(location){
        getPhoto(location);
      }).catch(function(res){ $ionicLoading.hide(); });

    }

    function takeSensorPhoto(){
      // var location = { city: $localStorage.selectedLocation.city, coords: $localStorage.selectedLocation.coords, sensor: sensorId};
      $ionicLoading.show();
      LocationService.getLocation()
      .then(function(location){
        getPhotoSensor(location);
      }).catch(function(res){ $ionicLoading.hide(); });
    }

    // function chooseSensor(){
    //   DataService.Sensors.get('', {user_id: $localStorage.user.id , type: 'cots'})
    //   .then(function(res){
    //       var sensors = res.data;
    //       var sensorsCots = sensors.filter(function(sensor){
    //         return sensor.type == 'cots';
    //       });
    //       $state.go('photo-sensor-choose', {sensors: sensorsCots});
    //   });
    // }

    // pops up when LocationService.getLocation() fails to get the location
    // the user is given two option: either to change the settings for GPS or add a location by typing the city on the input/search field

    function closeHowTo(){
        $localStorage.firstPhoto = false;
        actuallyTakePhoto();
    }

    function getPhoto(location){
        $ionicLoading.hide();
        return CameraService.openCameraSky()
        .then(function photoSuccess(photo){

            var stateParams = {
                photo: {
                    image_uri: photo,
                    meta: {
                        city: location.city,
                        location: coordsToFeature(location.coords),
                        date: new Date().toLocaleDateString()
                    }
                }
            };

            $state.go('photo-upload', stateParams);
        });
    }

    function getPhotoSensor(location){
      $ionicLoading.hide();
      return CameraService.openCameraSensor()
      .then(function photoSuccess(photo){
          var stateParams = {
              photo: {
                  image_uri: photo,
                  meta: {
                      city: location.city,
                      location: coordsToFeature(location.coords),
                      date: moment(new Date()).format('DD/MM/YYYY'),
                      sensor: location.sensor
                  }
              }
          };
          $state.go('photo-sensor-upload', stateParams);
      });
    }


    function getCity(location){
        return LocationService.reverseGeocode(location)
        .then(function citySuccess(city){
            location.city = city;
            return location;
        });
    }

    function uploadPhoto(image_uri){
        vm.uploading = true;
        UploadService.uploadSkyPhoto(image_uri, vm.photoData)
        .then(function uploadSuccess(res){
            $cordovaToast.show('Your photo has been uploaded!', 1500, 'top')
            .then(function(){
                vm.uploading = false;
                console.log('Uploaded file!', res);            

                console.log('$rootScope.userID:', $rootScope.userID);

                AuthService.getProfile($rootScope.userID)
                .then(function(userData){
                  console.log('retrieving profile after submitting new photo in order to update photo count');
                  var user = {
                    id: $rootScope.userID
                  };                      
                  angular.extend(user, userData);
                  $localStorage.user = user;
                  $state.go('photo');
                });

                // $state.go('photo');
                
            });

        }, function uploadFailure(err){
            var response = JSON.parse(err.body);
            console.log(response);
            $cordovaToast.show(response.message, 5500, 'top')
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
                $state.go('photo');
            });
        }, function updateProgress(progress){
            vm.progress = Math.round(progress.loaded * 100 / progress.total);
            vm.progressStyle = {width: vm.progress + '%'};
        }).catch(function uploadFailure(err){
            var response = JSON.parse(err.body);
            console.log(response);
            $cordovaToast.show(response.message, 5500, 'top')
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
                $state.go('photo');
            });
        });
    }

    function uploadSensorPhoto(image_uri){
        vm.uploading = true;
        UploadService.uploadSensorPhoto(image_uri, vm.photoData)
        .then(function uploadSuccess(res){
            $cordovaToast.show('Your photo has been uploaded!', 1500, 'top')
            .then(function(){
                vm.uploading = false;
                console.log('Uploaded file!', res);
                var response = JSON.parse(res.response);
                $state.go('photo-measurement', {aq: response.data.data.pollutant_i.index});
            });

        }, function uploadFailure(err){
            var response = JSON.parse(err.body);
            console.log(response);
            console.log(response.message);
            $cordovaToast.show(response.message, 5500, 'top')            
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
            });
        }, function updateProgress(progress){
            vm.progress = Math.round(progress.loaded * 100 / progress.total);
            vm.progressStyle = {width: vm.progress + '%'};
        }).catch(function uploadFailure(err){
            var response = JSON.parse(err.body);
            console.log(response);
            $cordovaToast.show(response.message, 5500, 'top')            
            .then(function(){
                vm.uploading = false;
                console.error(':( Upload failed!', err);
            });
        });
    }

    function photoError(photoError){
        console.error('Error taking photo: ', photoError );
    }

    function coordsToFeature(coords){
        var feature = {
            type: 'Point',
            coordinates: [coords.longitude, coords.latitude]
        };

        return feature;
    }
  }
})();
