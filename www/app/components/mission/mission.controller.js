(function() {
  'use strict';

  angular
    .module('app.components')
    .controller('MissionController', MissionController);

  MissionController.$inject = ['$state','$localStorage'];
  /* @ngInject */
  function MissionController($state, $localStorage) {
    var vm = this;
    var active ;

    var currentMissionID = 0;
    var testMissions = [
      {
        id: 0,
        shortTitle: "Public Transport Awareness",
        shortInfo: "Prove your environmental sensitivities.",
        fullTitle: "Public Transport Awareness Mission",
        image: "img/temp/public_transport_mission.png",
        fullText: "<p>Prove your environmental sensitivities by using three different means of public transport in a week. Mauris commodo in odio luctus rutrum. Nullam eu lacus turpis.</p><p>Ut quis neque vulputate, hendrerit nisl pulvinar, condimentum massa. Vivamus varius, tortor ac pellentesque suscipit, dui ipsum iaculis metus, nec fringilla dolor turpis vitae tellus. Sed sed ullam corper ligula, nec hendrerit purus.</p>"
      },
      {
        id: 1,
        shortTitle: "Cycling in the City",
        shortInfo: "Prove your environmental sensitivities.",
        fullTitle: "Cycling in the City",
        image: "http://ecf.com/files/wp-content/uploads/5423939650_9d2da2b6fd_z.jpg",
        fullText: "<p>Prove your environmental sensitivities by cycling in the city. Mauris commodo in odio luctus rutrum. Nullam eu lacus turpis.</p><p>Ut quis neque vulputate, hendrerit nisl pulvinar, condimentum massa. Vivamus varius, tortor ac pellentesque suscipit, dui ipsum iaculis metus, nec fringilla dolor turpis vitae tellus. Sed sed ullam corper ligula, nec hendrerit purus.</p>"
      },
      {
        id: 2,
        shortTitle:"Walk a Mile",
        shortInfo: "Improve your health by walking.",
        fullTitle: "Walk a Mile",
        image: "http://news.stanford.edu/news/2014/april/images/13763-walking_news.jpg",
        fullText: "<p>Prove your environmental sensitivities by walking. Mauris commodo in odio luctus rutrum. Nullam eu lacus turpis.</p><p>Ut quis neque vulputate, hendrerit nisl pulvinar, condimentum massa. Vivamus varius, tortor ac pellentesque suscipit, dui ipsum iaculis metus, nec fringilla dolor turpis vitae tellus. Sed sed ullam corper ligula, nec hendrerit purus.</p>"
      },
      {
        id: 3,
        shortTitle:"Run Lola Run",
        shortInfo: "Do some exercise!",
        fullTitle:"Run Lola Run",
        image: "https://static01.nyt.com/images/2016/12/14/well/move/14physed-running-photo/14physed-running-photo-facebookJumbo.jpg",
        fullText: "<p>Prove your environmental sensitivities by using running. Mauris commodo in odio luctus rutrum. Nullam eu lacus turpis.</p><p>Ut quis neque vulputate, hendrerit nisl pulvinar, condimentum massa. Vivamus varius, tortor ac pellentesque suscipit, dui ipsum iaculis metus, nec fringilla dolor turpis vitae tellus. Sed sed ullam corper ligula, nec hendrerit purus.</p>"
      }
    ];

    activate();

    function activate(){
      vm.testMissions = testMissions;
      vm.currentMissionID = currentMissionID;
      vm.updateMissionView = updateMissionView;
      vm.profile = angular.copy($localStorage.user);
    }

    function updateMissionView(missionID){
      vm.currentMissionID = missionID;

      $state.go('view-mission');
    }
  }
})();
