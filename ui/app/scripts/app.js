/* global jQuery, $ */
// http://ng-perf.com/2014/10/24/simple-trick-to-speed-up-your-angularjs-app-load-time/
if (jQuery) {
var originalFn = $.fn.data;
  $.fn.data = function() {
    if (arguments[0] !== '$binding')
      return originalFn.apply(this, arguments);
  };
}

angular.module('weathergui', [
  'ui.router',
  'xeditable',
  'ui.bootstrap',  
  'pascalprecht.translate',
])
  .config(function($urlRouterProvider, $locationProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('error', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl',
      });
  })
  .run(function($rootScope, $state, $stateParams, editableOptions, Error) {
    $rootScope.$stateParams = $stateParams;
    $rootScope.$state = $state;    
    Error.init();      
  });
