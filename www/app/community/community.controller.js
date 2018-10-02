(function() {
  'use strict';

  angular
    .module('app.community')
    .controller('CommunityController', CommunityController);

  CommunityController.$inject = ['$state', '$localStorage', 'SocialService', 'NotificationService', 'profile'];
  /* @ngInject */
  function CommunityController($state, $localStorage, SocialService, NotificationService, profile) {
    var vm = this;
    vm.word_for_delete = "hackAIR";

    activate();

    function activate(){
      vm.communities = profile.communities;
      vm.createCommunity = createCommunity;
      vm.updateCommunity = updateCommunity;
      vm.deleteCommunity = deleteCommunity;
      vm.joinCommunity = joinCommunity;
      vm.leaveCommunity = leaveCommunity;
      getCommunityFeed($state.params.id);
    }


    function getCommunityFeed(community_id) {
      SocialService.getCommunityFeed(community_id)
      .then(function(response) {
        vm.selectedCommunity = response.community;
        vm.communityFeed = response.feeds.data;
      });
    }

    function createCommunity() {
      SocialService.createCommunity(vm.community.name, vm.community.description)
      .then(function(response) {
        NotificationService.show(response.data.message)
        .then(function() {
          $state.go('community.view', {id: response.data.data.id});
        })
      })
      .catch(function(error) {
        NotificationService.show(error.data.message);
      });
    }

    function updateCommunity() {
      SocialService.updateCommunity(vm.community.name, vm.community.description, $state.params.id)
      .then(function(response) {
        NotificationService.show(response.data.message);
        $state.go('community.view', {id: $state.params.id});
      })
      .catch(function(error) {
        NotificationService.show(error.data.message);
      });
    }

    function deleteCommunity() {
      if (vm.delete_word === 'hackAIR') {
        SocialService.deleteCommunity($state.params.id)
        .then(function(response) {
          NotificationService.show(response.data.message);
          $state.go('community.list');
        })
        .catch(function(error) {
          NotificationService.show(error.data.message);
          $state.reload();
        });
      }
    }

    function joinCommunity(community_id) {
      SocialService.joinCommunity(community_id)
      .then(function(response) {
        NotificationService.show(response.data.message);
        $state.reload();
      })
      .catch(function(error) {
        NotificationService.show(error.data.message);
        $state.reload();
      });
    }

    function leaveCommunity(community_id) {
      SocialService.leaveCommunity(community_id)
      .then(function(response) {
        NotificationService.show(response.data.message);
        $state.go('community.list');
      })
      .catch(function(error) {
        NotificationService.show(error.data.message);
        $state.reload();
      });
    }
  }
})();
