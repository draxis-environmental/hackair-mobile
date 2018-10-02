(function() {
  "use strict";

  angular
    .module("app.follows")
    .controller("FollowsController", FollowsController);

  FollowsController.$inject = ["$state", "$scope", "$rootScope", "$localStorage", "$ionicPopup", "$cordovaToast", "DataService", "$http", "$filter", "API_URL"];
  /* @ngInject */
  function FollowsController($state, $scope, $rootScope, $localStorage, $ionicPopup, $cordovaToast, DataService, $http, $filter, API_URL) {
    var vm = this;

    // var followers = [
    //   {photo: "img/temp/avatar_1.png", fullName: "Roger Wallace", username:"@rogie25", following: "no"},
    //   {photo: "img/temp/avatar_2.png", fullName: "Dan Porter", username:"@DanAirEnthusiast", following: "yes"},
    //   {photo: "img/temp/avatar_3.png", fullName: "Susan Goodwin", username:"@windOfChange", following: "yes"}
    // ];

    // var following = [
    //   {photo: "img/temp/avatar_1.png", fullName: "Roger Wallace", username:"@rogie25", follower: "no"},
    //   {photo: "img/temp/avatar_2.png", fullName: "Dan Porter", username:"@DanAirEnthusiast", follower: "yes"},
    //   {photo: "img/temp/avatar_3.png", fullName: "Susan Goodwin", username:"@windOfChange", follower: "yes"}
    // ];

    activate();

    function activate(){
      vm.profile = $localStorage.user,
      vm.toggleFollow = toggleFollow,
      vm.followMap = getFollowMap()
      vm.followUser = followUser,
      vm.unfollowUser = unfollowUser
    };
    console.log(vm);

    $scope.goToUserProfile = goToUserProfile;

    function goToUserProfile(state, id){
      // console.log(state, id);
      $state.go(state, {id: id});
    }

    function getFollowMap(){
      return {
        followers: $localStorage.user.followers.map(function(user){
          return {
            id: user.id,
            fullname: user.name + ' ' + user.surname,
            username: user.username,
            profile_picture: user.profile_picture,
            follow_status: getFollowStatus(user.id)
          };
        }),
        following: $localStorage.user.following.map(function(user){
          return {
            id: user.id,
            fullname: user.name + ' ' + user.surname,
            username: user.username,
            profile_picture: user.profile_picture,
            follow_status: true
          }
        })
      };

    }

    function getFollowStatus(id){
      var filter = $localStorage.user.following.filter(function(u){return u.id == id});
      return filter.length ? true : false;
    }

    function toggleFollow(user){
      if (user.follow_status) {
        vm.unfollowUser(user.id)
        .then(function(response) {
          // Remove user from localstorage user following;
          var filter = $localStorage.user.following.filter(function(u){return u.id == user.id});

          if (filter.length){
            var index = $localStorage.user.following.indexOf(filter[0]);
            $localStorage.user.following.splice(index, 1);
          } else {
            console.error('Error: Oops something went wrong, user not found in localstorage following');
          }
          console.log($localStorage.user.following);
          // run
          angular.extend(vm, {
            followMap: getFollowMap()
          });
        })
        // .catch(function(response){

        // });
      } else {
        vm.followUser(user.id)
        .then(function(response){
          // Add user to localstorage user following;
          $localStorage.user.following.push(user);
          console.log($localStorage.user.following);
          // run
          angular.extend(vm, {
            followMap: getFollowMap()
          });
        })
        // .catch(function(response){

        // });
      }

    }

      function followUser(user_id) {
        return $http.put(API_URL + '/users/following/' + user_id, {})
        .then(function(response) {
            return response;
        });
      }

    function unfollowUser(user_id) {
        return $http.delete(API_URL + '/users/following/' + user_id, {})
        .then(function(response) {
            return response;
        });
      }
  }
})();
