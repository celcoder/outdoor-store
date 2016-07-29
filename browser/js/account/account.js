app.config(function($stateProvider) {

  $stateProvider.state('account', {
    url: '/user/:id',
    templateUrl: '/js/account/account-info.html',
    controller: 'UserCtrl',
    resolve: {
      user: function(UserFactory, $stateParams) {
        return UserFactory.fetchById($stateParams.id)
      },
      orderHistory: function(OrderFactory, $stateParams) {
        return OrderFactory.getUserHistory($stateParams.id)
      },
      cart: function(OrderFactory, $stateParams) {
        return OrderFactory.getUserCart($stateParams.id)
      }
    },
    // The following data.authenticate is read by an event listener
    // that controls access to this state. Refer to app.js.
    data: {
      authenticate: true
    }
  });

});

app.controller('UserCtrl', function($scope, user, orderHistory, cart) {

  $scope.user = user;
  $scope.orderHistory = orderHistory;
  $scope.cart = cart;
  var prices = cart.products.map(function(product) {
    return parseFloat(product.price);
  })
  var quantities = cart.products.map(function(product) {
    return product.productOrder.quantity;
  })
  var subtotal = 0;
  for (var i = 0; i < cart.products.length; i++) {
    subtotal += prices[i] * quantities[i];
  }
  $scope.cart.subtotal = subtotal;

});
