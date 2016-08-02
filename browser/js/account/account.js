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
      },
      reviews: function(ReviewFactory,$stateParams){
            return ReviewFactory.fetchByUserId($stateParams.id)
                  .then(function (allReviews) {
                      return allReviews;
                  })
      }
    },
    // The following data.authenticate is read by an event listener
    // that controls access to this state. Refer to app.js.
    data: {
      authenticate: true
    }
  });

});

app.controller('UserCtrl', function($scope, user, orderHistory, cart, reviews, UserFactory) {
  $scope.user = user;
  $scope.details = {};

  $scope.details.showUserDetails = true;
  $scope.details.showContactInfo = false;
  $scope.details.showPaymentInfo = false;

  $scope.details.toggleUserView = function () {
    $scope.details.showUserDetails = !$scope.details.showUserDetails
  }

  $scope.details.toggleContactView = function () {
    $scope.details.showContactInfo = !$scope.details.showContactInfo
  }

  $scope.details.togglePaymentView = function () {
    $scope.details.showPaymentInfo = !$scope.details.showPaymentInfo
  }

  $scope.details.saveUserDetails = function () {
    $scope.details.showUserDetails = !$scope.details.showUserDetails;

    UserFactory.modifyUser($scope.user.id, $scope.user);

  }

  $scope.details.saveContact = function () {
    $scope.details.showContactInfo = !$scope.details.showContactInfo;

    UserFactory.modifyUser($scope.user.id, $scope.user);

  }

  $scope.details.savePayment = function () {
    $scope.details.showPaymentInfo = !$scope.details.showPaymentInfo;

    UserFactory.modifyUser($scope.user.id, $scope.user);

  }

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

  $scope.reviews = reviews;

});
