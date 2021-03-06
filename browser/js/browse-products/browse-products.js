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

app.config(function ($stateProvider) {
    $stateProvider.state('mens', {
        url: '/browse/mens',
        templateUrl: 'js/browse-products/mens-products.html',
    	controller: 'ProductsCtrl',
    	resolve: {
    		products: function(ProductFactory) {
    			return ProductFactory.fetchAll()
    			.then(function(allProducts) {
    				return allProducts.filter(function(product) {
    					return product.name.split(' ').indexOf("Men's") !== -1;
    				})
    			});
    			
    			
    			
    		}
    	}
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('womens', {
        url: '/browse/womens',
        templateUrl: 'js/browse-products/womens-products.html',
    	controller: 'ProductsCtrl',
    	resolve: {
    		products: function(ProductFactory) {
    			return ProductFactory.fetchAll()
    			.then(function(allProducts) {
    				return allProducts.filter(function(product) {
    					return product.name.split(' ').indexOf("Women's") !== -1;
    				})
    			});
    			
    			
    			
    		}
    	}
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('gear', {
        url: '/browse/gear',
        templateUrl: 'js/browse-products/gear-products.html',
    	controller: 'ProductsCtrl',
    	resolve: {
    		products: function(ProductFactory) {
    			return ProductFactory.fetchAll()
    			.then(function(allProducts) {
    				return allProducts.filter(function(product) {
    					return (product.name.split(' ').indexOf("Men's") === -1 && product.name.split(' ').indexOf("Women's") === -1);
    				})
    			});
    			
    			
    			
    		}
    	}
    });
});

app.controller('ProductsCtrl', function ($scope, products, OrderFactory, Session, $state, $rootScope) {
    $rootScope.video = false;
	$scope.products = products;
	//$scope.men = "Men's";
    
    $scope.addOneToCart = function(product){
        OrderFactory.updateCart(product, 1)
    }	


});