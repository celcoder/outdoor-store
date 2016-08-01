app.config(function($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin/orders',
    templateUrl: 'js/admin/admin-orders.html',
    controller: 'AdminCtrl',
    resolve: {
      orders: function(OrderFactory) {
        return OrderFactory.fetchAll();
      }
    }
  });
});

app.controller('AdminCtrl', function($scope, orders, $filter) {

  $scope.orders = orders.filter(function(order) {
    return order.status !== 'cart';
  });

  var upDown = 'id';
  var status = 'status';
  var date = "createdAt";

  $scope.orderNumberFilter = function() {
    if (upDown === 'id') {
      upDown = "-id";
      $scope.orders = $filter('orderBy')($scope.orders, upDown);
    } else {
      upDown = 'id';
      $scope.orders = $filter('orderBy')($scope.orders, upDown);
    }

  }

  $scope.orderDate = function() {
    if (date === "createdAt") {
      date = '-createdAt';
      $scope.orders = $filter('orderBy')($scope.orders, date);
    } else {
      date = 'createdAt';
      $scope.orders = $filter('orderBy')($scope.orders, date);
    }
  }

  $scope.filterStatus = function() {
    if (status === "status") {
      status = '-status';
      $scope.orders = $filter('orderBy')($scope.orders, status);
    } else {
      status = 'status';
      $scope.orders = $filter('orderBy')($scope.orders, status);
    }
  }

})
