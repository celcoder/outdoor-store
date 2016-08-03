'use strict';

window.app = angular.module('FullstackGeneratedApp', ['fsaPreBuilt', 'ui.router', 'ui.bootstrap', 'ngAnimate', 'ngCookies']);

app.config(function ($urlRouterProvider, $locationProvider) {
  // This turns off hashbang urls (/#about) and changes it to something normal (/about)
  $locationProvider.html5Mode(true);
  // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
  $urlRouterProvider.otherwise('/');
  // Trigger page refresh when accessing an OAuth route
  $urlRouterProvider.when('/auth/:provider', function () {
    window.location.reload();
  });
});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, AuthService, $state, $cookies) {

  //Initialize cart cookie for non-auth users if there isn't already one:
  if (!$cookies.getObject("cart")) $cookies.putObject('cart', { status: "cart", products: [], subtotal: 0 });

  // The given state requires an authenticated user.
  var destinationStateRequiresAuth = function destinationStateRequiresAuth(state) {
    return state.data && state.data.authenticate;
  };

  $rootScope.video = true;

  // $stateChangeStart is an event fired
  // whenever the process of changing a state begins.
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {

    if (!destinationStateRequiresAuth(toState)) {
      // The destination state does not require authentication
      // Short circuit with return.
      return;
    }

    if (AuthService.isAuthenticated()) {
      // The user is authenticated.
      // Short circuit with return.
      return;
    }

    // Cancel navigating to new state.
    event.preventDefault();

    AuthService.getLoggedInUser().then(function (user) {
      // If a user is retrieved, then renavigate to the destination
      // (the second time, AuthService.isAuthenticated() will work)
      // otherwise, if no user is logged in, go to "login" state.
      if (user) {
        $state.go(toState.name, toParams);
      } else {
        $state.go('login');
      }
    });
  });
});

app.config(function ($stateProvider) {

  // Register our *about* state.
  $stateProvider.state('about', {
    url: '/about',
    // controller: 'AboutController',
    templateUrl: 'js/about/about.html'
  });
});

// app.controller('AboutController', function ($scope, FullstackPics) {

//     // Images of beautiful Fullstack people.
//     $scope.images = _.shuffle(FullstackPics);

// });
app.config(function ($stateProvider) {

  $stateProvider.state('account', {
    url: '/user/:id',
    templateUrl: '/js/account/account-info.html',
    controller: 'UserCtrl',
    resolve: {
      user: function user(UserFactory, $stateParams) {
        return UserFactory.fetchById($stateParams.id);
      },
      orderHistory: function orderHistory(OrderFactory, $stateParams) {
        return OrderFactory.getUserHistory($stateParams.id);
      },
      cart: function cart(OrderFactory, $stateParams) {
        return OrderFactory.getUserCart($stateParams.id);
      },
      reviews: function reviews(ReviewFactory, $stateParams) {
        return ReviewFactory.fetchByUserId($stateParams.id).then(function (allReviews) {
          return allReviews;
        });
      }
    },
    // The following data.authenticate is read by an event listener
    // that controls access to this state. Refer to app.js.
    data: {
      authenticate: true
    }
  });
});

app.controller('UserCtrl', function ($scope, user, orderHistory, cart, reviews, UserFactory, $rootScope) {
  $scope.user = user;
  $scope.details = {};
  $rootScope.video = false;
  $scope.details.showUserDetails = false;
  $scope.details.showContactInfo = false;
  $scope.details.showPaymentInfo = false;

  $scope.details.toggleUserView = function () {
    $scope.details.showUserDetails = !$scope.details.showUserDetails;
  };

  $scope.details.toggleContactView = function () {
    $scope.details.showContactInfo = !$scope.details.showContactInfo;
  };

  $scope.details.togglePaymentView = function () {
    $scope.details.showPaymentInfo = !$scope.details.showPaymentInfo;
  };

  $scope.details.saveUserDetails = function () {
    $scope.details.showUserDetails = !$scope.details.showUserDetails;

    UserFactory.modifyUser($scope.user.id, $scope.user);
  };

  $scope.details.saveContact = function () {
    $scope.details.showContactInfo = !$scope.details.showContactInfo;

    UserFactory.modifyUser($scope.user.id, $scope.user);
  };

  $scope.details.savePayment = function () {
    $scope.details.showPaymentInfo = !$scope.details.showPaymentInfo;

    UserFactory.modifyUser($scope.user.id, $scope.user);
  };

  $scope.orderHistory = orderHistory;
  $scope.cart = cart;
  var prices = cart.products.map(function (product) {
    return parseFloat(product.price);
  });
  var quantities = cart.products.map(function (product) {
    return product.productOrder.quantity;
  });
  var subtotal = 0;
  for (var i = 0; i < cart.products.length; i++) {
    subtotal += prices[i] * quantities[i];
  }
  $scope.cart.subtotal = subtotal;

  $scope.reviews = reviews;
});

app.directive('updateInfo', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/account/update-info.html',
    scope: {
      userView: '=',
      detailsView: '='
    }
  };
});

app.config(function ($stateProvider) {
  $stateProvider.state('browse', {
    url: '/browse',
    templateUrl: 'js/browse-products/browse-products.html',
    controller: 'ProductsCtrl',
    resolve: {
      products: function products(ProductFactory) {
        return ProductFactory.fetchAll();
      }
    }
  });
});

app.config(function ($stateProvider) {
  $stateProvider.state('mens', {
    url: '/browse/mens',
    templateUrl: 'js/browse-products/mens-products.html',
    controller: 'ProductsCtrl',
    resolve: {
      products: function products(ProductFactory) {
        return ProductFactory.fetchAll().then(function (allProducts) {
          return allProducts.filter(function (product) {
            return product.name.split(' ').indexOf("Men's") !== -1;
          });
        });
      }
    }
  });
});

app.config(function ($stateProvider) {
  $stateProvider.state('womens', {
    url: '/browse/womens',
    templateUrl: 'js/browse-products/womens-products.html',
    controller: 'ProductsCtrl',
    resolve: {
      products: function products(ProductFactory) {
        return ProductFactory.fetchAll().then(function (allProducts) {
          return allProducts.filter(function (product) {
            return product.name.split(' ').indexOf("Women's") !== -1;
          });
        });
      }
    }
  });
});

app.config(function ($stateProvider) {
  $stateProvider.state('gear', {
    url: '/browse/gear',
    templateUrl: 'js/browse-products/gear-products.html',
    controller: 'ProductsCtrl',
    resolve: {
      products: function products(ProductFactory) {
        return ProductFactory.fetchAll().then(function (allProducts) {
          return allProducts.filter(function (product) {
            return product.name.split(' ').indexOf("Men's") === -1 && product.name.split(' ').indexOf("Women's") === -1;
          });
        });
      }
    }
  });
});

app.controller('ProductsCtrl', function ($scope, products, OrderFactory, Session, $state, $rootScope) {
  $rootScope.video = false;
  $scope.products = products;
  //$scope.men = "Men's";

  $scope.addOneToCart = function (product) {
    OrderFactory.updateCart(product, 1);
  };
});
app.config(function ($stateProvider) {
  $stateProvider.state('admin-orders', {
    url: '/admin/orders/',
    templateUrl: 'js/admin/admin-orders.html',
    controller: 'AdminOrdersCtrl',
    resolve: {
      orders: function orders(OrderFactory) {
        return OrderFactory.fetchAll();
      }
    }
  });
});

app.controller('AdminOrdersCtrl', function ($scope, orders, $filter, OrderFactory) {

  $scope.allOrders = orders.filter(function (order) {
    return order.status !== 'cart';
  });

  $scope.orders = $scope.allOrders;

  $scope.ordersToBeShipped = $scope.allOrders.filter(function (order) {
    return order.status === 'ordered';
  });

  if ($scope.ordersToBeShipped.length) {
    $scope.main = true;
  } else {
    $scope.main = false;
  }

  $scope.viewAll = function () {
    $scope.main = false;
    $scope.orders = $scope.allOrders;
  };

  $scope.viewOrdered = function () {
    $scope.main = false;
    $scope.orders = $scope.ordersToBeShipped;
  };

  var upDown = 'id';
  var status = 'status';
  var date = "createdAt";

  $scope.orderNumberFilter = function () {
    if (upDown === 'id') {
      upDown = "-id";
      $scope.orders = $filter('orderBy')($scope.orders, upDown);
    } else {
      upDown = 'id';
      $scope.orders = $filter('orderBy')($scope.orders, upDown);
    }
  };

  $scope.shipAll = OrderFactory.shipAll;

  $scope.ship = OrderFactory.ship;
  $scope.shipUpdate = function (order) {
    order.status = 'shipped';
  };

  $scope.bulkUpdate = function () {
    $scope.ordersToBeShipped = $scope.ordersToBeShipped.map(function (order) {
      order.status = 'shipped';
      return order;
    });
    $scope.allOrders = $scope.allOrders.map(function (order) {
      if (order.status === 'ordered') {
        order.status = 'shipped';
      }
      return order;
    });
  };

  $scope.cancel = OrderFactory.cancel;
  $scope.cancelUpdate = function (order) {
    order.status = 'canceled';
  };

  $scope.orderDate = function () {
    if (date === "createdAt") {
      date = '-createdAt';
      $scope.orders = $filter('orderBy')($scope.orders, date);
    } else {
      date = 'createdAt';
      $scope.orders = $filter('orderBy')($scope.orders, date);
    }
  };

  $scope.filterStatus = function () {
    if (status === "status") {
      status = '-status';
      $scope.orders = $filter('orderBy')($scope.orders, status);
    } else {
      status = 'status';
      $scope.orders = $filter('orderBy')($scope.orders, status);
    }
  };
});

app.config(function ($stateProvider) {
  $stateProvider.state('admin-products', {
    url: '/admin/products',
    templateUrl: 'js/admin/admin-products.html',
    controller: 'AdminProductsCtrl',
    resolve: {
      getAllProducts: function getAllProducts(ProductFactory) {
        return ProductFactory.fetchAll();
      }
    }
  });
});

app.controller('AdminProductsCtrl', function ($scope, getAllProducts, $filter) {
  $scope.allProducts = getAllProducts;

  $scope.outOfStock = $scope.allProducts.filter(function (product) {
    return product.status === 'out of stock';
  });

  $scope.products = $scope.allProducts;

  if ($scope.outOfStock.length) {
    $scope.main = true;
  } else {
    $scope.main = false;
  }

  $scope.viewAll = function () {
    $scope.main = false;
    $scope.products = $scope.allProducts;
  };

  $scope.viewOutOfStock = function () {
    $scope.main = false;
    $scope.products = $scope.outOfStock;
  };

  var name = "name";
  var status = "status";
  var quantity = "stock";

  $scope.filterByName = function () {
    if (name === 'name') {
      name = '-name';
      $scope.products = $filter('orderBy')($scope.products, name);
    } else {
      name = 'name';
      $scope.products = $filter('orderBy')($scope.products, name);
    }
  };

  $scope.filterByStatus = function () {
    if (status === 'status') {
      status = '-status';
      $scope.products = $filter('orderBy')($scope.products, status);
    } else {
      status = 'status';
      $scope.products = $filter('orderBy')($scope.products, status);
    }
  };

  $scope.filterByQuantity = function () {
    if (quantity === 'stock') {
      quantity = '-stock';
      $scope.products = $filter('orderBy')($scope.products, quantity);
    } else {
      quantity = 'stock';
      $scope.products = $filter('orderBy')($scope.products, quantity);
    }
  };
});
app.config(function ($stateProvider) {
  $stateProvider.state('admin-update', {
    url: '/admin/orders/:id',
    templateUrl: 'js/admin/admin-single-order.html',
    controller: 'AdminUpdateCtrl',
    resolve: {
      order: function order(OrderFactory) {
        return OrderFactory.fetchAll();
      }
    }
  });
});

app.controller('AdminUpdateCtrl', function ($scope, orders) {
  $scope.orders = orders.filter(function (order) {
    return order.status !== 'cart';
  });
});
app.config(function ($stateProvider) {
  $stateProvider.state('adminUsers', {
    url: '/admin/users',
    templateUrl: 'js/admin/admin-users.html',
    controller: 'AdminUsersCtrl',
    resolve: {
      getAllUsers: function getAllUsers(UserFactory) {
        return UserFactory.fetchAll();
      }
    }
  });
});

app.controller('AdminUsersCtrl', function ($scope, getAllUsers, $filter) {
  $scope.users = getAllUsers;

  var userId = 'id';
  var lastName = 'last_name';
  var email = 'email';

  $scope.filterByUserId = function () {
    if (userId === 'id') {
      userId = '-id';
      $scope.users = $filter('orderBy')($scope.users, userId);
    } else {
      userId = 'id';
      $scope.users = $filter('orderBy')($scope.users, userId);
    }
  };

  $scope.filterByEmail = function () {
    if (email === 'email') {
      email = "-email";
      $scope.users = $filter('orderBy')($scope.users, email);
    } else {
      email = 'email';
      $scope.users = $filter('orderBy')($scope.users, email);
    }
  };

  $scope.filterByLastName = function () {
    if (lastName === 'last_name') {
      lastName = "-last_name";
      $scope.users = $filter('orderBy')($scope.users, lastName);
    } else {
      lastName = 'last_name';
      $scope.users = $filter('orderBy')($scope.users, lastName);
    }
  };
});
app.config(function ($stateProvider) {

  $stateProvider.state('checkout', {
    url: '/:id/checkout',
    templateUrl: '/js/checkout/checkout.html',
    controller: 'CheckoutCtrl',
    resolve: {
      user: function user(UserFactory, $stateParams) {
        if (!$stateParams.id) return {};
        return UserFactory.fetchById($stateParams.id);
      },
      cart: function cart(OrderFactory, $stateParams) {
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
      $scope.address = { street_address: user.street_address, city: user.city, state: user.state, zip: user.zip, first_name: user.first_name, last_name: user.last_name, status: 'ordered', email: user.email };
    } else {
      $scope.address = $scope.cart;
    }
  };

  $scope.submitOrder = function (userId, cartId, address) {

    if ($scope.showShipping === false) {
      address = { street_address: user.street_address, city: user.city, state: user.state, zip: user.zip, first_name: user.first_name, last_name: user.last_name, status: 'ordered', email: user.email };
    }

    $scope.cart.status = "ordered";
    $scope.cart.email = $scope.user.email;

    OrderFactory.purchase(userId, cartId, address).then(function () {});
  };

  $scope.cart.subtotal = 0;

  // subtotal math
  if (cart.products.length) {
    var prices = cart.products.map(function (product) {
      return parseFloat(product.price);
    });
    var quantities = cart.products.map(function (product) {
      return product.productOrder.quantity;
    });
    var subtotal = 0;
    for (var i = 0; i < cart.products.length; i++) {
      subtotal += prices[i] * quantities[i];
    }
    $scope.cart.subtotal = subtotal.toFixed(2);
  }
});

app.config(function ($stateProvider) {

  $stateProvider.state('confirmation', {
    url: '/:id/:orderId/confirmation',
    templateUrl: '/js/checkout/confirmation.html',
    controller: 'ConfirmationCtrl',
    resolve: {
      user: function user(UserFactory, $stateParams) {
        return UserFactory.fetchById($stateParams.id);
      },
      order: function order(OrderFactory, $stateParams) {
        return OrderFactory.fetchById($stateParams.id, $stateParams.orderId);
      }
    }
  });
});

app.controller('ConfirmationCtrl', function ($scope, user, order) {
  $scope.user = user;
  $scope.order = order;

  $scope.order.subtotal = 0;

  if (order.products.length) {
    var prices = order.products.map(function (product) {
      return parseFloat(product.price);
    });
    var quantities = order.products.map(function (product) {
      return product.productOrder.quantity;
    });
    var subtotal = 0;
    for (var i = 0; i < order.products.length; i++) {
      subtotal += prices[i] * quantities[i];
    }
    $scope.order.subtotal = subtotal;
  }
});

app.factory('HomePagePics', function () {
  return ["https://www.rei.com/assets/drsp/2016/q3/homepage/07-26/lead-brooks-md-lg/live.jpg", "https://www.rei.com/assets/drsp/2016/q3/homepage/07-26/paddling/live.jpg", "https://images.thenorthface.com/is/image/TheNorthFaceBrand/051116-activity-hero-climbing-d?$SCALE-ORIGINAL$", "http://www.ems.com/on/demandware.static/-/Sites-EMS-Library/default/dw16d55e4f/images/promotions/homepage/2016/07/24/20160724_hm_box4.jpg"];
});

app.config(function ($stateProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: 'js/home/home.html',
    controller: 'HomeCarousel',
    resolve: {
      randomProducts: function randomProducts(ProductFactory) {
        return ProductFactory.fetchAll();
      }
    }
  });
});

app.controller('HomeCarousel', function ($scope, HomePagePics, randomProducts, $rootScope) {
  $scope.images = _.shuffle(HomePagePics);
  $rootScope.title = true;
  $scope.randomProducts = _.sample(randomProducts, 4);
});

