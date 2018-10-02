(function(){
    angular.module('app.components')

    .directive('introMap', introMap);

    function introMap(){
        var directive = {
            restrict: 'E',
            template: '<div class="intro-map" id="map"></div>',
            scope: {
                intro: '='
            },
            link: link,
            controller: 'MapController',
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function link(scope, el, attr, ctrl) {

        }
    }
})();
