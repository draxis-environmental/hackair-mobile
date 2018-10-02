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
            state: 'perception',
            config: {
                url: '/perception',
                templateUrl: 'app/perception/perception.html',
                controller: 'PerceptionController',
                controllerAs: 'vm',
                bindToController: true
            }
        }
    ];
  }
})();
