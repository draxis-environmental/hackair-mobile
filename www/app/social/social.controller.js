(function() {
    'use strict';

    angular
      .module('app.social')
      .controller('SocialController', SocialController);

    SocialController.$inject = ['$scope', '$rootScope', '$localStorage', /* 'SocialService', */ 'DataService', '$state'];
    /* @ngInject */
    function SocialController($scope, $rootScope, $localStorage, /* SocialService, */ DataService, $state) {
        var vm = this;
    }
})();
