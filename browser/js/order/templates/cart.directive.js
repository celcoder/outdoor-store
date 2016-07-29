app.directive('order', function () {

  return {
    restrict: 'E',
    scope: {
      orderView: '='
    },
    templateUrl: 'js/order/templates/order.html'
  }

});


// this is not done; make it useable for carts and orders