(function () {

  'use strict';

  // Hope you didn't forget Angular! Duh-doy.

  if (!window.angular) throw new Error('I can\'t find Angular!');

  var app = angular.module('fsaPreBuilt', []);

  app.factory('Socket', function () {
    if (!window.io) throw new Error('socket.io not found!');
    return window.io(window.location.origin);
  });

  // AUTH_EVENTS is used throughout our app to
  // broadcast and listen from and to the $rootScope
  // for important events about authentication flow.
  app.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  });

  app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    var statusDict = {
      401: AUTH_EVENTS.notAuthenticated,
      403: AUTH_EVENTS.notAuthorized,
      419: AUTH_EVENTS.sessionTimeout,
      440: AUTH_EVENTS.sessionTimeout
    };
    return {
      responseError: function responseError(response) {
        $rootScope.$broadcast(statusDict[response.status], response);
        return $q.reject(response);
      }
    };
  });

  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$injector', function ($injector) {
      return $injector.get('AuthInterceptor');
    }]);
  });

  app.service('AuthService', function ($http, Session, $rootScope, AUTH_EVENTS, $q) {

    function onSuccessfulLogin(response) {
      var data = response.data;
      Session.create(data.id, data.user);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      return data.user;
    }

    // Uses the session factory to see if an
    // authenticated user is currently registered.
    this.isAuthenticated = function () {
      return !!Session.user;
    };

    this.getLoggedInUser = function (fromServer) {

      // If an authenticated session exists, we
      // return the user attached to that session
      // with a promise. This ensures that we can
      // always interface with this method asynchronously.

      // Optionally, if true is given as the fromServer parameter,
      // then this cached value will not be used.

      if (this.isAuthenticated() && fromServer !== true) {
        return $q.when(Session.user);
      }

      // Make request GET /session.
      // If it returns a user, call onSuccessfulLogin with the response.
      // If it returns a 401 response, we catch it and instead resolve to null.
      return $http.get('/session').then(onSuccessfulLogin).catch(function () {
        return null;
      });
    };

    this.login = function (credentials) {
      return $http.post('/login', credentials).then(onSuccessfulLogin).catch(function () {
        return $q.reject({ message: 'Invalid login credentials.' });
      });
    };

    this.signup = function (credentials) {
      return $http.post('/signup', credentials).then(onSuccessfulLogin).catch(function () {
        return $q.reject({ message: 'Invalid login credentials.' });
      });
    };

    this.logout = function () {
      return $http.get('/logout').then(function () {
        Session.destroy();
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
      });
    };
  });

  app.service('Session', function ($rootScope, AUTH_EVENTS) {

    var self = this;

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
      self.destroy();
    });

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
      self.destroy();
    });

    this.id = null;
    this.user = null;

    this.create = function (sessionId, user) {
      this.id = sessionId;
      this.user = user;
    };

    this.destroy = function () {
      this.id = null;
      this.user = null;
    };
  });
})();

app.config(function ($stateProvider) {

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'js/login/login.html',
    controller: 'LoginCtrl'
  });
});

app.controller('LoginCtrl', function ($scope, AuthService, $state) {

  $scope.login = {};
  $scope.error = null;

  $scope.sendLogin = function (loginInfo) {

    $scope.error = null;

    AuthService.login(loginInfo).then(function () {
      $state.go('home');
    }).catch(function () {
      $scope.error = 'Invalid login credentials.';
    });
  };

  $scope.sendSignup = function (loginInfo) {

    $scope.error = null;

    AuthService.signup(loginInfo).then(function () {
      $state.go('home');
    }).catch(function () {
      $scope.error = 'Invalid signup credentials.';
    });
  };
});
app.config(function ($stateProvider) {
  $stateProvider.state('cart', {
    url: '/cart/',
    templateUrl: 'js/order/templates/cartpage.html',
    controller: 'CartCtrl'
  });
});

app.controller('CartCtrl', function ($scope, OrderFactory, Session, AuthService) {
  // $scope.cart = cart;
  $scope.user = Session.user;

  // subtotal math
  var calcSubtotal = function calcSubtotal() {
    if ($scope.cart.products.length) {
      var prices = $scope.cart.products.map(function (product) {
        return parseFloat(product.price);
      });
      var quantities = $scope.cart.products.map(function (product) {
        return product.productOrder.quantity;
      });
      var subtotal = 0;
      for (var i = 0; i < $scope.cart.products.length; i++) {
        subtotal += prices[i] * quantities[i];
      }
      $scope.cart.subtotal = subtotal.toFixed(2);
    }
  };

  //Force getting user before trying to get the cart
  AuthService.getLoggedInUser().then(function () {
    OrderFactory.getUserCart().then(function (res) {
      $scope.cart = res;
      calcSubtotal();
      console.log("USER CART:", res);
    });
  });

  $scope.updateCart = function (product, quantity) {
    OrderFactory.updateCart(product, quantity).then(function (updatedCart) {
      $scope.cart = updatedCart;
      calcSubtotal();
    });
  };
});

app.factory('OrderFactory', function ($http, Session, AuthService, $q, $cookies, $state) {

  var OrderFactory = {};

  // We have a check to see if the user is
  // authenticated, but do we have a check to make
  // sure that the authenticated user is the same
  // as the user whose cart they are querying?

  OrderFactory.getUserCart = function () {

    //deals with Auth users
    if (AuthService.isAuthenticated()) {
      return $http.get('/api/orders/' + Session.user.id + '/cart').then(function (orders) {
        return orders.data;
      });
    }
    //NON-AUTH USERS
    return $q.when($cookies.getObject("cart"));
  };

  OrderFactory.getAllUserOrders = function (userId) {
    if (AuthService.isAuthenticated()) {
      return $http.get('/api/orders/' + userId + '/all').then(function (orders) {
        return orders.data;
      });
    }
  };

  OrderFactory.getUserHistory = function (userId) {
    if (AuthService.isAuthenticated()) {
      return $http.get('/api/orders/' + userId + '/orderhistory').then(function (orders) {
        return orders.data;
      });
    }
  };

  OrderFactory.purchase = function (userId, orderId, address) {
    console.log(AuthService.isAuthenticated());
    if (AuthService.isAuthenticated()) {
      return $http.put('/api/orders/' + userId + "/" + orderId + '/purchase', address).then(function () {
        $state.go('confirmation', { id: userId, orderId: orderId });
        return;
      });
    } else {
      console.log("ADDRESS::", address);
      return $http.put('/api/orders/guest/purchase', address).then(function () {
        $state.go('home');
        $cookies.putObject('cart', { status: "cart", products: [], subtotal: 0 });
      });
    }
  };

  OrderFactory.fetchById = function (userId, orderId) {
    return $http.get('/api/orders/' + userId + "/" + orderId).then(function (order) {
      return order.data;
    });
  };

  OrderFactory.updateCart = function (product, quantityChange) {
    if (AuthService.isAuthenticated()) {
      return $http.put("/api/orders/" + Session.user.id + "/updateCart", { productId: product.id, quantityChange: quantityChange }).then(function (cart) {
        $state.go('cart');
        return cart.data;
      });
    }
    //For non-auth people
    else {
        //Get cart from cookie
        var cart = $cookies.getObject("cart");

        //find cart Idx of product (Can't use indexOf because quantity on products.productOrder.quantity could differ)
        var cartIdx = -1;
        for (var i = 0; i < cart.products.length; i++) {
          if (cart.products[i].id === product.id) {
            cartIdx = i;
            break;
          }
        }
        //if incrementing product num
        if (quantityChange > 0) {
          if (cartIdx === -1) {
            //add to cart if not in there BUT ONLY if the product stock exceeds the number you're trying to add
            if (product.stock >= quantityChange) {
              product.productOrder = { quantity: quantityChange };
              cart.products.push(product);
              $state.go('cart');
            }
          } else {
            //otherwise just increment the quantity BUT ONLY if the stock exceeds the current cart quantity+change
            if (product.stock >= cart.products[cartIdx].productOrder.quantity + quantityChange) {
              cart.products[cartIdx].productOrder.quantity += quantityChange;
              $state.go('cart');
            }
          }
          //Update cookie
          $cookies.putObject("cart", cart);
          //return as promise
          return $q.when(cart);
          //else if decreasing product num
        } else {
          //if to zero, remove it altogether
          if (quantityChange + cart.products[cartIdx].productOrder.quantity <= 0) {
            cart.products.splice(cartIdx, 1);
          } else {
            //otherwise just decrease the quantity (change is neg number)
            cart.products[cartIdx].productOrder.quantity += quantityChange;
          }
          //Update cookie
          $cookies.putObject("cart", cart);
          //return as promise
          return $q.when(cart);
        }
      }
  };

  OrderFactory.ship = function (orderId) {
    return $http.put('/api/orders/' + orderId + '/status', { status: 'shipped' }).then(function (shippedOrder) {
      return shippedOrder.data;
    });
  };

  OrderFactory.shipAll = function () {
    return $http.put('/api/orders/shipall', { status: 'shipped' }).then(function (shippedOrders) {
      return shippedOrders.data;
    });
  };

  OrderFactory.cancel = function (orderId) {
    return $http.put('/api/orders/' + orderId + '/status', { status: 'canceled' }).then(function (canceledOrder) {
      return canceledOrder.data;
    });
  };

  OrderFactory.fetchAll = function () {
    return $http.get('/api/orders/').then(function (allOrders) {
      return allOrders.data;
    });
  };

  return OrderFactory;
});

app.factory('ReviewFactory', function ($http, Session) {

  var reviewFactory = {};

  reviewFactory.fetchByProductId = function (id) {
    return $http.get('/api/products/' + id + '/reviews').then(function (reviews) {
      console.log("reviews:", reviews);
      return reviews.data;
    });
  };

  reviewFactory.fetchByUserId = function (id) {
    return $http.get('/api/user/' + id + '/reviews').then(function (reviews) {
      return reviews.data;
    });
  };

  reviewFactory.postReview = function (productId, data) {
    data.productId = productId;
    if (Session.user) data.userId = Session.user.id;
    return $http.post('/api/products/' + productId + '/review/submit', data).then(function (newReview) {
      return newReview.data;
    });
  };

  return reviewFactory;
});
app.directive('starRating', function () {
  return {
    restrict: 'EA',
    template: '<ul class="star-rating">' + '<li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' + '    <i class="glyphicon glyphicon-star"></i>' + // or &#9733
    '  </li>' + '</ul>',
    scope: {
      ratingValue: '=ngModel',
      readonly: '=?'
    },
    link: function link(scope, element, attributes) {
      function updateStars() {
        scope.stars = [];
        for (var i = 0; i < 5; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue
          });
        }
      };

      updateStars();

      scope.toggle = function (index) {
        if (scope.readonly == undefined || scope.readonly === false) {
          scope.ratingValue = index + 1;
        }
      };
      scope.$watch('ratingValue', function (oldValue, newValue) {
        if (newValue) {
          updateStars();
        }
      });
    }
  };
});

app.factory('ProductFactory', function ($http) {
  var productFactory = {};

  productFactory.fetchAll = function () {
    return $http.get('/api/products/').then(function (products) {
      return products.data;
    });
  };

  productFactory.fetchById = function (id) {
    return $http.get('/api/products/' + id).then(function (product) {
      return product.data;
    });
  };

  productFactory.updateStock = function (id, stock) {
    var status = stock ? 'available' : 'out of stock';
    return $http.put('/api/products/' + id, { stock: stock, status: status }).then(function (updatedProduct) {
      return updatedProduct.data;
    });
  };

  productFactory.addProduct = function (newProduct) {
    return $http.post('/api/products/', newProduct).then(function (createdProduct) {
      return createdProduct.data;
    });
  };

  productFactory.discontinue = function (id) {
    return $http.put('/api/products/' + id, { status: 'discontinued' }).then(function (updatedProduct) {
      return updatedProduct.data;
    });
  };

  return productFactory;
});
app.config(function ($stateProvider) {

  $stateProvider.state('product', {
    url: '/product/:id',
    templateUrl: 'js/products/single.product.html',
    resolve: {
      reviews: function reviews(ReviewFactory, $stateParams) {
        return ReviewFactory.fetchByProductId($stateParams.id).then(function (allReviews) {
          return allReviews;
        });
      }
    },
    controller: 'ProductCtrl'
  });
});

app.controller('ProductCtrl', function ($scope, $state, $stateParams, ProductFactory, $log, OrderFactory, reviews, ReviewFactory, Session) {

  var averageRating = reviews.map(function (r) {
    return r.rating;
  }).reduce(function (a, b) {
    return a + b;
  }) / reviews.length;
  $scope.ratingValue = averageRating;

  $scope.reviews = reviews;

  $scope.newReview = { rating: 5, text: "" };

  $scope.submitReview = function () {
    if ($scope.newReview.text === "") return;
    ReviewFactory.postReview($scope.product.id, $scope.newReview).then(function (newReview) {
      newReview.user = Session.user;
      $scope.reviews.push(newReview);
      $scope.leaveReview = false;
      $scope.newReview = { rating: 5, text: "" };
    });
  };

  $scope.quantity = 1;

  ProductFactory.fetchById($stateParams.id).then(function (product) {
    $scope.product = product;
  }).catch($log);

  $scope.up = function () {
    if ($scope.quantity >= $scope.product.stock) return;
    $scope.quantity++;
  };

  $scope.down = function () {
    if ($scope.quantity > 1) $scope.quantity--;
  };

  $scope.addToCart = function () {
    OrderFactory.updateCart($scope.product, $scope.quantity);
  };

  // ReviewFactory.fetchByProductId($stateParams.id)
  // .then(function (allReviews) {
  //     $scope.reviews = allReviews;
  //     var averageRating = (allReviews.map(function(r){return r.rating}).reduce(function(a,b){return a+b}))/allReviews.length;
  //     $scope.ratingValue = averageRating; 
  // })
});

app.factory('UserFactory', function ($http) {

  function getData(res) {
    return res.data;
  }

  var User = {};

  User.fetchAll = function () {
    return $http.get('/api/user').then(getData);
  };

  User.fetchById = function (id) {
    return $http.get('/api/user/' + id).then(getData);
  };

  User.deleteUser = function (id) {
    return $http.delete('/api/user/' + id);
  };

  User.createUser = function (data) {
    return $http.post('/api/user/', data).then(getData);
  };

  User.modifyUser = function (id, data) {
    return $http.put('/api/user/' + id, data).then(getData);
  };

  return User;
});

app.directive('address', function () {
  return {
    restrict: 'E',
    scope: {
      addressView: '='
    },
    templateUrl: 'js/checkout/templates/addressform.html'
  };
});

app.factory('FullstackPics', function () {
  return ['https://pbs.twimg.com/media/B7gBXulCAAAXQcE.jpg:large', 'https://fbcdn-sphotos-c-a.akamaihd.net/hphotos-ak-xap1/t31.0-8/10862451_10205622990359241_8027168843312841137_o.jpg', 'https://pbs.twimg.com/media/B-LKUshIgAEy9SK.jpg', 'https://pbs.twimg.com/media/B79-X7oCMAAkw7y.jpg', 'https://pbs.twimg.com/media/B-Uj9COIIAIFAh0.jpg:large', 'https://pbs.twimg.com/media/B6yIyFiCEAAql12.jpg:large', 'https://pbs.twimg.com/media/CE-T75lWAAAmqqJ.jpg:large', 'https://pbs.twimg.com/media/CEvZAg-VAAAk932.jpg:large', 'https://pbs.twimg.com/media/CEgNMeOXIAIfDhK.jpg:large', 'https://pbs.twimg.com/media/CEQyIDNWgAAu60B.jpg:large', 'https://pbs.twimg.com/media/CCF3T5QW8AE2lGJ.jpg:large', 'https://pbs.twimg.com/media/CAeVw5SWoAAALsj.jpg:large', 'https://pbs.twimg.com/media/CAaJIP7UkAAlIGs.jpg:large', 'https://pbs.twimg.com/media/CAQOw9lWEAAY9Fl.jpg:large', 'https://pbs.twimg.com/media/B-OQbVrCMAANwIM.jpg:large', 'https://pbs.twimg.com/media/B9b_erwCYAAwRcJ.png:large', 'https://pbs.twimg.com/media/B5PTdvnCcAEAl4x.jpg:large', 'https://pbs.twimg.com/media/B4qwC0iCYAAlPGh.jpg:large', 'https://pbs.twimg.com/media/B2b33vRIUAA9o1D.jpg:large', 'https://pbs.twimg.com/media/BwpIwr1IUAAvO2_.jpg:large', 'https://pbs.twimg.com/media/BsSseANCYAEOhLw.jpg:large', 'https://pbs.twimg.com/media/CJ4vLfuUwAAda4L.jpg:large', 'https://pbs.twimg.com/media/CI7wzjEVEAAOPpS.jpg:large', 'https://pbs.twimg.com/media/CIdHvT2UsAAnnHV.jpg:large', 'https://pbs.twimg.com/media/CGCiP_YWYAAo75V.jpg:large', 'https://pbs.twimg.com/media/CIS4JPIWIAI37qu.jpg:large'];
});

app.factory('RandomGreetings', function () {

  var getRandomFromArray = function getRandomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  var greetings = ['Hello, world!', 'At long last, I live!', 'Hello, simple human.', 'What a beautiful day!', 'I\'m like any other project, except that I am yours. :)', 'This empty string is for Lindsay Levine.', 'こんにちは、ユーザー様。', 'Welcome. To. WEBSITE.', ':D', 'Yes, I think we\'ve met before.', 'Gimme 3 mins... I just grabbed this really dope frittata', 'If Cooper could offer only one piece of advice, it would be to nevSQUIRREL!'];

  return {
    greetings: greetings,
    getRandomGreeting: function getRandomGreeting() {
      return getRandomFromArray(greetings);
    }
  };
});

app.directive('cart', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/order/templates/cart.html'
  };
});

app.directive('orderHistory', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/order/templates/order-history.html'
  };
});

app.directive('fullstackLogo', function () {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/logo/logo.html'
  };
});

app.directive('fullstackLogoTwo', function () {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/logo/logo.html'
  };
});
app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function link(scope) {

      scope.items = [
      // { label: 'Home', state: 'home' },
      { label: 'About', state: 'about' }
      // { label: 'Account Information', state: 'membersOnly', auth: true }
      ];

      scope.account = { label: 'Account Information', state: 'account', auth: true };

      scope.user = null;
      scope.title = true;

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      scope.logout = function () {
        AuthService.logout().then(function () {
          $state.go('home');
        });
      };

      var setUser = function setUser() {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;
        });
      };

      var removeUser = function removeUser() {
        scope.user = null;
      };

      scope.leaveHome = function () {
        scope.title = false;
      };
      scope.comeHome = function () {
        scope.title = true;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
    }

  };
});

app.directive('searchbar', function ($state, ProductFactory) {

  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/searchbar.html',
    link: function link(scope, element, attrs) {
      scope.getProducts = function () {
        return ProductFactory.fetchAll();
      };
    }

  };
});

