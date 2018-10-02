(function() {
  'use strict';

  angular
    .module('app.profile')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
        {
            state: 'profile',
            config: {
                url: '/profile',
                template: '<ion-nav-view></ion-nav-view>',
                abstract: true
            }
        },
        {
            state: 'profile.view',
            config: {
                url: '/',
                templateUrl: 'app/profile/profile.html',
                controller: 'ProfileController',
                controllerAs: 'vm'
            }
        },
        {
            state: 'profile.edit',
            config: {
                url: '/edit',
                templateUrl: 'app/profile/edit-profile.html',
                controller: 'ProfileController',
                cache: false,
                controllerAs: 'vm'
            }
        },
        {
          state: 'profile.edit-password',
          config: {
              url: '/password',
              templateUrl: 'app/profile/profile.password.html',
              controller: 'ProfileController',
              cache: false,
              controllerAs: 'vm'
          }
        },
        {
          state: 'profile.edit-settings',
          config: {
              url: '/settings',
              templateUrl: 'app/profile/profile.settings.html',
              controller: 'ProfileController',
              cache: false,
              controllerAs: 'vm'
          }
        },        
        {
          state: 'profile.delete-account',
          config: {
              url: '/delete',
              templateUrl: 'app/profile/profile.delete.html',
              controller: 'ProfileController',
              cache: false,
              controllerAs: 'vm'
          }
        },
        {
            state: 'photos',
            config: {
                url: '/photos',
                templateUrl: 'app/photos/view-photos.html',
                controller: 'PhotosController',
                controllerAs: 'vm',
                cache: false,
                bindToController: true
            }
        },
        {
            state: 'followers',
            config: {
                url: '/followers',
                templateUrl: 'app/follows/followers.html',
                controller: 'FollowsController',
                controllerAs: 'vm'
            }
        },
        {
            state: 'following',
            config: {
                url: '/following',
                templateUrl: 'app/follows/following.html',
                controller: 'FollowsController',
                controllerAs: 'vm'
            }
        }
    ];
  }
})();
