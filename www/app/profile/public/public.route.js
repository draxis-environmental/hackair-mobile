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
                state: 'public',
                config: {
                    url: '/user',
                    template: '<ion-nav-view></ion-nav-view>',
                    abstract: true
                }
            },
            {
                state: 'public.view',
                config: {
                    url: '/:id',
                    templateUrl: 'app/profile/public/public.html',
                    controller: 'PublicProfileController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'public.achievements',
                config: {
                    url: '/achievements',
                    templateUrl: '',
                    controller: 'PublicProfileAchievementsController',
                    controllerAs: 'vm',
                    bindToController: true
                }
            },
            {
                state: 'public.photos',
                config: {
                    url: '/photos',
                    templateUrl: 'app/photos/view-photos.html',
                    controller: 'PublicProfilePhotosController',
                    controllerAs: 'vm'
                }
            },
            // {
            //     state: 'public.perceptions',
            //     config: {
            //         url: '/perceptions',
            //         templateUrl: 'app/profile/public/tabs/perceptions.html',
            //         controller: 'PublicProfilePerceptionsController',
            //         controllerAs: 'vm'
            //     }
            // },
            {
                state: 'public.sensors',
                config: {
                    url: '/sensors',
                    templateUrl: 'app/profile/public/tabs/sensors.html',
                    controller: 'PublicProfileSensorsController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'public.following',
                config: {
                    url: '/following',
                    templateUrl: 'app/follows/following.html',
                    controller: 'PublicProfileFollowersController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'public.followers',
                config: {
                    url: '/followers',
                    templateUrl: 'app/follows/followers.html',
                    controller: 'PublicProfileFollowersController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'public.view-sensor',
                config: {
                    url: '/sensors/:id',
                    templateUrl: 'app/public/sensors/view-sensor.html',
                    controller: 'PublicSensorsController',
                    controllerAs: 'vm'
                }
            },
            {
                state: 'public.communities',
                config: {
                    url: '/communities',
                    templateUrl: '',
                    controller: 'PublicProfileCommunitiesController',
                    controllerAs: 'vm'
                }
            },
        ];

    }
})();