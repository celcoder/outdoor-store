app.factory('OrderFactory', function($http, Session, AuthService){

	var OrderFactory = {};

	OrderFactory.getUserOrders = function(userId){
		//deals with Auth users
		if (AuthService.isAuthenticated){
			return $http.get('/api/orders/'+userId+'/all')
			.then(function(orders){
				return orders.data;
			})
		}
		//MUST ADD SESSION CART FOR NON-AUTH USERS
		return;
	}

	return OrderFactory;
})