(function() {
  "use strict";

  angular
    .module("app.photos")
    .controller("PhotosController", PhotosController);

  PhotosController.$inject = ["$timeout", "$state", "$scope", "$rootScope", "$localStorage", "$ionicPopup", "$cordovaToast", "DataService", "$http", "$filter", "$translate"];
  /* @ngInject */
  function PhotosController($timeout, $state, $scope, $rootScope, $localStorage, $ionicPopup, $cordovaToast, DataService, $http, $filter, $translate) {
    var vm = this;

    vm.airQualityIndex = '';
    vm.airQualityIs = '';

    angular.extend(vm, {
      getPhotoAQI: getPhotoAQI
    });

    var photos = [
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'false', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
      {used: 'false', src:"img/temp/my_photos_2.png"},
      {used: 'true', src:"img/temp/my_photos_1.png"},
      {used: 'true', src:"img/temp/my_photos_0.png"},
    ];

    activate();

    function activate(){
      // vm.photos = photos;
      getMyPhotos();
    }

    function getMyPhotos(){
      console.log('Getting photos...');
      DataService.Photos.get('', {user_id: $localStorage.user.id })
      .then(function(res){
        vm.photos = res.data;
      });
    }


    function getPhotoAQI(image_id){ 

    vm.airQualityIndex;
    vm.airQualityIs;
    vm.loading_please_wait;

    $translate('photos.loading_please_wait').then(function(translation){
      vm.loading_please_wait = translation; })

     var loadingoptions = {
          template: vm.loading_please_wait,
          scope: $scope,
          title: ''
      };

      var loadingPopup = $ionicPopup.show(loadingoptions); 
      // $timeout(function() {loadingPopup.close();}, 1500);

      DataService.Photo.get(image_id)
      .then(function(response){
        if(response.data != null) 
        { 

          var translation_key = response.data.index;
          if(translation_key == 'very good') { translation_key = 'very_good'; }
          $translate('photos.' + translation_key).then(function(translation){
             vm.airQualityIndex = translation;
             console.log(vm.airQualityIndex);

             $translate('photos.Air_quality_is').then(function(translation){
                vm.airQualityIs = translation;

               var options = {
                    template: vm.airQualityIs + ' ' + vm.airQualityIndex,
                    scope: $scope,
                    title: 'AIR QUALITY',
                    buttons: [
                    {
                      text: 'CLOSE',
                      type: 'button-assertive',
                      onTap: function(e) { airQualityPopup.close(); loadingPopup.close(); }
                    }]
                };

                var airQualityPopup = $ionicPopup.show(options);                     
              })  
          })  

        }
        else if (response.data == null) 
        { 
          console.log('the_photo_does_not_contain_usable_sky');

          $translate('photos.the_photo_does_not_contain_usable_sky').then(function(translation){
             vm.airQualityTitle = translation;
             vm.airQualityIndex = translation;

              var options = {
                  template: vm.airQualityTitle,
                  scope: $scope,
                  title: '',
                  buttons: [
                  {
                    text: 'CLOSE',
                    type: 'button-assertive',
                    onTap: function(e) { airQualityPopup.close(); loadingPopup.close(); }
                  }]
              };

              var airQualityPopup = $ionicPopup.show(options);  

          })                   


                              
        }
      });

    }    

  }
})();
