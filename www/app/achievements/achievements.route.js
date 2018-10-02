(function() {
  'use strict';

  angular
    .module('app.achievements')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
        {
            state: 'achievements',
            config: {
                url: '/achievements',
                template: '<ion-nav-view></ion-nav-view>',
                abstract: true
            }
        },
        {
            state: 'achievements.view',
            config: {
                url: '/',
                templateUrl: 'app/achievements/view-achievements.html',
                controller: 'AchievementsController',
                controllerAs: 'vm'
            }
        }
    ];
  }
})();
