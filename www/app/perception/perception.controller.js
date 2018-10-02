(function(){
  'use strict';

  angular.module('app.perception')
  .controller('PerceptionController', PerceptionController);

  function PerceptionController(DataService, LocationService, $localStorage, $state, $cordovaToast){
    var vm = this
    var selected = '';
    activate();

    function activate(){
      angular.extend(vm, {
        postPerception: postPerception,
        selectPerception: selectPerception,
        isSelected: isSelected,
        showResult: showResult
      });
    }

    function selectPerception(el){
      selected = el;
    }

    function isSelected(el){
      return el == selected;
    }

    function postPerception(){
      LocationService.getLocation().then(function(location){
        var coords = [location.coords.latitude, location.coords.longitude];

        DataService.Perceptions.post({
          perception: selected,
          location: coords
        }).then(function(res){
          try {
            $cordovaToast
            .show('Thanks for the input!', 1500, 'top')
            .then(function(){
              $state.go('home');
              selected = '';
            })

          } catch (e){
            $state.go('home');
            selected = '';
          }
        }).catch(function(res){
          try {
            $cordovaToast
            .show('An error occured', 1500, 'top')
            .then(function(){
              $state.go('home');
              selected = '';
            })

          } catch (e){
            $state.go('home');
            selected = '';
          }
          console.log('Error')
          console.log(res)
        });
      });
    }

    function showResult(){

    }
  }

})();
