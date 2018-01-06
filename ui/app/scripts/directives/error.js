angular.module('weathergui')
  .directive('error', function($parse, $sce) {
    // Display object|String given as parameter
    // as error
    // String: display message
    // Object: if contains only message attribute, display that as String
    // otherwise, stringify as JSON
    return {
      restrict: 'A',
      scope: {
        error: '=',
      },
      template: '<div ng-bind-html="showError()"></div>',
      // template: '{{showError()}}',
      link: function(scope, el) {
        el.addClass('alert alert-danger');

        function foo(err) {
          /*alert("In foo...error "+err);
          alert("In foo... _.keys(err).length is  "+_.keys(err).length);
          alert("In foo... err.error is  "+err.error);
          alert("In foo... err.message is  "+err.message);*/
          if (_.keys(err).length === 1 && err.error) {
            err = err.error;
          }

          if (_.keys(err).length === 1 && err.message) {
            err = err.message;
          }

          if (_.keys(err).length === 4 && _.has(err, 'status') && _.has(err, 'config') && _.has(err, 'data') && _.has(err, 'headers')) {
            err = '<h1>Virhe ' + err.status + '</h1><p>' + foo(err.data) + '</p>';
          }

          if (_.isPlainObject(err)) {
            err = '<pre>' + JSON.stringify(err, null, 2) + '</pre>';
          }

          return err;
        }

        scope.showError = function() {
          // Cast everything to string
          //alert("In error.js showError method ..... "+scope.error);
          return $sce.trustAsHtml('' + foo(scope.error));
        };

        scope.$watch('error', function(newVal) {
         // alert("In error.js watch method......newVal is "+newVal);
          if (newVal) {
            el.removeClass('ng-hide');
          } else {
            el.addClass('ng-hide');
          }
        });
      },
    };
  });
