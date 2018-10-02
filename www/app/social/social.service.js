(function(){
  'use strict';

  angular.module('app.social')
  .factory('SocialService', SocialService);

  SocialService.$inject = ['$http', 'API_URL'];

  function SocialService($http, API_URL) {
    var service = {
      createCommunity: createCommunity,
      updateCommunity: updateCommunity,
      deleteCommunity: deleteCommunity,
      joinCommunity: joinCommunity,
      leaveCommunity: leaveCommunity,
      getCommunityFeed: getCommunityFeed
    };

    return service;

    function createCommunity(name, description) {
      var data = {
        name: name,
        description: description
      };
      return $http.post(API_URL + '/social/communities', data)
      .then(function(response) {
        return response;
      });
    }

    function updateCommunity(name, description, community_id) {
      var data = {
        name: name,
        description: description
      };
      return $http.put(API_URL + '/social/communities/' + community_id, data)
      .then(function(response) {
        return response;
      });
    }

    function deleteCommunity(community_id) {
      return $http.delete(API_URL + '/social/communities/' + community_id, {})
      .then(function(response) {
        return response;
      });
    }

    function joinCommunity(community_id) {
      return $http.post(API_URL + '/users/social/communities/' + community_id, {})
      .then(function(response) {
        return response;
      });
    }

    function leaveCommunity(community_id) {
      return $http.delete(API_URL + '/users/social/communities/' + community_id, {})
      .then(function(response) {
        return response;
      });
    }

    function getCommunityFeed(community_id) {
      return $http.get(API_URL + '/social/communities/' + community_id + '/feed', {})
      .then(function(response) {
        return response.data.data;
      });
    }

  }

})();
