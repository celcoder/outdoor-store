app.directive('searchbar', function ($state, ProductFactory) {

  return {
    restrict: 'E',
    scope: {

    },
    templateUrl: 'js/common/directives/navbar/searchbar.html',
    link: function (scope, element, attrs) {
      scope.getProducts = function () {
        return ProductFactory.fetchAll()
      }
    }

  }

})
