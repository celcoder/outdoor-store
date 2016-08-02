app.config(function ($stateProvider) {

  $stateProvider.state('checkout', {
    url: '/:id/checkout',
    templateUrl: '/js/checkout/checkout.html',
    controller: 'CheckoutCtrl',
    resolve: {
      user: function (UserFactory, $stateParams) {
        if (!$stateParams.id) return {};
        return UserFactory.fetchById($stateParams.id)
      },
      cart: function (OrderFactory, $stateParams) {
        return OrderFactory.getUserCart($stateParams.id);
      }
    }
  });

});

app.controller('CheckoutCtrl', function ($scope, user, cart, OrderFactory, $state) {

 $scope.user = user;
 $scope.cart = cart;
 $scope.showShipping = false;
 $scope.address;

 $scope.toggleShipping = function () {
  $scope.showShipping = !$scope.showShipping;

  if ($scope.showShipping === false) {
    $scope.address = {street_address: user.street_address, city: user.city, state: user.state, zip: user.zip, first_name: user.first_name, last_name: user.last_name, status: 'ordered'}
  } else {
    $scope.address = $scope.cart;
  }

 }

 $scope.submitOrder = function (userId, cartId, address) {

  if ($scope.showShipping === false) {
    address = {street_address: user.street_address, city: user.city, state: user.state, zip: user.zip, first_name: user.first_name, last_name: user.last_name, status: 'ordered'}
  }

  $scope.cart.status = "ordered";

  OrderFactory.purchase(userId, cartId, address)
    .then(function () {})
 }

 $scope.cart.subtotal = 0;

  // subtotal math
  if (cart.products.length){
    var prices = cart.products.map(function(product){
      return parseFloat(product.price);
    })
    var quantities = cart.products.map(function(product){
      return product.productOrder.quantity;
    })
    var subtotal = 0;
    for (var i = 0; i<cart.products.length; i++){
        subtotal += prices[i] * quantities[i];
    }
    $scope.cart.subtotal = subtotal.toFixed(2);
  }

});

