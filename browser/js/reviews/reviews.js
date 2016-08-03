app.directive('starRating', function( ) {
  return {
    restrict: 'EA',
    template:
      '<ul class="star-rating">' +
      '<li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
      '    <i class="glyphicon glyphicon-star"></i>' + 
      '  </li>' +
      '</ul>',
    scope: {
      ratingValue: '=ngModel',
      readonly: '=?'
    },
    link: function(scope, element, attributes) {
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < 5; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };

      updateStars();

      scope.toggle = function(index) {
        if (scope.readonly == undefined || scope.readonly === false){
          scope.ratingValue = index + 1;
        }
      };
      scope.$watch('ratingValue', function(oldValue, newValue) {
        if (newValue) {
          updateStars();
        }
      });
    }
  };
});

