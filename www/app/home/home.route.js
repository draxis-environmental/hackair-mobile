(function() {
  'use strict';

  angular
    .module('app.home')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
        {
            state: 'home',
            config: {
                url: '/home',
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                bindToController: true
                }
        },
        {
            state: 'aq-history',
            config: {
                url: '/history',
                templateUrl: 'app/components/aqGraph/aqGraph.html',
                controller: 'ChartController',
                controllerAs: 'vm'
                }
        },
        {
            state: 'missions',
            config: {
                url: '/missions',
                template: '<ion-nav-view></ion-nav-view>',
                abstract: true
                }
        },
        {
            state: 'missions.list',
            config: {
                url: '/',
                templateUrl: 'app/components/mission/list-missions.html',
                controller: 'MissionController',
                controllerAs: 'vm'
                }
        },
        {
            state: 'missions.view',
            config: {
                url: '/:id',
                templateUrl: 'app/components/mission/view-mission.html',
                controller: 'MissionController',
                controllerAs: 'vm'
                }
        },
        {
            state: 'aq-share',
            config: {
                url: '/aq-share',
                templateUrl: 'app/components/airquality/share.html',
                controller: 'AirQualityInfoController',
                controllerAs: 'vm',
                cache: false,
                bindToController: true
                }
        },

    ];
  }
})();
