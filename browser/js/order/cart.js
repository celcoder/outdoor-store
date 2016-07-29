app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/:id/cart/',
        templateUrl: 'js/order/templates/cartpage.html',
        resolve: {
        	cart: function(OrderFactory, $stateParams){
        		return OrderFactory.getUserCart($stateParams.id)
        	}
        },
        controller: 'CartCtrl'
    });
});

app.controller('CartCtrl', function($scope, cart, OrderFactory, Session, $state ){
	$scope.cart = cart;

	$scope.cart.subtotal = 0;

	console.log($scope.cart);

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

	calcSubtotal();


	$scope.addOneToCart = function(productId){
        OrderFactory.updateCart(Session.user.id, productId, 1)
        .then(function(updatedCart){
        	$scope.cart = updatedCart;
        	calcSubtotal();
        })
    }	

    $scope.removeOneFromCart = function(productId){
        OrderFactory.updateCart(Session.user.id, productId, -1)
        .then(function(updatedCart){
        	$scope.cart = updatedCart;
        	calcSubtotal();
        })
    }

    $scope.removeAllFromCart = function(productId, quantity){
    	OrderFactory.updateCart(Session.user.id, productId, -quantity)
        .then(function(updatedCart){
        	$scope.cart = updatedCart;
        	calcSubtotal();
        })
    }
	

})
