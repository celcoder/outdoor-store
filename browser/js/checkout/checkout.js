app.config(function ($stateProvider) {

  $stateProvider.state('checkout', {
    url: 'user/:id/checkout',
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

app.controller('CheckoutCtrl', function ($scope, user, cart) {

 $scope.user = user;
 $scope.cart = [cart];

});

