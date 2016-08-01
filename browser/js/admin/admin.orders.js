app.config(function($stateProvider) {
  $stateProvider.state('admin-orders', {
    url: '/admin/orders/',
    templateUrl: 'js/admin/admin-orders.html',
    controller: 'AdminOrdersCtrl',
    resolve: {
      orders: function(OrderFactory) {
        return OrderFactory.fetchAll();
      }
    }
  })
});

app.controller('AdminOrdersCtrl', function($scope, orders, $filter, OrderFactory) {
 

  $scope.allOrders = orders.filter(function(order) {
    return order.status !== 'cart';
  });
  
  $scope.orders = $scope.allOrders;
  
  $scope.ordersToBeShipped = $scope.allOrders.filter(function(order) {
    return order.status === 'ordered';
  })


  if ($scope.ordersToBeShipped.length) {
    $scope.main = true;
  } else {
    $scope.main = false;
  }

  $scope.viewAll = function() {
    $scope.main = false;
    $scope.orders = $scope.allOrders;
  }

  $scope.viewOrdered = function() {
    $scope.main = false;
    $scope.orders = $scope.ordersToBeShipped;
  }


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

  $scope.shipAll = OrderFactory.shipAll;

  $scope.ship = OrderFactory.ship;
  $scope.shipUpdate = function(order) {
    order.status = 'shipped';
    $scope.ordersToBeShipped.splice($scope.ordersToBeShipped.indexOf(order), 1);
  }

  $scope.bulkUpdate = function() {
    $scope.ordersToBeShipped = $scope.ordersToBeShipped.map(function(order) {
      order.status = 'shipped';
      return order;
    })
    $scope.allOrders = $scope.allOrders.map(function(order) {
      if (order.status === 'ordered') {
        order.status = 'shipped';
      }
      return order;
    })
  }

  $scope.cancel = OrderFactory.cancel;
  $scope.cancelUpdate = function(order) {
    order.status = 'canceled';
    $scope.ordersToBeShipped.splice($scope.ordersToBeShipped.indexOf(order), 1);
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
