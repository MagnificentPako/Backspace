var directives = angular.module("testDirectives",[]);

directives.directive("compareTo", function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue){
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModuleValue", function(){
        ngModel.$validate();
      });
    }
  };
});

directives.directive('autoGrow', function($window, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      element.on('input propertychange', update);
      function update() {
          var scrollTop = $window.pageYOffset,
              scrollLeft = $window.pageXOffset;
          element.css({
            height: 'auto',
            overflow: 'hidden'
          });
          var height = element[0].scrollHeight;
          if (height > 0) {
              element.css('height', height + 'px');
          }
          $window.scrollTo(scrollLeft, scrollTop);
      }
      $timeout(update);
    }
  };
});
