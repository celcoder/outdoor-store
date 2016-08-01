app.config(function ($stateProvider) {

  $stateProvider.state('checkout', {
    url: '/:id/checkout',
    templateUrl: '/js/checkout/checkout.html',
    controller: 'CheckoutCtrl',
    resolve: {
      user: function (UserFactory, $stateParams) {
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

 $scope.toggleShipping = function () {
  $scope.showShipping = !$scope.showShipping;
 }

 $scope.submitOrder = function (id) {

  $state.go('orderFulfilled');
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
    $scope.cart.subtotal = subtotal;
  }

});

