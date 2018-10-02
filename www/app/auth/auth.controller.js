(function() {
  'use strict';

  angular
    .module('app.auth')
    .controller('AuthController', AuthController);

  AuthController.$inject = ['$state', '$rootScope', '$scope', '$stateParams', 'AuthService', '$localStorage', 'NotificationService', '$ionicHistory', '$timeout' ];
  /* @ngInject */
  function AuthController($state, $rootScope, $scope, $stateParams, AuthService, $localStorage, NotificationService, $ionicHistory, $timeout) {
    var vm = this;
    vm.user = {};
    vm.accept_newsletters = false;
    vm.acceptTerms = false;    
    var activeTab = 'login';

    activate();

    function activate(){
      angular.extend(vm, {
        isTabActive: isTabActive,
        setTabActive: setTabActive,
        login: login,
        register: register,
        sendReset: sendReset,
        resetPassword: resetPassword,
        toggleNewsletter: toggleNewsletter,
        toggleAcceptTerms: toggleAcceptTerms        
      });

      $scope.goTo = goTo;

      function goTo(state){
        $state.go(state);
      }
    }

    function toggleNewsletter(){
      vm.accept_newsletters = !vm.accept_newsletters;
      console.log(vm.accept_newsletters);
      vm.user.accept_newsletters = vm.accept_newsletters;
      console.log(vm.user.accept_newsletters);
    }

    function toggleAcceptTerms(){
      vm.acceptTerms = !vm.acceptTerms;
      console.log(vm.acceptTerms);
    }    

    function isTabActive(tab){
      return activeTab === tab;
    }

    function setTabActive(tab){
      activeTab = tab;
    }

    function login(){

      AuthService.login(vm.user)
      .then(function success(response){
        NotificationService
        .show('Successfully logged in')
        .then(function(){
          $localStorage.credentials = response.data.token;
          var decodedToken = parseJwt($localStorage.credentials);

          var user = {
            id: decodedToken.sub
          };

          $rootScope.userID = user.id;

          AuthService.getProfile(user.id)
          .then(function(userData){
            angular.extend(user, userData);

            $localStorage.user = user;
            $rootScope.loggedIn = true;
            console.log($localStorage);

            $state.go('home');
          });

        });
      })
      .catch(function failure(response){
        if (response.data.status == 'error' && response.data.type == 'validation'){

          vm.loginForm.message = response.data.message;

          for (var err in response.data.message) {
            vm.loginForm[err].$error = true;
          }

          console.log(vm.loginForm);

         NotificationService.show('Please check your inputs');
        }

        if (response.data.status == 'error' && response.data.type == 'not_found'){
          NotificationService.show(response.data.message);
        } else {
          // NotificationService
          // .show(response.data.message)
        }
      });
    }

    function logout(){
        NotificationService
        .show('Successfully logged out')
        .then(function(){

          // Clear $localStorage
          delete($localStorage.credentials);
          delete($localStorage.firstPhoto);
          delete($localStorage.user);
          delete($rootScope.loggedIn);

          $timeout(function () { 
            $ionicHistory.clearCache(); $ionicHistory.clearHistory(); }, 200)           

          NotificationService
          .show('Successfully logged out').then(function(){
            $state.go('auth');
          })
        });
    }

    // function register(){
    //   AuthService.register(vm.user)
    //   .then(function(response){
    //      NotificationService
    //     .show('Successfully registered').then(login)
    //   })
    //   .catch(function failure(err){
    //     NotificationService.show(err.data.message);
    //     console.error('Failed authentication', err);
    //   });
    // }

    function register(){
      if(!vm.user.accept_newsletters) { vm.user.accept_newsletters = false; }
      AuthService.register(vm.user)
      .then(function(response){
         NotificationService
        .show('Successfully registered. Please check your email to ACTIVATE YOUR ACCOUNT.')
      })
      .catch(function failure(err){
        NotificationService.show(err.data.message);
        console.error('Failed authentication', err);
      });
    }

    function sendReset() {
      console.log("Password Reset!");
      AuthService.sendReset(vm.user.email)
      .then(function(response){
        NotificationService
        .show('Reset link was sent to '+vm.user.email)
        .then(function() {
          $state.go('auth');
        });
      })
      .catch(function failure(response){
        NotificationService
        .show(response.data.message);
      });
    }

    function resetPassword(){
      var reset_token = $stateParams.id;

      AuthService.resetPassword(vm.user.password, vm.user.confirm_password, reset_token)
      .then(function(response){
        NotificationService.show('Password changed.')
        .then(function() {
          $state.go('auth');
        });
      })
      .catch(function failure(response){
        NotificationService
        .show(response.data.message);
      });
    }

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };
  }
})();
