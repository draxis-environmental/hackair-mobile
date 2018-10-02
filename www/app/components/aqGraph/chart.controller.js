(function() {
  'use strict';

  angular
    .module('app.components')
    .controller('ChartController', ChartController);
    ChartController.$inject = ['$scope', '$rootScope', 'DataService'];
    function ChartController($scope, $rootScope, DataService){
      var vm = this;
      console.log('init');
      $scope.londonaqhistory = [120, 70, 170, 320, 160, 145, 430, 270];
      $scope.dateLabels = [];
      $scope.AQData = [];

      console.log($rootScope.searchedCity); 

      $scope.getAQm = function(dateStart){
        var citylat = $rootScope.searchedCity.coords.latitude;
        var citylong = $rootScope.searchedCity.coords.longitude;
        return DataService.AQ.get({
          dateStart: dateStart,
          lat: citylat,
          lon: citylong
        })
      }     

      $scope.rangeOptions = [
        {id:1, name:'Last week', value: 1},
        {id:2, name:'Last month', value: 2},
        {id:3, name:'Last year', value: 3}
      ];

      $scope.selectedRange = $scope.rangeOptions[0];

      activate();

      function activate(){
        vm.chartChange = chartChange;
      }

      function chartChange(selectedRange){
        $rootScope.$broadcast('chartChanges', selectedRange);
      }
    }
})();
