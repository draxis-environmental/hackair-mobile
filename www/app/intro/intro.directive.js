(function() {
  'use strict';

  angular
    .module('app.intro')
    .directive('introFooterBar', introFooterBar);

  introFooterBar.$inject = [];
  /* @ngInject */
  function introFooterBar() {
      var directive = {
        restrict: 'E',
        templateUrl: 'app/intro/intro-footer-bar.html',
        scope: {
            route: '=',
            next: '='
        },
        link: link,
        controller: 'IntroController',
        controllerAs: 'vm',
        bindToController: true // because the scope is isolated
    };

    return directive;

    function link(scope, el, attr, ctrl) {
        
    }
  }
})();
