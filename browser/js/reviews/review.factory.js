app.factory('ReviewFactory', function($http) {
	
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

	return reviewFactory;
})