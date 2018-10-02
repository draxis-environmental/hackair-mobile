(function(){
    'use strict';

    angular.module('app.services')
    .factory('UploadService', UploadService);

    UploadService.$inject = ['$q','$cordovaFileTransfer', '$localStorage', 'API_URL', '$http','ORCH_URL'];

    function UploadService($q, $cordovaFileTransfer, $localStorage, API_URL, $http, ORCH_URL){
      var service = {
          uploadSkyPhoto: uploadSkyPhoto,
          uploadSensorPhoto: uploadSensorPhoto,
          uploadAvatar: uploadAvatar
      };

      return service;

      function uploadSkyPhoto(fileURL, metaData){
        var orchestratorUrl = ORCH_URL;
        var deferred = $q.defer();
        var serverURL = API_URL + '/photos/sky';

        if (ionic.Platform.isWebView()) {
          var uploadOptions = new FileUploadOptions();
          uploadOptions.fileKey = "file";
          uploadOptions.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          uploadOptions.mimeType = "image/jpeg";
          uploadOptions.chunkedMode = false;
          uploadOptions.params = {
              loc: metaData.location,
              datetime: metaData.date
          };
          uploadOptions.headers = {
              'authorization': 'Bearer ' + $localStorage.credentials
          };

          $cordovaFileTransfer.upload(serverURL, fileURL, uploadOptions)
          .then(function(result) {
                  deferred.resolve(result);
                  $http.post(orchestratorUrl, {
                      action: 'finished',
                      service: 'MobilePhoto',
                      msg: []
                  }).then(function(result){
                      console.log('Triggering orchestrator', result);
                  }).catch(function(result){
                      console.error('Couldnt trigger ochestrator', result);
                  })
              }, function(err) {
                  deferred.reject(err);
              }, function(progress) {
                  deferred.notify(progress);
              }
          );
        } else {
          deferred.reject('Uploading not supported in browser');
        }

        return deferred.promise;

      }

      function uploadSensorPhoto(fileURL, metaData){
        var orchestratorUrl = ORCH_URL;
        var deferred = $q.defer();
        var serverURL = API_URL + '/photos/sensor';

        if (ionic.Platform.isWebView()) {
          var uploadOptions = new FileUploadOptions();
          uploadOptions.fileKey = "file";
          uploadOptions.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          uploadOptions.mimeType = "image/jpeg";
          uploadOptions.chunkedMode = false;
          uploadOptions.params = {
              loc: metaData.location,
              datetime: metaData.date
          };
          uploadOptions.headers = {
              'authorization': 'Bearer ' + $localStorage.credentials
          };

          $cordovaFileTransfer.upload(serverURL, fileURL, uploadOptions)
          .then(function(result) {
            console.log('Response from server', result);
            // var photo_id = JSON.parse(result.response).data.resources.photo_id;
            deferred.resolve(result);
                  // $http.post(orchestratorUrl, {
                  //     action: 'finished',
                  //     service: 'CotsPhoto',
                  //     photo_id: photo_id
                  // }).then(function(result){
                  //     console.log('Triggering orchestrator', result);
                  // }).catch(function(result){
                  //     console.error('Couldnt trigger ochestrator', result);
                  // })
              }, function(err) {
                  deferred.reject(err);
              }, function(progress) {
                  deferred.notify(progress);
              }
          );
        } else {
          deferred.reject('Uploading not supported in browser');
        }

        return deferred.promise;

      }

      function uploadAvatar(fileURL, metaData){
        var deferred = $q.defer();
        var serverURL = API_URL + '/users/' + $localStorage.user.id + '/profile_picture';


        if (ionic.Platform.isWebView()) {
          var uploadOptions = new FileUploadOptions();
          uploadOptions.fileKey = "profile_picture";
          uploadOptions.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
          uploadOptions.mimeType = "image/jpeg";
          uploadOptions.chunkedMode = false;
          // uploadOptions.params = {
          //     loc: metaData.location,
          //     datetime: metaData.date
          // };
          uploadOptions.headers = {
              'authorization': 'Bearer ' + $localStorage.credentials
          };

          $cordovaFileTransfer.upload(serverURL, fileURL, uploadOptions)
          .then(function(result) {
                  deferred.resolve(result);
              }, function(err) {
                  deferred.reject(err);
              }, function(progress) {
                  deferred.notify(progress);
              }
          );
        } else {
          deferred.reject('Uploading not supported in browser');
        }

        return deferred.promise;

      }

    }
})();
