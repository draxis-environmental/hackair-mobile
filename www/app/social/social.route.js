(function() {
    'use strict';
  
    angular
      .module('app.social')
      .run(appRun);
  
    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
      routerHelper.configureStates(getStates());
    }
  
    function getStates() {
      return [
        {
          state: 'social',
          config: {
            url: '/social/',
            templateUrl: 'app/social/social.html',
            controller: 'SocialController',
            controllerAs: 'vm',
            bindToController: true,
            cache: false
          }
        }
      ];
    }
  })();
  