app.directive('randoGreeting', function (RandomGreetings) {

  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/rando-greeting/rando-greeting.html',
    link: function link(scope) {
      scope.greeting = RandomGreetings.getRandomGreeting();
    }
  };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiYWNjb3VudC91cGRhdGUtaW5mby5qcyIsImJyb3dzZS1wcm9kdWN0cy9icm93c2UtcHJvZHVjdHMuanMiLCJhZG1pbi9hZG1pbi5vcmRlcnMuanMiLCJhZG1pbi9hZG1pbi5wcm9kdWN0cy5qcyIsImFkbWluL2FkbWluLnVwZGF0ZS5qcyIsImFkbWluL2FkbWluLnVzZXIuanMiLCJjaGVja291dC9jaGVja291dC5qcyIsImNoZWNrb3V0L2NvbmZpcm1hdGlvbi5qcyIsImhvbWUvSG9tZXBhZ2VQaWNzLmpzIiwiaG9tZS9ob21lLmpzIiwiZnNhL2ZzYS1wcmUtYnVpbHQuanMiLCJsb2dpbi9sb2dpbi5qcyIsIm9yZGVyL2NhcnQuanMiLCJvcmRlci9vcmRlci1mYWN0b3J5LmpzIiwicmV2aWV3cy9yZXZpZXcuZmFjdG9yeS5qcyIsInJldmlld3MvcmV2aWV3cy5qcyIsInByb2R1Y3RzL3Byb2R1Y3QuZmFjdG9yeS5qcyIsInByb2R1Y3RzL3NpbmdsZS5wcm9kdWN0LnN0YXRlLmpzIiwidXNlci1kZXRhaWxzL3VzZXIuanMiLCJjaGVja291dC90ZW1wbGF0ZXMvYWRkcmVzc2Zvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9GdWxsc3RhY2tQaWNzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJvcmRlci90ZW1wbGF0ZXMvY2FydC5kaXJlY3RpdmUuanMiLCJvcmRlci90ZW1wbGF0ZXMvb3JkZXItaGlzdG9yeS1kaXJlY3RpdmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9sb2dvL2xvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL3NlYXJjaGJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmpzIl0s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OztBQWdDQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxTQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxPQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsS0FBQTtBQUNBLFNBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxLQUFBO0FBQ0EsU0FBQSxPQUFBLENBQUEsZUFBQSxHQUFBLEtBQUE7O0FBRUEsU0FBQSxPQUFBLENBQUEsY0FBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxpQkFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxpQkFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLGVBQUE7O0FBRUEsZ0JBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxPQUFBLElBQUE7QUFFQSxHQUxBOztBQU9BLFNBQUEsT0FBQSxDQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxPQUFBLENBQUEsZUFBQSxHQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsZUFBQTs7QUFFQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQTtB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T0FBQSxFQUFBLFlBQUEsRUFBQTs7QUFHQSxTQUFBLFNBQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsTUFBQTtBQUNBLEdBRkEsQ0FBQTs7QUFJQSxTQUFBLE1BQUEsR0FBQSxPQUFBLFNBQUE7O0FBRUEsU0FBQSxpQkFBQSxHQUFBLE9BQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsU0FBQTtBQUNBLEdBRkEsQ0FBQTs7QUFLQSxNQUFBLE9BQUEsaUJBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsR0FGQSxNQUVBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBOztBQUVBLFNBQUEsT0FBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxLQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsT0FBQSxTQUFBO0FBQ0EsR0FIQTs7QUFLQSxTQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLE9BQUEsaUJBQUE7QUFDQSxHQUhBOztBQU1BLE1BQUEsU0FBQSxJQUFBO0FBQ0EsTUFBQSxTQUFBLFFBQUE7QUFDQSxNQUFBLE9BQUEsV0FBQTs7QUFFQSxTQUFBLGlCQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsV0FBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxlQUFBLElBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLENBQUE7QUFDQTtBQUVBLEdBVEE7O0FBV0EsU0FBQSxPQUFBLEdBQUEsYUFBQSxPQUFBOztBQUVBLFNBQUEsSUFBQSxHQUFBLGFBQUEsSUFBQTtBQUNBLFNBQUEsVUFBQSxHQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsVUFBQSxNQUFBLEdBQUEsU0FBQTtBQUNBLEdBRkE7O0FBSUEsU0FBQSxVQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsaUJBQUEsR0FBQSxPQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxNQUFBLEdBQUEsU0FBQTtBQUNBLGFBQUEsS0FBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLFdBQUEsU0FBQSxHQUFBLE9BQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFVBQUEsTUFBQSxNQUFBLEtBQUEsU0FBQSxFQUFBO0FBQ0EsY0FBQSxNQUFBLEdBQUEsU0FBQTtBQUNBO0FBQ0EsYUFBQSxLQUFBO0FBQ0EsS0FMQSxDQUFBO0FBTUEsR0FYQTs7QUFhQSxTQUFBLE1BQUEsR0FBQSxhQUFBLE1BQUE7QUFDQSxTQUFBLFlBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFVBQUEsTUFBQSxHQUFBLFVBQUE7QUFDQSxHQUZBOztBQUlBLFNBQUEsU0FBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLFNBQUEsV0FBQSxFQUFBO0FBQ0EsYUFBQSxZQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsYUFBQSxXQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxDQUFBO0FBQ0E7QUFDQSxHQVJBOztBQVVBLFNBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLFdBQUEsUUFBQSxFQUFBO0FBQ0EsZUFBQSxTQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsTUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsZUFBQSxRQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsTUFBQSxDQUFBO0FBQ0E7QUFDQSxHQVJBO0FBVUEsQ0EzRkE7O0FDYkEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxLQUFBLENBQUEsZ0JBQUEsRUFBQTtBQUNBLFNBQUEsaUJBREE7QUFFQSxpQkFBQSw4QkFGQTtBQUdBLGdCQUFBLG1CQUhBO0FBSUEsYUFBQTtBQUNBLHNCQUFBLHdCQUFBLGNBQUEsRUFBQTtBQUNBLGVBQUEsZUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBY0EsSUFBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsU0FBQSxXQUFBLEdBQUEsY0FBQTs7QUFFQSxTQUFBLFVBQUEsR0FBQSxPQUFBLFdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLFFBQUEsTUFBQSxLQUFBLGNBQUE7QUFDQSxHQUZBLENBQUE7O0FBSUEsU0FBQSxRQUFBLEdBQUEsT0FBQSxXQUFBOztBQUVBLE1BQUEsT0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLEdBRkEsTUFFQTtBQUNBLFdBQUEsSUFBQSxHQUFBLEtBQUE7QUFDQTs7QUFFQSxTQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEsUUFBQSxHQUFBLE9BQUEsV0FBQTtBQUNBLEdBSEE7O0FBS0EsU0FBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsSUFBQSxHQUFBLEtBQUE7QUFDQSxXQUFBLFFBQUEsR0FBQSxPQUFBLFVBQUE7QUFDQSxHQUhBOztBQU1BLE1BQUEsT0FBQSxNQUFBO0FBQ0EsTUFBQSxTQUFBLFFBQUE7QUFDQSxNQUFBLFdBQUEsT0FBQTs7QUFFQSxTQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxTQUFBLE1BQUEsRUFBQTtBQUNBLGFBQUEsT0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGFBQUEsTUFBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTs7QUFVQSxTQUFBLGNBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxXQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsU0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGVBQUEsUUFBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTs7QUFVQSxTQUFBLGdCQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxpQkFBQSxRQUFBO0FBQ0EsYUFBQSxRQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxRQUFBLEVBQUEsUUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsaUJBQUEsT0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLFFBQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTtBQVdBLENBN0RBO0FDZEEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxLQUFBLENBQUEsY0FBQSxFQUFBO0FBQ0EsU0FBQSxtQkFEQTtBQUVBLGlCQUFBLGtDQUZBO0FBR0EsZ0JBQUEsaUJBSEE7QUFJQSxhQUFBO0FBQ0EsYUFBQSxlQUFBLFlBQUEsRUFBQTtBQUNBLGVBQUEsYUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBYUEsSUFBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsTUFBQTtBQUNBLEdBRkEsQ0FBQTtBQUdBLENBSkE7QUNiQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxZQUFBLEVBQUE7QUFDQSxTQUFBLGNBREE7QUFFQSxpQkFBQSwyQkFGQTtBQUdBLGdCQUFBLGdCQUhBO0FBSUEsYUFBQTtBQUNBLG1CQUFBLHFCQUFBLFdBQUEsRUFBQTtBQUNBLGVBQUEsWUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBY0EsSUFBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsU0FBQSxLQUFBLEdBQUEsV0FBQTs7QUFFQSxNQUFBLFNBQUEsSUFBQTtBQUNBLE1BQUEsV0FBQSxXQUFBO0FBQ0EsTUFBQSxRQUFBLE9BQUE7O0FBRUEsU0FBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsV0FBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxNQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxlQUFBLElBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxNQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7O0FBVUEsU0FBQSxhQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxjQUFBLFFBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxLQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxjQUFBLE9BQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxLQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7O0FBVUEsU0FBQSxnQkFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLGFBQUEsV0FBQSxFQUFBO0FBQ0EsaUJBQUEsWUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsS0FBQSxFQUFBLFFBQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGlCQUFBLFdBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxRQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7QUFVQSxDQXJDQTtBQ2RBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGlCQUFBLEtBQUEsQ0FBQSxVQUFBLEVBQUE7QUFDQSxTQUFBLGVBREE7QUFFQSxpQkFBQSw0QkFGQTtBQUdBLGdCQUFBLGNBSEE7QUFJQSxhQUFBO0FBQ0EsWUFBQSxjQUFBLFdBQUEsRUFBQSxZQUFBLEVBQUE7QUFDQSxZQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxZQUFBLFNBQUEsQ0FBQSxhQUFBLEVBQUEsQ0FBQTtBQUNBLE9BSkE7QUFLQSxZQUFBLGNBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQTtBQUNBLGVBQUEsYUFBQSxXQUFBLENBQUEsYUFBQSxFQUFBLENBQUE7QUFDQTtBQVBBO0FBSkEsR0FBQTtBQWVBLENBakJBOztBQW1CQSxJQUFBLFVBQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxZQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLFNBQUEsSUFBQSxHQUFBLElBQUE7QUFDQSxTQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxZQUFBLEdBQUEsS0FBQTtBQUNBLFNBQUEsT0FBQTs7QUFFQSxTQUFBLGNBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxZQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUE7O0FBRUEsUUFBQSxPQUFBLFlBQUEsS0FBQSxLQUFBLEVBQUE7QUFDQSxhQUFBLE9BQUEsR0FBQSxFQUFBLGdCQUFBLEtBQUEsY0FBQSxFQUFBLE1BQUEsS0FBQSxJQUFBLEVBQUEsT0FBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsR0FBQSxFQUFBLFlBQUEsS0FBQSxVQUFBLEVBQUEsV0FBQSxLQUFBLFNBQUEsRUFBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsS0FBQSxFQUFBO0FBQ0EsS0FGQSxNQUVBO0FBQ0EsYUFBQSxPQUFBLEdBQUEsT0FBQSxJQUFBO0FBQ0E7QUFFQSxHQVRBOztBQVdBLFNBQUEsV0FBQSxHQUFBLFVBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUE7O0FBRUEsUUFBQSxPQUFBLFlBQUEsS0FBQSxLQUFBLEVBQUE7QUFDQSxnQkFBQSxFQUFBLGdCQUFBLEtBQUEsY0FBQSxFQUFBLE1BQUEsS0FBQSxJQUFBLEVBQUEsT0FBQSxLQUFBLEtBQUEsRUFBQSxLQUFBLEtBQUEsR0FBQSxFQUFBLFlBQUEsS0FBQSxVQUFBLEVBQUEsV0FBQSxLQUFBLFNBQUEsRUFBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsS0FBQSxFQUFBO0FBQ0E7O0FBRUEsV0FBQSxJQUFBLENBQUEsTUFBQSxHQUFBLFNBQUE7QUFDQSxXQUFBLElBQUEsQ0FBQSxLQUFBLEdBQUEsT0FBQSxJQUFBLENBQUEsS0FBQTs7QUFFQSxpQkFBQSxRQUFBLENBQUEsTUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUEsQ0FBQSxDQURBO0FBRUEsR0FYQTs7QUFhQSxTQUFBLElBQUEsQ0FBQSxRQUFBLEdBQUEsQ0FBQTs7QUFFQTtBQUNBLE1BQUEsS0FBQSxRQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsUUFBQSxTQUFBLEtBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGFBQUEsV0FBQSxRQUFBLEtBQUEsQ0FBQTtBQUNBLEtBRkEsQ0FBQTtBQUdBLFFBQUEsYUFBQSxLQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxhQUFBLFFBQUEsWUFBQSxDQUFBLFFBQUE7QUFDQSxLQUZBLENBQUE7QUFHQSxRQUFBLFdBQUEsQ0FBQTtBQUNBLFNBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxJQUFBLEtBQUEsUUFBQSxDQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUE7QUFDQSxrQkFBQSxPQUFBLENBQUEsSUFBQSxXQUFBLENBQUEsQ0FBQTtBQUNBO0FBQ0EsV0FBQSxJQUFBLENBQUEsUUFBQSxHQUFBLFNBQUEsT0FBQSxDQUFBLENBQUEsQ0FBQTtBQUNBO0FBRUEsQ0FoREE7O0FDbkJBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGlCQUFBLEtBQUEsQ0FBQSxjQUFBLEVBQUE7QUFDQSxTQUFBLDRCQURBO0FBRUEsaUJBQUEsZ0NBRkE7QUFHQSxnQkFBQSxrQkFIQTtBQUlBLGFBQUE7QUFDQSxZQUFBLGNBQUEsV0FBQSxFQUFBLFlBQUEsRUFBQTtBQUNBLGVBQUEsWUFBQSxTQUFBLENBQUEsYUFBQSxFQUFBLENBQUE7QUFDQSxPQUhBO0FBSUEsYUFBQSxlQUFBLFlBQUEsRUFBQSxZQUFBLEVBQUE7QUFDQSxlQUFBLGFBQUEsU0FBQSxDQUFBLGFBQUEsRUFBQSxFQUFBLGFBQUEsT0FBQSxDQUFBO0FBQ0E7QUFOQTtBQUpBLEdBQUE7QUFjQSxDQWhCQTs7QUFrQkEsSUFBQSxVQUFBLENBQUEsa0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBO0FBQ0EsU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLFNBQUEsS0FBQSxHQUFBLEtBQUE7O0FBRUEsU0FBQSxLQUFBLENBQUEsUUFBQSxHQUFBLENBQUE7O0FBRUEsTUFBQSxNQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxRQUFBLFNBQUEsTUFBQSxRQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsYUFBQSxXQUFBLFFBQUEsS0FBQSxDQUFBO0FBQ0EsS0FGQSxDQUFBO0FBR0EsUUFBQSxhQUFBLE1BQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGFBQUEsUUFBQSxZQUFBLENBQUEsUUFBQTtBQUNBLEtBRkEsQ0FBQTtBQUdBLFFBQUEsV0FBQSxDQUFBO0FBQ0EsU0FBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLElBQUEsTUFBQSxRQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQTtBQUNBLGtCQUFBLE9BQUEsQ0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFDQSxXQUFBLEtBQUEsQ0FBQSxRQUFBLEdBQUEsUUFBQTtBQUNBO0FBRUEsQ0FwQkE7O0FDbEJBLElBQUEsT0FBQSxDQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsU0FBQSxDQUNBLG1GQURBLEVBRUEsMEVBRkEsRUFHQSw2R0FIQSxFQUlBLDJJQUpBLENBQUE7QUFNQSxDQVBBOztBQ0FBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsaUJBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFNBQUEsR0FEQTtBQUVBLGlCQUFBLG1CQUZBO0FBR0EsZ0JBQUEsY0FIQTtBQUlBLGFBQUE7QUFDQSxzQkFBQSx3QkFBQSxjQUFBLEVBQUE7QUFDQSxlQUFBLGVBQUEsUUFBQSxFQUFBO0FBQ0E7QUFIQTtBQUpBLEdBQUE7QUFVQSxDQVhBOztBQWNBLElBQUEsVUFBQSxDQUFBLGNBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxZQUFBLEVBQUEsY0FBQSxFQUFBLFVBQUEsRUFBQTtBQUNBLFNBQUEsTUFBQSxHQUFBLEVBQUEsT0FBQSxDQUFBLFlBQUEsQ0FBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLElBQUE7QUFDQSxTQUFBLGNBQUEsR0FBQSxFQUFBLE1BQUEsQ0FBQSxjQUFBLEVBQUEsQ0FBQSxDQUFBO0FBQ0EsQ0FKQTs7QUNkQSxDQUFBLFlBQUE7O0FBRUE7O0FBRUE7O0FBQ0EsTUFBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLE1BQUEsSUFBQSxLQUFBLENBQUEsd0JBQUEsQ0FBQTs7QUFFQSxNQUFBLE1BQUEsUUFBQSxNQUFBLENBQUEsYUFBQSxFQUFBLEVBQUEsQ0FBQTs7QUFFQSxNQUFBLE9BQUEsQ0FBQSxRQUFBLEVBQUEsWUFBQTtBQUNBLFFBQUEsQ0FBQSxPQUFBLEVBQUEsRUFBQSxNQUFBLElBQUEsS0FBQSxDQUFBLHNCQUFBLENBQUE7QUFDQSxXQUFBLE9BQUEsRUFBQSxDQUFBLE9BQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQTtBQUNBLEdBSEE7O0FBS0E7QUFDQTtBQUNBO0FBQ0EsTUFBQSxRQUFBLENBQUEsYUFBQSxFQUFBO0FBQ0Esa0JBQUEsb0JBREE7QUFFQSxpQkFBQSxtQkFGQTtBQUdBLG1CQUFBLHFCQUhBO0FBSUEsb0JBQUEsc0JBSkE7QUFLQSxzQkFBQSx3QkFMQTtBQU1BLG1CQUFBO0FBTkEsR0FBQTs7QUFTQSxNQUFBLE9BQUEsQ0FBQSxpQkFBQSxFQUFBLFVBQUEsVUFBQSxFQUFBLEVBQUEsRUFBQSxXQUFBLEVBQUE7QUFDQSxRQUFBLGFBQUE7QUFDQSxXQUFBLFlBQUEsZ0JBREE7QUFFQSxXQUFBLFlBQUEsYUFGQTtBQUdBLFdBQUEsWUFBQSxjQUhBO0FBSUEsV0FBQSxZQUFBO0FBSkEsS0FBQTtBQU1BLFdBQUE7QUFDQSxxQkFBQSx1QkFBQSxRQUFBLEVBQUE7QUFDQSxtQkFBQSxVQUFBLENBQUEsV0FBQSxTQUFBLE1BQUEsQ0FBQSxFQUFBLFFBQUE7QUFDQSxlQUFBLEdBQUEsTUFBQSxDQUFBLFFBQUEsQ0FBQTtBQUNBO0FBSkEsS0FBQTtBQU1BLEdBYkE7O0FBZUEsTUFBQSxNQUFBLENBQUEsVUFBQSxhQUFBLEVBQUE7QUFDQSxrQkFBQSxZQUFBLENBQUEsSUFBQSxDQUFBLENBQ0EsV0FEQSxFQUVBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxVQUFBLEdBQUEsQ0FBQSxpQkFBQSxDQUFBO0FBQ0EsS0FKQSxDQUFBO0FBTUEsR0FQQTs7QUFTQSxNQUFBLE9BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLFVBQUEsRUFBQSxXQUFBLEVBQUEsRUFBQSxFQUFBOztBQUVBLGFBQUEsaUJBQUEsQ0FBQSxRQUFBLEVBQUE7QUFDQSxVQUFBLE9BQUEsU0FBQSxJQUFBO0FBQ0EsY0FBQSxNQUFBLENBQUEsS0FBQSxFQUFBLEVBQUEsS0FBQSxJQUFBO0FBQ0EsaUJBQUEsVUFBQSxDQUFBLFlBQUEsWUFBQTtBQUNBLGFBQUEsS0FBQSxJQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQUEsZUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLENBQUEsQ0FBQSxRQUFBLElBQUE7QUFDQSxLQUZBOztBQUlBLFNBQUEsZUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsVUFBQSxLQUFBLGVBQUEsTUFBQSxlQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsR0FBQSxJQUFBLENBQUEsUUFBQSxJQUFBLENBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxLQUFBLENBQUEsWUFBQTtBQUNBLGVBQUEsSUFBQTtBQUNBLE9BRkEsQ0FBQTtBQUlBLEtBckJBOztBQXVCQSxTQUFBLEtBQUEsR0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLFdBQUEsRUFDQSxJQURBLENBQ0EsaUJBREEsRUFFQSxLQUZBLENBRUEsWUFBQTtBQUNBLGVBQUEsR0FBQSxNQUFBLENBQUEsRUFBQSxTQUFBLDRCQUFBLEVBQUEsQ0FBQTtBQUNBLE9BSkEsQ0FBQTtBQUtBLEtBTkE7O0FBUUEsU0FBQSxNQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxhQUFBLE1BQUEsSUFBQSxDQUFBLFNBQUEsRUFBQSxXQUFBLEVBQ0EsSUFEQSxDQUNBLGlCQURBLEVBRUEsS0FGQSxDQUVBLFlBQUE7QUFDQSxlQUFBLEdBQUEsTUFBQSxDQUFBLEVBQUEsU0FBQSw0QkFBQSxFQUFBLENBQUE7QUFDQSxPQUpBLENBQUE7QUFLQSxLQU5BOztBQVFBLFNBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGdCQUFBLE9BQUE7QUFDQSxtQkFBQSxVQUFBLENBQUEsWUFBQSxhQUFBO0FBQ0EsT0FIQSxDQUFBO0FBSUEsS0FMQTtBQU9BLEdBN0RBOztBQStEQSxNQUFBLE9BQUEsQ0FBQSxTQUFBLEVBQUEsVUFBQSxVQUFBLEVBQUEsV0FBQSxFQUFBOztBQUVBLFFBQUEsT0FBQSxJQUFBOztBQUVBLGVBQUEsR0FBQSxDQUFBLFlBQUEsZ0JBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxPQUFBO0FBQ0EsS0FGQTs7QUFJQSxlQUFBLEdBQUEsQ0FBQSxZQUFBLGNBQUEsRUFBQSxZQUFBO0FBQ0EsV0FBQSxPQUFBO0FBQ0EsS0FGQTs7QUFJQSxTQUFBLEVBQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxJQUFBLEdBQUEsSUFBQTs7QUFFQSxTQUFBLE1BQUEsR0FBQSxVQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7QUFDQSxXQUFBLEVBQUEsR0FBQSxTQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLEtBSEE7O0FBS0EsU0FBQSxPQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsRUFBQSxHQUFBLElBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsS0FIQTtBQUtBLEdBekJBO0FBMkJBLENBNUlBOztBQ0FBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGlCQUFBLEtBQUEsQ0FBQSxPQUFBLEVBQUE7QUFDQSxTQUFBLFFBREE7QUFFQSxpQkFBQSxxQkFGQTtBQUdBLGdCQUFBO0FBSEEsR0FBQTtBQU1BLENBUkE7O0FBVUEsSUFBQSxVQUFBLENBQUEsV0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUE7O0FBRUEsU0FBQSxLQUFBLEdBQUEsRUFBQTtBQUNBLFNBQUEsS0FBQSxHQUFBLElBQUE7O0FBRUEsU0FBQSxTQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7O0FBRUEsV0FBQSxLQUFBLEdBQUEsSUFBQTs7QUFFQSxnQkFBQSxLQUFBLENBQUEsU0FBQSxFQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0EsYUFBQSxFQUFBLENBQUEsTUFBQTtBQUNBLEtBRkEsRUFFQSxLQUZBLENBRUEsWUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLDRCQUFBO0FBQ0EsS0FKQTtBQU1BLEdBVkE7O0FBWUEsU0FBQSxVQUFBLEdBQUEsVUFBQSxTQUFBLEVBQUE7O0FBRUEsV0FBQSxLQUFBLEdBQUEsSUFBQTs7QUFFQSxnQkFBQSxNQUFBLENBQUEsU0FBQSxFQUFBLElBQUEsQ0FBQSxZQUFBO0FBQ0EsYUFBQSxFQUFBLENBQUEsTUFBQTtBQUNBLEtBRkEsRUFFQSxLQUZBLENBRUEsWUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLDZCQUFBO0FBQ0EsS0FKQTtBQU1BLEdBVkE7QUFZQSxDQTdCQTtBQ1ZBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsaUJBQUEsS0FBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFNBQUEsUUFEQTtBQUVBLGlCQUFBLGtDQUZBO0FBR0EsZ0JBQUE7QUFIQSxHQUFBO0FBS0EsQ0FOQTs7QUFRQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxXQUFBLEVBQUE7QUFDQTtBQUNBLFNBQUEsSUFBQSxHQUFBLFFBQUEsSUFBQTs7QUFFQTtBQUNBLE1BQUEsZUFBQSxTQUFBLFlBQUEsR0FBQTtBQUNBLFFBQUEsT0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLE1BQUEsRUFBQTtBQUNBLFVBQUEsU0FBQSxPQUFBLElBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxXQUFBLFFBQUEsS0FBQSxDQUFBO0FBQ0EsT0FGQSxDQUFBO0FBR0EsVUFBQSxhQUFBLE9BQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSxHQUFBLENBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxlQUFBLFFBQUEsWUFBQSxDQUFBLFFBQUE7QUFDQSxPQUZBLENBQUE7QUFHQSxVQUFBLFdBQUEsQ0FBQTtBQUNBLFdBQUEsSUFBQSxJQUFBLENBQUEsRUFBQSxJQUFBLE9BQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxFQUFBO0FBQ0Esb0JBQUEsT0FBQSxDQUFBLElBQUEsV0FBQSxDQUFBLENBQUE7QUFDQTtBQUNBLGFBQUEsSUFBQSxDQUFBLFFBQUEsR0FBQSxTQUFBLE9BQUEsQ0FBQSxDQUFBLENBQUE7QUFDQTtBQUNBLEdBZEE7O0FBZ0JBO0FBQ0EsY0FBQSxlQUFBLEdBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxpQkFBQSxXQUFBLEdBQ0EsSUFEQSxDQUNBLFVBQUEsR0FBQSxFQUFBO0FBQ0EsYUFBQSxJQUFBLEdBQUEsR0FBQTtBQUNBO0FBQ0EsY0FBQSxHQUFBLENBQUEsWUFBQSxFQUFBLEdBQUE7QUFDQSxLQUxBO0FBTUEsR0FSQTs7QUFXQSxTQUFBLFVBQUEsR0FBQSxVQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUE7QUFDQSxpQkFBQSxVQUFBLENBQUEsT0FBQSxFQUFBLFFBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxXQUFBLEVBQUE7QUFDQSxhQUFBLElBQUEsR0FBQSxXQUFBO0FBQ0E7QUFDQSxLQUpBO0FBS0EsR0FOQTtBQVNBLENBMUNBOztBQ1JBLElBQUEsT0FBQSxDQUFBLGNBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLEVBQUEsTUFBQSxFQUFBOztBQUVBLE1BQUEsZUFBQSxFQUFBOztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGVBQUEsV0FBQSxHQUFBLFlBQUE7O0FBRUE7QUFDQSxRQUFBLFlBQUEsZUFBQSxFQUFBLEVBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLGlCQUFBLFFBQUEsSUFBQSxDQUFBLEVBQUEsR0FBQSxPQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsZUFBQSxPQUFBLElBQUE7QUFDQSxPQUhBLENBQUE7QUFJQTtBQUNBO0FBQ0EsV0FBQSxHQUFBLElBQUEsQ0FBQSxTQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUEsQ0FBQTtBQUNBLEdBWEE7O0FBYUEsZUFBQSxnQkFBQSxHQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsUUFBQSxZQUFBLGVBQUEsRUFBQSxFQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxNQUFBLEdBQUEsTUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxJQUFBO0FBQ0EsT0FIQSxDQUFBO0FBSUE7QUFDQSxHQVBBOztBQVNBLGVBQUEsY0FBQSxHQUFBLFVBQUEsTUFBQSxFQUFBO0FBQ0EsUUFBQSxZQUFBLGVBQUEsRUFBQSxFQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxNQUFBLEdBQUEsZUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxJQUFBO0FBQ0EsT0FIQSxDQUFBO0FBSUE7QUFDQSxHQVBBOztBQVNBLGVBQUEsUUFBQSxHQUFBLFVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxPQUFBLEVBQUE7QUFDQSxZQUFBLEdBQUEsQ0FBQSxZQUFBLGVBQUEsRUFBQTtBQUNBLFFBQUEsWUFBQSxlQUFBLEVBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxHQUFBLENBQUEsaUJBQUEsTUFBQSxHQUFBLEdBQUEsR0FBQSxPQUFBLEdBQUEsV0FBQSxFQUFBLE9BQUEsRUFDQSxJQURBLENBQ0EsWUFBQTtBQUNBLGVBQUEsRUFBQSxDQUFBLGNBQUEsRUFBQSxFQUFBLElBQUEsTUFBQSxFQUFBLFNBQUEsT0FBQSxFQUFBO0FBQ0E7QUFDQSxPQUpBLENBQUE7QUFLQSxLQU5BLE1BT0E7QUFDQSxjQUFBLEdBQUEsQ0FBQSxXQUFBLEVBQUEsT0FBQTtBQUNBLGFBQUEsTUFBQSxHQUFBLENBQUEsNEJBQUEsRUFBQSxPQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxlQUFBLEVBQUEsQ0FBQSxNQUFBO0FBQ0EsaUJBQUEsU0FBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLFFBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQSxFQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQ0EsT0FKQSxDQUFBO0FBTUE7QUFDQSxHQWxCQTs7QUFvQkEsZUFBQSxTQUFBLEdBQUEsVUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxNQUFBLEdBQUEsR0FBQSxHQUFBLE9BQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxLQUFBLEVBQUE7QUFDQSxhQUFBLE1BQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0EsZUFBQSxVQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsY0FBQSxFQUFBO0FBQ0EsUUFBQSxZQUFBLGVBQUEsRUFBQSxFQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxRQUFBLElBQUEsQ0FBQSxFQUFBLEdBQUEsYUFBQSxFQUFBLEVBQUEsV0FBQSxRQUFBLEVBQUEsRUFBQSxnQkFBQSxjQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEVBQUEsQ0FBQSxNQUFBO0FBQ0EsZUFBQSxLQUFBLElBQUE7QUFDQSxPQUpBLENBQUE7QUFLQTtBQUNBO0FBUEEsU0FRQTtBQUNBO0FBQ0EsWUFBQSxPQUFBLFNBQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQTs7QUFFQTtBQUNBLFlBQUEsVUFBQSxDQUFBLENBQUE7QUFDQSxhQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsSUFBQSxLQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQUEsR0FBQSxFQUFBO0FBQ0EsY0FBQSxLQUFBLFFBQUEsQ0FBQSxDQUFBLEVBQUEsRUFBQSxLQUFBLFFBQUEsRUFBQSxFQUFBO0FBQ0Esc0JBQUEsQ0FBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBQSxpQkFBQSxDQUFBLEVBQUE7QUFDQSxjQUFBLFlBQUEsQ0FBQSxDQUFBLEVBQUE7QUFDQTtBQUNBLGdCQUFBLFFBQUEsS0FBQSxJQUFBLGNBQUEsRUFBQTtBQUNBLHNCQUFBLFlBQUEsR0FBQSxFQUFBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLElBQUEsQ0FBQSxPQUFBO0FBQ0EscUJBQUEsRUFBQSxDQUFBLE1BQUE7QUFFQTtBQUNBLFdBUkEsTUFRQTtBQUNBO0FBQ0EsZ0JBQUEsUUFBQSxLQUFBLElBQUEsS0FBQSxRQUFBLENBQUEsT0FBQSxFQUFBLFlBQUEsQ0FBQSxRQUFBLEdBQUEsY0FBQSxFQUFBO0FBQ0EsbUJBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLENBQUEsUUFBQSxJQUFBLGNBQUE7QUFDQSxxQkFBQSxFQUFBLENBQUEsTUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUEsSUFBQTtBQUNBO0FBQ0EsaUJBQUEsR0FBQSxJQUFBLENBQUEsSUFBQSxDQUFBO0FBQ0E7QUFDQSxTQXJCQSxNQXFCQTtBQUNBO0FBQ0EsY0FBQSxpQkFBQSxLQUFBLFFBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQSxDQUFBLFFBQUEsSUFBQSxDQUFBLEVBQUE7QUFDQSxpQkFBQSxRQUFBLENBQUEsTUFBQSxDQUFBLE9BQUEsRUFBQSxDQUFBO0FBQ0EsV0FGQSxNQUVBO0FBQ0E7QUFDQSxpQkFBQSxRQUFBLENBQUEsT0FBQSxFQUFBLFlBQUEsQ0FBQSxRQUFBLElBQUEsY0FBQTtBQUNBO0FBQ0E7QUFDQSxtQkFBQSxTQUFBLENBQUEsTUFBQSxFQUFBLElBQUE7QUFDQTtBQUNBLGlCQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBO0FBRUE7QUFDQSxHQTFEQTs7QUE0REEsZUFBQSxJQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLE1BQUEsR0FBQSxDQUFBLGlCQUFBLE9BQUEsR0FBQSxTQUFBLEVBQUEsRUFBQSxRQUFBLFNBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLFlBQUEsRUFBQTtBQUNBLGFBQUEsYUFBQSxJQUFBO0FBQ0EsS0FIQSxDQUFBO0FBSUEsR0FMQTs7QUFPQSxlQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxxQkFBQSxFQUFBLEVBQUEsUUFBQSxTQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxhQUFBLEVBQUE7QUFDQSxhQUFBLGNBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0EsZUFBQSxNQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLE1BQUEsR0FBQSxDQUFBLGlCQUFBLE9BQUEsR0FBQSxTQUFBLEVBQUEsRUFBQSxRQUFBLFVBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLGFBQUEsRUFBQTtBQUNBLGFBQUEsY0FBQSxJQUFBO0FBQ0EsS0FIQSxDQUFBO0FBSUEsR0FMQTs7QUFPQSxlQUFBLFFBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxjQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxVQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLFNBQUEsWUFBQTtBQUNBLENBN0pBOztBQ0FBLElBQUEsT0FBQSxDQUFBLGVBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUE7O0FBRUEsTUFBQSxnQkFBQSxFQUFBOztBQUVBLGdCQUFBLGdCQUFBLEdBQUEsVUFBQSxFQUFBLEVBQUE7QUFDQSxXQUFBLE1BQUEsR0FBQSxDQUFBLG1CQUFBLEVBQUEsR0FBQSxVQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsY0FBQSxHQUFBLENBQUEsVUFBQSxFQUFBLE9BQUE7QUFDQSxhQUFBLFFBQUEsSUFBQTtBQUNBLEtBSkEsQ0FBQTtBQUtBLEdBTkE7O0FBUUEsZ0JBQUEsYUFBQSxHQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxlQUFBLEVBQUEsR0FBQSxVQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsYUFBQSxRQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGdCQUFBLFVBQUEsR0FBQSxVQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUE7QUFDQSxTQUFBLFNBQUEsR0FBQSxTQUFBO0FBQ0EsUUFBQSxRQUFBLElBQUEsRUFBQSxLQUFBLE1BQUEsR0FBQSxRQUFBLElBQUEsQ0FBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLElBQUEsQ0FBQSxtQkFBQSxTQUFBLEdBQUEsZ0JBQUEsRUFBQSxJQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsYUFBQSxVQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQVBBOztBQVNBLFNBQUEsYUFBQTtBQUNBLENBN0JBO0FDQUEsSUFBQSxTQUFBLENBQUEsWUFBQSxFQUFBLFlBQUE7QUFDQSxTQUFBO0FBQ0EsY0FBQSxJQURBO0FBRUEsY0FDQSw2QkFDQSx3R0FEQSxHQUVBLDhDQUZBLEdBRUE7QUFDQSxhQUhBLEdBSUEsT0FQQTtBQVFBLFdBQUE7QUFDQSxtQkFBQSxVQURBO0FBRUEsZ0JBQUE7QUFGQSxLQVJBO0FBWUEsVUFBQSxjQUFBLEtBQUEsRUFBQSxPQUFBLEVBQUEsVUFBQSxFQUFBO0FBQ0EsZUFBQSxXQUFBLEdBQUE7QUFDQSxjQUFBLEtBQUEsR0FBQSxFQUFBO0FBQ0EsYUFBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLElBQUEsQ0FBQSxFQUFBLEdBQUEsRUFBQTtBQUNBLGdCQUFBLEtBQUEsQ0FBQSxJQUFBLENBQUE7QUFDQSxvQkFBQSxJQUFBLE1BQUE7QUFEQSxXQUFBO0FBR0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFBLE1BQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFlBQUEsTUFBQSxRQUFBLElBQUEsU0FBQSxJQUFBLE1BQUEsUUFBQSxLQUFBLEtBQUEsRUFBQTtBQUNBLGdCQUFBLFdBQUEsR0FBQSxRQUFBLENBQUE7QUFDQTtBQUNBLE9BSkE7QUFLQSxZQUFBLE1BQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxRQUFBLEVBQUEsUUFBQSxFQUFBO0FBQ0EsWUFBQSxRQUFBLEVBQUE7QUFDQTtBQUNBO0FBQ0EsT0FKQTtBQUtBO0FBbENBLEdBQUE7QUFvQ0EsQ0FyQ0E7O0FDQUEsSUFBQSxPQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLE1BQUEsaUJBQUEsRUFBQTs7QUFFQSxpQkFBQSxRQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEsZ0JBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxRQUFBLEVBQUE7QUFDQSxhQUFBLFNBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0EsaUJBQUEsU0FBQSxHQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsYUFBQSxRQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGlCQUFBLFdBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7QUFDQSxRQUFBLFNBQUEsUUFBQSxXQUFBLEdBQUEsY0FBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEsbUJBQUEsRUFBQSxFQUFBLEVBQUEsT0FBQSxLQUFBLEVBQUEsUUFBQSxNQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxjQUFBLEVBQUE7QUFDQSxhQUFBLGVBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUtBLEdBUEE7O0FBU0EsaUJBQUEsVUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLElBQUEsQ0FBQSxnQkFBQSxFQUFBLFVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxjQUFBLEVBQUE7QUFDQSxhQUFBLGVBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0EsaUJBQUEsV0FBQSxHQUFBLFVBQUEsRUFBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxtQkFBQSxFQUFBLEVBQUEsRUFBQSxRQUFBLGNBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGFBQUEsZUFBQSxJQUFBO0FBQ0EsS0FIQSxDQUFBO0FBSUEsR0FMQTs7QUFTQSxTQUFBLGNBQUE7QUFDQSxDQTNDQTtBQ0FBLElBQUEsTUFBQSxDQUFBLFVBQUEsY0FBQSxFQUFBOztBQUVBLGlCQUFBLEtBQUEsQ0FBQSxTQUFBLEVBQUE7QUFDQSxTQUFBLGNBREE7QUFFQSxpQkFBQSxpQ0FGQTtBQUdBLGFBQUE7QUFDQSxlQUFBLGlCQUFBLGFBQUEsRUFBQSxZQUFBLEVBQUE7QUFDQSxlQUFBLGNBQUEsZ0JBQUEsQ0FBQSxhQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxVQUFBLEVBQUE7QUFDQSxpQkFBQSxVQUFBO0FBQ0EsU0FIQSxDQUFBO0FBSUE7QUFOQSxLQUhBO0FBV0EsZ0JBQUE7QUFYQSxHQUFBO0FBY0EsQ0FoQkE7O0FBa0JBLElBQUEsVUFBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsWUFBQSxFQUFBLGNBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLE9BQUEsRUFBQSxhQUFBLEVBQUEsT0FBQSxFQUFBOztBQUVBLE1BQUEsZ0JBQUEsUUFBQSxHQUFBLENBQUEsVUFBQSxDQUFBLEVBQUE7QUFBQSxXQUFBLEVBQUEsTUFBQTtBQUFBLEdBQUEsRUFBQSxNQUFBLENBQUEsVUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBO0FBQUEsV0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLENBQUEsR0FBQSxRQUFBLE1BQUE7QUFDQSxTQUFBLFdBQUEsR0FBQSxhQUFBOztBQUVBLFNBQUEsT0FBQSxHQUFBLE9BQUE7O0FBRUEsU0FBQSxTQUFBLEdBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsRUFBQTs7QUFFQSxTQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxPQUFBLFNBQUEsQ0FBQSxJQUFBLEtBQUEsRUFBQSxFQUFBO0FBQ0Esa0JBQUEsVUFBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLEVBQUEsRUFBQSxPQUFBLFNBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxTQUFBLEVBQUE7QUFDQSxnQkFBQSxJQUFBLEdBQUEsUUFBQSxJQUFBO0FBQ0EsYUFBQSxPQUFBLENBQUEsSUFBQSxDQUFBLFNBQUE7QUFDQSxhQUFBLFdBQUEsR0FBQSxLQUFBO0FBQ0EsYUFBQSxTQUFBLEdBQUEsRUFBQSxRQUFBLENBQUEsRUFBQSxNQUFBLEVBQUEsRUFBQTtBQUNBLEtBTkE7QUFPQSxHQVRBOztBQVdBLFNBQUEsUUFBQSxHQUFBLENBQUE7O0FBRUEsaUJBQUEsU0FBQSxDQUFBLGFBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsT0FBQSxHQUFBLE9BQUE7QUFDQSxHQUhBLEVBSUEsS0FKQSxDQUlBLElBSkE7O0FBTUEsU0FBQSxFQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsT0FBQSxRQUFBLElBQUEsT0FBQSxPQUFBLENBQUEsS0FBQSxFQUFBO0FBQ0EsV0FBQSxRQUFBO0FBQ0EsR0FIQTs7QUFLQSxTQUFBLElBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxPQUFBLFFBQUEsR0FBQSxDQUFBLEVBQUEsT0FBQSxRQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLFNBQUEsR0FBQSxZQUFBO0FBQ0EsaUJBQUEsVUFBQSxDQUFBLE9BQUEsT0FBQSxFQUFBLE9BQUEsUUFBQTtBQUNBLEdBRkE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsQ0FoREE7O0FDbEJBLElBQUEsT0FBQSxDQUFBLGFBQUEsRUFBQSxVQUFBLEtBQUEsRUFBQTs7QUFFQSxXQUFBLE9BQUEsQ0FBQSxHQUFBLEVBQUE7QUFBQSxXQUFBLElBQUEsSUFBQTtBQUFBOztBQUVBLE1BQUEsT0FBQSxFQUFBOztBQUVBLE9BQUEsUUFBQSxHQUFBLFlB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QUFBLEVBQUEsVUFBQTtBQUNBLGlCQUFBLEdBQUEsQ0FBQSxZQUFBLGNBQUEsRUFBQSxVQUFBO0FBRUE7O0FBbERBLEdBQUE7QUFzREEsQ0F4REE7O0FDQUEsSUFBQSxTQUFBLENBQUEsV0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGNBQUEsRUFBQTs7QUFFQSxTQUFBO0FBQ0EsY0FBQSxHQURBO0FBRUEsV0FBQSxFQUZBO0FBS0EsaUJBQUEsNENBTEE7QUFNQSxVQUFBLGNBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxlQUFBLFFBQUEsRUFBQTtBQUNBLE9BRkE7QUFHQTs7QUFWQSxHQUFBO0FBY0EsQ0FoQkE7O0FDQUEsSUFBQSxTQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsZUFBQSxFQUFBOztBQUVBLFNBQUE7QUFDQSxjQUFBLEdBREE7QUFFQSxpQkFBQSx5REFGQTtBQUdBLFVBQUEsY0FBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLFFBQUEsR0FBQSxnQkFBQSxpQkFBQSxFQUFBO0FBQ0E7QUFMQSxHQUFBO0FBUUEsQ0FWQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ2ZzYVByZUJ1aWx0JywgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJywgJ25nQ29va2llcyddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUsICRjb29raWVzKSB7XG5cbiAgICAvL0luaXRpYWxpemUgY2FydCBjb29raWUgZm9yIG5vbi1hdXRoIHVzZXJzIGlmIHRoZXJlIGlzbid0IGFscmVhZHkgb25lOlxuICAgIGlmICghJGNvb2tpZXMuZ2V0T2JqZWN0KFwiY2FydFwiKSkgJGNvb2tpZXMucHV0T2JqZWN0KCdjYXJ0Jywge3N0YXR1czogXCJjYXJ0XCIsIHByb2R1Y3RzOiBbXSwgc3VidG90YWw6IDB9KTtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgICRyb290U2NvcGUudmlkZW8gPSB0cnVlO1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICAvLyBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuLy8gYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEZ1bGxzdGFja1BpY3MpIHtcblxuLy8gICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbi8vICAgICAkc2NvcGUuaW1hZ2VzID0gXy5zaHVmZmxlKEZ1bGxzdGFja1BpY3MpO1xuXG4vLyB9KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG4gICAgdXJsOiAnL3VzZXIvOmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy9qcy9hY2NvdW50L2FjY291bnQtaW5mby5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHVzZXI6IGZ1bmN0aW9uKFVzZXJGYWN0b3J5LCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIFVzZXJGYWN0b3J5LmZldGNoQnlJZCgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICB9LFxuICAgICAgb3JkZXJIaXN0b3J5OiBmdW5jdGlvbihPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJIaXN0b3J5KCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICBjYXJ0OiBmdW5jdGlvbihPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJDYXJ0KCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICByZXZpZXdzOiBmdW5jdGlvbihSZXZpZXdGYWN0b3J5LCRzdGF0ZVBhcmFtcyl7XG4gICAgICAgICAgICByZXR1cm4gUmV2aWV3RmFjdG9yeS5mZXRjaEJ5VXNlcklkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhbGxSZXZpZXdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsbFJldmlld3M7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgLy8gdGhhdCBjb250cm9scyBhY2Nlc3MgdG8gdGhpcyBzdGF0ZS4gUmVmZXIgdG8gYXBwLmpzLlxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIHVzZXIsIG9yZGVySGlzdG9yeSwgY2FydCwgcmV2aWV3cywgVXNlckZhY3RvcnksICRyb290U2NvcGUpIHtcbiAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAkc2NvcGUuZGV0YWlscyA9IHt9O1xuICAkcm9vdFNjb3BlLnZpZGVvID0gZmFsc2U7XG4gICRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlscyA9IGZhbHNlO1xuICAkc2NvcGUuZGV0YWlscy5zaG93Q29udGFjdEluZm8gPSBmYWxzZTtcbiAgJHNjb3BlLmRldGFpbHMuc2hvd1BheW1lbnRJbmZvID0gZmFsc2U7XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlVXNlclZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd1VzZXJEZXRhaWxzID0gISRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlsc1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlQ29udGFjdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd0NvbnRhY3RJbmZvID0gISRzY29wZS5kZXRhaWxzLnNob3dDb250YWN0SW5mb1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlUGF5bWVudFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd1BheW1lbnRJbmZvID0gISRzY29wZS5kZXRhaWxzLnNob3dQYXltZW50SW5mb1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMuc2F2ZVVzZXJEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlscyA9ICEkc2NvcGUuZGV0YWlscy5zaG93VXNlckRldGFpbHM7XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5kZXRhaWxzLnNhdmVDb250YWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dDb250YWN0SW5mbyA9ICEkc2NvcGUuZGV0YWlscy5zaG93Q29udGFjdEluZm87XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5kZXRhaWxzLnNhdmVQYXltZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dQYXltZW50SW5mbyA9ICEkc2NvcGUuZGV0YWlscy5zaG93UGF5bWVudEluZm87XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5vcmRlckhpc3RvcnkgPSBvcmRlckhpc3Rvcnk7XG4gICRzY29wZS5jYXJ0ID0gY2FydDtcbiAgdmFyIHByaWNlcyA9IGNhcnQucHJvZHVjdHMubWFwKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9kdWN0LnByaWNlKTtcbiAgfSlcbiAgdmFyIHF1YW50aXRpZXMgPSBjYXJ0LnByb2R1Y3RzLm1hcChmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgcmV0dXJuIHByb2R1Y3QucHJvZHVjdE9yZGVyLnF1YW50aXR5O1xuICB9KVxuICB2YXIgc3VidG90YWwgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICB9XG4gICRzY29wZS5jYXJ0LnN1YnRvdGFsID0gc3VidG90YWw7XG5cbiAgJHNjb3BlLnJldmlld3MgPSByZXZpZXdzO1xuXG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3VwZGF0ZUluZm8nLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvYWNjb3VudC91cGRhdGUtaW5mby5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgdXNlclZpZXc6ICc9JyxcbiAgICAgIGRldGFpbHNWaWV3OiAnPSdcbiAgICB9XG4gIH1cblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdicm93c2UnLCB7XG4gICAgICAgIHVybDogJy9icm93c2UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Jyb3dzZS1wcm9kdWN0cy9icm93c2UtcHJvZHVjdHMuaHRtbCcsXG4gICAgXHRjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICBcdHJlc29sdmU6IHtcbiAgICBcdFx0cHJvZHVjdHM6IGZ1bmN0aW9uKFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgXHRcdFx0cmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtZW5zJywge1xuICAgICAgICB1cmw6ICcvYnJvd3NlL21lbnMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Jyb3dzZS1wcm9kdWN0cy9tZW5zLXByb2R1Y3RzLmh0bWwnLFxuICAgIFx0Y29udHJvbGxlcjogJ1Byb2R1Y3RzQ3RybCcsXG4gICAgXHRyZXNvbHZlOiB7XG4gICAgXHRcdHByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgIFx0XHRcdHJldHVybiBQcm9kdWN0RmFjdG9yeS5mZXRjaEFsbCgpXG4gICAgXHRcdFx0LnRoZW4oZnVuY3Rpb24oYWxsUHJvZHVjdHMpIHtcbiAgICBcdFx0XHRcdHJldHVybiBhbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gcHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIk1lbidzXCIpICE9PSAtMTtcbiAgICBcdFx0XHRcdH0pXG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdFx0XG4gICAgXHRcdFx0XG4gICAgXHRcdFx0XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b21lbnMnLCB7XG4gICAgICAgIHVybDogJy9icm93c2Uvd29tZW5zJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9icm93c2UtcHJvZHVjdHMvd29tZW5zLXByb2R1Y3RzLmh0bWwnLFxuICAgIFx0Y29udHJvbGxlcjogJ1Byb2R1Y3RzQ3RybCcsXG4gICAgXHRyZXNvbHZlOiB7XG4gICAgXHRcdHByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgIFx0XHRcdHJldHVybiBQcm9kdWN0RmFjdG9yeS5mZXRjaEFsbCgpXG4gICAgXHRcdFx0LnRoZW4oZnVuY3Rpb24oYWxsUHJvZHVjdHMpIHtcbiAgICBcdFx0XHRcdHJldHVybiBhbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gcHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIldvbWVuJ3NcIikgIT09IC0xO1xuICAgIFx0XHRcdFx0fSlcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIH0pO1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2dlYXInLCB7XG4gICAgICAgIHVybDogJy9icm93c2UvZ2VhcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYnJvd3NlLXByb2R1Y3RzL2dlYXItcHJvZHVjdHMuaHRtbCcsXG4gICAgXHRjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICBcdHJlc29sdmU6IHtcbiAgICBcdFx0cHJvZHVjdHM6IGZ1bmN0aW9uKFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgXHRcdFx0cmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKClcbiAgICBcdFx0XHQudGhlbihmdW5jdGlvbihhbGxQcm9kdWN0cykge1xuICAgIFx0XHRcdFx0cmV0dXJuIGFsbFByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgXHRcdFx0XHRcdHJldHVybiAocHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIk1lbidzXCIpID09PSAtMSAmJiBwcm9kdWN0Lm5hbWUuc3BsaXQoJyAnKS5pbmRleE9mKFwiV29tZW4nc1wiKSA9PT0gLTEpO1xuICAgIFx0XHRcdFx0fSlcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdQcm9kdWN0c0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0cywgT3JkZXJGYWN0b3J5LCBTZXNzaW9uLCAkc3RhdGUsICRyb290U2NvcGUpIHtcbiAgICAkcm9vdFNjb3BlLnZpZGVvID0gZmFsc2U7XG5cdCRzY29wZS5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuXHQvLyRzY29wZS5tZW4gPSBcIk1lbidzXCI7XG4gICAgXG4gICAgJHNjb3BlLmFkZE9uZVRvQ2FydCA9IGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgICBPcmRlckZhY3RvcnkudXBkYXRlQ2FydChwcm9kdWN0LCAxKVxuICAgIH1cdFxuXG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLW9yZGVycycsIHtcbiAgICB1cmw6ICcvYWRtaW4vb3JkZXJzLycsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi1vcmRlcnMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluT3JkZXJzQ3RybCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgb3JkZXJzOiBmdW5jdGlvbihPcmRlckZhY3RvcnkpIHtcbiAgICAgICAgcmV0dXJuIE9yZGVyRmFjdG9yeS5mZXRjaEFsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5PcmRlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBvcmRlcnMsICRmaWx0ZXIsIE9yZGVyRmFjdG9yeSkge1xuIFxuXG4gICRzY29wZS5hbGxPcmRlcnMgPSBvcmRlcnMuZmlsdGVyKGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgcmV0dXJuIG9yZGVyLnN0YXR1cyAhPT0gJ2NhcnQnO1xuICB9KTtcbiAgXG4gICRzY29wZS5vcmRlcnMgPSAkc2NvcGUuYWxsT3JkZXJzO1xuICBcbiAgJHNjb3BlLm9yZGVyc1RvQmVTaGlwcGVkID0gJHNjb3BlLmFsbE9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICByZXR1cm4gb3JkZXIuc3RhdHVzID09PSAnb3JkZXJlZCc7XG4gIH0pXG5cblxuICBpZiAoJHNjb3BlLm9yZGVyc1RvQmVTaGlwcGVkLmxlbmd0aCkge1xuICAgICRzY29wZS5tYWluID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAkc2NvcGUubWFpbiA9IGZhbHNlO1xuICB9XG5cbiAgJHNjb3BlLnZpZXdBbGwgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUubWFpbiA9IGZhbHNlO1xuICAgICRzY29wZS5vcmRlcnMgPSAkc2NvcGUuYWxsT3JkZXJzO1xuICB9XG5cbiAgJHNjb3BlLnZpZXdPcmRlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLm1haW4gPSBmYWxzZTtcbiAgICAkc2NvcGUub3JkZXJzID0gJHNjb3BlLm9yZGVyc1RvQmVTaGlwcGVkO1xuICB9XG5cblxuICB2YXIgdXBEb3duID0gJ2lkJztcbiAgdmFyIHN0YXR1cyA9ICdzdGF0dXMnO1xuICB2YXIgZGF0ZSA9IFwiY3JlYXRlZEF0XCI7XG5cbiAgJHNjb3BlLm9yZGVyTnVtYmVyRmlsdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHVwRG93biA9PT0gJ2lkJykge1xuICAgICAgdXBEb3duID0gXCItaWRcIjtcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgdXBEb3duKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBEb3duID0gJ2lkJztcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgdXBEb3duKTtcbiAgICB9XG5cbiAgfVxuXG4gICRzY29wZS5zaGlwQWxsID0gT3JkZXJGYWN0b3J5LnNoaXBBbGw7XG5cbiAgJHNjb3BlLnNoaXAgPSBPcmRlckZhY3Rvcnkuc2hpcDtcbiAgJHNjb3BlLnNoaXBVcGRhdGUgPSBmdW5jdGlvbihvcmRlcikge1xuICAgIG9yZGVyLnN0YXR1cyA9ICdzaGlwcGVkJztcbiAgfVxuXG4gICRzY29wZS5idWxrVXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLm9yZGVyc1RvQmVTaGlwcGVkID0gJHNjb3BlLm9yZGVyc1RvQmVTaGlwcGVkLm1hcChmdW5jdGlvbihvcmRlcikge1xuICAgICAgb3JkZXIuc3RhdHVzID0gJ3NoaXBwZWQnO1xuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pXG4gICAgJHNjb3BlLmFsbE9yZGVycyA9ICRzY29wZS5hbGxPcmRlcnMubWFwKGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICBpZiAob3JkZXIuc3RhdHVzID09PSAnb3JkZXJlZCcpIHtcbiAgICAgICAgb3JkZXIuc3RhdHVzID0gJ3NoaXBwZWQnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9yZGVyO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUuY2FuY2VsID0gT3JkZXJGYWN0b3J5LmNhbmNlbDtcbiAgJHNjb3BlLmNhbmNlbFVwZGF0ZSA9IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgb3JkZXIuc3RhdHVzID0gJ2NhbmNlbGVkJztcbiAgfVxuXG4gICRzY29wZS5vcmRlckRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoZGF0ZSA9PT0gXCJjcmVhdGVkQXRcIikge1xuICAgICAgZGF0ZSA9ICctY3JlYXRlZEF0JztcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgZGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGUgPSAnY3JlYXRlZEF0JztcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgZGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLmZpbHRlclN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0dXMgPT09IFwic3RhdHVzXCIpIHtcbiAgICAgIHN0YXR1cyA9ICctc3RhdHVzJztcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgc3RhdHVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzID0gJ3N0YXR1cyc7XG4gICAgICAkc2NvcGUub3JkZXJzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5vcmRlcnMsIHN0YXR1cyk7XG4gICAgfVxuICB9XG5cbn0pXG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pbi1wcm9kdWN0cycsIHtcbiAgICB1cmw6ICcvYWRtaW4vcHJvZHVjdHMnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vYWRtaW4tcHJvZHVjdHMuaHRtbCcsXG4gICAgY29udHJvbGxlcjogJ0FkbWluUHJvZHVjdHNDdHJsJyxcbiAgICByZXNvbHZlOiB7XG4gICAgICBnZXRBbGxQcm9kdWN0czogZnVuY3Rpb24oUHJvZHVjdEZhY3RvcnkpIHtcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9KVxufSlcblxuXG5hcHAuY29udHJvbGxlcignQWRtaW5Qcm9kdWN0c0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIGdldEFsbFByb2R1Y3RzLCAkZmlsdGVyKXtcbiAgJHNjb3BlLmFsbFByb2R1Y3RzID0gZ2V0QWxsUHJvZHVjdHM7XG5cbiAgJHNjb3BlLm91dE9mU3RvY2sgPSAkc2NvcGUuYWxsUHJvZHVjdHMuZmlsdGVyKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICByZXR1cm4gcHJvZHVjdC5zdGF0dXMgPT09ICdvdXQgb2Ygc3RvY2snO1xuICB9KVxuXG4gICRzY29wZS5wcm9kdWN0cyA9ICRzY29wZS5hbGxQcm9kdWN0cztcblxuICBpZiAoJHNjb3BlLm91dE9mU3RvY2subGVuZ3RoKSB7XG4gICAgJHNjb3BlLm1haW4gPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgICRzY29wZS5tYWluID0gZmFsc2U7XG4gIH1cblxuICAkc2NvcGUudmlld0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5tYWluID0gZmFsc2U7XG4gICAgJHNjb3BlLnByb2R1Y3RzID0gJHNjb3BlLmFsbFByb2R1Y3RzO1xuICB9XG5cbiAgJHNjb3BlLnZpZXdPdXRPZlN0b2NrID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLm1haW4gPSBmYWxzZTtcbiAgICAkc2NvcGUucHJvZHVjdHMgPSAkc2NvcGUub3V0T2ZTdG9jaztcbiAgfVxuXG5cbiAgdmFyIG5hbWUgPSBcIm5hbWVcIjtcbiAgdmFyIHN0YXR1cyA9IFwic3RhdHVzXCI7XG4gIHZhciBxdWFudGl0eSA9IFwic3RvY2tcIjtcblxuICAkc2NvcGUuZmlsdGVyQnlOYW1lID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG5hbWUgPT09ICduYW1lJykge1xuICAgICAgbmFtZSA9ICctbmFtZSc7XG4gICAgICAkc2NvcGUucHJvZHVjdHMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnByb2R1Y3RzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9ICduYW1lJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gICRzY29wZS5maWx0ZXJCeVN0YXR1cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0dXMgPT09ICdzdGF0dXMnKSB7XG4gICAgICBzdGF0dXMgPSAnLXN0YXR1cyc7XG4gICAgICAkc2NvcGUucHJvZHVjdHMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnByb2R1Y3RzLCBzdGF0dXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSAnc3RhdHVzJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIHN0YXR1cyk7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLmZpbHRlckJ5UXVhbnRpdHkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAocXVhbnRpdHkgPT09ICdzdG9jaycpIHtcbiAgICAgIHF1YW50aXR5ID0gJy1zdG9jayc7XG4gICAgICAkc2NvcGUucHJvZHVjdHMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnByb2R1Y3RzLCBxdWFudGl0eSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHF1YW50aXR5ID0gJ3N0b2NrJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIHF1YW50aXR5KTtcbiAgICB9XG4gIH1cblxuXG59KSIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLXVwZGF0ZScsIHtcbiAgICAgICAgdXJsOiAnL2FkbWluL29yZGVycy86aWQnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL2FkbWluLXNpbmdsZS1vcmRlci5odG1sJyxcbiAgICBcdGNvbnRyb2xsZXI6ICdBZG1pblVwZGF0ZUN0cmwnLFxuICAgIFx0cmVzb2x2ZToge1xuICAgIFx0XHRvcmRlcjogZnVuY3Rpb24oT3JkZXJGYWN0b3J5KSB7XG4gICAgXHRcdFx0cmV0dXJuIE9yZGVyRmFjdG9yeS5mZXRjaEFsbCgpO1xuICAgIFx0XHR9XG4gICAgXHR9XG4gICAgfSk7XG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluVXBkYXRlQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgb3JkZXJzKSB7XG4gICAgJHNjb3BlLm9yZGVycyA9IG9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yZGVyLnN0YXR1cyAhPT0gJ2NhcnQnO1xuICAgICAgICAgICAgICAgIH0pO1xufSkiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdhZG1pblVzZXJzJywge1xuICAgIHVybDogJy9hZG1pbi91c2VycycsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi11c2Vycy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5Vc2Vyc0N0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGdldEFsbFVzZXJzOiBmdW5jdGlvbihVc2VyRmFjdG9yeSkge1xuICAgICAgICByZXR1cm4gVXNlckZhY3RvcnkuZmV0Y2hBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuXG5cbmFwcC5jb250cm9sbGVyKCdBZG1pblVzZXJzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0QWxsVXNlcnMsICRmaWx0ZXIpe1xuICAkc2NvcGUudXNlcnMgPSBnZXRBbGxVc2VycztcblxuICB2YXIgdXNlcklkID0gJ2lkJztcbiAgdmFyIGxhc3ROYW1lID0gJ2xhc3RfbmFtZSc7XG4gIHZhciBlbWFpbCA9ICdlbWFpbCc7XG5cbiAgJHNjb3BlLmZpbHRlckJ5VXNlcklkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHVzZXJJZCA9PT0gJ2lkJykge1xuICAgICAgdXNlcklkID0gJy1pZCc7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCB1c2VySWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2VySWQgPSAnaWQnO1xuICAgICAgJHNjb3BlLnVzZXJzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS51c2VycywgdXNlcklkKTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuZmlsdGVyQnlFbWFpbCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChlbWFpbCA9PT0gJ2VtYWlsJykge1xuICAgICAgZW1haWwgPSBcIi1lbWFpbFwiO1xuICAgICAgJHNjb3BlLnVzZXJzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS51c2VycywgZW1haWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbWFpbCA9ICdlbWFpbCc7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCBlbWFpbCk7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLmZpbHRlckJ5TGFzdE5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAobGFzdE5hbWUgPT09ICdsYXN0X25hbWUnKSB7XG4gICAgICBsYXN0TmFtZSA9IFwiLWxhc3RfbmFtZVwiO1xuICAgICAgJHNjb3BlLnVzZXJzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS51c2VycywgbGFzdE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYXN0TmFtZSA9ICdsYXN0X25hbWUnO1xuICAgICAgJHNjb3BlLnVzZXJzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS51c2VycywgbGFzdE5hbWUpO1xuICAgIH1cbiAgfVxuXG59KSIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoZWNrb3V0Jywge1xuICAgIHVybDogJy86aWQvY2hlY2tvdXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnL2pzL2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHVzZXI6IGZ1bmN0aW9uIChVc2VyRmFjdG9yeSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIGlmICghJHN0YXRlUGFyYW1zLmlkKSByZXR1cm4ge307XG4gICAgICAgIHJldHVybiBVc2VyRmFjdG9yeS5mZXRjaEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgfSxcbiAgICAgIGNhcnQ6IGZ1bmN0aW9uIChPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJDYXJ0KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGVja291dEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyLCBjYXJ0LCBPcmRlckZhY3RvcnksICRzdGF0ZSkge1xuXG4gJHNjb3BlLnVzZXIgPSB1c2VyO1xuICRzY29wZS5jYXJ0ID0gY2FydDtcbiAkc2NvcGUuc2hvd1NoaXBwaW5nID0gZmFsc2U7XG4gJHNjb3BlLmFkZHJlc3M7XG5cbiAkc2NvcGUudG9nZ2xlU2hpcHBpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICRzY29wZS5zaG93U2hpcHBpbmcgPSAhJHNjb3BlLnNob3dTaGlwcGluZztcblxuICBpZiAoJHNjb3BlLnNob3dTaGlwcGluZyA9PT0gZmFsc2UpIHtcbiAgICAkc2NvcGUuYWRkcmVzcyA9IHtzdHJlZXRfYWRkcmVzczogdXNlci5zdHJlZXRfYWRkcmVzcywgY2l0eTogdXNlci5jaXR5LCBzdGF0ZTogdXNlci5zdGF0ZSwgemlwOiB1c2VyLnppcCwgZmlyc3RfbmFtZTogdXNlci5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHVzZXIubGFzdF9uYW1lLCBzdGF0dXM6ICdvcmRlcmVkJywgZW1haWw6IHVzZXIuZW1haWx9XG4gIH0gZWxzZSB7XG4gICAgJHNjb3BlLmFkZHJlc3MgPSAkc2NvcGUuY2FydDtcbiAgfVxuXG4gfVxuXG4gJHNjb3BlLnN1Ym1pdE9yZGVyID0gZnVuY3Rpb24gKHVzZXJJZCwgY2FydElkLCBhZGRyZXNzKSB7XG5cbiAgaWYgKCRzY29wZS5zaG93U2hpcHBpbmcgPT09IGZhbHNlKSB7XG4gICAgYWRkcmVzcyA9IHtzdHJlZXRfYWRkcmVzczogdXNlci5zdHJlZXRfYWRkcmVzcywgY2l0eTogdXNlci5jaXR5LCBzdGF0ZTogdXNlci5zdGF0ZSwgemlwOiB1c2VyLnppcCwgZmlyc3RfbmFtZTogdXNlci5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHVzZXIubGFzdF9uYW1lLCBzdGF0dXM6ICdvcmRlcmVkJywgZW1haWw6IHVzZXIuZW1haWx9XG4gIH1cblxuICAkc2NvcGUuY2FydC5zdGF0dXMgPSBcIm9yZGVyZWRcIjtcbiAgJHNjb3BlLmNhcnQuZW1haWwgPSAkc2NvcGUudXNlci5lbWFpbDtcblxuICBPcmRlckZhY3RvcnkucHVyY2hhc2UodXNlcklkLCBjYXJ0SWQsIGFkZHJlc3MpXG4gICAgLnRoZW4oZnVuY3Rpb24gKCkge30pXG4gfVxuXG4gJHNjb3BlLmNhcnQuc3VidG90YWwgPSAwO1xuXG4gIC8vIHN1YnRvdGFsIG1hdGhcbiAgaWYgKGNhcnQucHJvZHVjdHMubGVuZ3RoKXtcbiAgICB2YXIgcHJpY2VzID0gY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9kdWN0LnByaWNlKTtcbiAgICB9KVxuICAgIHZhciBxdWFudGl0aWVzID0gY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG4gICAgICByZXR1cm4gcHJvZHVjdC5wcm9kdWN0T3JkZXIucXVhbnRpdHk7XG4gICAgfSlcbiAgICB2YXIgc3VidG90YWwgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpPGNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICAgIH1cbiAgICAkc2NvcGUuY2FydC5zdWJ0b3RhbCA9IHN1YnRvdGFsLnRvRml4ZWQoMik7XG4gIH1cblxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NvbmZpcm1hdGlvbicsIHtcbiAgICB1cmw6ICcvOmlkLzpvcmRlcklkL2NvbmZpcm1hdGlvbicsXG4gICAgdGVtcGxhdGVVcmw6ICcvanMvY2hlY2tvdXQvY29uZmlybWF0aW9uLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICByZXNvbHZlOiB7XG4gICAgICB1c2VyOiBmdW5jdGlvbiAoVXNlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gVXNlckZhY3RvcnkuZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICBvcmRlcjogZnVuY3Rpb24gKE9yZGVyRmFjdG9yeSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBPcmRlckZhY3RvcnkuZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5pZCwgJHN0YXRlUGFyYW1zLm9yZGVySWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXIsIG9yZGVyKSB7XG4gICRzY29wZS51c2VyID0gdXNlcjtcbiAgJHNjb3BlLm9yZGVyID0gb3JkZXI7XG5cbiAgJHNjb3BlLm9yZGVyLnN1YnRvdGFsID0gMDtcblxuICBpZiAob3JkZXIucHJvZHVjdHMubGVuZ3RoKXtcbiAgICB2YXIgcHJpY2VzID0gb3JkZXIucHJvZHVjdHMubWFwKGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvZHVjdC5wcmljZSk7XG4gICAgfSlcbiAgICB2YXIgcXVhbnRpdGllcyA9IG9yZGVyLnByb2R1Y3RzLm1hcChmdW5jdGlvbihwcm9kdWN0KXtcbiAgICAgIHJldHVybiBwcm9kdWN0LnByb2R1Y3RPcmRlci5xdWFudGl0eTtcbiAgICB9KVxuICAgIHZhciBzdWJ0b3RhbCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGk8b3JkZXIucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICAgIH1cbiAgICAkc2NvcGUub3JkZXIuc3VidG90YWwgPSBzdWJ0b3RhbDtcbiAgfVxuXG59KTtcbiIsImFwcC5mYWN0b3J5KCdIb21lUGFnZVBpY3MnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgXCJodHRwczovL3d3dy5yZWkuY29tL2Fzc2V0cy9kcnNwLzIwMTYvcTMvaG9tZXBhZ2UvMDctMjYvbGVhZC1icm9va3MtbWQtbGcvbGl2ZS5qcGdcIixcbiAgICAgICAgXCJodHRwczovL3d3dy5yZWkuY29tL2Fzc2V0cy9kcnNwLzIwMTYvcTMvaG9tZXBhZ2UvMDctMjYvcGFkZGxpbmcvbGl2ZS5qcGdcIixcbiAgICAgICAgXCJodHRwczovL2ltYWdlcy50aGVub3J0aGZhY2UuY29tL2lzL2ltYWdlL1RoZU5vcnRoRmFjZUJyYW5kLzA1MTExNi1hY3Rpdml0eS1oZXJvLWNsaW1iaW5nLWQ/JFNDQUxFLU9SSUdJTkFMJFwiLFxuICAgICAgICBcImh0dHA6Ly93d3cuZW1zLmNvbS9vbi9kZW1hbmR3YXJlLnN0YXRpYy8tL1NpdGVzLUVNUy1MaWJyYXJ5L2RlZmF1bHQvZHcxNmQ1NWU0Zi9pbWFnZXMvcHJvbW90aW9ucy9ob21lcGFnZS8yMDE2LzA3LzI0LzIwMTYwNzI0X2htX2JveDQuanBnXCJcbiAgICBdO1xufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgICAgICB1cmw6ICcvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9ob21lL2hvbWUuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ2Fyb3VzZWwnLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgIFx0cmFuZG9tUHJvZHVjdHM6IGZ1bmN0aW9uKFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgICAgIFx0XHRyZXR1cm4gUHJvZHVjdEZhY3RvcnkuZmV0Y2hBbGwoKTtcbiAgICAgICAgXHR9XG4gICAgICAgIH1cbiAgICB9KTtcbn0pO1xuXG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ2Fyb3VzZWwnLCBmdW5jdGlvbiAoJHNjb3BlLCBIb21lUGFnZVBpY3MsIHJhbmRvbVByb2R1Y3RzLCAkcm9vdFNjb3BlKSB7XG4gICAgJHNjb3BlLmltYWdlcyA9IF8uc2h1ZmZsZShIb21lUGFnZVBpY3MpO1xuICAgICRyb290U2NvcGUudGl0bGUgPSB0cnVlO1xuICAgICRzY29wZS5yYW5kb21Qcm9kdWN0cyA9IF8uc2FtcGxlKHJhbmRvbVByb2R1Y3RzLCA0KTtcbn0pO1xuIiwiKGZ1bmN0aW9uICgpIHtcblxuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8vIEhvcGUgeW91IGRpZG4ndCBmb3JnZXQgQW5ndWxhciEgRHVoLWRveS5cbiAgICBpZiAoIXdpbmRvdy5hbmd1bGFyKSB0aHJvdyBuZXcgRXJyb3IoJ0kgY2FuXFwndCBmaW5kIEFuZ3VsYXIhJyk7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2ZzYVByZUJ1aWx0JywgW10pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ1NvY2tldCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF3aW5kb3cuaW8pIHRocm93IG5ldyBFcnJvcignc29ja2V0LmlvIG5vdCBmb3VuZCEnKTtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbyh3aW5kb3cubG9jYXRpb24ub3JpZ2luKTtcbiAgICB9KTtcblxuICAgIC8vIEFVVEhfRVZFTlRTIGlzIHVzZWQgdGhyb3VnaG91dCBvdXIgYXBwIHRvXG4gICAgLy8gYnJvYWRjYXN0IGFuZCBsaXN0ZW4gZnJvbSBhbmQgdG8gdGhlICRyb290U2NvcGVcbiAgICAvLyBmb3IgaW1wb3J0YW50IGV2ZW50cyBhYm91dCBhdXRoZW50aWNhdGlvbiBmbG93LlxuICAgIGFwcC5jb25zdGFudCgnQVVUSF9FVkVOVFMnLCB7XG4gICAgICAgIGxvZ2luU3VjY2VzczogJ2F1dGgtbG9naW4tc3VjY2VzcycsXG4gICAgICAgIGxvZ2luRmFpbGVkOiAnYXV0aC1sb2dpbi1mYWlsZWQnLFxuICAgICAgICBsb2dvdXRTdWNjZXNzOiAnYXV0aC1sb2dvdXQtc3VjY2VzcycsXG4gICAgICAgIHNlc3Npb25UaW1lb3V0OiAnYXV0aC1zZXNzaW9uLXRpbWVvdXQnLFxuICAgICAgICBub3RBdXRoZW50aWNhdGVkOiAnYXV0aC1ub3QtYXV0aGVudGljYXRlZCcsXG4gICAgICAgIG5vdEF1dGhvcml6ZWQ6ICdhdXRoLW5vdC1hdXRob3JpemVkJ1xuICAgIH0pO1xuXG4gICAgYXBwLmZhY3RvcnkoJ0F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkcSwgQVVUSF9FVkVOVFMpIHtcbiAgICAgICAgdmFyIHN0YXR1c0RpY3QgPSB7XG4gICAgICAgICAgICA0MDE6IEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsXG4gICAgICAgICAgICA0MDM6IEFVVEhfRVZFTlRTLm5vdEF1dGhvcml6ZWQsXG4gICAgICAgICAgICA0MTk6IEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LFxuICAgICAgICAgICAgNDQwOiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVzcG9uc2VFcnJvcjogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KHN0YXR1c0RpY3RbcmVzcG9uc2Uuc3RhdHVzXSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICBhcHAuY29uZmlnKGZ1bmN0aW9uICgkaHR0cFByb3ZpZGVyKSB7XG4gICAgICAgICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goW1xuICAgICAgICAgICAgJyRpbmplY3RvcicsXG4gICAgICAgICAgICBmdW5jdGlvbiAoJGluamVjdG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoJ0F1dGhJbnRlcmNlcHRvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdBdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgU2Vzc2lvbiwgJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMsICRxKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gb25TdWNjZXNzZnVsTG9naW4ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIFNlc3Npb24uY3JlYXRlKGRhdGEuaWQsIGRhdGEudXNlcik7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzKTtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLnVzZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2VzIHRoZSBzZXNzaW9uIGZhY3RvcnkgdG8gc2VlIGlmIGFuXG4gICAgICAgIC8vIGF1dGhlbnRpY2F0ZWQgdXNlciBpcyBjdXJyZW50bHkgcmVnaXN0ZXJlZC5cbiAgICAgICAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gISFTZXNzaW9uLnVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5nZXRMb2dnZWRJblVzZXIgPSBmdW5jdGlvbiAoZnJvbVNlcnZlcikge1xuXG4gICAgICAgICAgICAvLyBJZiBhbiBhdXRoZW50aWNhdGVkIHNlc3Npb24gZXhpc3RzLCB3ZVxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSB1c2VyIGF0dGFjaGVkIHRvIHRoYXQgc2Vzc2lvblxuICAgICAgICAgICAgLy8gd2l0aCBhIHByb21pc2UuIFRoaXMgZW5zdXJlcyB0aGF0IHdlIGNhblxuICAgICAgICAgICAgLy8gYWx3YXlzIGludGVyZmFjZSB3aXRoIHRoaXMgbWV0aG9kIGFzeW5jaHJvbm91c2x5LlxuXG4gICAgICAgICAgICAvLyBPcHRpb25hbGx5LCBpZiB0cnVlIGlzIGdpdmVuIGFzIHRoZSBmcm9tU2VydmVyIHBhcmFtZXRlcixcbiAgICAgICAgICAgIC8vIHRoZW4gdGhpcyBjYWNoZWQgdmFsdWUgd2lsbCBub3QgYmUgdXNlZC5cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNBdXRoZW50aWNhdGVkKCkgJiYgZnJvbVNlcnZlciAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAkcS53aGVuKFNlc3Npb24udXNlcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE1ha2UgcmVxdWVzdCBHRVQgL3Nlc3Npb24uXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgdXNlciwgY2FsbCBvblN1Y2Nlc3NmdWxMb2dpbiB3aXRoIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIC8vIElmIGl0IHJldHVybnMgYSA0MDEgcmVzcG9uc2UsIHdlIGNhdGNoIGl0IGFuZCBpbnN0ZWFkIHJlc29sdmUgdG8gbnVsbC5cbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zZXNzaW9uJykudGhlbihvblN1Y2Nlc3NmdWxMb2dpbikuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zaWdudXAgPSBmdW5jdGlvbiAoY3JlZGVudGlhbHMpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2lnbnVwJywgY3JlZGVudGlhbHMpXG4gICAgICAgICAgICAgICAgLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHsgbWVzc2FnZTogJ0ludmFsaWQgbG9naW4gY3JlZGVudGlhbHMuJyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBTZXNzaW9uLmRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoQVVUSF9FVkVOVFMubG9nb3V0U3VjY2Vzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgIH0pO1xuXG4gICAgYXBwLnNlcnZpY2UoJ1Nlc3Npb24nLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgQVVUSF9FVkVOVFMpIHtcblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubm90QXV0aGVudGljYXRlZCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLnNlc3Npb25UaW1lb3V0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgIHRoaXMudXNlciA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbiAoc2Vzc2lvbklkLCB1c2VyKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gc2Vzc2lvbklkO1xuICAgICAgICAgICAgdGhpcy51c2VyID0gdXNlcjtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxufSkoKTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5zZW5kU2lnbnVwID0gZnVuY3Rpb24gKGxvZ2luSW5mbykge1xuXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAgICAgQXV0aFNlcnZpY2Uuc2lnbnVwKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ0ludmFsaWQgc2lnbnVwIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2FydCcsIHtcbiAgICAgICAgdXJsOiAnL2NhcnQvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlci90ZW1wbGF0ZXMvY2FydHBhZ2UuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIE9yZGVyRmFjdG9yeSwgU2Vzc2lvbiwgQXV0aFNlcnZpY2Upe1xuXHQvLyAkc2NvcGUuY2FydCA9IGNhcnQ7XG4gICRzY29wZS51c2VyID0gU2Vzc2lvbi51c2VyO1xuXG4vLyBzdWJ0b3RhbCBtYXRoXG5cdHZhciBjYWxjU3VidG90YWwgPSBmdW5jdGlvbiAoKXtcblx0XHRpZiAoJHNjb3BlLmNhcnQucHJvZHVjdHMubGVuZ3RoKXtcblx0XHRcdHZhciBwcmljZXMgPSAkc2NvcGUuY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG5cdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHByb2R1Y3QucHJpY2UpXG5cdFx0XHR9KVxuXHRcdFx0dmFyIHF1YW50aXRpZXMgPSAkc2NvcGUuY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG5cdFx0XHRcdHJldHVybiBwcm9kdWN0LnByb2R1Y3RPcmRlci5xdWFudGl0eTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgc3VidG90YWwgPSAwO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGk8JHNjb3BlLmNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdHN1YnRvdGFsICs9IHByaWNlc1tpXSAqIHF1YW50aXRpZXNbaV07XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FydC5zdWJ0b3RhbCA9IHN1YnRvdGFsLnRvRml4ZWQoMik7XG5cdFx0fVxuXHR9XG5cblx0Ly9Gb3JjZSBnZXR0aW5nIHVzZXIgYmVmb3JlIHRyeWluZyB0byBnZXQgdGhlIGNhcnRcblx0QXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKClcblx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRPcmRlckZhY3RvcnkuZ2V0VXNlckNhcnQoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHQkc2NvcGUuY2FydCA9IHJlcztcblx0XHRcdGNhbGNTdWJ0b3RhbCgpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJVU0VSIENBUlQ6XCIsIHJlcyk7XG5cdFx0fSlcblx0fSlcblxuXG4gICAgJHNjb3BlLnVwZGF0ZUNhcnQgPSBmdW5jdGlvbihwcm9kdWN0LCBxdWFudGl0eSl7XG4gICAgXHRPcmRlckZhY3RvcnkudXBkYXRlQ2FydChwcm9kdWN0LCBxdWFudGl0eSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXBkYXRlZENhcnQpe1xuICAgICAgICBcdCRzY29wZS5jYXJ0ID0gdXBkYXRlZENhcnQ7XG4gICAgICAgIFx0Y2FsY1N1YnRvdGFsKCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbn0pXG4iLCJhcHAuZmFjdG9yeSgnT3JkZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIFNlc3Npb24sIEF1dGhTZXJ2aWNlLCAkcSwgJGNvb2tpZXMsICRzdGF0ZSl7XG5cblx0dmFyIE9yZGVyRmFjdG9yeSA9IHt9O1xuXG5cblx0Ly8gV2UgaGF2ZSBhIGNoZWNrIHRvIHNlZSBpZiB0aGUgdXNlciBpc1xuXHQvLyBhdXRoZW50aWNhdGVkLCBidXQgZG8gd2UgaGF2ZSBhIGNoZWNrIHRvIG1ha2Vcblx0Ly8gc3VyZSB0aGF0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgaXMgdGhlIHNhbWVcblx0Ly8gYXMgdGhlIHVzZXIgd2hvc2UgY2FydCB0aGV5IGFyZSBxdWVyeWluZz9cblxuXHRPcmRlckZhY3RvcnkuZ2V0VXNlckNhcnQgPSBmdW5jdGlvbigpe1xuXG5cdFx0Ly9kZWFscyB3aXRoIEF1dGggdXNlcnNcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJytTZXNzaW9uLnVzZXIuaWQrJy9jYXJ0Jylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKG9yZGVycyl7XG5cdFx0XHRcdHJldHVybiBvcmRlcnMuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdC8vTk9OLUFVVEggVVNFUlNcblx0XHRyZXR1cm4gJHEud2hlbigkY29va2llcy5nZXRPYmplY3QoXCJjYXJ0XCIpKTtcblx0fVxuXG5cdE9yZGVyRmFjdG9yeS5nZXRBbGxVc2VyT3JkZXJzID0gZnVuY3Rpb24gKHVzZXJJZCkge1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVycy8nK3VzZXJJZCsnL2FsbCcpXG5cdFx0XHQudGhlbihmdW5jdGlvbihvcmRlcnMpe1xuXHRcdFx0XHRyZXR1cm4gb3JkZXJzLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdE9yZGVyRmFjdG9yeS5nZXRVc2VySGlzdG9yeSA9IGZ1bmN0aW9uICh1c2VySWQpIHtcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJyt1c2VySWQrJy9vcmRlcmhpc3RvcnknKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ob3JkZXJzKXtcblx0XHRcdFx0cmV0dXJuIG9yZGVycy5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRPcmRlckZhY3RvcnkucHVyY2hhc2UgPSBmdW5jdGlvbiAodXNlcklkLCBvcmRlcklkLCBhZGRyZXNzKSB7XG5cdFx0Y29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvJyArdXNlcklkKyBcIi9cIiArIG9yZGVySWQgKyAnL3B1cmNoYXNlJywgYWRkcmVzcylcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdjb25maXJtYXRpb24nLCB7aWQ6IHVzZXJJZCwgb3JkZXJJZDogb3JkZXJJZH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiQUREUkVTUzo6XCIsIGFkZHJlc3MpO1xuXHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvZ3Vlc3QvcHVyY2hhc2UnLCBhZGRyZXNzKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0JHN0YXRlLmdvKCdob21lJyk7XG5cdFx0XHRcdCRjb29raWVzLnB1dE9iamVjdCgnY2FydCcsIHtzdGF0dXM6IFwiY2FydFwiLCBwcm9kdWN0czogW10sIHN1YnRvdGFsOiAwfSlcblx0XHRcdH0pXG5cblx0XHR9XG5cdH1cblxuXHRPcmRlckZhY3RvcnkuZmV0Y2hCeUlkID0gZnVuY3Rpb24gKHVzZXJJZCwgb3JkZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXJzLycgKyB1c2VySWQgKyBcIi9cIiArIG9yZGVySWQpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAob3JkZXIpIHtcblx0XHRcdFx0cmV0dXJuIG9yZGVyLmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LnVwZGF0ZUNhcnQgPSBmdW5jdGlvbihwcm9kdWN0LCBxdWFudGl0eUNoYW5nZSl7XG5cdFx0aWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL29yZGVycy9cIitTZXNzaW9uLnVzZXIuaWQrXCIvdXBkYXRlQ2FydFwiLCB7cHJvZHVjdElkOiBwcm9kdWN0LmlkLCBxdWFudGl0eUNoYW5nZTogcXVhbnRpdHlDaGFuZ2V9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oY2FydCl7XG5cdFx0XHRcdCRzdGF0ZS5nbygnY2FydCcpO1xuXHRcdFx0XHRyZXR1cm4gY2FydC5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0Ly9Gb3Igbm9uLWF1dGggcGVvcGxlXG5cdFx0ZWxzZSB7XG5cdFx0XHQvL0dldCBjYXJ0IGZyb20gY29va2llXG5cdFx0XHR2YXIgY2FydCA9ICRjb29raWVzLmdldE9iamVjdChcImNhcnRcIik7XG5cblx0XHRcdC8vZmluZCBjYXJ0IElkeCBvZiBwcm9kdWN0IChDYW4ndCB1c2UgaW5kZXhPZiBiZWNhdXNlIHF1YW50aXR5IG9uIHByb2R1Y3RzLnByb2R1Y3RPcmRlci5xdWFudGl0eSBjb3VsZCBkaWZmZXIpXG5cdFx0XHR2YXIgY2FydElkeCA9IC0xO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0LnByb2R1Y3RzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0aWYgKGNhcnQucHJvZHVjdHNbaV0uaWQgPT09IHByb2R1Y3QuaWQpIHtcblx0XHRcdFx0XHRjYXJ0SWR4ID0gaTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9pZiBpbmNyZW1lbnRpbmcgcHJvZHVjdCBudW1cblx0XHRcdGlmIChxdWFudGl0eUNoYW5nZSA+IDApe1xuXHRcdFx0XHRpZiAoY2FydElkeCA9PT0gLTEpe1xuXHRcdFx0XHRcdC8vYWRkIHRvIGNhcnQgaWYgbm90IGluIHRoZXJlIEJVVCBPTkxZIGlmIHRoZSBwcm9kdWN0IHN0b2NrIGV4Y2VlZHMgdGhlIG51bWJlciB5b3UncmUgdHJ5aW5nIHRvIGFkZFxuXHRcdFx0XHRcdGlmIChwcm9kdWN0LnN0b2NrID49IHF1YW50aXR5Q2hhbmdlKSB7XG5cdFx0XHRcdFx0XHRwcm9kdWN0LnByb2R1Y3RPcmRlciA9IHtxdWFudGl0eTogcXVhbnRpdHlDaGFuZ2V9XG5cdFx0XHRcdFx0XHRjYXJ0LnByb2R1Y3RzLnB1c2gocHJvZHVjdCk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2NhcnQnKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL290aGVyd2lzZSBqdXN0IGluY3JlbWVudCB0aGUgcXVhbnRpdHkgQlVUIE9OTFkgaWYgdGhlIHN0b2NrIGV4Y2VlZHMgdGhlIGN1cnJlbnQgY2FydCBxdWFudGl0eStjaGFuZ2Vcblx0XHRcdFx0XHRpZiAocHJvZHVjdC5zdG9jayA+PSAoY2FydC5wcm9kdWN0c1tjYXJ0SWR4XS5wcm9kdWN0T3JkZXIucXVhbnRpdHkgKyBxdWFudGl0eUNoYW5nZSkpIHtcblx0XHRcdFx0XHRcdGNhcnQucHJvZHVjdHNbY2FydElkeF0ucHJvZHVjdE9yZGVyLnF1YW50aXR5ICs9IHF1YW50aXR5Q2hhbmdlO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdjYXJ0Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vVXBkYXRlIGNvb2tpZVxuXHRcdFx0XHQkY29va2llcy5wdXRPYmplY3QoXCJjYXJ0XCIsIGNhcnQpO1xuXHRcdFx0XHQvL3JldHVybiBhcyBwcm9taXNlXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKGNhcnQpO1xuXHRcdFx0XHQvL2Vsc2UgaWYgZGVjcmVhc2luZyBwcm9kdWN0IG51bVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9pZiB0byB6ZXJvLCByZW1vdmUgaXQgYWx0b2dldGhlclxuXHRcdFx0XHRpZiAocXVhbnRpdHlDaGFuZ2UgKyBjYXJ0LnByb2R1Y3RzW2NhcnRJZHhdLnByb2R1Y3RPcmRlci5xdWFudGl0eSA8PSAwKSB7XG5cdFx0XHRcdFx0Y2FydC5wcm9kdWN0cy5zcGxpY2UoY2FydElkeCwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9vdGhlcndpc2UganVzdCBkZWNyZWFzZSB0aGUgcXVhbnRpdHkgKGNoYW5nZSBpcyBuZWcgbnVtYmVyKVxuXHRcdFx0XHRcdGNhcnQucHJvZHVjdHNbY2FydElkeF0ucHJvZHVjdE9yZGVyLnF1YW50aXR5ICs9IHF1YW50aXR5Q2hhbmdlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vVXBkYXRlIGNvb2tpZVxuXHRcdFx0XHQkY29va2llcy5wdXRPYmplY3QoXCJjYXJ0XCIsIGNhcnQpO1xuXHRcdFx0XHQvL3JldHVybiBhcyBwcm9taXNlXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKGNhcnQpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LnNoaXAgPSBmdW5jdGlvbihvcmRlcklkKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvJyArIG9yZGVySWQgKyAnL3N0YXR1cycsIHtzdGF0dXM6ICdzaGlwcGVkJ30pXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoc2hpcHBlZE9yZGVyKSB7XG5cdFx0XHRcdHJldHVybiBzaGlwcGVkT3JkZXIuZGF0YTtcblx0XHRcdH0pXG5cdH1cblxuXHRPcmRlckZhY3Rvcnkuc2hpcEFsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvb3JkZXJzL3NoaXBhbGwnLCB7c3RhdHVzOiAnc2hpcHBlZCd9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHNoaXBwZWRPcmRlcnMpIHtcblx0XHRcdFx0cmV0dXJuIHNoaXBwZWRPcmRlcnMuZGF0YTtcblx0XHRcdH0pXG5cdH1cblxuXHRPcmRlckZhY3RvcnkuY2FuY2VsID0gZnVuY3Rpb24ob3JkZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvb3JkZXJzLycgKyBvcmRlcklkICsgJy9zdGF0dXMnLCB7c3RhdHVzOiAnY2FuY2VsZWQnfSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChjYW5jZWxlZE9yZGVyKSB7XG5cdFx0XHRcdHJldHVybiBjYW5jZWxlZE9yZGVyLmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LmZldGNoQWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJylcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbGxPcmRlcnMpIHtcblx0XHRcdFx0cmV0dXJuIGFsbE9yZGVycy5kYXRhO1xuXHRcdFx0fSlcblx0fVxuXG5cdHJldHVybiBPcmRlckZhY3Rvcnk7XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1Jldmlld0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbikge1xuXHRcblx0dmFyIHJldmlld0ZhY3RvcnkgPSB7fTtcblxuXHRyZXZpZXdGYWN0b3J5LmZldGNoQnlQcm9kdWN0SWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcHJvZHVjdHMvJyArIGlkICsgJy9yZXZpZXdzJylcblx0XHQudGhlbihmdW5jdGlvbiAocmV2aWV3cykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJyZXZpZXdzOlwiLCByZXZpZXdzKVxuXHRcdFx0cmV0dXJuIHJldmlld3MuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cmV2aWV3RmFjdG9yeS5mZXRjaEJ5VXNlcklkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkICsgJy9yZXZpZXdzJylcblx0XHQudGhlbihmdW5jdGlvbiAocmV2aWV3cykge1xuXHRcdFx0cmV0dXJuIHJldmlld3MuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cmV2aWV3RmFjdG9yeS5wb3N0UmV2aWV3ID0gZnVuY3Rpb24ocHJvZHVjdElkLCBkYXRhKXtcblx0XHRkYXRhLnByb2R1Y3RJZCA9IHByb2R1Y3RJZDtcblx0XHRpZiAoU2Vzc2lvbi51c2VyKSBkYXRhLnVzZXJJZCA9IFNlc3Npb24udXNlci5pZDtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0cy8nK3Byb2R1Y3RJZCsnL3Jldmlldy9zdWJtaXQnLCBkYXRhKVxuXHRcdC50aGVuKGZ1bmN0aW9uKG5ld1Jldmlldyl7XG5cdFx0XHRyZXR1cm4gbmV3UmV2aWV3LmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiByZXZpZXdGYWN0b3J5O1xufSkiLCJhcHAuZGlyZWN0aXZlKCdzdGFyUmF0aW5nJywgZnVuY3Rpb24oICkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHRlbXBsYXRlOlxuICAgICAgJzx1bCBjbGFzcz1cInN0YXItcmF0aW5nXCI+JyArXG4gICAgICAnPGxpIG5nLXJlcGVhdD1cInN0YXIgaW4gc3RhcnNcIiBjbGFzcz1cInN0YXJcIiBuZy1jbGFzcz1cIntmaWxsZWQ6IHN0YXIuZmlsbGVkfVwiIG5nLWNsaWNrPVwidG9nZ2xlKCRpbmRleClcIj4nICtcbiAgICAgICcgICAgPGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXN0YXJcIj48L2k+JyArIC8vIG9yICYjOTczM1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJhdGluZ1ZhbHVlOiAnPW5nTW9kZWwnLFxuICAgICAgcmVhZG9ubHk6ICc9PydcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICBmdW5jdGlvbiB1cGRhdGVTdGFycygpIHtcbiAgICAgICAgc2NvcGUuc3RhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICBzY29wZS5zdGFycy5wdXNoKHtcbiAgICAgICAgICAgIGZpbGxlZDogaSA8IHNjb3BlLnJhdGluZ1ZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHVwZGF0ZVN0YXJzKCk7XG5cbiAgICAgIHNjb3BlLnRvZ2dsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChzY29wZS5yZWFkb25seSA9PSB1bmRlZmluZWQgfHwgc2NvcGUucmVhZG9ubHkgPT09IGZhbHNlKXtcbiAgICAgICAgICBzY29wZS5yYXRpbmdWYWx1ZSA9IGluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNjb3BlLiR3YXRjaCgncmF0aW5nVmFsdWUnLCBmdW5jdGlvbihvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgdXBkYXRlU3RhcnMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbiIsImFwcC5mYWN0b3J5KCdQcm9kdWN0RmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKSB7XG5cdHZhciBwcm9kdWN0RmFjdG9yeSA9IHt9O1xuXG5cdHByb2R1Y3RGYWN0b3J5LmZldGNoQWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy8nKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHByb2R1Y3RzKSB7XG5cdFx0XHRcdHJldHVybiBwcm9kdWN0cy5kYXRhO1xuXHRcdFx0fSlcblx0fVxuXG5cdHByb2R1Y3RGYWN0b3J5LmZldGNoQnlJZCA9IGZ1bmN0aW9uKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9wcm9kdWN0cy8nICsgaWQpXG5cdFx0LnRoZW4oZnVuY3Rpb24gKHByb2R1Y3QpIHtcblx0XHRcdHJldHVybiBwcm9kdWN0LmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHByb2R1Y3RGYWN0b3J5LnVwZGF0ZVN0b2NrID0gZnVuY3Rpb24oaWQsIHN0b2NrKSB7XG5cdFx0dmFyIHN0YXR1cyA9IHN0b2NrID8gJ2F2YWlsYWJsZScgOiAnb3V0IG9mIHN0b2NrJyBcblx0XHRyZXR1cm4gJGh0dHAucHV0KCgnL2FwaS9wcm9kdWN0cy8nICsgaWQpLCB7c3RvY2s6IHN0b2NrLCBzdGF0dXM6IHN0YXR1c30pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGVkUHJvZHVjdCkge1xuXHRcdFx0XHRcdHJldHVybiB1cGRhdGVkUHJvZHVjdC5kYXRhO1xuXHRcdFx0XHR9KTtcblx0XG5cdH1cblxuXHRwcm9kdWN0RmFjdG9yeS5hZGRQcm9kdWN0ID0gZnVuY3Rpb24gKG5ld1Byb2R1Y3QpIHtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0cy8nLCBuZXdQcm9kdWN0KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKGNyZWF0ZWRQcm9kdWN0KSB7XG5cdFx0XHRcdHJldHVybiBjcmVhdGVkUHJvZHVjdC5kYXRhO1xuXHRcdFx0fSlcblx0fVxuXG5cdHByb2R1Y3RGYWN0b3J5LmRpc2NvbnRpbnVlID0gZnVuY3Rpb24gKGlkKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgoJy9hcGkvcHJvZHVjdHMvJyArIGlkKSwge3N0YXR1czogJ2Rpc2NvbnRpbnVlZCd9KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbiAodXBkYXRlZFByb2R1Y3QpIHtcblx0XHRcdFx0XHRyZXR1cm4gdXBkYXRlZFByb2R1Y3QuZGF0YTtcblx0XHRcdFx0fSk7XG5cdH1cblxuXG5cblx0cmV0dXJuIHByb2R1Y3RGYWN0b3J5O1xufSkiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ3Byb2R1Y3QnLCB7XG4gICAgdXJsOiAnL3Byb2R1Y3QvOmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL3Byb2R1Y3RzL3NpbmdsZS5wcm9kdWN0Lmh0bWwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgIHJldmlld3M6IGZ1bmN0aW9uKFJldmlld0ZhY3RvcnksJHN0YXRlUGFyYW1zKXtcbiAgICAgICAgICAgIHJldHVybiBSZXZpZXdGYWN0b3J5LmZldGNoQnlQcm9kdWN0SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGFsbFJldmlld3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYWxsUmV2aWV3cztcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgY29udHJvbGxlcjogJ1Byb2R1Y3RDdHJsJ1xuICB9KVxuXG59KTtcblxuYXBwLmNvbnRyb2xsZXIoJ1Byb2R1Y3RDdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIFByb2R1Y3RGYWN0b3J5LCAkbG9nLCBPcmRlckZhY3RvcnksIHJldmlld3MsIFJldmlld0ZhY3RvcnksIFNlc3Npb24pIHtcblxuICB2YXIgYXZlcmFnZVJhdGluZyA9IChyZXZpZXdzLm1hcChmdW5jdGlvbihyKXtyZXR1cm4gci5yYXRpbmd9KS5yZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYStifSkpL3Jldmlld3MubGVuZ3RoO1xuICAkc2NvcGUucmF0aW5nVmFsdWUgPSBhdmVyYWdlUmF0aW5nOyBcblxuICAkc2NvcGUucmV2aWV3cyA9IHJldmlld3M7XG5cbiAgJHNjb3BlLm5ld1JldmlldyA9IHtyYXRpbmc6IDUsIHRleHQ6IFwiXCJ9O1xuXG4gICRzY29wZS5zdWJtaXRSZXZpZXcgPSBmdW5jdGlvbiAoKXtcbiAgICBpZiAoJHNjb3BlLm5ld1Jldmlldy50ZXh0ID09PSBcIlwiKSByZXR1cm47XG4gICAgUmV2aWV3RmFjdG9yeS5wb3N0UmV2aWV3KCRzY29wZS5wcm9kdWN0LmlkLCAkc2NvcGUubmV3UmV2aWV3KVxuICAgIC50aGVuKGZ1bmN0aW9uKG5ld1Jldmlldyl7XG4gICAgICBuZXdSZXZpZXcudXNlciA9IFNlc3Npb24udXNlclxuICAgICAgJHNjb3BlLnJldmlld3MucHVzaChuZXdSZXZpZXcpO1xuICAgICAgJHNjb3BlLmxlYXZlUmV2aWV3ID0gZmFsc2U7XG4gICAgICAkc2NvcGUubmV3UmV2aWV3ID0ge3JhdGluZzogNSwgdGV4dDogXCJcIn07XG4gICAgfSlcbiAgfVxuXG5cdCRzY29wZS5xdWFudGl0eSA9IDE7XG5cbiBcdFByb2R1Y3RGYWN0b3J5LmZldGNoQnlJZCgkc3RhdGVQYXJhbXMuaWQpXG5cdC50aGVuKGZ1bmN0aW9uIChwcm9kdWN0KSB7XG4gICAgICAkc2NvcGUucHJvZHVjdCA9IHByb2R1Y3Q7XG4gICAgfSlcbiAgICAuY2F0Y2goJGxvZyk7XG5cblx0JHNjb3BlLnVwID0gZnVuY3Rpb24oKXtcbiAgICBpZiAoJHNjb3BlLnF1YW50aXR5ID49ICRzY29wZS5wcm9kdWN0LnN0b2NrKSByZXR1cm47XG5cdFx0JHNjb3BlLnF1YW50aXR5Kys7XG5cdH1cblxuXHQkc2NvcGUuZG93biA9IGZ1bmN0aW9uKCl7XG5cdFx0aWYgKCRzY29wZS5xdWFudGl0eSA+IDEpICRzY29wZS5xdWFudGl0eS0tO1xuXHR9XG5cblx0JHNjb3BlLmFkZFRvQ2FydCA9IGZ1bmN0aW9uKCl7XG4gICAgXHRPcmRlckZhY3RvcnkudXBkYXRlQ2FydCgkc2NvcGUucHJvZHVjdCwgJHNjb3BlLnF1YW50aXR5KVxuICAgIH07XG5cbiAgLy8gUmV2aWV3RmFjdG9yeS5mZXRjaEJ5UHJvZHVjdElkKCRzdGF0ZVBhcmFtcy5pZClcbiAgLy8gLnRoZW4oZnVuY3Rpb24gKGFsbFJldmlld3MpIHtcbiAgLy8gICAgICRzY29wZS5yZXZpZXdzID0gYWxsUmV2aWV3cztcbiAgLy8gICAgIHZhciBhdmVyYWdlUmF0aW5nID0gKGFsbFJldmlld3MubWFwKGZ1bmN0aW9uKHIpe3JldHVybiByLnJhdGluZ30pLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9KSkvYWxsUmV2aWV3cy5sZW5ndGg7XG4gIC8vICAgICAkc2NvcGUucmF0aW5nVmFsdWUgPSBhdmVyYWdlUmF0aW5nOyBcbiAgLy8gfSlcblxufSlcbiIsImFwcC5mYWN0b3J5KCdVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YShyZXMpIHsgcmV0dXJuIHJlcy5kYXRhOyB9XG5cbiAgdmFyIFVzZXIgPSB7fTtcblxuICBVc2VyLmZldGNoQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyJylcbiAgICAgIC50aGVuKGdldERhdGEpO1xuICB9XG5cbiAgVXNlci5mZXRjaEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgaWQpXG4gICAgICAudGhlbihnZXREYXRhKTtcbiAgfTtcblxuICBVc2VyLmRlbGV0ZVVzZXIgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdXNlci8nICsgaWQpO1xuICB9XG5cbiAgVXNlci5jcmVhdGVVc2VyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXIvJywgZGF0YSlcbiAgICAgIC50aGVuKGdldERhdGEpO1xuICB9XG5cbiAgVXNlci5tb2RpZnlVc2VyID0gZnVuY3Rpb24oaWQsIGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3VzZXIvJyArIGlkLCBkYXRhKVxuICAgICAgLnRoZW4oZ2V0RGF0YSk7XG4gIH1cblxuICByZXR1cm4gVXNlcjtcblxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ2FkZHJlc3MnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgYWRkcmVzc1ZpZXc6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jaGVja291dC90ZW1wbGF0ZXMvYWRkcmVzc2Zvcm0uaHRtbCdcbiAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdjYXJ0JywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL3RlbXBsYXRlcy9jYXJ0Lmh0bWwnLFxuICB9XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnb3JkZXJIaXN0b3J5JywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL3RlbXBsYXRlcy9vcmRlci1oaXN0b3J5Lmh0bWwnLFxuICB9XG5cbn0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbG9nby9sb2dvLmh0bWwnXG4gICAgfTtcbn0pO1xuXG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvVHdvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbG9nby9sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ25hdmJhcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsICRzdGF0ZSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuXG4gICAgICAgICAgICBzY29wZS5pdGVtcyA9IFtcbiAgICAgICAgICAgICAgICAvLyB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQWJvdXQnLCBzdGF0ZTogJ2Fib3V0JyB9XG4gICAgICAgICAgICAgICAgLy8geyBsYWJlbDogJ0FjY291bnQgSW5mb3JtYXRpb24nLCBzdGF0ZTogJ21lbWJlcnNPbmx5JywgYXV0aDogdHJ1ZSB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBzY29wZS5hY2NvdW50ID0ge2xhYmVsOiAnQWNjb3VudCBJbmZvcm1hdGlvbicsIHN0YXRlOiAnYWNjb3VudCcsIGF1dGg6IHRydWV9O1xuXG4gICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLnRpdGxlID0gdHJ1ZTtcblxuICAgICAgICAgICAgc2NvcGUuaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2V0VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHJlbW92ZVVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5sZWF2ZUhvbWUgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzY29wZS50aXRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NvcGUuY29tZUhvbWUgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzY29wZS50aXRsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnc2VhcmNoYmFyJywgZnVuY3Rpb24gKCRzdGF0ZSwgUHJvZHVjdEZhY3RvcnkpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcblxuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvc2VhcmNoYmFyLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHNjb3BlLmdldFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUHJvZHVjdEZhY3RvcnkuZmV0Y2hBbGwoKVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbn0pXG4iLCJhcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
