app.config(function($stateProvider) {

  $stateProvider.state('product', {
    url: '/product/:id',
    templateUrl: 'js/products/single.product.html',
    controller: 'ProductCtrl'
  })


});

app.controller('ProductCtrl', function ($scope, $state, $stateParams, ProductFactory, $log, OrderFactory) {

	$scope.quantity = 1;

 	ProductFactory.fetchById($stateParams.id)
	.then(function (product) {
      $scope.product = product;
    })
    .catch($log);

	$scope.up = function(){
		$scope.quantity++;
	}

	$scope.down = function(){
		if ($scope.quantity > 1) $scope.quantity--;
	}

	$scope.addToCart = function(){
    	OrderFactory.updateCart($scope.product, $scope.quantity)
        .then(function(){
            $state.go('cart');
        })
    };

})
