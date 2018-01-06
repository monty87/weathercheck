angular.module('weathergui')
  .config(function($stateProvider) {
    $stateProvider
      .state('search', {
        url: '/',
        abstract: true,
      })
      .state('search.index', {
        url: '',
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
        resolveApi: {
          results: {data: []},
        },
      })
      .state('search.results', {
        url: '^/search?q',
        resolve: {
          results: ['Api', '$stateParams', function(Api, $stateParams) {
            if (_.isEmpty($stateParams.q)) {
              return {data: []};
            }
            return Api.getAutocomplete({}, {q: $stateParams.q});
          }]
        },
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl',
      })
      .state('search.results.detail', {
        url: '^/preview/{lat},{lon}?q',
        resolveApi: {
          details: 'getForecastdetails',
        },
        views: {
          '': {
            templateUrl: 'views/weather/detail.html',
            controller: 'WeatherServiceCtrl',
          },
        },
      });
  })
  .controller('SearchCtrl', function($scope, $q, results, Api, $http, $state, $stateParams, $log) {
    $log.log('init searchctrl: ' + $state.params.q);
    $scope.searchTerm = $state.params.q || '';   

    $scope.results = results.data || [];
    $scope.searchOngoing = false;

    var arrayRef = [];
    var push = arrayRef.push;
    var timeout;
    var requestTimeout = null;
   

    function doSearch(term) {
      var target = 'search.results';
      if (_.isEmpty(term)) {
        target = 'search.index';
      }
      // If already on search
      else if ($state.includes('search.results')) {
        target = '.';
      }

      $state.go(target, {q: term}, {notify: false});

      if (_.isEmpty(term)) {
        $scope.results.length = 0;        
        return;
      }

      $scope.searchOngoing = true;

      // Cancel previous request to make sure no wrong results are shown even
      // if responses are received in random order
      if (requestTimeout) {
        requestTimeout.resolve();
      }
      requestTimeout = $q.defer();
      Api.getAutocomplete({}, {q: term}, null, {timeout: requestTimeout.promise}).success(function(data) {
        $scope.results.length = 0;        
        push.apply($scope.results, data);        
        $scope.searchOngoing = false;
      }).error(function() {
        $scope.searchOngoing = false;
      });
    }

    $scope.search = function(term) {
      $scope.searchTerm = term;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        doSearch(term);
      }, 200);
    };    
   });
