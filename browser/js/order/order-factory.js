app.factory('OrderFactory', function($http, Session, AuthService, $q){

	var OrderFactory = {};


	// We have a check to see if the user is
	// authenticated, but do we have a check to make
	// sure that the authenticated user is the same
	// as the user whose cart they are querying?

	OrderFactory.getUserCart = function(){

		//deals with Auth users
		if (AuthService.isAuthenticated()){
			return $http.get('/api/orders/'+Session.user.id+'/cart')
			.then(function(orders){
				return orders.data;
			})
		}
		//NON-AUTH USERS
		return $q.when(Session.cart);
	}

	OrderFactory.getAllUserOrders = function (userId) {
		if (AuthService.isAuthenticated()){
			return $http.get('/api/orders/'+userId+'/all')
			.then(function(orders){
				return orders.data;
			})
		}
	}

	OrderFactory.getUserHistory = function (userId) {
		if (AuthService.isAuthenticated()){
			return $http.get('/api/orders/'+userId+'/orderhistory')
			.then(function(orders){
				return orders.data;
			})
		}
	}

	OrderFactory.updateCart = function(product, quantityChange){
		if (AuthService.isAuthenticated()){
			return $http.put("/api/orders/"+Session.user.id+"/updateCart", {productId: product.id, quantityChange: quantityChange})
			.then(function(cart){
				return cart.data;
			})
		}
		//For non-auth people
		else {
			//find cart Idx of product
			var cartIdx = Session.cart.products.indexOf(product);
			//if incrementing product num
			if (quantityChange > 0){
				if (cartIdx === -1){
					//add to cart if not in there
					product.productOrder = {quantity: quantityChange}
					Session.cart.products.push(product);
				} else {
					//otherwise just increment the quantity
					Session.cart.products[cartIdx].productOrder.quantity += quantityChange;
				}
				//return as promise
				return $q.when(Session.cart);
				//else if decreasing product num
			} else {
				//if to zero, remove it altogether
				if (quantityChange + Session.cart.products[cartIdx].productOrder.quantity <= 0) {
					Session.cart.products.splice(cartIdx, 1);
				} else {
					//otherwise just decrease the quantity (change is neg number)
					Session.cart.products[cartIdx].productOrder.quantity += quantityChange;
				}
				//return as promise
				return $q.when(Session.cart);
			}
			
		}
	}

	return OrderFactory;
})
