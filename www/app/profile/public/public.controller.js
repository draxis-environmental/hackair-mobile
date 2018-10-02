(function() {
    'use strict';

    angular
      .module('app.profile')
      .controller('PublicProfileController', PublicProfileController)
      .controller('PublicProfilePhotosController', PublicProfilePhotosController)
      .controller('PublicProfileFollowersController', PublicProfileFollowersController)
      .controller('PublicProfileAchievementsController', PublicProfileAchievementsController)
      .controller('PublicProfilePerceptionsController', PublicProfilePerceptionsController)
      .controller('PublicProfileSensorsController', PublicProfileSensorsController)
      .controller('PublicSensorsController', PublicSensorsController)
      .controller('PublicProfileCommunitiesController', PublicProfileCommunitiesController);

      PublicProfileController.$inject = ['$scope','$rootScope','$localStorage', '$filter','DataService','$state'];
    /* @ngInject */
    function PublicProfileController($scope, $rootScope, $localStorage, $filter, DataService, $state) {
      var vm = this;

      var achievements = [
        "Beacon_in_the_dark",
        "Constantly_on_the_move",
        "FeelsL_like_home",
        "Fresh_air_hunter",
        "HackAir's_hero",
        "Hackathon",
        "Hacker_nomad",
        "Hacker's_masterpiece",
        "Health_watcher",
        "Helping_hand",
        "History_buff",
        "How_is_your_life_today",
        "Just_an_extra_badge",
        "Keep_it_scientific",
        "Prolific_hacker",
        "Share_with_others",
        "Survivor",
        "Watcher_on_the_wall"];

      activate();

      function activate(){
        // vm.achievements = achievements;
        getUserProfile($state.params.id).then(function() {
          angular.extend(vm, {
            profile: $localStorage.public_user,
            // isFollowed: isFollowed($localStorage.user.following, $localStorage.public_user.id), // returns true if user follows the public user
            // isFollowing: isFollowing(),
            // toggleFollow: toggleFollow
          });
        });
      }

      // function toggleFollow(followStatus, user_id) {
      //   if (followStatus === true) {
      //     SocialService.unfollowUser(user_id)
      //     .then(function(response) {
      //       // console.log(response);
      //       function searchFollowing(nameKey, myArray){
      //         for (var i=0; i < myArray.length; i++) {
      //           if (myArray[i].id === nameKey) {
      //               return i;
      //           }
      //         }
      //       }
      //       var userPosition = searchFollowing(user_id, $localStorage.user.following);
      //       if (userPosition > -1) {
      //         $localStorage.user.following.splice(userPosition, 1);
      //       }
      //       $state.reload();
      //     })
      //     .catch(function(e) {
      //       console.log(e);
      //     });
      //   } else {
      //     SocialService.followUser(user_id)
      //     .then(function(response) {
      //       // console.log(response);
      //       $localStorage.user.following.push(user_id);
      //       $state.reload();
      //     })
      //     .catch(function(e) {
      //       console.log(e);
      //     });
      //   }

      // }

      // function isFollowed(following, public_user_id) {
      //   var isFollowed = false;
      //   following.forEach(function(element) {
      //     if (element.id === public_user_id) {
      //       isFollowed = true;
      //       return isFollowed;
      //     }
      //   });
      //   return isFollowed;
      // }

      function getUserProfile(user_id) {
        return DataService.Users.get(user_id)
        .then(function(user) {
            $localStorage.public_user = user.data;
        });
      }

      function transformViewModel(obj){
        var newObj = {

        };

        for (var key in obj){
          if (obj[key] !== null && obj[key] !== "" && obj[key] !== 0){
            newObj[key] = obj[key];
          }
        }
        angular.extend(newObj, {
          outdoor_activities: vm.selectedActivities,
          groups:             vm.selectedSensitivities
        });

        return newObj;
      }

      function getSelected(option) {
        return option.selected == true;
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

    function PublicProfilePhotosController(DataService, $localStorage){

      var vm = this;

      activate();

      function activate(){
        angular.extend(vm, {
          profile: $localStorage.public_user
        });
        getUserPhotos();
      }

      function getUserPhotos(){
        DataService.Photos.get('', {user_id: $localStorage.public_user.id })
        .then(function(response){
          vm.photos = response.data;
        });
      }

    }

    function PublicProfileFollowersController(DataService, $localStorage){
      var vm = this;
      activate();

      function activate(){
        angular.extend(vm, {
          profile: $localStorage.public_user,
          isFollowed: vm.isFollowed
        });
      }

      function isFollowed(following, user_id) {
        var isFollowed = false;
        following.forEach(function(element) {
          if (element.id === user_id) {
            isFollowed = true;
            return isFollowed;
          }
        });
        return isFollowed;
      }

    }

    function PublicProfileAchievementsController(DataService, $localStorage){
      var vm = this;
      activate();

      function activate(){
        angular.extend(vm, {
          profile: $localStorage.public_user
        });
      }

      function openBadgeInfo(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/components/badges/templates/badge-info.html',
          controller: function($uibModalInstance,$scope){
            $scope.ok = function() {
              $uibModalInstance.dismiss('close');
            };
          },
          size: 'sm'
        });
      }

      function openObtainedBadge(){
        var modalInstance = $uibModal.open({
          templateUrl: 'app/components/badges/templates/badge-optained.html',
          controller: function($uibModalInstance,$scope){
            $scope.ok = function() {
              $uibModalInstance.dismiss('close');
            };
          },
          size: 'sm'
        });
      }
    }

    function PublicProfileSensorsController(DataService, $localStorage){
      var vm = this;
      activate();

      function activate(){
        angular.extend(vm, {
          profile: $localStorage.public_user
        });
        getUserSensors();
      }

      function getUserSensors() {
        DataService.Sensors
          .get('',{user_id: $localStorage.public_user.id})
          .then(function(response){
            vm.sensors = response.data;
            console.log(vm.sensors);
          });
        }
      }

    function PublicProfilePerceptionsController(DataService, $localStorage){
      var vm = this;
      activate();

      function activate(){
        angular.extend(vm, {
          profile: $localStorage.public_user
        });
        getUserPerceptions();
      }

      function getUserPerceptions(){
        DataService.Perceptions
          .get('',{user_id: $localStorage.public_user.id})
          .then(function(response){
            vm.perceptions = response.data;
          })
      }
    }

    function PublicSensorsController() {
      var vm = this;
      $scope.selectedSensor;
  
      activate();

      function activate(){
        angular.extend(vm, {
          getSensor: getSensor($stateParams.id)
        });
      }

      function getSensor(id){
        DataService.Sensors
        .one(id).get()
        .then(function(res){
            vm.sensor = res.data;

            if ($state.current.name === 'profile.view-sensor'){
              renderSensorMap();
            }

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
    }

    function PublicProfileCommunitiesController() {

    }

})();
