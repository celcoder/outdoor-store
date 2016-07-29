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

	// subtotal math
	if (cart.products.length){
		var prices = cart.products.map(function(product){
			return parseFloat(product.price);
		})
		var quantities = cart.products.map(function(product){
			return product.productOrder.quantity;
		})
		var subtotal = 0;
		for (var i = 0; i<cart.products.length; i++){
	    	subtotal += prices[i] * quantities[i];
		}
		$scope.cart.subtotal = subtotal;
	}

	$scope.addOneToCart = function(productId){
        OrderFactory.updateCart(Session.user.id, productId, 1)
        .then(function(){
        	$scope.$evalAsync();
            $state.go('cart', {'id': Session.user.id});

        })
    }	

    $scope.removeOneFromCart = function(productId){
        OrderFactory.updateCart(Session.user.id, productId, -1)
        .then(function(){
        	$scope.$evalAsync();
            $state.go('cart', {'id': Session.user.id});
        })
    }

    $scope.removeAllFromCart = function(productId, quantity){
    	OrderFactory.updateCart(Session.user.id, productId, -quantity)
        .then(function(){
        	$scope.$evalAsync();
            $state.go('cart', {'id': Session.user.id});
        })
    }
	

})
