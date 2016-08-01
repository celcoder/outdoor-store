app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin/orders',
        templateUrl: 'js/admin/admin-orders.html',
    	controller: 'AdminCtrl',
    	resolve: {
    		orders: function(OrderFactory) {
    			return OrderFactory.fetchAll();
    		}
    	}
    });
});

app.controller('AdminCtrl', function($scope, orders) {
    $scope.orders = orders.filter(function(order) {
                    return order.status !== 'cart';
                });
})