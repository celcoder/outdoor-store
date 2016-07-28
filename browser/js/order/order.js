app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/:id/cart/',
        templateUrl: 'js/order/templates/cart.html',
        resolve: {
        	orders: function(OrderFactory, $stateParams){
        		return OrderFactory.getUserOrders($stateParams.id)
        	}
        },
        controller: 'CartCtrl' 
    });
});

app.controller('CartCtrl', function($scope, orders){
	$scope.orders = orders;
	$scope.seeOrders = function(){ console.log("THESE ARE THE ORDERS", orders)};
	$scope.singleorder = orders[0];
})