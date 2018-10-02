(function(){
    angular.module('app.components')

    .directive('tipNotification', TipNotification);

    function TipNotification(){
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/tipNotification/tipNotification.html',
            scope: {
                quality: '@'
            },
            link: link,
            controller: 'TipNotificationController',
            controllerAs: 'vm',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function link(scope, el, attr, ctrl) {

        }
    }
})();
