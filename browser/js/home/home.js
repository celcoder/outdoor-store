app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCarousel'
    });
});


app.controller('HomeCarousel', function ($scope, HomePagePics) {

    $scope.images = _.shuffle(HomePagePics);

});