(function(){
    'use strict';

    angular.module('app.services')
    .factory('NotificationService', NotificationService);

    NotificationService.$inject = ['$cordovaToast','$q']; // ngToast

    function NotificationService ($cordovaToast, $q) {
        var service = {
            show:   function(msg){
              var defered = $q.defer();

              if (!window.cordova){
                console.info('Toastr message: ', msg)
                defered.resolve(false);

                return defered.promise;
              }

              return $cordovaToast.show(msg, 6000, 'top')
            }
        };

        return service;
    }
})();
