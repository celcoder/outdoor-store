app.config(function($stateProvider) {

  $stateProvider.state('product', {
    url: '/product/:id',
    templateUrl: 'js/products/single.product.html',
    resolve: {
         reviews: function(ReviewFactory,$stateParams){
            return ReviewFactory.fetchByProductId($stateParams.id)
                  .then(function (allReviews) {
                      return allReviews;
                  })
         }
        },
    controller: 'ProductCtrl'
  })

});

app.controller('ProductCtrl', function ($scope, $state, $stateParams, ProductFactory, $log, OrderFactory, reviews, ReviewFactory, Session) {

  var averageRating = (reviews.map(function(r){return r.rating}).reduce(function(a,b){return a+b}))/reviews.length;
  $scope.ratingValue = averageRating; 

  $scope.reviews = reviews;

  $scope.newReview = {rating: 5, text: ""};

  $scope.submitReview = function (){
    if ($scope.newReview.text === "") return;
    ReviewFactory.postReview($scope.product.id, $scope.newReview)
    .then(function(newReview){
      newReview.user = Session.user
      $scope.reviews.push(newReview);
      $scope.leaveReview = false;
      $scope.newReview = {rating: 5, text: ""};
    })
  }

	$scope.quantity = 1;

 	ProductFactory.fetchById($stateParams.id)
	.then(function (product) {
      $scope.product = product;
    })
    .catch($log);

	$scope.up = function(){
    if ($scope.quantity >= $scope.product.stock) return;
		$scope.quantity++;
	}

	$scope.down = function(){
		if ($scope.quantity > 1) $scope.quantity--;
	}

	$scope.addToCart = function(){
    	OrderFactory.updateCart($scope.product, $scope.quantity)
    };

  // ReviewFactory.fetchByProductId($stateParams.id)
  // .then(function (allReviews) {
  //     $scope.reviews = allReviews;
  //     var averageRating = (allReviews.map(function(r){return r.rating}).reduce(function(a,b){return a+b}))/allReviews.length;
  //     $scope.ratingValue = averageRating; 
  // })

})
