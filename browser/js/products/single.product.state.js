app.config(function($stateProvider) {

  $stateProvider.state('product', {
    url: '/product/:id',
    templateUrl: 'js/products/single.product.html',
    controller: 'ProductCtrl'
  })


});

app.controller('ProductCtrl', function ($scope, $state, $stateParams, ProductFactory, $log) {

 ProductFactory.fetchById($stateParams.id)
    .then(function (product) {
      $scope.product = product;
    })
    .catch($log);

})
