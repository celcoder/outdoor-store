app.config(function($stateProvider) {
  $stateProvider.state('admin-products', {
    url: '/admin/products',
    templateUrl: 'js/admin/admin-products.html',
    controller: 'AdminProductsCtrl',
    resolve: {
      getAllProducts: function(ProductFactory) {
        return ProductFactory.fetchAll();
      }
    }
  })
})


app.controller('AdminProductsCtrl', function($scope, getAllProducts, $filter){
  $scope.allProducts = getAllProducts;

  $scope.outOfStock = $scope.allProducts.filter(function(product) {
    return product.status === 'out of stock';
  })

  $scope.products = $scope.allProducts;

  if ($scope.outOfStock.length) {
    $scope.main = true;
  } else {
    $scope.main = false;
  }

  $scope.viewAll = function() {
    $scope.main = false;
    $scope.products = $scope.allProducts;
  }

  $scope.viewOutOfStock = function() {
    $scope.main = false;
    $scope.products = $scope.outOfStock;
  }


  var name = "name";
  var status = "status";
  var quantity = "stock";

  $scope.filterByName = function() {
    if (name === 'name') {
      name = '-name';
      $scope.products = $filter('orderBy')($scope.products, name);
    } else {
      name = 'name';
      $scope.products = $filter('orderBy')($scope.products, name);
    }
  }

  $scope.filterByStatus = function() {
    if (status === 'status') {
      status = '-status';
      $scope.products = $filter('orderBy')($scope.products, status);
    } else {
      status = 'status';
      $scope.products = $filter('orderBy')($scope.products, status);
    }
  }

  $scope.filterByQuantity = function() {
    if (quantity === 'stock') {
      quantity = '-stock';
      $scope.products = $filter('orderBy')($scope.products, quantity);
    } else {
      quantity = 'stock';
      $scope.products = $filter('orderBy')($scope.products, quantity);
    }
  }


})