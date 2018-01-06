angular.module('weathergui')
  .factory('Error', function($rootScope) {
    var authScope = $rootScope.$new();

    authScope.setError = function(err) {
      authScope.error = err;
    };

    authScope.clearError = function() {
      authScope.error = null;
    };

    authScope.init = function() {
      $rootScope.$on('$stateChangeError', function(e, to, toParams, from, fromParams, error) {
        $rootScope.rootError = error;
      });

      $rootScope.$on('$stateChangeSuccess', function() {
        $rootScope.rootError = null;
      });
    };

    return authScope;
  });
