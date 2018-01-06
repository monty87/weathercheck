angular.module('weathergui')
  .config(function($stateProvider) {  
    })
  
  .controller('WeatherServiceCtrl', function($scope, details) {
   function init(data) {           
      $scope.forecastDetails = data;      
      $scope.forecastdays =  $scope.forecastDetails.forecast.forecastday;
      
          }
    init(details.data);
  });


