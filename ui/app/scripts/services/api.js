angular.module('weathergui')
  .config(function($stateProvider, $httpProvider) {
    // What is Angular/Chrome doing?
    // That other browsers do? Who knows? Who cares?
    $httpProvider.defaults.headers['delete'] = {'Content-Type': 'application/json; charset=utf-8'};

    // This will add states a parameter called "resolveApi"
    // this works like resolve (check ngRoute.$routeProvider docs)
    // but automatically uses Api function for dependancy
    //
    // Alternatively, when dependancy is given as object,
    // function will be created which will immediately return given object.
    // This is useful when initializing Controller with empty data (e.g.
    // create item state which uses same controller as regular view edit page)
    $stateProvider.decorator('resolveApi', function(state) {
      _.each(state.resolveApi, function(v, k) {
        if (_.isString(v)) {
          state.resolve[k] = ['$stateParams', 'Api', function($stateParams, Api) {
            return Api[v].call(this, $stateParams, this.apiParams || {});
          }];
        } else if (_.isPlainObject(v)) {
          state.resolve[k] = function() {
            return v;
          };
        } else {
          throw 'Invalid resolveApi defintion: ' + k + ' = ' + v;
        }
      });
      return state.resolve;
    });

    // Api functions take optional parameters which can be used to define query parametrs sent to server
    // which in turn tell server how to
    // 1) search
    // 2) sort
    // 3) populate
    // results
    $stateProvider.decorator('apiParams', function(state) {
      // inherit from parent states
      // FIXME: is this good assumption to make?
      // In some cases child states do not want to populate same things as parent?
      if (state.parent && state.parent.apiParams) {
        state.apiParams = state.self.data = angular.extend({}, state.parent.apiParams, state.apiParams);
      }
      return state.apiParams;
    });

    // Give default template for abstract states
    $stateProvider.decorator('abstract', function(state) {
      if (state.abstract && !state.template && !state.templateUrl) {
        state.template = '<ui-view/>';
      }
      return state.abstract;
    });
  })
  .factory('Api', function($http) {
    function replaceParams(urlRaw, params) {
      var url = urlRaw;
      var r = new RegExp(':([A-Za-z_]+)([?]?)([\/]?)', 'g');
      var match;

      while ((match = r.exec(urlRaw))) {
        var k = match[1];

        if (params.hasOwnProperty(k)) {
          // Replace param with value in route
          url = url.replace(':' + k + match[2], encodeURIComponent(params[k]));
        } else if (match[2] === '?') {
          // Remove optional param is undefined
          url = url.replace(':' + k + match[2] + match[3], '');
        } else {
          throw 'Missing non-optional url parameter: ' + k;
        }
      }
      return url;
    }

    var http = {};
    _.each(['get', 'delete', 'put', 'post'], function(method) {
      http[method] = function(urlRaw) {
        return function(params, query, data, config) {
          var url = replaceParams(urlRaw, params);
          config = _.extend(config || {}, {params: query});
          if (method === 'get' || method === 'delete') {
            return $http[method](url, config);
          } else {
            return $http[method](url, data, config);
          }
        };
      };
    });

    return {
      getForecastdetails: http.get('api/weatherservice/forecast/:lat/:lon'),      
      getAutocomplete: http.get('api/weatherservice/location')
      
      
    };
  });
