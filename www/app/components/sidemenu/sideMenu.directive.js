(function(){
    angular.module('app.components')

    .directive('sideMenu', SideMenu);

    function SideMenu(){
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/sidemenu/sideMenu.html',
            scope: {
            },
            link: link,
            controller: 'SideMenuController',
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function link(scope, el, attr, ctrl) {
            
        }
    }
})();
