(function() {
  "use strict";

  angular
    .module("app.achievements")
    .controller("AchievementsController", AchievementsController);

  AchievementsController.$inject = ["$location", "$state", "$scope", "$rootScope", "$localStorage", "$ionicPopup", "$cordovaToast", "DataService", "$http", "$filter"];
  /* @ngInject */
  function AchievementsController($location, $state, $scope, $rootScope, $localStorage, $ionicPopup, $cordovaToast, DataService, $http, $filter) {
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

    var vm = this;

    activate();

    function activate() {
      getAchievements();
    }

    function getAchievements() {
      DataService.Achievements.badges($localStorage.user.id)
      // DataService.Achievements.badges(102)
      .then(function(res){ 
        console.log(res.data.data.acquired); 
        console.log(res.data.data.available); 
        vm.acquired = res.data.data.acquired;
        vm.available = res.data.data.available;
      })
      .catch(function(res){
        console.error(res);
      })
    }

    // Show Badges PopUp
    $scope.BadgePopup = function(achievement, type) {
      // $scope.$on('$stateChangeStart', function(event){ event.preventDefault(); } ); // prevents changing state when clicking on popup - should be removed!
      $scope.achievement = achievement;
      $scope.display_picture = achievement.display_picture;
      if(type == 'acquired') 
      {
        $scope.photoUrl = 'img/badges/Badges_with_bg/' + $scope.display_picture;
      }
      else if (type == 'available') 
      {
        $scope.photoUrl = 'img/badges/Badges_with_bg_Grayscale/' + $scope.display_picture;
      }          
      $scope.name = achievement.name;
      $scope.description = achievement.description;

      var myPopup = $ionicPopup.alert({
        templateUrl: 'app/achievements/badge-popup.html',
        scope: $scope
      });  

      myPopup.then(function(res) {
        console.log('Tapped!', res);
        $state.go('achievements.view');
      });

     };

}
})();
