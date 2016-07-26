app.factory('ProductFactory', function($http) {
	var productFactory = {};

	productFactory.fetchAll = function() {
		return $http.get('/api/products/')
			.then(function (products) {
				return products.data;
			})
	}

	productFactory.fetchById = function(id) {
		return $http.get('/api/products/' + id)
		.then(function (product) {
			return product.data;
		})
	}

	productFactory.updateStock = function(id, stock) {
		var status = stock ? 'available' : 'out of stock' 
		return $http.put(('/api/products/' + id), {stock: stock, status: status})
				.then(function (updatedProduct) {
					return updatedProduct.data;
				});
	
	}

	productFactory.addProduct = function (newProduct) {
		return $http.post('/api/products/', newProduct)
			.then(function (createdProduct) {
				return createdProduct.data;
			})
	}

	productFactory.discontinue = function (id) {
		return $http.put(('/api/products/' + id), {status: 'discontinued'})
				.then(function (updatedProduct) {
					return updatedProduct.data;
				});
	}



	return productFactory;
})