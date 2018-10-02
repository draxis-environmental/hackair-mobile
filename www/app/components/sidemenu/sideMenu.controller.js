(function() {
  'use strict';

  angular
    .module('app.components')
    .controller('SideMenuController', SideMenuController);

  SideMenuController.$inject = ['$state', '$rootScope', 'AuthService', '$localStorage', 'NotificationService'];
  /* @ngInject */
  function SideMenuController($state, $rootScope, AuthService, $localStorage, NotificationService) {
    var vm = this;

    activate();

    function activate(){
      vm.profile = $localStorage.user;
      vm.logout = logout;
    }

    function logout(){
        NotificationService
        .show('Successfully logged out')
        .then(function(){
          $localStorage.credentials = null;
          $localStorage.user = null;

          $rootScope.loggedIn = false;
          $state.go('auth');
        });
    }

  }
})();
