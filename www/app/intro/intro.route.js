(function() {
  'use strict';

  angular
    .module('app.intro')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'intro-welcome',
        config: {
          url: '/intro-welcome',
          cache: false,
          templateUrl: 'app/intro/intro-welcome.html',
          controller: 'IntroController'
        }
      },
      {
        state: 'intro-step2',
        config: {
          url: '/intro-step2',
          cache: false,
          templateUrl: 'app/intro/intro-step2.html',
          controller: 'IntroController'
        }
      },
      {
        state: 'intro-step3',
        config: {
          url: '/intro-step3',
          cache: false,
          templateUrl: 'app/intro/intro-step3.html',
          controller: 'IntroMapController',
          controllerAs: 'vm',
          bindToController: true
        }
      }
    ];
  }
})();
