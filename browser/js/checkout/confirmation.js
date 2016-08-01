app.config(function ($stateProvider) {

  $stateProvider.state('confirmation', {
    url: '/:id/:orderId/confirmation',
    templateUrl: '/js/checkout/confirmation.html',
    controller: 'ConfirmationCtrl',
    resolve: {
      user: function (UserFactory, $stateParams) {
        return UserFactory.fetchById($stateParams.id)
      },
      order: function (OrderFactory, $stateParams) {
        return OrderFactory.fetchById($stateParams.id, $stateParams.orderId);
      }
    }
  });

});

app.controller('ConfirmationCtrl', function ($scope, user, order) {
  $scope.user = user;
  $scope.order = order;

  $scope.order.subtotal = 0;

  if (order.products.length){
    var prices = order.products.map(function(product){
      return parseFloat(product.price);
    })
    var quantities = order.products.map(function(product){
      return product.productOrder.quantity;
    })
    var subtotal = 0;
    for (var i = 0; i<order.products.length; i++){
        subtotal += prices[i] * quantities[i];
    }
    $scope.order.subtotal = subtotal;
  }

});
