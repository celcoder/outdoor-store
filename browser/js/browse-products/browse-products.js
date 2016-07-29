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

app.controller('ProductsCtrl', function ($scope, products, OrderFactory, Session, $state) {

	$scope.products = products;
    
    $scope.addOneToCart = function(productId){
        OrderFactory.updateCart(Session.user.id, productId, 1)
        .then(function(){
            $state.go('cart', {'id': Session.user.id});
        })
    }	


});