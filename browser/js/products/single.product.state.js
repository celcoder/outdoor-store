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

	$scope.up = function(){
		if ($scope.selectedNum) return $scope.selectedNum++;
		else {
			$scope.selectedNum = 2;
			return;
		}
	}

	$scope.down = function(){
		if ($scope.selectedNum && $scope.selectedNum > 1) $scope.selectedNum--;
		return;
	}

	//unfinished
	$scope.addToCart = function(){};

})
