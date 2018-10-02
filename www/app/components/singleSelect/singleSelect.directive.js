(function(){
  'use strict';

  angular.module('app.components')
  .directive('ionSingleSelect', ionSingleSelect);

  ionSingleSelect.$inject = ['$ionicModal', '$ionicGesture'];

  function ionSingleSelect ($ionicModal, $ionicGesture) {
    return {
      restrict: 'E',
      scope: {
        options : "="
      },
      controller: function ($scope, $element, $attrs) {
        $scope.singleSelect = {
          title:              $attrs.title || "Select One",
          headerclass:        $attrs.headerclass || "",
          scroll:             $attrs.scroll || true,
          tempOptions:        [],
          selected:           '',
          keyProperty:        $attrs.keyProperty || "id",
          valueProperty:      $attrs.valueProperty || "value",
          selectedProperty:   $attrs.selectedProperty || "selected",
          optiontextProperty: $attrs.optiontextProperty || "name",
          templateUrl:        $attrs.templateUrl || 'app/components/singleSelect/singleSelect.html',
          renderCheckbox:     $attrs.renderCheckbox ? $attrs.renderCheckbox == "true" : true,
          animation:          $attrs.animation || 'slide-in-up'
        };

        $scope.OpenModalFromTemplate = function (templateUrl) {
          $ionicModal.fromTemplateUrl(templateUrl, {
            scope: $scope,
            animation: $scope.singleSelect.animation
          }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
          });
        };
        
        $ionicGesture.on('tap', function (e) {
          $scope.singleSelect.tempOptions = $scope.options.map(function(option){
            var tempOption = { };
            tempOption[$scope.singleSelect.keyProperty] = option[$scope.singleSelect.keyProperty];
            tempOption[$scope.singleSelect.valueProperty] = option[$scope.singleSelect.valueProperty];
            tempOption[$scope.singleSelect.optiontextProperty] = option[$scope.singleSelect.optiontextProperty];
            tempOption[$scope.singleSelect.selectedProperty] = option[$scope.singleSelect.selectedProperty];
            
            return tempOption;
          });
          $scope.OpenModalFromTemplate($scope.singleSelect.templateUrl);
        }, $element);
        
        $scope.saveOptions = function(){
          for(var i = 0; i < $scope.options.length; i++){
            var option = $scope.options[i];
            
            if($scope.singleSelect.selected === option[$scope.singleSelect.valueProperty]){
              option[$scope.singleSelect.selectedProperty] = true;
              console.log(option);
              // break;
            } else {
              option[$scope.singleSelect.selectedProperty] = false;
            }
          }
          console.log($scope.options);
          $scope.closeModal();
        };
        
        $scope.closeModal = function () {
          $scope.modal.remove();
        };
        $scope.$on('$destroy', function () {
            if ($scope.modal){
                $scope.modal.remove();
            }
        });
      }
    };
  }
})();
