app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/:id/cart/',
        templateUrl: 'js/order/templates/cart.html',
        resolve: {
        	cart: function(OrderFactory, $stateParams){
        		return OrderFactory.getUserCart($stateParams.id)
        	}
        },
        controller: 'CartCtrl' 
    });
});

app.controller('CartCtrl', function($scope, cart){
	$scope.cart = cart;
	$scope.seeOrders = function(){ console.log("THIS IS THE CART", cart)};
})