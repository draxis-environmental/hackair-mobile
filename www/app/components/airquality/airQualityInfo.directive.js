(function(){
    angular.module('app.components')

    .directive('airQualityInfo', AirQualityInfo);

    function AirQualityInfo(){
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/airquality/airQualityInfo.html',
            scope: {
                quality: '@'
            },
            link: link,
            controller: 'AirQualityInfoController',
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function link(scope, el, attr, ctrl) {
            
        }
    }
})();
