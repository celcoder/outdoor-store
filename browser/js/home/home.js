app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCarousel',
        resolve: {
        	randomProducts: function(ProductFactory) {
        		return ProductFactory.fetchAll();
        	}
        }
    });
});


app.controller('HomeCarousel', function ($scope, HomePagePics, randomProducts, $rootScope) {
    $scope.images = _.shuffle(HomePagePics);
    $rootScope.title = true;
    $scope.randomProducts = _.sample(randomProducts, 4);
});
