app.factory('OrderFactory', function($http, Session, AuthService){

	var OrderFactory = {};


	// We have a check to see if the user is
	// authenticated, but do we have a check to make
	// sure that the authenticated user is the same
	// as the user whose cart they are querying?

	OrderFactory.getUserCart = function(userId){
		//deals with Auth users
		if (AuthService.isAuthenticated){
			return $http.get('/api/orders/'+userId+'/cart')
			.then(function(orders){
				return orders.data;
			})
		}
		//MUST ADD SESSION CART FOR NON-AUTH USERS
		return;
	}

	OrderFactory.getAllUserOrders = function (userId) {
		if (AuthService.isAuthenticated){
			return $http.get('/api/orders/'+userId+'/all')
			.then(function(orders){
				return orders.data;
			})
		}
	}

	OrderFactory.getUserHistory = function (userId) {
		if (AuthService.isAuthenticated){
			return $http.get('/api/orders/'+userId+'/orderhistory')
			.then(function(orders){
				return orders.data;
			})
		}
	}

	OrderFactory.updateCart = function(userId, productId, quantityChange){
		return $http.put("/api/orders/"+userId+"/updateCart", {productId: productId, quantityChange: quantityChange})
		.then(function(){})
	},

	OrderFactory.purchase = function (userId, orderId) {
		return $http.put('/api/orders/' +userId+ "/" + orderId + '/purchase')
			.then(function (array) {
				return [array[0].data, array[1].data];
			})
	},

	OrderFactory.fetchById = function (userId, orderId) {
		return $http.get('/api/orders/' + userId + "/" + orderId)
			.then(function (order) {
				return order.data;
			})
	}

	return OrderFactory;
})
