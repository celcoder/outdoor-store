app.config(function ($stateProvider) {
    $stateProvider.state('browse', {
        url: '/browse',
        templateUrl: 'js/browse-products/browse-products.html',
    	controller: 'ProductsCtrl',
    	resolve: {
    		products: function(ProductFactory) {
    			return ProductFactory.fetchAll();
    		}
    	}
    });
});

app.controller('ProductsCtrl', function ($scope, products) {


	$scope.products = products;
	// console.log("Here they ar *****************", $scope.products);
});