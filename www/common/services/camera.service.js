(function(){
    'use strict';

    angular.module('app.services')
    .factory('CameraService', CameraService);

    CameraService.$inject = ['$ionicPlatform','$cordovaCamera'];

    function CameraService($ionicPlatform, $cordovaCamera){
        var service = {
            openCameraSky: openCameraSky,
            openCameraSensor: openCameraSensor,
            openCameraAvatar: openCameraAvatar
        };

        return service;

        function openCameraSky(){ // Open sesame ٩(͡๏̯͡๏)۶
            return $ionicPlatform.ready().then(getSkyPicture);
        }

        function openCameraAvatar(){
            return $ionicPlatform.ready().then(getAvatar);
        }

        function openCameraSensor(){
          return $ionicPlatform.ready().then(getSensorPicture)
        }

        function getAvatar(){
            var options = {
                quality: 60,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation:true
            };
            return $cordovaCamera.getPicture(options);

        }


        function getSkyPicture () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation:true
            };

            return $cordovaCamera.getPicture(options);
        }

        function getSensorPicture () {
            var options = {
                quality: 30,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true,
                correctOrientation:true
            };

            return $cordovaCamera.getPicture(options);
        }
    }
})();
