app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart/',
        templateUrl: 'js/order/templates/cartpage.html',
        // resolve: {
        // 	cart: function(OrderFactory){
        // 		return OrderFactory.getUserCart()
        // 	}
        // },
        controller: 'CartCtrl'
    });
});

app.controller('CartCtrl', function($scope, OrderFactory, Session){
	// $scope.cart = cart;
  $scope.user = Session.user;

// subtotal math
	var calcSubtotal = function (){
		if ($scope.cart.products.length){
			var prices = $scope.cart.products.map(function(product){
				return parseFloat(product.price);
			})
			var quantities = $scope.cart.products.map(function(product){
				return product.productOrder.quantity;
			})
			var subtotal = 0;
			for (var i = 0; i<$scope.cart.products.length; i++){
		    	subtotal += prices[i] * quantities[i];
			}
			$scope.cart.subtotal = subtotal;
		}
	}

	OrderFactory.getUserCart()
	.then(function(res){
		$scope.cart = res;
		calcSubtotal();
		console.log("USER CART:", res);
	})


    $scope.updateCart = function(product, quantity){
    	OrderFactory.updateCart(product, quantity)
        .then(function(updatedCart){
        	$scope.cart = updatedCart;
        	calcSubtotal();
        })
    }


})
