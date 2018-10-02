(function() {
  'use strict';

  angular
    .module('app.photo')
    .run(appRun);

  appRun.$inject = ['routerHelper'];
  /* @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
        {
            state: 'photo',
            config: {
                url: '/photo',
                templateUrl: 'app/photo/photo.html',
                controller: 'PhotoController',
                controllerAs: 'vm'
            }
        },
        {
            state: 'photo-upload',
            config: {
                url: '/photo-upload',
                templateUrl: 'app/photo/photo-upload.html',
                params: {photo: null},
                controller: 'PhotoController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
            state: 'photo-sensor-upload',
            config: {
                url: '/photo-sensor-upload',
                templateUrl: 'app/photo/photo-sensor-upload.html',
                params: {photo: null, sensorId: null},
                controller: 'PhotoController',
                controllerAs: 'vm',
                cache: false
            }
        },
        {
          state: 'photo-sensor-choose',
          config: {
              url: '/photo-sensor-choose',
              templateUrl: 'app/photo/photo-sensor-choose.html',
              params: {sensors: null},
              controller: 'PhotoController',
              controllerAs: 'vm',
              cache: false
          }
        },
        {
            state: 'photo-howto',
            config: {
                url: '/photo-howto',
                templateUrl: 'app/photo/photo-howto.html',
                controller: 'PhotoController',
                controllerAs: 'vm'
            }
        },
        {
            state: 'photo-cots-howto',
            config: {
                url: '/photo-cots-howto',
                templateUrl: 'app/photo/photo-cots-howto.html',
                controller: 'PhotoController',
                controllerAs: 'vm'
            }
        },        
        {
            state: 'photo-measurement',
            config: {
                url: '/photo-measurement',
                templateUrl: 'app/photo/photo-measurement.html',
                params: {aq: null},
                controller: 'PhotoController',
                controllerAs: 'vm',
                cache: false
            }
        }
    ];
  }
})();
