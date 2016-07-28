app.factory('OrderFactory', function($http, Session, AuthService){

	var OrderFactory = {};

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

	OrderFactory.updateCart = function(userId, itemId, quantity){
		
	}

	return OrderFactory;
})