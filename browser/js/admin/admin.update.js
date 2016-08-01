app.config(function ($stateProvider) {
    $stateProvider.state('admin-update', {
        url: '/admin/orders/:id',
        templateUrl: 'js/admin/admin-single-order.html',
    	controller: 'AdminUpdateCtrl',
    	resolve: {
    		order: function(OrderFactory) {
    			return OrderFactory.fetchAll();
    		}
    	}
    });
});

app.controller('AdminUpdateCtrl', function($scope, orders) {
    $scope.orders = orders.filter(function(order) {
                    return order.status !== 'cart';
                });
})