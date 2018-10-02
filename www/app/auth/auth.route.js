(function() {
  'use strict';

  angular
    .module('app.auth')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'auth',
        config: {
          url: '/auth',
          templateUrl: 'app/auth/auth.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'forgot-password',
        config: {
          url: '/forgot-password',
          templateUrl: 'app/auth/forgot-password.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      },
      {
        state: 'reset-password',
        config: {
          url: '/reset-password/:id',
          templateUrl: 'app/auth/reset-password.html',
          controller: 'AuthController',
          controllerAs: 'vm'
        }
      }
    ];
  }
})();
