app.directive('order', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/order/templates/order.html',
    scope: {
      orderView: '='
    }
  }

});


// this is not done; make it useable for carts and orders
