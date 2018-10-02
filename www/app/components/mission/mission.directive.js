(function(){
    angular.module('app.components')

    .directive('mission', mission);

    function mission(){
        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/components/mission/mission.html',
            scope: {
                profile: '='
            },
            link: link,
            controller: 'MissionController',
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function link(scope, el, attr, ctrl) {

        }
    }
})();
