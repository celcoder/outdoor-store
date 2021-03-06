app.factory('OrderFactory', function($http, Session, AuthService, $q, $cookies, $state){

	var OrderFactory = {};


	OrderFactory.getUserCart = function(){

		//deals with Auth users
		if (AuthService.isAuthenticated()){
			return $http.get('/api/orders/'+Session.user.id+'/cart')
			.then(function(orders){
				return orders.data;
			})
		}
		//NON-AUTH USERS
		return $q.when($cookies.getObject("cart"));
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

	OrderFactory.purchase = function (userId, orderId, address) {
		if (AuthService.isAuthenticated()){
		return $http.put('/api/orders/' +userId+ "/" + orderId + '/purchase', address)
			.then(function () {
				$state.go('confirmation', {id: userId, orderId: orderId});
				return;
			})
		}
		else {
			return $http.put('/api/orders/guest/purchase', address)
			.then(function(){
				$state.go('home');
				$cookies.putObject('cart', {status: "cart", products: [], subtotal: 0})
			})

		}
	}

	OrderFactory.fetchById = function (userId, orderId) {
		return $http.get('/api/orders/' + userId + "/" + orderId)
			.then(function (order) {
				return order.data;
			})
	}

	OrderFactory.updateCart = function(product, quantityChange){
		if (AuthService.isAuthenticated()){
			return $http.put("/api/orders/"+Session.user.id+"/updateCart", {productId: product.id, quantityChange: quantityChange})
			.then(function(cart){
				$state.go('cart');
				return cart.data;
			})
		}
		//For non-auth people
		else {
			//Get cart from cookie
			var cart = $cookies.getObject("cart");

			//find cart Idx of product (Can't use indexOf because quantity on products.productOrder.quantity could differ)
			var cartIdx = -1;
			for (var i = 0; i < cart.products.length; i++){
				if (cart.products[i].id === product.id) {
					cartIdx = i;
					break;
				}
			}
			//if incrementing product num
			if (quantityChange > 0){
				if (cartIdx === -1){
					//add to cart if not in there BUT ONLY if the product stock exceeds the number you're trying to add
					if (product.stock >= quantityChange) {
						product.productOrder = {quantity: quantityChange}
						cart.products.push(product);
						$state.go('cart');

					}
				} else {
					//otherwise just increment the quantity BUT ONLY if the stock exceeds the current cart quantity+change
					if (product.stock >= (cart.products[cartIdx].productOrder.quantity + quantityChange)) {
						cart.products[cartIdx].productOrder.quantity += quantityChange;
						$state.go('cart');
					}
				}
				//Update cookie
				$cookies.putObject("cart", cart);
				//return as promise
				return $q.when(cart);
				//else if decreasing product num
			} else {
				//if to zero, remove it altogether
				if (quantityChange + cart.products[cartIdx].productOrder.quantity <= 0) {
					cart.products.splice(cartIdx, 1);
				} else {
					//otherwise just decrease the quantity (change is neg number)
					cart.products[cartIdx].productOrder.quantity += quantityChange;
				}
				//Update cookie
				$cookies.putObject("cart", cart);
				//return as promise
				return $q.when(cart);
			}

		}
	}

	OrderFactory.ship = function(orderId) {
		return $http.put('/api/orders/' + orderId + '/status', {status: 'shipped'})
			.then(function (shippedOrder) {
				return shippedOrder.data;
			})
	}

	OrderFactory.shipAll = function() {
		return $http.put('/api/orders/shipall', {status: 'shipped'})
			.then(function (shippedOrders) {
				return shippedOrders.data;
			})
	}

	OrderFactory.cancel = function(orderId) {
		return $http.put('/api/orders/' + orderId + '/status', {status: 'canceled'})
			.then(function (canceledOrder) {
				return canceledOrder.data;
			})
	}

	OrderFactory.fetchAll = function() {
		return $http.get('/api/orders/')
			.then(function (allOrders) {
				return allOrders.data;
			})
	}

	return OrderFactory;
})
