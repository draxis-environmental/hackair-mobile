(function() {
  'use strict';

  angular
    .module('app.community')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'community',
        config: {
          url: '/community',
          template: '<ion-nav-view></ion-nav-view>',
          controller: 'CommunityController',
          cache: false,
          abstract: true,
          resolve: {
            profile: function(AuthService, $localStorage){
              return AuthService.getProfile($localStorage.user.id).then(function(profile){return profile});
            }
          }
        }
      },
      {
        state: 'community.list',
        config: {
          url: '/',
          templateUrl: 'app/community/list-communities.html',
          controller: 'CommunityController',
          controllerAs: 'vm',
          cache: false,
          resolve: {
            profile: function(AuthService, $localStorage){
              return AuthService.getProfile($localStorage.user.id).then(function(profile){return profile});
            }
          }
        }
      },
      {
        state: 'community.create',
        config: {
          url: '/create',
          templateUrl: 'app/community/create-community.html',
          controller: 'CommunityController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'community.view',
        config: {
          url: '/:id',
          templateUrl: 'app/community/view-community.html',
          controller: 'CommunityController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'community.feed',
        config: {
          url: '/:id/feed',
          templateUrl: 'app/community/community.feed.html',
          controller: 'CommunityController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'community.update',
        config: {
          url: '/:id/update',
          templateUrl: 'app/community/update-community.html',
          controller: 'CommunityController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'community.delete',
        config: {
          url: '/:id/delete',
          templateUrl: 'app/community/delete-community.html',
          controller: 'CommunityController',
          controllerAs: 'vm'
        }
      }
    ];
  }
})();
