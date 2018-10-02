(function() {
  'use strict';

  var local   = '',
      staging = '',
      production = 'https://api.hackair.eu';



  angular.module('hackair')
  // .constant('API_URL', local)
  // .constant('API_URL', staging)
  .constant('API_URL', production)
  .constant('ORCH_URL', 'https://orchestrator.hackair.eu/action')
  .constant('availableLanguages', [
    'en', // English
    'de', // German
    'no', // Norwegian
    'nb', // Norwegian
    'nn' // Norwegian
    ])
  .constant('defaultLanguage', 'en');

})();
