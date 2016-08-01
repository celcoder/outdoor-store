app.factory('ReviewFactory', function($http, Session) {
	
	var reviewFactory = {};

	reviewFactory.fetchByProductId = function(id) {
		return $http.get('/api/products/' + id + '/reviews')
		.then(function (reviews) {
			console.log("reviews:", reviews)
			return reviews.data;
		})
	}

	reviewFactory.fetchByUserId = function(id) {
		return $http.get('/api/users/' + id + '/reviews')
		.then(function (reviews) {
			return reviews.data;
		})
	}

	reviewFactory.postReview = function(productId, data){
		data.productId = productId;
		if (Session.user) data.userId = Session.user.id;
		return $http.post('/api/products/'+productId+'/review/submit', data)
		.then(function(newReview){
			return newReview.data;
		})
	}

	return reviewFactory;
})