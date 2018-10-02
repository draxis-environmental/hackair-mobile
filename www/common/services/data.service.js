(function(){
    'use strict';

    angular.module('app.services')
    .factory('DataService', DataService);

    DataService.$inject = ['API_URL','Restangular', '$http'];

    function DataService (API_URL, Restangular, $http) {
        Restangular.setBaseUrl(API_URL);

        var service = {
            Users:   Restangular.service('users'),
            Sensors: Restangular.service('sensors'),
            Measurements: Restangular.service('measurements'),
            Photos:  Restangular.service('photos'),
            Photo: Restangular.service('photos/aqi/'),
            Achievements: {
              badges: function(userId){
                return $http.get(API_URL + '/users/' + userId + '/achievements', {});
              }
            },
            AQ: {
              get: function(params){
                return $http.get(API_URL + '/aq', {params: params});
              }
            },            
            Perceptions: Restangular.service('perceptions'),
            Profile: {
              togglePrivacy: function(userId){
                return $http.put(API_URL + '/users/' + userId + '/privacy', {});
              },
              toggleNotificationEmails: function(){
                return $http.post(API_URL + '/users' + '/stop_mails', {});
              },
              toggleNewsletter: function(){
                return $http.post(API_URL + '/users' + '/accept_newsletters', {});
              }  
            }
        };

        return service;
    }
})();
