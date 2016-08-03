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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFib3V0L2Fib3V0LmpzIiwiYWNjb3VudC9hY2NvdW50LmpzIiwiYWNjb3VudC91cGRhdGUtaW5mby5qcyIsImJyb3dzZS1wcm9kdWN0cy9icm93c2UtcHJvZHVjdHMuanMiLCJjaGVja291dC9jaGVja291dC5qcyIsImNoZWNrb3V0L2NvbmZpcm1hdGlvbi5qcyIsImZzYS9mc2EtcHJlLWJ1aWx0LmpzIiwiaG9tZS9Ib21lcGFnZVBpY3MuanMiLCJob21lL2hvbWUuanMiLCJsb2dpbi9sb2dpbi5qcyIsImFkbWluL2FkbWluLm9yZGVycy5qcyIsImFkbWluL2FkbWluLnByb2R1Y3RzLmpzIiwiYWRtaW4vYWRtaW4udXBkYXRlLmpzIiwiYWRtaW4vYWRtaW4udXNlci5qcyIsInByb2R1Y3RzL3Byb2R1Y3QuZmFjdG9yeS5qcyIsInByb2R1Y3RzL3NpbmdsZS5wcm9kdWN0LnN0YXRlLmpzIiwib3JkZXIvY2FydC5qcyIsIm9yZGVyL29yZGVyLWZhY3RvcnkuanMiLCJyZXZpZXdzL3Jldmlldy5mYWN0b3J5LmpzIiwicmV2aWV3cy9yZXZpZXdzLmpzIiwidXNlci1kZXRhaWxzL3VzZXIuanMiLCJjaGVja291dC90ZW1wbGF0ZXMvYWRkcmVzc2Zvcm0uZGlyZWN0aXZlLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9GdWxsc3RhY2tQaWNzLmpzIiwiY29tbW9uL2ZhY3Rvcmllcy9SYW5kb21HcmVldGluZ3MuanMiLCJvcmRlci90ZW1wbGF0ZXMvY2FydC5kaXJlY3RpdmUuanMiLCJvcmRlci90ZW1wbGF0ZXMvb3JkZXItaGlzdG9yeS1kaXJlY3RpdmUuanMiLCJjb21tb24vZGlyZWN0aXZlcy9sb2dvL2xvZ28uanMiLCJjb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvbmF2YmFyLmpzIiwiY29tbW9uL2RpcmVjdGl2ZXMvbmF2YmFyL3NlYXJjaGJhci5qcyIsImNvbW1vbi9kaXJlY3RpdmVzL3JhbmRvLWdyZWV0aW5nL3JhbmRvLWdyZWV0aW5nLmpzIl0s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OztBQWdDQSxJQUFBLFVBQUEsQ0FBQSxVQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQSxVQUFBLEVBQUE7QUFDQSxTQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxPQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsS0FBQTtBQUNBLFNBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxLQUFBO0FBQ0EsU0FBQSxPQUFBLENBQUEsZUFBQSxHQUFBLEtBQUE7O0FBRUEsU0FBQSxPQUFBLENBQUEsY0FBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxpQkFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxpQkFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxlQUFBO0FBQ0EsR0FGQTs7QUFJQSxTQUFBLE9BQUEsQ0FBQSxlQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsT0FBQSxDQUFBLGVBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxDQUFBLGVBQUE7O0FBRUEsZ0JBQUEsVUFBQSxDQUFBLE9BQUEsSUFBQSxDQUFBLEVBQUEsRUFBQSxPQUFBLElBQUE7QUFFQSxHQUxBOztBQU9BLFNBQUEsT0FBQSxDQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxPQUFBLENBQUEsZUFBQSxHQUFBLENBQUEsT0FBQSxPQUFBLENBQUEsZUFBQTs7QUFFQSxnQkFBQSxVQUFBLENBQUEsT0FBQSxJQUFBLENBQUEsRUFBQSxFQUFBLE9BQUEsSUFBQTtB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LFlBQUEsRUFBQSxZQUFBLEVBQUE7QUFDQSxlQUFBLGFBQUEsV0FBQSxDQUFBLGFBQUEsRUFBQSxDQUFBO0FBQ0E7QUFQQTtBQUpBLEdBQUE7QUFlQSxDQWpCQTs7QUFtQkEsSUFBQSxVQUFBLENBQUEsY0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsWUFBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQSxTQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsU0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLFNBQUEsWUFBQSxHQUFBLEtBQUE7QUFDQSxTQUFBLE9BQUE7O0FBRUEsU0FBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsWUFBQSxHQUFBLENBQUEsT0FBQSxZQUFBOztBQUVBLFFBQUEsT0FBQSxZQUFBLEtBQUEsS0FBQSxFQUFBO0FBQ0EsYUFBQSxPQUFBLEdBQUEsRUFBQSxnQkFBQSxLQUFBLGNBQUEsRUFBQSxNQUFBLEtBQUEsSUFBQSxFQUFBLE9BQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEdBQUEsRUFBQSxZQUFBLEtBQUEsVUFBQSxFQUFBLFdBQUEsS0FBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxLQUFBLEtBQUEsRUFBQTtBQUNBLEtBRkEsTUFFQTtBQUNBLGFBQUEsT0FBQSxHQUFBLE9BQUEsSUFBQTtBQUNBO0FBRUEsR0FUQTs7QUFXQSxTQUFBLFdBQUEsR0FBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBOztBQUVBLFFBQUEsT0FBQSxZQUFBLEtBQUEsS0FBQSxFQUFBO0FBQ0EsZ0JBQUEsRUFBQSxnQkFBQSxLQUFBLGNBQUEsRUFBQSxNQUFBLEtBQUEsSUFBQSxFQUFBLE9BQUEsS0FBQSxLQUFBLEVBQUEsS0FBQSxLQUFBLEdBQUEsRUFBQSxZQUFBLEtBQUEsVUFBQSxFQUFBLFdBQUEsS0FBQSxTQUFBLEVBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxLQUFBLEtBQUEsRUFBQTtBQUNBOztBQUVBLFdBQUEsSUFBQSxDQUFBLE1B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S0FBQSxJQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQUEsZUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLENBQUEsQ0FBQSxRQUFBLElBQUE7QUFDQSxLQUZBOztBQUlBLFNBQUEsZUFBQSxHQUFBLFVBQUEsVUFBQSxFQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsVUFBQSxLQUFBLGVBQUEsTUFBQSxlQUFBLElBQUEsRUFBQTtBQUNBLGVBQUEsR0FBQSxJQUFBLENBQUEsUUFBQSxJQUFBLENBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLFVBQUEsRUFBQSxJQUFBLENBQUEsaUJBQUEsRUFBQSxLQUFBLENBQUEsWUFBQTtBQUNBLGVBQUEsSUFBQTtBQUNBLE9BRkEsQ0FBQTtBQUlBLEtBckJBOztBQXVCQSxTQUFBLEtBQUEsR0FBQSxVQUFBLFdBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxJQUFBLENBQUEsUUFBQSxFQUFBLFdBQUEsRUFDQSxJQURBLENBQ0EsaUJBREEsRUFFQSxLQUZBLENBRUEsWUFBQTtBQUNBLGVBQUEsR0FBQSxNQUFBLENBQUEsRUFBQSxTQUFBLDRCQUFBLEVBQUEsQ0FBQTtBQUNBLE9BSkEsQ0FBQTtBQUtBLEtBTkE7O0FBUUEsU0FBQSxNQUFBLEdBQUEsVUFBQSxXQUFBLEVBQUE7QUFDQSxhQUFBLE1BQUEsSUFBQSxDQUFBLFNBQUEsRUFBQSxXQUFBLEVBQ0EsSUFEQSxDQUNBLGlCQURBLEVBRUEsS0FGQSxDQUVBLFlBQUE7QUFDQSxlQUFBLEdBQUEsTUFBQSxDQUFBLEVBQUEsU0FBQSw0QkFBQSxFQUFBLENBQUE7QUFDQSxPQUpBLENBQUE7QUFLQSxLQU5BOztBQVFBLFNBQUEsTUFBQSxHQUFBLFlBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLFNBQUEsRUFBQSxJQUFBLENBQUEsWUFBQTtBQUNBLGdCQUFBLE9BQUE7QUFDQSxtQkFBQSxVQUFBLENBQUEsWUFBQSxhQUFBO0FBQ0EsT0FIQSxDQUFBO0FB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QSxnQkFBQSxpQkFIQTtBQUlBLGFBQUE7QUFDQSxjQUFBLGdCQUFBLFlBQUEsRUFBQTtBQUNBLGVBQUEsYUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBYUEsSUFBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLFlBQUEsRUFBQTs7QUFHQSxTQUFBLFNBQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsTUFBQTtBQUNBLEdBRkEsQ0FBQTs7QUFJQSxTQUFBLE1BQUEsR0FBQSxPQUFBLFNBQUE7O0FBRUEsU0FBQSxpQkFBQSxHQUFBLE9BQUEsU0FBQSxDQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsU0FBQTtBQUNBLEdBRkEsQ0FBQTs7QUFLQSxNQUFBLE9BQUEsaUJBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxJQUFBO0FBQ0EsR0FGQSxNQUVBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBOztBQUVBLFNBQUEsT0FBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLElBQUEsR0FBQSxLQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsT0FBQSxTQUFBO0FBQ0EsR0FIQTs7QUFLQSxTQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLE9BQUEsaUJBQUE7QUFDQSxHQUhBOztBQU1BLE1BQUEsU0FBQSxJQUFBO0FBQ0EsTUFBQSxTQUFBLFFBQUE7QUFDQSxNQUFBLE9BQUEsV0FBQTs7QUFFQSxTQUFBLGlCQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsV0FBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxlQUFBLElBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLE1BQUEsRUFBQSxNQUFBLENBQUE7QUFDQTtBQUVBLEdBVEE7O0FBV0EsU0FBQSxPQUFBLEdBQUEsYUFBQSxPQUFBOztBQUVBLFNBQUEsSUFBQSxHQUFBLGFBQUEsSUFBQTtBQUNBLFNBQUEsVUFBQSxHQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsVUFBQSxNQUFBLEdBQUEsU0FBQTtBQUNBLEdBRkE7O0FBSUEsU0FBQSxVQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsaUJBQUEsR0FBQSxPQUFBLGlCQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsWUFBQSxNQUFBLEdBQUEsU0FBQTtBQUNBLGFBQUEsS0FBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLFdBQUEsU0FBQSxHQUFBLE9BQUEsU0FBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFVBQUEsTUFBQSxNQUFBLEtBQUEsU0FBQSxFQUFBO0FBQ0EsY0FBQSxNQUFBLEdBQUEsU0FBQTtBQUNBO0FBQ0EsYUFBQSxLQUFBO0FBQ0EsS0FMQSxDQUFBO0FBTUEsR0FYQTs7QUFhQSxTQUFBLE1BQUEsR0FBQSxhQUFBLE1BQUE7QUFDQSxTQUFBLFlBQUEsR0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFVBQUEsTUFBQSxHQUFBLFVBQUE7QUFDQSxHQUZBOztBQUlBLFNBQUEsU0FBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLFNBQUEsV0FBQSxFQUFBO0FBQ0EsYUFBQSxZQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsYUFBQSxXQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsSUFBQSxDQUFBO0FBQ0E7QUFDQSxHQVJBOztBQVVBLFNBQUEsWUFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLFdBQUEsUUFBQSxFQUFBO0FBQ0EsZUFBQSxTQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsTUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsZUFBQSxRQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxNQUFBLEVBQUEsTUFBQSxDQUFBO0FBQ0E7QUFDQSxHQVJBO0FBVUEsQ0EzRkE7O0FDYkEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxLQUFBLENBQUEsZ0JBQUEsRUFBQTtBQUNBLFNBQUEsaUJBREE7QUFFQSxpQkFBQSw4QkFGQTtBQUdBLGdCQUFBLG1CQUhBO0FBSUEsYUFBQTtBQUNBLHNCQUFBLHdCQUFBLGNBQUEsRUFBQTtBQUNBLGVBQUEsZUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBY0EsSUFBQSxVQUFBLENBQUEsbUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxjQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsU0FBQSxXQUFBLEdBQUEsY0FBQTs7QUFFQSxTQUFBLFVBQUEsR0FBQSxPQUFBLFdBQUEsQ0FBQSxNQUFBLENBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLFFBQUEsTUFBQSxLQUFBLGNBQUE7QUFDQSxHQUZBLENBQUE7O0FBSUEsU0FBQSxRQUFBLEdBQUEsT0FBQSxXQUFBOztBQUVBLE1BQUEsT0FBQSxVQUFBLENBQUEsTUFBQSxFQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsSUFBQTtBQUNBLEdBRkEsTUFFQTtBQUNBLFdBQUEsSUFBQSxHQUFBLEtBQUE7QUFDQTs7QUFFQSxTQUFBLE9BQUEsR0FBQSxZQUFBO0FBQ0EsV0FBQSxJQUFBLEdBQUEsS0FBQTtBQUNBLFdBQUEsUUFBQSxHQUFBLE9BQUEsV0FBQTtBQUNBLEdBSEE7O0FBS0EsU0FBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsSUFBQSxHQUFBLEtBQUE7QUFDQSxXQUFBLFFBQUEsR0FBQSxPQUFBLFVBQUE7QUFDQSxHQUhBOztBQU1BLE1BQUEsT0FBQSxNQUFBO0FBQ0EsTUFBQSxTQUFBLFFBQUE7QUFDQSxNQUFBLFdBQUEsT0FBQTs7QUFFQSxTQUFBLFlBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxTQUFBLE1BQUEsRUFBQTtBQUNBLGFBQUEsT0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGFBQUEsTUFBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLElBQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTs7QUFVQSxTQUFBLGNBQUEsR0FBQSxZQUFBO0FBQ0EsUUFBQSxXQUFBLFFBQUEsRUFBQTtBQUNBLGVBQUEsU0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGVBQUEsUUFBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLE1BQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTs7QUFVQSxTQUFBLGdCQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsYUFBQSxPQUFBLEVBQUE7QUFDQSxpQkFBQSxRQUFBO0FBQ0EsYUFBQSxRQUFBLEdBQUEsUUFBQSxTQUFBLEVBQUEsT0FBQSxRQUFBLEVBQUEsUUFBQSxDQUFBO0FBQ0EsS0FIQSxNQUdBO0FBQ0EsaUJBQUEsT0FBQTtBQUNBLGFBQUEsUUFBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsUUFBQSxFQUFBLFFBQUEsQ0FBQTtBQUNBO0FBQ0EsR0FSQTtBQVdBLENBN0RBO0FDZEEsSUFBQSxNQUFBLENBQUEsVUFBQSxjQUFBLEVBQUE7QUFDQSxpQkFBQSxLQUFBLENBQUEsY0FBQSxFQUFBO0FBQ0EsU0FBQSxtQkFEQTtBQUVBLGlCQUFBLGtDQUZBO0FBR0EsZ0JBQUEsaUJBSEE7QUFJQSxhQUFBO0FBQ0EsYUFBQSxlQUFBLFlBQUEsRUFBQTtBQUNBLGVBQUEsYUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBYUEsSUFBQSxVQUFBLENBQUEsaUJBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxNQUFBLEVBQUE7QUFDQSxTQUFBLE1BQUEsR0FBQSxPQUFBLE1BQUEsQ0FBQSxVQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxNQUFBLEtBQUEsTUFBQTtBQUNBLEdBRkEsQ0FBQTtBQUdBLENBSkE7QUNiQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxZQUFBLEVBQUE7QUFDQSxTQUFBLGNBREE7QUFFQSxpQkFBQSwyQkFGQTtBQUdBLGdCQUFBLGdCQUhBO0FBSUEsYUFBQTtBQUNBLG1CQUFBLHFCQUFBLFdBQUEsRUFBQTtBQUNBLGVBQUEsWUFBQSxRQUFBLEVBQUE7QUFDQTtBQUhBO0FBSkEsR0FBQTtBQVVBLENBWEE7O0FBY0EsSUFBQSxVQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLE1BQUEsRUFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsU0FBQSxLQUFBLEdBQUEsV0FBQTs7QUFFQSxNQUFBLFNBQUEsSUFBQTtBQUNBLE1BQUEsV0FBQSxXQUFBO0FBQ0EsTUFBQSxRQUFBLE9BQUE7O0FBRUEsU0FBQSxjQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsV0FBQSxJQUFBLEVBQUE7QUFDQSxlQUFBLEtBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxNQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxlQUFBLElBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxNQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7O0FBVUEsU0FBQSxhQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsVUFBQSxPQUFBLEVBQUE7QUFDQSxjQUFBLFFBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxLQUFBLENBQUE7QUFDQSxLQUhBLE1BR0E7QUFDQSxjQUFBLE9BQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxLQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7O0FBVUEsU0FBQSxnQkFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLGFBQUEsV0FBQSxFQUFBO0FBQ0EsaUJBQUEsWUFBQTtBQUNBLGFBQUEsS0FBQSxHQUFBLFFBQUEsU0FBQSxFQUFBLE9BQUEsS0FBQSxFQUFBLFFBQUEsQ0FBQTtBQUNBLEtBSEEsTUFHQTtBQUNBLGlCQUFBLFdBQUE7QUFDQSxhQUFBLEtBQUEsR0FBQSxRQUFBLFNBQUEsRUFBQSxPQUFBLEtBQUEsRUFBQSxRQUFBLENBQUE7QUFDQTtBQUNBLEdBUkE7QUFVQSxDQXJDQTtBQ2RBLElBQUEsT0FBQSxDQUFBLGdCQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUE7QUFDQSxNQUFBLGlCQUFBLEVBQUE7O0FBRUEsaUJBQUEsUUFBQSxHQUFBLFlBQUE7QUFDQSxXQUFBLE1BQUEsR0FBQSxDQUFBLGdCQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsUUFBQSxFQUFBO0FBQ0EsYUFBQSxTQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGlCQUFBLFNBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEsbUJBQUEsRUFBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGFBQUEsUUFBQSxJQUFBO0FBQ0EsS0FIQSxDQUFBO0FBSUEsR0FMQTs7QUFPQSxpQkFBQSxXQUFBLEdBQUEsVUFBQSxFQUFBLEVBQUEsS0FBQSxFQUFBO0FBQ0EsUUFBQSxTQUFBLFFBQUEsV0FBQSxHQUFBLGNBQUE7QUFDQSxXQUFBLE1BQUEsR0FBQSxDQUFBLG1CQUFBLEVBQUEsRUFBQSxFQUFBLE9BQUEsS0FBQSxFQUFBLFFBQUEsTUFBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsYUFBQSxlQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFLQSxHQVBBOztBQVNBLGlCQUFBLFVBQUEsR0FBQSxVQUFBLFVBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxJQUFBLENBQUEsZ0JBQUEsRUFBQSxVQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsY0FBQSxFQUFBO0FBQ0EsYUFBQSxlQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGlCQUFBLFdBQUEsR0FBQSxVQUFBLEVBQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEsbUJBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxjQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxjQUFBLEVBQUE7QUFDQSxhQUFBLGVBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBU0EsU0FBQSxjQUFBO0FBQ0EsQ0EzQ0E7QUNBQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTs7QUFFQSxpQkFBQSxLQUFBLENBQUEsU0FBQSxFQUFBO0FBQ0EsU0FBQSxjQURBO0FBRUEsaUJBQUEsaUNBRkE7QUFHQSxhQUFBO0FBQ0EsZUFBQSxpQkFBQSxhQUFBLEVBQUEsWUFBQSxFQUFBO0FBQ0EsZUFBQSxjQUFBLGdCQUFBLENBQUEsYUFBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsVUFBQSxFQUFBO0FBQ0EsaUJBQUEsVUFBQTtBQUNBLFNBSEEsQ0FBQTtBQUlBO0FBTkEsS0FIQTtBQVdBLGdCQUFBO0FBWEEsR0FBQTtBQWNBLENBaEJBOztBQWtCQSxJQUFBLFVBQUEsQ0FBQSxhQUFBLEVBQUEsVUFBQSxNQUFBLEVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxjQUFBLEVBQUEsSUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsYUFBQSxFQUFBLE9BQUEsRUFBQTs7QUFFQSxNQUFBLGdCQUFBLFFBQUEsR0FBQSxDQUFBLFVBQUEsQ0FBQSxFQUFBO0FBQUEsV0FBQSxFQUFBLE1BQUE7QUFBQSxHQUFBLEVBQUEsTUFBQSxDQUFBLFVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQTtBQUFBLFdBQUEsSUFBQSxDQUFBO0FBQUEsR0FBQSxDQUFBLEdBQUEsUUFBQSxNQUFBO0FBQ0EsU0FBQSxXQUFBLEdBQUEsYUFBQTs7QUFFQSxTQUFBLE9BQUEsR0FBQSxPQUFBOztBQUVBLFNBQUEsU0FBQSxHQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUE7O0FBRUEsU0FBQSxZQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsT0FBQSxTQUFBLENBQUEsSUFBQSxLQUFBLEVBQUEsRUFBQTtBQUNBLGtCQUFBLFVBQUEsQ0FBQSxPQUFBLE9BQUEsQ0FBQSxFQUFBLEVBQUEsT0FBQSxTQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsU0FBQSxFQUFBO0FBQ0EsZ0JBQUEsSUFBQSxHQUFBLFFBQUEsSUFBQTtBQUNBLGFBQUEsT0FBQSxDQUFBLElBQUEsQ0FBQSxTQUFBO0FBQ0EsYUFBQSxXQUFBLEdBQUEsS0FBQTtBQUNBLGFBQUEsU0FBQSxHQUFBLEVBQUEsUUFBQSxDQUFBLEVBQUEsTUFBQSxFQUFBLEVBQUE7QUFDQSxLQU5BO0FBT0EsR0FUQTs7QUFXQSxTQUFBLFFBQUEsR0FBQSxDQUFBOztBQUVBLGlCQUFBLFNBQUEsQ0FBQSxhQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxPQUFBLEVBQUE7QUFDQSxXQUFBLE9BQUEsR0FBQSxPQUFBO0FBQ0EsR0FIQSxFQUlBLEtBSkEsQ0FJQSxJQUpBOztBQU1BLFNBQUEsRUFBQSxHQUFBLFlBQUE7QUFDQSxRQUFBLE9BQUEsUUFBQSxJQUFBLE9BQUEsT0FBQSxDQUFBLEtBQUEsRUFBQTtBQUNBLFdBQUEsUUFBQTtBQUNBLEdBSEE7O0FBS0EsU0FBQSxJQUFBLEdBQUEsWUFBQTtBQUNBLFFBQUEsT0FBQSxRQUFBLEdBQUEsQ0FBQSxFQUFBLE9BQUEsUUFBQTtBQUNBLEdBRkE7O0FBSUEsU0FBQSxTQUFBLEdBQUEsWUFBQTtBQUNBLGlCQUFBLFVBQUEsQ0FBQSxPQUFBLE9BQUEsRUFBQSxPQUFBLFFBQUE7QUFDQSxHQUZBOztBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLENBaERBOztBQ2xCQSxJQUFBLE1BQUEsQ0FBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLGlCQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxTQUFBLFFBREE7QUFFQSxpQkFBQSxrQ0FGQTtBQUdBLGdCQUFBO0FBSEEsR0FBQTtBQUtBLENBTkE7O0FBUUEsSUFBQSxVQUFBLENBQUEsVUFBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLFlBQUEsRUFBQSxPQUFBLEVBQUEsV0FBQSxFQUFBO0FBQ0E7QUFDQSxTQUFBLElBQUEsR0FBQSxRQUFBLElBQUE7O0FBRUE7QUFDQSxNQUFBLGVBQUEsU0FBQSxZQUFBLEdBQUE7QUFDQSxRQUFBLE9BQUEsSUFBQSxDQUFBLFFBQUEsQ0FBQSxNQUFBLEVBQUE7QUFDQSxVQUFBLFNBQUEsT0FBQSxJQUFBLENBQUEsUUFBQSxDQUFBLEdBQUEsQ0FBQSxVQUFBLE9BQUEsRUFBQTtBQUNBLGVBQUEsV0FBQSxRQUFBLEtBQUEsQ0FBQTtBQUNBLE9BRkEsQ0FBQTtBQUdBLFVBQUEsYUFBQSxPQUFBLElBQUEsQ0FBQSxRQUFBLENBQUEsR0FBQSxDQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsZUFBQSxRQUFBLFlBQUEsQ0FBQSxRQUFBO0FBQ0EsT0FGQSxDQUFBO0FBR0EsVUFBQSxXQUFBLENBQUE7QUFDQSxXQUFBLElBQUEsSUFBQSxDQUFBLEVBQUEsSUFBQSxPQUFBLElBQUEsQ0FBQSxRQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQTtBQUNBLG9CQUFBLE9BQUEsQ0FBQSxJQUFBLFdBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFDQSxhQUFBLElBQUEsQ0FBQSxRQUFBLEdBQUEsU0FBQSxPQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0E7QUFDQSxHQWRBOztBQWdCQTtBQUNBLGNBQUEsZUFBQSxHQUNBLElBREEsQ0FDQSxZQUFBO0FBQ0EsaUJBQUEsV0FBQSxHQUNBLElBREEsQ0FDQSxVQUFBLEdBQUEsRUFBQTtBQUNBLGFBQUEsSUFBQSxHQUFBLEdBQUE7QUFDQTtBQUNBLGNBQUEsR0FBQSxDQUFBLFlBQUEsRUFBQSxHQUFBO0FBQ0EsS0FMQTtBQU1BLEdBUkE7O0FBV0EsU0FBQSxVQUFBLEdBQUEsVUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBO0FBQ0EsaUJBQUEsVUFBQSxDQUFBLE9BQUEsRUFBQSxRQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsV0FBQSxFQUFBO0FBQ0EsYUFBQSxJQUFBLEdBQUEsV0FBQTtBQUNBO0FBQ0EsS0FKQTtBQUtBLEdBTkE7QUFTQSxDQTFDQTs7QUNSQSxJQUFBLE9BQUEsQ0FBQSxjQUFBLEVBQUEsVUFBQSxLQUFBLEVBQUEsT0FBQSxFQUFBLFdBQUEsRUFBQSxFQUFBLEVBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQTs7QUFFQSxNQUFBLGVBQUEsRUFBQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFBLFdBQUEsR0FBQSxZQUFBOztBQUVBO0FBQ0EsUUFBQSxZQUFBLGVBQUEsRUFBQSxFQUFBO0FBQ0EsYUFBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxRQUFBLElBQUEsQ0FBQSxFQUFBLEdBQUEsT0FBQSxFQUNBLElBREEsQ0FDQSxVQUFBLE1BQUEsRUFBQTtBQUNBLGVBQUEsT0FBQSxJQUFBO0FBQ0EsT0FIQSxDQUFBO0FBSUE7QUFDQTtBQUNBLFdBQUEsR0FBQSxJQUFBLENBQUEsU0FBQSxTQUFBLENBQUEsTUFBQSxDQUFBLENBQUE7QUFDQSxHQVhBOztBQWFBLGVBQUEsZ0JBQUEsR0FBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLFFBQUEsWUFBQSxlQUFBLEVBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxHQUFBLENBQUEsaUJBQUEsTUFBQSxHQUFBLE1BQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxNQUFBLEVBQUE7QUFDQSxlQUFBLE9BQUEsSUFBQTtBQUNBLE9BSEEsQ0FBQTtBQUlBO0FBQ0EsR0FQQTs7QUFTQSxlQUFBLGNBQUEsR0FBQSxVQUFBLE1BQUEsRUFBQTtBQUNBLFFBQUEsWUFBQSxlQUFBLEVBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxHQUFBLENBQUEsaUJBQUEsTUFBQSxHQUFBLGVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxNQUFBLEVBQUE7QUFDQSxlQUFBLE9BQUEsSUFBQTtBQUNBLE9BSEEsQ0FBQTtBQUlBO0FBQ0EsR0FQQTs7QUFTQSxlQUFBLFFBQUEsR0FBQSxVQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ0EsWUFBQSxHQUFBLENBQUEsWUFBQSxlQUFBLEVBQUE7QUFDQSxRQUFBLFlBQUEsZUFBQSxFQUFBLEVBQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLGlCQUFBLE1BQUEsR0FBQSxHQUFBLEdBQUEsT0FBQSxHQUFBLFdBQUEsRUFBQSxPQUFBLEVBQ0EsSUFEQSxDQUNBLFlBQUE7QUFDQSxlQUFBLEVBQUEsQ0FBQSxjQUFBLEVBQUEsRUFBQSxJQUFBLE1BQUEsRUFBQSxTQUFBLE9BQUEsRUFBQTtBQUNBO0FBQ0EsT0FKQSxDQUFBO0FBS0EsS0FOQSxNQU9BO0FBQ0EsY0FBQSxHQUFBLENBQUEsV0FBQSxFQUFBLE9BQUE7QUFDQSxhQUFBLE1BQUEsR0FBQSxDQUFBLDRCQUFBLEVBQUEsT0FBQSxFQUNBLElBREEsQ0FDQSxZQUFBO0FBQ0EsZUFBQSxFQUFBLENBQUEsTUFBQTtBQUNBLGlCQUFBLFNBQUEsQ0FBQSxNQUFBLEVBQUEsRUFBQSxRQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUEsRUFBQSxVQUFBLENBQUEsRUFBQTtBQUNBLE9BSkEsQ0FBQTtBQU1BO0FBQ0EsR0FsQkE7O0FBb0JBLGVBQUEsU0FBQSxHQUFBLFVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEsaUJBQUEsTUFBQSxHQUFBLEdBQUEsR0FBQSxPQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsS0FBQSxFQUFBO0FBQ0EsYUFBQSxNQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGVBQUEsVUFBQSxHQUFBLFVBQUEsT0FBQSxFQUFBLGNBQUEsRUFBQTtBQUNBLFFBQUEsWUFBQSxlQUFBLEVBQUEsRUFBQTtBQUNBLGFBQUEsTUFBQSxHQUFBLENBQUEsaUJBQUEsUUFBQSxJQUFBLENBQUEsRUFBQSxHQUFBLGFBQUEsRUFBQSxFQUFBLFdBQUEsUUFBQSxFQUFBLEVBQUEsZ0JBQUEsY0FBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsSUFBQSxFQUFBO0FBQ0EsZUFBQSxFQUFBLENBQUEsTUFBQTtBQUNBLGVBQUEsS0FBQSxJQUFBO0FBQ0EsT0FKQSxDQUFBO0FBS0E7QUFDQTtBQVBBLFNBUUE7QUFDQTtBQUNBLFlBQUEsT0FBQSxTQUFBLFNBQUEsQ0FBQSxNQUFBLENBQUE7O0FBRUE7QUFDQSxZQUFBLFVBQUEsQ0FBQSxDQUFBO0FBQ0EsYUFBQSxJQUFBLElBQUEsQ0FBQSxFQUFBLElBQUEsS0FBQSxRQUFBLENBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQTtBQUNBLGNBQUEsS0FBQSxRQUFBLENBQUEsQ0FBQSxFQUFBLEVBQUEsS0FBQSxRQUFBLEVBQUEsRUFBQTtBQUNBLHNCQUFBLENBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUEsaUJBQUEsQ0FBQSxFQUFBO0FBQ0EsY0FBQSxZQUFBLENBQUEsQ0FBQSxFQUFBO0FBQ0E7QUFDQSxnQkFBQSxRQUFBLEtBQUEsSUFBQSxjQUFBLEVBQUE7QUFDQSxzQkFBQSxZQUFBLEdBQUEsRUFBQSxVQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxJQUFBLENBQUEsT0FBQTtBQUNBLHFCQUFBLEVBQUEsQ0FBQSxNQUFBO0FBRUE7QUFDQSxXQVJBLE1BUUE7QUFDQTtBQUNBLGdCQUFBLFFBQUEsS0FBQSxJQUFBLEtBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLENBQUEsUUFBQSxHQUFBLGNBQUEsRUFBQTtBQUNBLG1CQUFBLFFBQUEsQ0FBQSxPQUFBLEVBQUEsWUFBQSxDQUFBLFFBQUEsSUFBQSxjQUFBO0FBQ0EscUJBQUEsRUFBQSxDQUFBLE1BQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBQSxTQUFBLENBQUEsTUFBQSxFQUFBLElBQUE7QUFDQTtBQUNBLGlCQUFBLEdBQUEsSUFBQSxDQUFBLElBQUEsQ0FBQTtBQUNBO0FBQ0EsU0FyQkEsTUFxQkE7QUFDQTtBQUNBLGNBQUEsaUJBQUEsS0FBQSxRQUFBLENBQUEsT0FBQSxFQUFBLFlBQUEsQ0FBQSxRQUFBLElBQUEsQ0FBQSxFQUFBO0FBQ0EsaUJBQUEsUUFBQSxDQUFBLE1BQUEsQ0FBQSxPQUFBLEVBQUEsQ0FBQTtBQUNBLFdBRkEsTUFFQTtBQUNBO0FBQ0EsaUJBQUEsUUFBQSxDQUFBLE9BQUEsRUFBQSxZQUFBLENBQUEsUUFBQSxJQUFBLGNBQUE7QUFDQTtBQUNBO0FBQ0EsbUJBQUEsU0FBQSxDQUFBLE1BQUEsRUFBQSxJQUFBO0FBQ0E7QUFDQSxpQkFBQSxHQUFBLElBQUEsQ0FBQSxJQUFBLENBQUE7QUFDQTtBQUVBO0FBQ0EsR0ExREE7O0FBNERBLGVBQUEsSUFBQSxHQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FBQSxpQkFBQSxPQUFBLEdBQUEsU0FBQSxFQUFBLEVBQUEsUUFBQSxTQUFBLEVBQUEsRUFDQSxJQURBLENBQ0EsVUFBQSxZQUFBLEVBQUE7QUFDQSxhQUFBLGFBQUEsSUFBQTtBQUNBLEtBSEEsQ0FBQTtBQUlBLEdBTEE7O0FBT0EsZUFBQSxPQUFBLEdBQUEsWUFBQTtBQUNBLFdBQUEsTUFBQSxHQUFBLENBQUEscUJBQUEsRUFBQSxFQUFBLFFBQUEsU0FBQSxFQUFBLEVBQ0EsSUFEQSxDQUNBLFVBQUEsYUFBQSxFQUFBO0FBQ0EsYUFBQSxjQUFBLElBQUE7QUFDQSxLQUhBLENBQUE7QUFJQSxHQUxBOztBQU9BLGVBQUEsTUFBQSxHQUFBLFVBQUEsT0FBQSxFQUFBO0FBQ0EsV0FBQSxNQUFBLEdBQUEsQ0FB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QUFBLEVBQUEsVUFBQTtBQUNBLGlCQUFBLEdBQUEsQ0FBQSxZQUFBLGNBQUEsRUFBQSxVQUFBO0FBRUE7O0FBbERBLEdBQUE7QUFzREEsQ0F4REE7O0FDQUEsSUFBQSxTQUFBLENBQUEsV0FBQSxFQUFBLFVBQUEsTUFBQSxFQUFBLGNBQUEsRUFBQTs7QUFFQSxTQUFBO0FBQ0EsY0FBQSxHQURBO0FBRUEsV0FBQSxFQUZBO0FBS0EsaUJBQUEsNENBTEE7QUFNQSxVQUFBLGNBQUEsS0FBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLFdBQUEsR0FBQSxZQUFBO0FBQ0EsZUFBQSxlQUFBLFFBQUEsRUFBQTtBQUNBLE9BRkE7QUFHQTs7QUFWQSxHQUFBO0FBY0EsQ0FoQkE7O0FDQUEsSUFBQSxTQUFBLENBQUEsZUFBQSxFQUFBLFVBQUEsZUFBQSxFQUFBOztBQUVBLFNBQUE7QUFDQSxjQUFBLEdBREE7QUFFQSxpQkFBQSx5REFGQTtBQUdBLFVBQUEsY0FBQSxLQUFBLEVBQUE7QUFDQSxZQUFBLFFBQUEsR0FBQSxnQkFBQSxpQkFBQSxFQUFBO0FBQ0E7QUFMQSxHQUFBO0FBUUEsQ0FWQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xud2luZG93LmFwcCA9IGFuZ3VsYXIubW9kdWxlKCdGdWxsc3RhY2tHZW5lcmF0ZWRBcHAnLCBbJ2ZzYVByZUJ1aWx0JywgJ3VpLnJvdXRlcicsICd1aS5ib290c3RyYXAnLCAnbmdBbmltYXRlJywgJ25nQ29va2llcyddKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuICAgIC8vIFRoaXMgdHVybnMgb2ZmIGhhc2hiYW5nIHVybHMgKC8jYWJvdXQpIGFuZCBjaGFuZ2VzIGl0IHRvIHNvbWV0aGluZyBub3JtYWwgKC9hYm91dClcbiAgICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUodHJ1ZSk7XG4gICAgLy8gSWYgd2UgZ28gdG8gYSBVUkwgdGhhdCB1aS1yb3V0ZXIgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQsIGdvIHRvIHRoZSBcIi9cIiB1cmwuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIC8vIFRyaWdnZXIgcGFnZSByZWZyZXNoIHdoZW4gYWNjZXNzaW5nIGFuIE9BdXRoIHJvdXRlXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJy9hdXRoLzpwcm92aWRlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xufSk7XG5cbi8vIFRoaXMgYXBwLnJ1biBpcyBmb3IgY29udHJvbGxpbmcgYWNjZXNzIHRvIHNwZWNpZmljIHN0YXRlcy5cbmFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUsICRjb29raWVzKSB7XG5cbiAgICAvL0luaXRpYWxpemUgY2FydCBjb29raWUgZm9yIG5vbi1hdXRoIHVzZXJzIGlmIHRoZXJlIGlzbid0IGFscmVhZHkgb25lOlxuICAgIGlmICghJGNvb2tpZXMuZ2V0T2JqZWN0KFwiY2FydFwiKSkgJGNvb2tpZXMucHV0T2JqZWN0KCdjYXJ0Jywge3N0YXR1czogXCJjYXJ0XCIsIHByb2R1Y3RzOiBbXSwgc3VidG90YWw6IDB9KTtcblxuICAgIC8vIFRoZSBnaXZlbiBzdGF0ZSByZXF1aXJlcyBhbiBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgdmFyIGRlc3RpbmF0aW9uU3RhdGVSZXF1aXJlc0F1dGggPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLmRhdGEgJiYgc3RhdGUuZGF0YS5hdXRoZW50aWNhdGU7XG4gICAgfTtcblxuICAgICRyb290U2NvcGUudmlkZW8gPSB0cnVlO1xuXG4gICAgLy8gJHN0YXRlQ2hhbmdlU3RhcnQgaXMgYW4gZXZlbnQgZmlyZWRcbiAgICAvLyB3aGVuZXZlciB0aGUgcHJvY2VzcyBvZiBjaGFuZ2luZyBhIHN0YXRlIGJlZ2lucy5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zKSB7XG5cbiAgICAgICAgaWYgKCFkZXN0aW5hdGlvblN0YXRlUmVxdWlyZXNBdXRoKHRvU3RhdGUpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZGVzdGluYXRpb24gc3RhdGUgZG9lcyBub3QgcmVxdWlyZSBhdXRoZW50aWNhdGlvblxuICAgICAgICAgICAgLy8gU2hvcnQgY2lyY3VpdCB3aXRoIHJldHVybi5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSkge1xuICAgICAgICAgICAgLy8gVGhlIHVzZXIgaXMgYXV0aGVudGljYXRlZC5cbiAgICAgICAgICAgIC8vIFNob3J0IGNpcmN1aXQgd2l0aCByZXR1cm4uXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYW5jZWwgbmF2aWdhdGluZyB0byBuZXcgc3RhdGUuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgQXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKCkudGhlbihmdW5jdGlvbiAodXNlcikge1xuICAgICAgICAgICAgLy8gSWYgYSB1c2VyIGlzIHJldHJpZXZlZCwgdGhlbiByZW5hdmlnYXRlIHRvIHRoZSBkZXN0aW5hdGlvblxuICAgICAgICAgICAgLy8gKHRoZSBzZWNvbmQgdGltZSwgQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkgd2lsbCB3b3JrKVxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlLCBpZiBubyB1c2VyIGlzIGxvZ2dlZCBpbiwgZ28gdG8gXCJsb2dpblwiIHN0YXRlLlxuICAgICAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28odG9TdGF0ZS5uYW1lLCB0b1BhcmFtcyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICAgLy8gUmVnaXN0ZXIgb3VyICphYm91dCogc3RhdGUuXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Fib3V0Jywge1xuICAgICAgICB1cmw6ICcvYWJvdXQnLFxuICAgICAgICAvLyBjb250cm9sbGVyOiAnQWJvdXRDb250cm9sbGVyJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9hYm91dC9hYm91dC5odG1sJ1xuICAgIH0pO1xuXG59KTtcblxuLy8gYXBwLmNvbnRyb2xsZXIoJ0Fib3V0Q29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsIEZ1bGxzdGFja1BpY3MpIHtcblxuLy8gICAgIC8vIEltYWdlcyBvZiBiZWF1dGlmdWwgRnVsbHN0YWNrIHBlb3BsZS5cbi8vICAgICAkc2NvcGUuaW1hZ2VzID0gXy5zaHVmZmxlKEZ1bGxzdGFja1BpY3MpO1xuXG4vLyB9KTsiLCJhcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FjY291bnQnLCB7XG4gICAgdXJsOiAnL3VzZXIvOmlkJyxcbiAgICB0ZW1wbGF0ZVVybDogJy9qcy9hY2NvdW50L2FjY291bnQtaW5mby5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnVXNlckN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHVzZXI6IGZ1bmN0aW9uKFVzZXJGYWN0b3J5LCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIFVzZXJGYWN0b3J5LmZldGNoQnlJZCgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICB9LFxuICAgICAgb3JkZXJIaXN0b3J5OiBmdW5jdGlvbihPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJIaXN0b3J5KCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICBjYXJ0OiBmdW5jdGlvbihPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJDYXJ0KCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICByZXZpZXdzOiBmdW5jdGlvbihSZXZpZXdGYWN0b3J5LCRzdGF0ZVBhcmFtcyl7XG4gICAgICAgICAgICByZXR1cm4gUmV2aWV3RmFjdG9yeS5mZXRjaEJ5VXNlcklkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChhbGxSZXZpZXdzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFsbFJldmlld3M7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH0sXG4gICAgLy8gVGhlIGZvbGxvd2luZyBkYXRhLmF1dGhlbnRpY2F0ZSBpcyByZWFkIGJ5IGFuIGV2ZW50IGxpc3RlbmVyXG4gICAgLy8gdGhhdCBjb250cm9scyBhY2Nlc3MgdG8gdGhpcyBzdGF0ZS4gUmVmZXIgdG8gYXBwLmpzLlxuICAgIGRhdGE6IHtcbiAgICAgIGF1dGhlbnRpY2F0ZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignVXNlckN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIHVzZXIsIG9yZGVySGlzdG9yeSwgY2FydCwgcmV2aWV3cywgVXNlckZhY3RvcnksICRyb290U2NvcGUpIHtcbiAgJHNjb3BlLnVzZXIgPSB1c2VyO1xuICAkc2NvcGUuZGV0YWlscyA9IHt9O1xuICAkcm9vdFNjb3BlLnZpZGVvID0gZmFsc2U7XG4gICRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlscyA9IGZhbHNlO1xuICAkc2NvcGUuZGV0YWlscy5zaG93Q29udGFjdEluZm8gPSBmYWxzZTtcbiAgJHNjb3BlLmRldGFpbHMuc2hvd1BheW1lbnRJbmZvID0gZmFsc2U7XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlVXNlclZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd1VzZXJEZXRhaWxzID0gISRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlsc1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlQ29udGFjdFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd0NvbnRhY3RJbmZvID0gISRzY29wZS5kZXRhaWxzLnNob3dDb250YWN0SW5mb1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMudG9nZ2xlUGF5bWVudFZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLmRldGFpbHMuc2hvd1BheW1lbnRJbmZvID0gISRzY29wZS5kZXRhaWxzLnNob3dQYXltZW50SW5mb1xuICB9XG5cbiAgJHNjb3BlLmRldGFpbHMuc2F2ZVVzZXJEZXRhaWxzID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dVc2VyRGV0YWlscyA9ICEkc2NvcGUuZGV0YWlscy5zaG93VXNlckRldGFpbHM7XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5kZXRhaWxzLnNhdmVDb250YWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dDb250YWN0SW5mbyA9ICEkc2NvcGUuZGV0YWlscy5zaG93Q29udGFjdEluZm87XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5kZXRhaWxzLnNhdmVQYXltZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5kZXRhaWxzLnNob3dQYXltZW50SW5mbyA9ICEkc2NvcGUuZGV0YWlscy5zaG93UGF5bWVudEluZm87XG5cbiAgICBVc2VyRmFjdG9yeS5tb2RpZnlVc2VyKCRzY29wZS51c2VyLmlkLCAkc2NvcGUudXNlcik7XG5cbiAgfVxuXG4gICRzY29wZS5vcmRlckhpc3RvcnkgPSBvcmRlckhpc3Rvcnk7XG4gICRzY29wZS5jYXJ0ID0gY2FydDtcbiAgdmFyIHByaWNlcyA9IGNhcnQucHJvZHVjdHMubWFwKGZ1bmN0aW9uKHByb2R1Y3QpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9kdWN0LnByaWNlKTtcbiAgfSlcbiAgdmFyIHF1YW50aXRpZXMgPSBjYXJ0LnByb2R1Y3RzLm1hcChmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgcmV0dXJuIHByb2R1Y3QucHJvZHVjdE9yZGVyLnF1YW50aXR5O1xuICB9KVxuICB2YXIgc3VidG90YWwgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICB9XG4gICRzY29wZS5jYXJ0LnN1YnRvdGFsID0gc3VidG90YWw7XG5cbiAgJHNjb3BlLnJldmlld3MgPSByZXZpZXdzO1xuXG59KTtcbiIsImFwcC5kaXJlY3RpdmUoJ3VwZGF0ZUluZm8nLCBmdW5jdGlvbiAoKSB7XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvYWNjb3VudC91cGRhdGUtaW5mby5odG1sJyxcbiAgICBzY29wZToge1xuICAgICAgdXNlclZpZXc6ICc9JyxcbiAgICAgIGRldGFpbHNWaWV3OiAnPSdcbiAgICB9XG4gIH1cblxufSk7XG4iLCJhcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdicm93c2UnLCB7XG4gICAgICAgIHVybDogJy9icm93c2UnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Jyb3dzZS1wcm9kdWN0cy9icm93c2UtcHJvZHVjdHMuaHRtbCcsXG4gICAgXHRjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICBcdHJlc29sdmU6IHtcbiAgICBcdFx0cHJvZHVjdHM6IGZ1bmN0aW9uKFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgXHRcdFx0cmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdtZW5zJywge1xuICAgICAgICB1cmw6ICcvYnJvd3NlL21lbnMnLFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2Jyb3dzZS1wcm9kdWN0cy9tZW5zLXByb2R1Y3RzLmh0bWwnLFxuICAgIFx0Y29udHJvbGxlcjogJ1Byb2R1Y3RzQ3RybCcsXG4gICAgXHRyZXNvbHZlOiB7XG4gICAgXHRcdHByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgIFx0XHRcdHJldHVybiBQcm9kdWN0RmFjdG9yeS5mZXRjaEFsbCgpXG4gICAgXHRcdFx0LnRoZW4oZnVuY3Rpb24oYWxsUHJvZHVjdHMpIHtcbiAgICBcdFx0XHRcdHJldHVybiBhbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gcHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIk1lbidzXCIpICE9PSAtMTtcbiAgICBcdFx0XHRcdH0pXG4gICAgXHRcdFx0fSk7XG4gICAgXHRcdFx0XG4gICAgXHRcdFx0XG4gICAgXHRcdFx0XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCd3b21lbnMnLCB7XG4gICAgICAgIHVybDogJy9icm93c2Uvd29tZW5zJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9icm93c2UtcHJvZHVjdHMvd29tZW5zLXByb2R1Y3RzLmh0bWwnLFxuICAgIFx0Y29udHJvbGxlcjogJ1Byb2R1Y3RzQ3RybCcsXG4gICAgXHRyZXNvbHZlOiB7XG4gICAgXHRcdHByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgIFx0XHRcdHJldHVybiBQcm9kdWN0RmFjdG9yeS5mZXRjaEFsbCgpXG4gICAgXHRcdFx0LnRoZW4oZnVuY3Rpb24oYWxsUHJvZHVjdHMpIHtcbiAgICBcdFx0XHRcdHJldHVybiBhbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgIFx0XHRcdFx0XHRyZXR1cm4gcHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIldvbWVuJ3NcIikgIT09IC0xO1xuICAgIFx0XHRcdFx0fSlcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIH0pO1xufSk7XG5cbmFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2dlYXInLCB7XG4gICAgICAgIHVybDogJy9icm93c2UvZ2VhcicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYnJvd3NlLXByb2R1Y3RzL2dlYXItcHJvZHVjdHMuaHRtbCcsXG4gICAgXHRjb250cm9sbGVyOiAnUHJvZHVjdHNDdHJsJyxcbiAgICBcdHJlc29sdmU6IHtcbiAgICBcdFx0cHJvZHVjdHM6IGZ1bmN0aW9uKFByb2R1Y3RGYWN0b3J5KSB7XG4gICAgXHRcdFx0cmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKClcbiAgICBcdFx0XHQudGhlbihmdW5jdGlvbihhbGxQcm9kdWN0cykge1xuICAgIFx0XHRcdFx0cmV0dXJuIGFsbFByb2R1Y3RzLmZpbHRlcihmdW5jdGlvbihwcm9kdWN0KSB7XG4gICAgXHRcdFx0XHRcdHJldHVybiAocHJvZHVjdC5uYW1lLnNwbGl0KCcgJykuaW5kZXhPZihcIk1lbidzXCIpID09PSAtMSAmJiBwcm9kdWN0Lm5hbWUuc3BsaXQoJyAnKS5pbmRleE9mKFwiV29tZW4nc1wiKSA9PT0gLTEpO1xuICAgIFx0XHRcdFx0fSlcbiAgICBcdFx0XHR9KTtcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0XHRcbiAgICBcdFx0fVxuICAgIFx0fVxuICAgIH0pO1xufSk7XG5cbmFwcC5jb250cm9sbGVyKCdQcm9kdWN0c0N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCBwcm9kdWN0cywgT3JkZXJGYWN0b3J5LCBTZXNzaW9uLCAkc3RhdGUsICRyb290U2NvcGUpIHtcbiAgICAkcm9vdFNjb3BlLnZpZGVvID0gZmFsc2U7XG5cdCRzY29wZS5wcm9kdWN0cyA9IHByb2R1Y3RzO1xuXHQvLyRzY29wZS5tZW4gPSBcIk1lbidzXCI7XG4gICAgXG4gICAgJHNjb3BlLmFkZE9uZVRvQ2FydCA9IGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgICBPcmRlckZhY3RvcnkudXBkYXRlQ2FydChwcm9kdWN0LCAxKVxuICAgIH1cdFxuXG5cbn0pOyIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NoZWNrb3V0Jywge1xuICAgIHVybDogJy86aWQvY2hlY2tvdXQnLFxuICAgIHRlbXBsYXRlVXJsOiAnL2pzL2NoZWNrb3V0L2NoZWNrb3V0Lmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdDaGVja291dEN0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIHVzZXI6IGZ1bmN0aW9uIChVc2VyRmFjdG9yeSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIGlmICghJHN0YXRlUGFyYW1zLmlkKSByZXR1cm4ge307XG4gICAgICAgIHJldHVybiBVc2VyRmFjdG9yeS5mZXRjaEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgfSxcbiAgICAgIGNhcnQ6IGZ1bmN0aW9uIChPcmRlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmdldFVzZXJDYXJ0KCRzdGF0ZVBhcmFtcy5pZCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdDaGVja291dEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCB1c2VyLCBjYXJ0LCBPcmRlckZhY3RvcnksICRzdGF0ZSkge1xuXG4gJHNjb3BlLnVzZXIgPSB1c2VyO1xuICRzY29wZS5jYXJ0ID0gY2FydDtcbiAkc2NvcGUuc2hvd1NoaXBwaW5nID0gZmFsc2U7XG4gJHNjb3BlLmFkZHJlc3M7XG5cbiAkc2NvcGUudG9nZ2xlU2hpcHBpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICRzY29wZS5zaG93U2hpcHBpbmcgPSAhJHNjb3BlLnNob3dTaGlwcGluZztcblxuICBpZiAoJHNjb3BlLnNob3dTaGlwcGluZyA9PT0gZmFsc2UpIHtcbiAgICAkc2NvcGUuYWRkcmVzcyA9IHtzdHJlZXRfYWRkcmVzczogdXNlci5zdHJlZXRfYWRkcmVzcywgY2l0eTogdXNlci5jaXR5LCBzdGF0ZTogdXNlci5zdGF0ZSwgemlwOiB1c2VyLnppcCwgZmlyc3RfbmFtZTogdXNlci5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHVzZXIubGFzdF9uYW1lLCBzdGF0dXM6ICdvcmRlcmVkJywgZW1haWw6IHVzZXIuZW1haWx9XG4gIH0gZWxzZSB7XG4gICAgJHNjb3BlLmFkZHJlc3MgPSAkc2NvcGUuY2FydDtcbiAgfVxuXG4gfVxuXG4gJHNjb3BlLnN1Ym1pdE9yZGVyID0gZnVuY3Rpb24gKHVzZXJJZCwgY2FydElkLCBhZGRyZXNzKSB7XG5cbiAgaWYgKCRzY29wZS5zaG93U2hpcHBpbmcgPT09IGZhbHNlKSB7XG4gICAgYWRkcmVzcyA9IHtzdHJlZXRfYWRkcmVzczogdXNlci5zdHJlZXRfYWRkcmVzcywgY2l0eTogdXNlci5jaXR5LCBzdGF0ZTogdXNlci5zdGF0ZSwgemlwOiB1c2VyLnppcCwgZmlyc3RfbmFtZTogdXNlci5maXJzdF9uYW1lLCBsYXN0X25hbWU6IHVzZXIubGFzdF9uYW1lLCBzdGF0dXM6ICdvcmRlcmVkJywgZW1haWw6IHVzZXIuZW1haWx9XG4gIH1cblxuICAkc2NvcGUuY2FydC5zdGF0dXMgPSBcIm9yZGVyZWRcIjtcbiAgJHNjb3BlLmNhcnQuZW1haWwgPSAkc2NvcGUudXNlci5lbWFpbDtcblxuICBPcmRlckZhY3RvcnkucHVyY2hhc2UodXNlcklkLCBjYXJ0SWQsIGFkZHJlc3MpXG4gICAgLnRoZW4oZnVuY3Rpb24gKCkge30pXG4gfVxuXG4gJHNjb3BlLmNhcnQuc3VidG90YWwgPSAwO1xuXG4gIC8vIHN1YnRvdGFsIG1hdGhcbiAgaWYgKGNhcnQucHJvZHVjdHMubGVuZ3RoKXtcbiAgICB2YXIgcHJpY2VzID0gY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG4gICAgICByZXR1cm4gcGFyc2VGbG9hdChwcm9kdWN0LnByaWNlKTtcbiAgICB9KVxuICAgIHZhciBxdWFudGl0aWVzID0gY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG4gICAgICByZXR1cm4gcHJvZHVjdC5wcm9kdWN0T3JkZXIucXVhbnRpdHk7XG4gICAgfSlcbiAgICB2YXIgc3VidG90YWwgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpPGNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICAgIH1cbiAgICAkc2NvcGUuY2FydC5zdWJ0b3RhbCA9IHN1YnRvdGFsLnRvRml4ZWQoMik7XG4gIH1cblxufSk7XG5cbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2NvbmZpcm1hdGlvbicsIHtcbiAgICB1cmw6ICcvOmlkLzpvcmRlcklkL2NvbmZpcm1hdGlvbicsXG4gICAgdGVtcGxhdGVVcmw6ICcvanMvY2hlY2tvdXQvY29uZmlybWF0aW9uLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdDb25maXJtYXRpb25DdHJsJyxcbiAgICByZXNvbHZlOiB7XG4gICAgICB1c2VyOiBmdW5jdGlvbiAoVXNlckZhY3RvcnksICRzdGF0ZVBhcmFtcykge1xuICAgICAgICByZXR1cm4gVXNlckZhY3RvcnkuZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIH0sXG4gICAgICBvcmRlcjogZnVuY3Rpb24gKE9yZGVyRmFjdG9yeSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBPcmRlckZhY3RvcnkuZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5pZCwgJHN0YXRlUGFyYW1zLm9yZGVySWQpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ29uZmlybWF0aW9uQ3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsIHVzZXIsIG9yZGVyKSB7XG4gICRzY29wZS51c2VyID0gdXNlcjtcbiAgJHNjb3BlLm9yZGVyID0gb3JkZXI7XG5cbiAgJHNjb3BlLm9yZGVyLnN1YnRvdGFsID0gMDtcblxuICBpZiAob3JkZXIucHJvZHVjdHMubGVuZ3RoKXtcbiAgICB2YXIgcHJpY2VzID0gb3JkZXIucHJvZHVjdHMubWFwKGZ1bmN0aW9uKHByb2R1Y3Qpe1xuICAgICAgcmV0dXJuIHBhcnNlRmxvYXQocHJvZHVjdC5wcmljZSk7XG4gICAgfSlcbiAgICB2YXIgcXVhbnRpdGllcyA9IG9yZGVyLnByb2R1Y3RzLm1hcChmdW5jdGlvbihwcm9kdWN0KXtcbiAgICAgIHJldHVybiBwcm9kdWN0LnByb2R1Y3RPcmRlci5xdWFudGl0eTtcbiAgICB9KVxuICAgIHZhciBzdWJ0b3RhbCA9IDA7XG4gICAgZm9yICh2YXIgaSA9IDA7IGk8b3JkZXIucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuICAgICAgICBzdWJ0b3RhbCArPSBwcmljZXNbaV0gKiBxdWFudGl0aWVzW2ldO1xuICAgIH1cbiAgICAkc2NvcGUub3JkZXIuc3VidG90YWwgPSBzdWJ0b3RhbDtcbiAgfVxuXG59KTtcbiIsIihmdW5jdGlvbiAoKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBIb3BlIHlvdSBkaWRuJ3QgZm9yZ2V0IEFuZ3VsYXIhIER1aC1kb3kuXG4gICAgaWYgKCF3aW5kb3cuYW5ndWxhcikgdGhyb3cgbmV3IEVycm9yKCdJIGNhblxcJ3QgZmluZCBBbmd1bGFyIScpO1xuXG4gICAgdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdmc2FQcmVCdWlsdCcsIFtdKTtcblxuICAgIGFwcC5mYWN0b3J5KCdTb2NrZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghd2luZG93LmlvKSB0aHJvdyBuZXcgRXJyb3IoJ3NvY2tldC5pbyBub3QgZm91bmQhJyk7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW8od2luZG93LmxvY2F0aW9uLm9yaWdpbik7XG4gICAgfSk7XG5cbiAgICAvLyBBVVRIX0VWRU5UUyBpcyB1c2VkIHRocm91Z2hvdXQgb3VyIGFwcCB0b1xuICAgIC8vIGJyb2FkY2FzdCBhbmQgbGlzdGVuIGZyb20gYW5kIHRvIHRoZSAkcm9vdFNjb3BlXG4gICAgLy8gZm9yIGltcG9ydGFudCBldmVudHMgYWJvdXQgYXV0aGVudGljYXRpb24gZmxvdy5cbiAgICBhcHAuY29uc3RhbnQoJ0FVVEhfRVZFTlRTJywge1xuICAgICAgICBsb2dpblN1Y2Nlc3M6ICdhdXRoLWxvZ2luLXN1Y2Nlc3MnLFxuICAgICAgICBsb2dpbkZhaWxlZDogJ2F1dGgtbG9naW4tZmFpbGVkJyxcbiAgICAgICAgbG9nb3V0U3VjY2VzczogJ2F1dGgtbG9nb3V0LXN1Y2Nlc3MnLFxuICAgICAgICBzZXNzaW9uVGltZW91dDogJ2F1dGgtc2Vzc2lvbi10aW1lb3V0JyxcbiAgICAgICAgbm90QXV0aGVudGljYXRlZDogJ2F1dGgtbm90LWF1dGhlbnRpY2F0ZWQnLFxuICAgICAgICBub3RBdXRob3JpemVkOiAnYXV0aC1ub3QtYXV0aG9yaXplZCdcbiAgICB9KTtcblxuICAgIGFwcC5mYWN0b3J5KCdBdXRoSW50ZXJjZXB0b3InLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHEsIEFVVEhfRVZFTlRTKSB7XG4gICAgICAgIHZhciBzdGF0dXNEaWN0ID0ge1xuICAgICAgICAgICAgNDAxOiBBVVRIX0VWRU5UUy5ub3RBdXRoZW50aWNhdGVkLFxuICAgICAgICAgICAgNDAzOiBBVVRIX0VWRU5UUy5ub3RBdXRob3JpemVkLFxuICAgICAgICAgICAgNDE5OiBBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCxcbiAgICAgICAgICAgIDQ0MDogQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlc3BvbnNlRXJyb3I6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdChzdGF0dXNEaWN0W3Jlc3BvbnNlLnN0YXR1c10sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlc3BvbnNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgYXBwLmNvbmZpZyhmdW5jdGlvbiAoJGh0dHBQcm92aWRlcikge1xuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKFtcbiAgICAgICAgICAgICckaW5qZWN0b3InLFxuICAgICAgICAgICAgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KCdBdXRoSW50ZXJjZXB0b3InKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBhcHAuc2VydmljZSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIFNlc3Npb24sICRyb290U2NvcGUsIEFVVEhfRVZFTlRTLCAkcSkge1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uU3VjY2Vzc2Z1bExvZ2luKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICBTZXNzaW9uLmNyZWF0ZShkYXRhLmlkLCBkYXRhLnVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ2luU3VjY2Vzcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF0YS51c2VyO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlcyB0aGUgc2Vzc2lvbiBmYWN0b3J5IHRvIHNlZSBpZiBhblxuICAgICAgICAvLyBhdXRoZW50aWNhdGVkIHVzZXIgaXMgY3VycmVudGx5IHJlZ2lzdGVyZWQuXG4gICAgICAgIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhU2Vzc2lvbi51c2VyO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuZ2V0TG9nZ2VkSW5Vc2VyID0gZnVuY3Rpb24gKGZyb21TZXJ2ZXIpIHtcblxuICAgICAgICAgICAgLy8gSWYgYW4gYXV0aGVudGljYXRlZCBzZXNzaW9uIGV4aXN0cywgd2VcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgdXNlciBhdHRhY2hlZCB0byB0aGF0IHNlc3Npb25cbiAgICAgICAgICAgIC8vIHdpdGggYSBwcm9taXNlLiBUaGlzIGVuc3VyZXMgdGhhdCB3ZSBjYW5cbiAgICAgICAgICAgIC8vIGFsd2F5cyBpbnRlcmZhY2Ugd2l0aCB0aGlzIG1ldGhvZCBhc3luY2hyb25vdXNseS5cblxuICAgICAgICAgICAgLy8gT3B0aW9uYWxseSwgaWYgdHJ1ZSBpcyBnaXZlbiBhcyB0aGUgZnJvbVNlcnZlciBwYXJhbWV0ZXIsXG4gICAgICAgICAgICAvLyB0aGVuIHRoaXMgY2FjaGVkIHZhbHVlIHdpbGwgbm90IGJlIHVzZWQuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQXV0aGVudGljYXRlZCgpICYmIGZyb21TZXJ2ZXIgIT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEud2hlbihTZXNzaW9uLnVzZXIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBNYWtlIHJlcXVlc3QgR0VUIC9zZXNzaW9uLlxuICAgICAgICAgICAgLy8gSWYgaXQgcmV0dXJucyBhIHVzZXIsIGNhbGwgb25TdWNjZXNzZnVsTG9naW4gd2l0aCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAvLyBJZiBpdCByZXR1cm5zIGEgNDAxIHJlc3BvbnNlLCB3ZSBjYXRjaCBpdCBhbmQgaW5zdGVhZCByZXNvbHZlIHRvIG51bGwuXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2Vzc2lvbicpLnRoZW4ob25TdWNjZXNzZnVsTG9naW4pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dpbiA9IGZ1bmN0aW9uIChjcmVkZW50aWFscykge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkcS5yZWplY3QoeyBtZXNzYWdlOiAnSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuc2lnbnVwID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NpZ251cCcsIGNyZWRlbnRpYWxzKVxuICAgICAgICAgICAgICAgIC50aGVuKG9uU3VjY2Vzc2Z1bExvZ2luKVxuICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRxLnJlamVjdCh7IG1lc3NhZ2U6ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLicgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvbG9nb3V0JykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgU2Vzc2lvbi5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICB9KTtcblxuICAgIGFwcC5zZXJ2aWNlKCdTZXNzaW9uJywgZnVuY3Rpb24gKCRyb290U2NvcGUsIEFVVEhfRVZFTlRTKSB7XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLm5vdEF1dGhlbnRpY2F0ZWQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYuZGVzdHJveSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkcm9vdFNjb3BlLiRvbihBVVRIX0VWRU5UUy5zZXNzaW9uVGltZW91dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2VsZi5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaWQgPSBudWxsO1xuICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlID0gZnVuY3Rpb24gKHNlc3Npb25JZCwgdXNlcikge1xuICAgICAgICAgICAgdGhpcy5pZCA9IHNlc3Npb25JZDtcbiAgICAgICAgICAgIHRoaXMudXNlciA9IHVzZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhpcy5pZCA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnVzZXIgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgfSk7XG5cbn0pKCk7XG4iLCJhcHAuZmFjdG9yeSgnSG9tZVBhZ2VQaWNzJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbXG4gICAgICAgIFwiaHR0cHM6Ly93d3cucmVpLmNvbS9hc3NldHMvZHJzcC8yMDE2L3EzL2hvbWVwYWdlLzA3LTI2L2xlYWQtYnJvb2tzLW1kLWxnL2xpdmUuanBnXCIsXG4gICAgICAgIFwiaHR0cHM6Ly93d3cucmVpLmNvbS9hc3NldHMvZHJzcC8yMDE2L3EzL2hvbWVwYWdlLzA3LTI2L3BhZGRsaW5nL2xpdmUuanBnXCIsXG4gICAgICAgIFwiaHR0cHM6Ly9pbWFnZXMudGhlbm9ydGhmYWNlLmNvbS9pcy9pbWFnZS9UaGVOb3J0aEZhY2VCcmFuZC8wNTExMTYtYWN0aXZpdHktaGVyby1jbGltYmluZy1kPyRTQ0FMRS1PUklHSU5BTCRcIixcbiAgICAgICAgXCJodHRwOi8vd3d3LmVtcy5jb20vb24vZGVtYW5kd2FyZS5zdGF0aWMvLS9TaXRlcy1FTVMtTGlicmFyeS9kZWZhdWx0L2R3MTZkNTVlNGYvaW1hZ2VzL3Byb21vdGlvbnMvaG9tZXBhZ2UvMjAxNi8wNy8yNC8yMDE2MDcyNF9obV9ib3g0LmpwZ1wiXG4gICAgXTtcbn0pO1xuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICAgICAgdXJsOiAnLycsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvaG9tZS9ob21lLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNhcm91c2VsJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICBcdHJhbmRvbVByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgICAgICBcdFx0cmV0dXJuIFByb2R1Y3RGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgICAgIFx0fVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcblxuXG5hcHAuY29udHJvbGxlcignSG9tZUNhcm91c2VsJywgZnVuY3Rpb24gKCRzY29wZSwgSG9tZVBhZ2VQaWNzLCByYW5kb21Qcm9kdWN0cywgJHJvb3RTY29wZSkge1xuICAgICRzY29wZS5pbWFnZXMgPSBfLnNodWZmbGUoSG9tZVBhZ2VQaWNzKTtcbiAgICAkcm9vdFNjb3BlLnRpdGxlID0gdHJ1ZTtcbiAgICAkc2NvcGUucmFuZG9tUHJvZHVjdHMgPSBfLnNhbXBsZShyYW5kb21Qcm9kdWN0cywgNCk7XG59KTtcbiIsImFwcC5jb25maWcoZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbG9naW4nLCB7XG4gICAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkN0cmwnXG4gICAgfSk7XG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignTG9naW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aFNlcnZpY2UsICRzdGF0ZSkge1xuXG4gICAgJHNjb3BlLmxvZ2luID0ge307XG4gICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICRzY29wZS5zZW5kTG9naW4gPSBmdW5jdGlvbiAobG9naW5JbmZvKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gbnVsbDtcblxuICAgICAgICBBdXRoU2VydmljZS5sb2dpbihsb2dpbkluZm8pLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRzY29wZS5lcnJvciA9ICdJbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICRzY29wZS5zZW5kU2lnbnVwID0gZnVuY3Rpb24gKGxvZ2luSW5mbykge1xuXG4gICAgICAgICRzY29wZS5lcnJvciA9IG51bGw7XG5cbiAgICAgICAgQXV0aFNlcnZpY2Uuc2lnbnVwKGxvZ2luSW5mbykudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJHNjb3BlLmVycm9yID0gJ0ludmFsaWQgc2lnbnVwIGNyZWRlbnRpYWxzLic7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxufSk7IiwiYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4tb3JkZXJzJywge1xuICAgIHVybDogJy9hZG1pbi9vcmRlcnMvJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL2FkbWluLW9yZGVycy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5PcmRlcnNDdHJsJyxcbiAgICByZXNvbHZlOiB7XG4gICAgICBvcmRlcnM6IGZ1bmN0aW9uKE9yZGVyRmFjdG9yeSkge1xuICAgICAgICByZXR1cm4gT3JkZXJGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgICB9XG4gICAgfVxuICB9KVxufSk7XG5cbmFwcC5jb250cm9sbGVyKCdBZG1pbk9yZGVyc0N0cmwnLCBmdW5jdGlvbigkc2NvcGUsIG9yZGVycywgJGZpbHRlciwgT3JkZXJGYWN0b3J5KSB7XG4gXG5cbiAgJHNjb3BlLmFsbE9yZGVycyA9IG9yZGVycy5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICByZXR1cm4gb3JkZXIuc3RhdHVzICE9PSAnY2FydCc7XG4gIH0pO1xuICBcbiAgJHNjb3BlLm9yZGVycyA9ICRzY29wZS5hbGxPcmRlcnM7XG4gIFxuICAkc2NvcGUub3JkZXJzVG9CZVNoaXBwZWQgPSAkc2NvcGUuYWxsT3JkZXJzLmZpbHRlcihmdW5jdGlvbihvcmRlcikge1xuICAgIHJldHVybiBvcmRlci5zdGF0dXMgPT09ICdvcmRlcmVkJztcbiAgfSlcblxuXG4gIGlmICgkc2NvcGUub3JkZXJzVG9CZVNoaXBwZWQubGVuZ3RoKSB7XG4gICAgJHNjb3BlLm1haW4gPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgICRzY29wZS5tYWluID0gZmFsc2U7XG4gIH1cblxuICAkc2NvcGUudmlld0FsbCA9IGZ1bmN0aW9uKCkge1xuICAgICRzY29wZS5tYWluID0gZmFsc2U7XG4gICAgJHNjb3BlLm9yZGVycyA9ICRzY29wZS5hbGxPcmRlcnM7XG4gIH1cblxuICAkc2NvcGUudmlld09yZGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUubWFpbiA9IGZhbHNlO1xuICAgICRzY29wZS5vcmRlcnMgPSAkc2NvcGUub3JkZXJzVG9CZVNoaXBwZWQ7XG4gIH1cblxuXG4gIHZhciB1cERvd24gPSAnaWQnO1xuICB2YXIgc3RhdHVzID0gJ3N0YXR1cyc7XG4gIHZhciBkYXRlID0gXCJjcmVhdGVkQXRcIjtcblxuICAkc2NvcGUub3JkZXJOdW1iZXJGaWx0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodXBEb3duID09PSAnaWQnKSB7XG4gICAgICB1cERvd24gPSBcIi1pZFwiO1xuICAgICAgJHNjb3BlLm9yZGVycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUub3JkZXJzLCB1cERvd24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cERvd24gPSAnaWQnO1xuICAgICAgJHNjb3BlLm9yZGVycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUub3JkZXJzLCB1cERvd24pO1xuICAgIH1cblxuICB9XG5cbiAgJHNjb3BlLnNoaXBBbGwgPSBPcmRlckZhY3Rvcnkuc2hpcEFsbDtcblxuICAkc2NvcGUuc2hpcCA9IE9yZGVyRmFjdG9yeS5zaGlwO1xuICAkc2NvcGUuc2hpcFVwZGF0ZSA9IGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgb3JkZXIuc3RhdHVzID0gJ3NoaXBwZWQnO1xuICB9XG5cbiAgJHNjb3BlLmJ1bGtVcGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUub3JkZXJzVG9CZVNoaXBwZWQgPSAkc2NvcGUub3JkZXJzVG9CZVNoaXBwZWQubWFwKGZ1bmN0aW9uKG9yZGVyKSB7XG4gICAgICBvcmRlci5zdGF0dXMgPSAnc2hpcHBlZCc7XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSlcbiAgICAkc2NvcGUuYWxsT3JkZXJzID0gJHNjb3BlLmFsbE9yZGVycy5tYXAoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIGlmIChvcmRlci5zdGF0dXMgPT09ICdvcmRlcmVkJykge1xuICAgICAgICBvcmRlci5zdGF0dXMgPSAnc2hpcHBlZCc7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JkZXI7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5jYW5jZWwgPSBPcmRlckZhY3RvcnkuY2FuY2VsO1xuICAkc2NvcGUuY2FuY2VsVXBkYXRlID0gZnVuY3Rpb24ob3JkZXIpIHtcbiAgICBvcmRlci5zdGF0dXMgPSAnY2FuY2VsZWQnO1xuICB9XG5cbiAgJHNjb3BlLm9yZGVyRGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChkYXRlID09PSBcImNyZWF0ZWRBdFwiKSB7XG4gICAgICBkYXRlID0gJy1jcmVhdGVkQXQnO1xuICAgICAgJHNjb3BlLm9yZGVycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUub3JkZXJzLCBkYXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0ZSA9ICdjcmVhdGVkQXQnO1xuICAgICAgJHNjb3BlLm9yZGVycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUub3JkZXJzLCBkYXRlKTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuZmlsdGVyU3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN0YXR1cyA9PT0gXCJzdGF0dXNcIikge1xuICAgICAgc3RhdHVzID0gJy1zdGF0dXMnO1xuICAgICAgJHNjb3BlLm9yZGVycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUub3JkZXJzLCBzdGF0dXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgPSAnc3RhdHVzJztcbiAgICAgICRzY29wZS5vcmRlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLm9yZGVycywgc3RhdHVzKTtcbiAgICB9XG4gIH1cblxufSlcbiIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluLXByb2R1Y3RzJywge1xuICAgIHVybDogJy9hZG1pbi9wcm9kdWN0cycsXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9hZG1pbi9hZG1pbi1wcm9kdWN0cy5odG1sJyxcbiAgICBjb250cm9sbGVyOiAnQWRtaW5Qcm9kdWN0c0N0cmwnLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGdldEFsbFByb2R1Y3RzOiBmdW5jdGlvbihQcm9kdWN0RmFjdG9yeSkge1xuICAgICAgICByZXR1cm4gUHJvZHVjdEZhY3RvcnkuZmV0Y2hBbGwoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59KVxuXG5cbmFwcC5jb250cm9sbGVyKCdBZG1pblByb2R1Y3RzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgZ2V0QWxsUHJvZHVjdHMsICRmaWx0ZXIpe1xuICAkc2NvcGUuYWxsUHJvZHVjdHMgPSBnZXRBbGxQcm9kdWN0cztcblxuICAkc2NvcGUub3V0T2ZTdG9jayA9ICRzY29wZS5hbGxQcm9kdWN0cy5maWx0ZXIoZnVuY3Rpb24ocHJvZHVjdCkge1xuICAgIHJldHVybiBwcm9kdWN0LnN0YXR1cyA9PT0gJ291dCBvZiBzdG9jayc7XG4gIH0pXG5cbiAgJHNjb3BlLnByb2R1Y3RzID0gJHNjb3BlLmFsbFByb2R1Y3RzO1xuXG4gIGlmICgkc2NvcGUub3V0T2ZTdG9jay5sZW5ndGgpIHtcbiAgICAkc2NvcGUubWFpbiA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgJHNjb3BlLm1haW4gPSBmYWxzZTtcbiAgfVxuXG4gICRzY29wZS52aWV3QWxsID0gZnVuY3Rpb24oKSB7XG4gICAgJHNjb3BlLm1haW4gPSBmYWxzZTtcbiAgICAkc2NvcGUucHJvZHVjdHMgPSAkc2NvcGUuYWxsUHJvZHVjdHM7XG4gIH1cblxuICAkc2NvcGUudmlld091dE9mU3RvY2sgPSBmdW5jdGlvbigpIHtcbiAgICAkc2NvcGUubWFpbiA9IGZhbHNlO1xuICAgICRzY29wZS5wcm9kdWN0cyA9ICRzY29wZS5vdXRPZlN0b2NrO1xuICB9XG5cblxuICB2YXIgbmFtZSA9IFwibmFtZVwiO1xuICB2YXIgc3RhdHVzID0gXCJzdGF0dXNcIjtcbiAgdmFyIHF1YW50aXR5ID0gXCJzdG9ja1wiO1xuXG4gICRzY29wZS5maWx0ZXJCeU5hbWUgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAobmFtZSA9PT0gJ25hbWUnKSB7XG4gICAgICBuYW1lID0gJy1uYW1lJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gJ25hbWUnO1xuICAgICAgJHNjb3BlLnByb2R1Y3RzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5wcm9kdWN0cywgbmFtZSk7XG4gICAgfVxuICB9XG5cbiAgJHNjb3BlLmZpbHRlckJ5U3RhdHVzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN0YXR1cyA9PT0gJ3N0YXR1cycpIHtcbiAgICAgIHN0YXR1cyA9ICctc3RhdHVzJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIHN0YXR1cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXR1cyA9ICdzdGF0dXMnO1xuICAgICAgJHNjb3BlLnByb2R1Y3RzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5wcm9kdWN0cywgc3RhdHVzKTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuZmlsdGVyQnlRdWFudGl0eSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChxdWFudGl0eSA9PT0gJ3N0b2NrJykge1xuICAgICAgcXVhbnRpdHkgPSAnLXN0b2NrJztcbiAgICAgICRzY29wZS5wcm9kdWN0cyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUucHJvZHVjdHMsIHF1YW50aXR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcXVhbnRpdHkgPSAnc3RvY2snO1xuICAgICAgJHNjb3BlLnByb2R1Y3RzID0gJGZpbHRlcignb3JkZXJCeScpKCRzY29wZS5wcm9kdWN0cywgcXVhbnRpdHkpO1xuICAgIH1cbiAgfVxuXG5cbn0pIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRtaW4tdXBkYXRlJywge1xuICAgICAgICB1cmw6ICcvYWRtaW4vb3JkZXJzLzppZCcsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvYWRtaW4vYWRtaW4tc2luZ2xlLW9yZGVyLmh0bWwnLFxuICAgIFx0Y29udHJvbGxlcjogJ0FkbWluVXBkYXRlQ3RybCcsXG4gICAgXHRyZXNvbHZlOiB7XG4gICAgXHRcdG9yZGVyOiBmdW5jdGlvbihPcmRlckZhY3RvcnkpIHtcbiAgICBcdFx0XHRyZXR1cm4gT3JkZXJGYWN0b3J5LmZldGNoQWxsKCk7XG4gICAgXHRcdH1cbiAgICBcdH1cbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQWRtaW5VcGRhdGVDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBvcmRlcnMpIHtcbiAgICAkc2NvcGUub3JkZXJzID0gb3JkZXJzLmZpbHRlcihmdW5jdGlvbihvcmRlcikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JkZXIuc3RhdHVzICE9PSAnY2FydCc7XG4gICAgICAgICAgICAgICAgfSk7XG59KSIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluVXNlcnMnLCB7XG4gICAgdXJsOiAnL2FkbWluL3VzZXJzJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL2FkbWluL2FkbWluLXVzZXJzLmh0bWwnLFxuICAgIGNvbnRyb2xsZXI6ICdBZG1pblVzZXJzQ3RybCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgZ2V0QWxsVXNlcnM6IGZ1bmN0aW9uKFVzZXJGYWN0b3J5KSB7XG4gICAgICAgIHJldHVybiBVc2VyRmFjdG9yeS5mZXRjaEFsbCgpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn0pXG5cblxuYXBwLmNvbnRyb2xsZXIoJ0FkbWluVXNlcnNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCBnZXRBbGxVc2VycywgJGZpbHRlcil7XG4gICRzY29wZS51c2VycyA9IGdldEFsbFVzZXJzO1xuXG4gIHZhciB1c2VySWQgPSAnaWQnO1xuICB2YXIgbGFzdE5hbWUgPSAnbGFzdF9uYW1lJztcbiAgdmFyIGVtYWlsID0gJ2VtYWlsJztcblxuICAkc2NvcGUuZmlsdGVyQnlVc2VySWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodXNlcklkID09PSAnaWQnKSB7XG4gICAgICB1c2VySWQgPSAnLWlkJztcbiAgICAgICRzY29wZS51c2VycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUudXNlcnMsIHVzZXJJZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVzZXJJZCA9ICdpZCc7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCB1c2VySWQpO1xuICAgIH1cbiAgfVxuXG4gICRzY29wZS5maWx0ZXJCeUVtYWlsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGVtYWlsID09PSAnZW1haWwnKSB7XG4gICAgICBlbWFpbCA9IFwiLWVtYWlsXCI7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCBlbWFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtYWlsID0gJ2VtYWlsJztcbiAgICAgICRzY29wZS51c2VycyA9ICRmaWx0ZXIoJ29yZGVyQnknKSgkc2NvcGUudXNlcnMsIGVtYWlsKTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuZmlsdGVyQnlMYXN0TmFtZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChsYXN0TmFtZSA9PT0gJ2xhc3RfbmFtZScpIHtcbiAgICAgIGxhc3ROYW1lID0gXCItbGFzdF9uYW1lXCI7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCBsYXN0TmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhc3ROYW1lID0gJ2xhc3RfbmFtZSc7XG4gICAgICAkc2NvcGUudXNlcnMgPSAkZmlsdGVyKCdvcmRlckJ5JykoJHNjb3BlLnVzZXJzLCBsYXN0TmFtZSk7XG4gICAgfVxuICB9XG5cbn0pIiwiYXBwLmZhY3RvcnkoJ1Byb2R1Y3RGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHApIHtcblx0dmFyIHByb2R1Y3RGYWN0b3J5ID0ge307XG5cblx0cHJvZHVjdEZhY3RvcnkuZmV0Y2hBbGwgPSBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzLycpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAocHJvZHVjdHMpIHtcblx0XHRcdFx0cmV0dXJuIHByb2R1Y3RzLmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0cHJvZHVjdEZhY3RvcnkuZmV0Y2hCeUlkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Byb2R1Y3RzLycgKyBpZClcblx0XHQudGhlbihmdW5jdGlvbiAocHJvZHVjdCkge1xuXHRcdFx0cmV0dXJuIHByb2R1Y3QuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cHJvZHVjdEZhY3RvcnkudXBkYXRlU3RvY2sgPSBmdW5jdGlvbihpZCwgc3RvY2spIHtcblx0XHR2YXIgc3RhdHVzID0gc3RvY2sgPyAnYXZhaWxhYmxlJyA6ICdvdXQgb2Ygc3RvY2snIFxuXHRcdHJldHVybiAkaHR0cC5wdXQoKCcvYXBpL3Byb2R1Y3RzLycgKyBpZCksIHtzdG9jazogc3RvY2ssIHN0YXR1czogc3RhdHVzfSlcblx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHVwZGF0ZWRQcm9kdWN0KSB7XG5cdFx0XHRcdFx0cmV0dXJuIHVwZGF0ZWRQcm9kdWN0LmRhdGE7XG5cdFx0XHRcdH0pO1xuXHRcblx0fVxuXG5cdHByb2R1Y3RGYWN0b3J5LmFkZFByb2R1Y3QgPSBmdW5jdGlvbiAobmV3UHJvZHVjdCkge1xuXHRcdHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3Byb2R1Y3RzLycsIG5ld1Byb2R1Y3QpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoY3JlYXRlZFByb2R1Y3QpIHtcblx0XHRcdFx0cmV0dXJuIGNyZWF0ZWRQcm9kdWN0LmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0cHJvZHVjdEZhY3RvcnkuZGlzY29udGludWUgPSBmdW5jdGlvbiAoaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAucHV0KCgnL2FwaS9wcm9kdWN0cy8nICsgaWQpLCB7c3RhdHVzOiAnZGlzY29udGludWVkJ30pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGVkUHJvZHVjdCkge1xuXHRcdFx0XHRcdHJldHVybiB1cGRhdGVkUHJvZHVjdC5kYXRhO1xuXHRcdFx0XHR9KTtcblx0fVxuXG5cblxuXHRyZXR1cm4gcHJvZHVjdEZhY3Rvcnk7XG59KSIsImFwcC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncHJvZHVjdCcsIHtcbiAgICB1cmw6ICcvcHJvZHVjdC86aWQnLFxuICAgIHRlbXBsYXRlVXJsOiAnanMvcHJvZHVjdHMvc2luZ2xlLnByb2R1Y3QuaHRtbCcsXG4gICAgcmVzb2x2ZToge1xuICAgICAgICAgcmV2aWV3czogZnVuY3Rpb24oUmV2aWV3RmFjdG9yeSwkc3RhdGVQYXJhbXMpe1xuICAgICAgICAgICAgcmV0dXJuIFJldmlld0ZhY3RvcnkuZmV0Y2hCeVByb2R1Y3RJZCgkc3RhdGVQYXJhbXMuaWQpXG4gICAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAoYWxsUmV2aWV3cykge1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbGxSZXZpZXdzO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICBjb250cm9sbGVyOiAnUHJvZHVjdEN0cmwnXG4gIH0pXG5cbn0pO1xuXG5hcHAuY29udHJvbGxlcignUHJvZHVjdEN0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgUHJvZHVjdEZhY3RvcnksICRsb2csIE9yZGVyRmFjdG9yeSwgcmV2aWV3cywgUmV2aWV3RmFjdG9yeSwgU2Vzc2lvbikge1xuXG4gIHZhciBhdmVyYWdlUmF0aW5nID0gKHJldmlld3MubWFwKGZ1bmN0aW9uKHIpe3JldHVybiByLnJhdGluZ30pLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9KSkvcmV2aWV3cy5sZW5ndGg7XG4gICRzY29wZS5yYXRpbmdWYWx1ZSA9IGF2ZXJhZ2VSYXRpbmc7IFxuXG4gICRzY29wZS5yZXZpZXdzID0gcmV2aWV3cztcblxuICAkc2NvcGUubmV3UmV2aWV3ID0ge3JhdGluZzogNSwgdGV4dDogXCJcIn07XG5cbiAgJHNjb3BlLnN1Ym1pdFJldmlldyA9IGZ1bmN0aW9uICgpe1xuICAgIGlmICgkc2NvcGUubmV3UmV2aWV3LnRleHQgPT09IFwiXCIpIHJldHVybjtcbiAgICBSZXZpZXdGYWN0b3J5LnBvc3RSZXZpZXcoJHNjb3BlLnByb2R1Y3QuaWQsICRzY29wZS5uZXdSZXZpZXcpXG4gICAgLnRoZW4oZnVuY3Rpb24obmV3UmV2aWV3KXtcbiAgICAgIG5ld1Jldmlldy51c2VyID0gU2Vzc2lvbi51c2VyXG4gICAgICAkc2NvcGUucmV2aWV3cy5wdXNoKG5ld1Jldmlldyk7XG4gICAgICAkc2NvcGUubGVhdmVSZXZpZXcgPSBmYWxzZTtcbiAgICAgICRzY29wZS5uZXdSZXZpZXcgPSB7cmF0aW5nOiA1LCB0ZXh0OiBcIlwifTtcbiAgICB9KVxuICB9XG5cblx0JHNjb3BlLnF1YW50aXR5ID0gMTtcblxuIFx0UHJvZHVjdEZhY3RvcnkuZmV0Y2hCeUlkKCRzdGF0ZVBhcmFtcy5pZClcblx0LnRoZW4oZnVuY3Rpb24gKHByb2R1Y3QpIHtcbiAgICAgICRzY29wZS5wcm9kdWN0ID0gcHJvZHVjdDtcbiAgICB9KVxuICAgIC5jYXRjaCgkbG9nKTtcblxuXHQkc2NvcGUudXAgPSBmdW5jdGlvbigpe1xuICAgIGlmICgkc2NvcGUucXVhbnRpdHkgPj0gJHNjb3BlLnByb2R1Y3Quc3RvY2spIHJldHVybjtcblx0XHQkc2NvcGUucXVhbnRpdHkrKztcblx0fVxuXG5cdCRzY29wZS5kb3duID0gZnVuY3Rpb24oKXtcblx0XHRpZiAoJHNjb3BlLnF1YW50aXR5ID4gMSkgJHNjb3BlLnF1YW50aXR5LS07XG5cdH1cblxuXHQkc2NvcGUuYWRkVG9DYXJ0ID0gZnVuY3Rpb24oKXtcbiAgICBcdE9yZGVyRmFjdG9yeS51cGRhdGVDYXJ0KCRzY29wZS5wcm9kdWN0LCAkc2NvcGUucXVhbnRpdHkpXG4gICAgfTtcblxuICAvLyBSZXZpZXdGYWN0b3J5LmZldGNoQnlQcm9kdWN0SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAvLyAudGhlbihmdW5jdGlvbiAoYWxsUmV2aWV3cykge1xuICAvLyAgICAgJHNjb3BlLnJldmlld3MgPSBhbGxSZXZpZXdzO1xuICAvLyAgICAgdmFyIGF2ZXJhZ2VSYXRpbmcgPSAoYWxsUmV2aWV3cy5tYXAoZnVuY3Rpb24ocil7cmV0dXJuIHIucmF0aW5nfSkucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0pKS9hbGxSZXZpZXdzLmxlbmd0aDtcbiAgLy8gICAgICRzY29wZS5yYXRpbmdWYWx1ZSA9IGF2ZXJhZ2VSYXRpbmc7IFxuICAvLyB9KVxuXG59KVxuIiwiYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnY2FydCcsIHtcbiAgICAgICAgdXJsOiAnL2NhcnQvJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9vcmRlci90ZW1wbGF0ZXMvY2FydHBhZ2UuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdDYXJ0Q3RybCdcbiAgICB9KTtcbn0pO1xuXG5hcHAuY29udHJvbGxlcignQ2FydEN0cmwnLCBmdW5jdGlvbigkc2NvcGUsIE9yZGVyRmFjdG9yeSwgU2Vzc2lvbiwgQXV0aFNlcnZpY2Upe1xuXHQvLyAkc2NvcGUuY2FydCA9IGNhcnQ7XG4gICRzY29wZS51c2VyID0gU2Vzc2lvbi51c2VyO1xuXG4vLyBzdWJ0b3RhbCBtYXRoXG5cdHZhciBjYWxjU3VidG90YWwgPSBmdW5jdGlvbiAoKXtcblx0XHRpZiAoJHNjb3BlLmNhcnQucHJvZHVjdHMubGVuZ3RoKXtcblx0XHRcdHZhciBwcmljZXMgPSAkc2NvcGUuY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG5cdFx0XHRcdHJldHVybiBwYXJzZUZsb2F0KHByb2R1Y3QucHJpY2UpXG5cdFx0XHR9KVxuXHRcdFx0dmFyIHF1YW50aXRpZXMgPSAkc2NvcGUuY2FydC5wcm9kdWN0cy5tYXAoZnVuY3Rpb24ocHJvZHVjdCl7XG5cdFx0XHRcdHJldHVybiBwcm9kdWN0LnByb2R1Y3RPcmRlci5xdWFudGl0eTtcblx0XHRcdH0pXG5cdFx0XHR2YXIgc3VidG90YWwgPSAwO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGk8JHNjb3BlLmNhcnQucHJvZHVjdHMubGVuZ3RoOyBpKyspe1xuXHRcdCAgICBcdHN1YnRvdGFsICs9IHByaWNlc1tpXSAqIHF1YW50aXRpZXNbaV07XG5cdFx0XHR9XG5cdFx0XHQkc2NvcGUuY2FydC5zdWJ0b3RhbCA9IHN1YnRvdGFsLnRvRml4ZWQoMik7XG5cdFx0fVxuXHR9XG5cblx0Ly9Gb3JjZSBnZXR0aW5nIHVzZXIgYmVmb3JlIHRyeWluZyB0byBnZXQgdGhlIGNhcnRcblx0QXV0aFNlcnZpY2UuZ2V0TG9nZ2VkSW5Vc2VyKClcblx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRPcmRlckZhY3RvcnkuZ2V0VXNlckNhcnQoKVxuXHRcdC50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHQkc2NvcGUuY2FydCA9IHJlcztcblx0XHRcdGNhbGNTdWJ0b3RhbCgpO1xuXHRcdFx0Y29uc29sZS5sb2coXCJVU0VSIENBUlQ6XCIsIHJlcyk7XG5cdFx0fSlcblx0fSlcblxuXG4gICAgJHNjb3BlLnVwZGF0ZUNhcnQgPSBmdW5jdGlvbihwcm9kdWN0LCBxdWFudGl0eSl7XG4gICAgXHRPcmRlckZhY3RvcnkudXBkYXRlQ2FydChwcm9kdWN0LCBxdWFudGl0eSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24odXBkYXRlZENhcnQpe1xuICAgICAgICBcdCRzY29wZS5jYXJ0ID0gdXBkYXRlZENhcnQ7XG4gICAgICAgIFx0Y2FsY1N1YnRvdGFsKCk7XG4gICAgICAgIH0pXG4gICAgfVxuXG5cbn0pXG4iLCJhcHAuZmFjdG9yeSgnT3JkZXJGYWN0b3J5JywgZnVuY3Rpb24oJGh0dHAsIFNlc3Npb24sIEF1dGhTZXJ2aWNlLCAkcSwgJGNvb2tpZXMsICRzdGF0ZSl7XG5cblx0dmFyIE9yZGVyRmFjdG9yeSA9IHt9O1xuXG5cblx0Ly8gV2UgaGF2ZSBhIGNoZWNrIHRvIHNlZSBpZiB0aGUgdXNlciBpc1xuXHQvLyBhdXRoZW50aWNhdGVkLCBidXQgZG8gd2UgaGF2ZSBhIGNoZWNrIHRvIG1ha2Vcblx0Ly8gc3VyZSB0aGF0IHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgaXMgdGhlIHNhbWVcblx0Ly8gYXMgdGhlIHVzZXIgd2hvc2UgY2FydCB0aGV5IGFyZSBxdWVyeWluZz9cblxuXHRPcmRlckZhY3RvcnkuZ2V0VXNlckNhcnQgPSBmdW5jdGlvbigpe1xuXG5cdFx0Ly9kZWFscyB3aXRoIEF1dGggdXNlcnNcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJytTZXNzaW9uLnVzZXIuaWQrJy9jYXJ0Jylcblx0XHRcdC50aGVuKGZ1bmN0aW9uKG9yZGVycyl7XG5cdFx0XHRcdHJldHVybiBvcmRlcnMuZGF0YTtcblx0XHRcdH0pXG5cdFx0fVxuXHRcdC8vTk9OLUFVVEggVVNFUlNcblx0XHRyZXR1cm4gJHEud2hlbigkY29va2llcy5nZXRPYmplY3QoXCJjYXJ0XCIpKTtcblx0fVxuXG5cdE9yZGVyRmFjdG9yeS5nZXRBbGxVc2VyT3JkZXJzID0gZnVuY3Rpb24gKHVzZXJJZCkge1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL29yZGVycy8nK3VzZXJJZCsnL2FsbCcpXG5cdFx0XHQudGhlbihmdW5jdGlvbihvcmRlcnMpe1xuXHRcdFx0XHRyZXR1cm4gb3JkZXJzLmRhdGE7XG5cdFx0XHR9KVxuXHRcdH1cblx0fVxuXG5cdE9yZGVyRmFjdG9yeS5nZXRVc2VySGlzdG9yeSA9IGZ1bmN0aW9uICh1c2VySWQpIHtcblx0XHRpZiAoQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpe1xuXHRcdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJyt1c2VySWQrJy9vcmRlcmhpc3RvcnknKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24ob3JkZXJzKXtcblx0XHRcdFx0cmV0dXJuIG9yZGVycy5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdH1cblxuXHRPcmRlckZhY3RvcnkucHVyY2hhc2UgPSBmdW5jdGlvbiAodXNlcklkLCBvcmRlcklkLCBhZGRyZXNzKSB7XG5cdFx0Y29uc29sZS5sb2coQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCkpO1xuXHRcdGlmIChBdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKSl7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvJyArdXNlcklkKyBcIi9cIiArIG9yZGVySWQgKyAnL3B1cmNoYXNlJywgYWRkcmVzcylcblx0XHRcdC50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JHN0YXRlLmdvKCdjb25maXJtYXRpb24nLCB7aWQ6IHVzZXJJZCwgb3JkZXJJZDogb3JkZXJJZH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9KVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiQUREUkVTUzo6XCIsIGFkZHJlc3MpO1xuXHRcdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvZ3Vlc3QvcHVyY2hhc2UnLCBhZGRyZXNzKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oKXtcblx0XHRcdFx0JHN0YXRlLmdvKCdob21lJyk7XG5cdFx0XHRcdCRjb29raWVzLnB1dE9iamVjdCgnY2FydCcsIHtzdGF0dXM6IFwiY2FydFwiLCBwcm9kdWN0czogW10sIHN1YnRvdGFsOiAwfSlcblx0XHRcdH0pXG5cblx0XHR9XG5cdH1cblxuXHRPcmRlckZhY3RvcnkuZmV0Y2hCeUlkID0gZnVuY3Rpb24gKHVzZXJJZCwgb3JkZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvb3JkZXJzLycgKyB1c2VySWQgKyBcIi9cIiArIG9yZGVySWQpXG5cdFx0XHQudGhlbihmdW5jdGlvbiAob3JkZXIpIHtcblx0XHRcdFx0cmV0dXJuIG9yZGVyLmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LnVwZGF0ZUNhcnQgPSBmdW5jdGlvbihwcm9kdWN0LCBxdWFudGl0eUNoYW5nZSl7XG5cdFx0aWYgKEF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKXtcblx0XHRcdHJldHVybiAkaHR0cC5wdXQoXCIvYXBpL29yZGVycy9cIitTZXNzaW9uLnVzZXIuaWQrXCIvdXBkYXRlQ2FydFwiLCB7cHJvZHVjdElkOiBwcm9kdWN0LmlkLCBxdWFudGl0eUNoYW5nZTogcXVhbnRpdHlDaGFuZ2V9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oY2FydCl7XG5cdFx0XHRcdCRzdGF0ZS5nbygnY2FydCcpO1xuXHRcdFx0XHRyZXR1cm4gY2FydC5kYXRhO1xuXHRcdFx0fSlcblx0XHR9XG5cdFx0Ly9Gb3Igbm9uLWF1dGggcGVvcGxlXG5cdFx0ZWxzZSB7XG5cdFx0XHQvL0dldCBjYXJ0IGZyb20gY29va2llXG5cdFx0XHR2YXIgY2FydCA9ICRjb29raWVzLmdldE9iamVjdChcImNhcnRcIik7XG5cblx0XHRcdC8vZmluZCBjYXJ0IElkeCBvZiBwcm9kdWN0IChDYW4ndCB1c2UgaW5kZXhPZiBiZWNhdXNlIHF1YW50aXR5IG9uIHByb2R1Y3RzLnByb2R1Y3RPcmRlci5xdWFudGl0eSBjb3VsZCBkaWZmZXIpXG5cdFx0XHR2YXIgY2FydElkeCA9IC0xO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYXJ0LnByb2R1Y3RzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0aWYgKGNhcnQucHJvZHVjdHNbaV0uaWQgPT09IHByb2R1Y3QuaWQpIHtcblx0XHRcdFx0XHRjYXJ0SWR4ID0gaTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0Ly9pZiBpbmNyZW1lbnRpbmcgcHJvZHVjdCBudW1cblx0XHRcdGlmIChxdWFudGl0eUNoYW5nZSA+IDApe1xuXHRcdFx0XHRpZiAoY2FydElkeCA9PT0gLTEpe1xuXHRcdFx0XHRcdC8vYWRkIHRvIGNhcnQgaWYgbm90IGluIHRoZXJlIEJVVCBPTkxZIGlmIHRoZSBwcm9kdWN0IHN0b2NrIGV4Y2VlZHMgdGhlIG51bWJlciB5b3UncmUgdHJ5aW5nIHRvIGFkZFxuXHRcdFx0XHRcdGlmIChwcm9kdWN0LnN0b2NrID49IHF1YW50aXR5Q2hhbmdlKSB7XG5cdFx0XHRcdFx0XHRwcm9kdWN0LnByb2R1Y3RPcmRlciA9IHtxdWFudGl0eTogcXVhbnRpdHlDaGFuZ2V9XG5cdFx0XHRcdFx0XHRjYXJ0LnByb2R1Y3RzLnB1c2gocHJvZHVjdCk7XG5cdFx0XHRcdFx0XHQkc3RhdGUuZ28oJ2NhcnQnKTtcblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvL290aGVyd2lzZSBqdXN0IGluY3JlbWVudCB0aGUgcXVhbnRpdHkgQlVUIE9OTFkgaWYgdGhlIHN0b2NrIGV4Y2VlZHMgdGhlIGN1cnJlbnQgY2FydCBxdWFudGl0eStjaGFuZ2Vcblx0XHRcdFx0XHRpZiAocHJvZHVjdC5zdG9jayA+PSAoY2FydC5wcm9kdWN0c1tjYXJ0SWR4XS5wcm9kdWN0T3JkZXIucXVhbnRpdHkgKyBxdWFudGl0eUNoYW5nZSkpIHtcblx0XHRcdFx0XHRcdGNhcnQucHJvZHVjdHNbY2FydElkeF0ucHJvZHVjdE9yZGVyLnF1YW50aXR5ICs9IHF1YW50aXR5Q2hhbmdlO1xuXHRcdFx0XHRcdFx0JHN0YXRlLmdvKCdjYXJ0Jyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdC8vVXBkYXRlIGNvb2tpZVxuXHRcdFx0XHQkY29va2llcy5wdXRPYmplY3QoXCJjYXJ0XCIsIGNhcnQpO1xuXHRcdFx0XHQvL3JldHVybiBhcyBwcm9taXNlXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKGNhcnQpO1xuXHRcdFx0XHQvL2Vsc2UgaWYgZGVjcmVhc2luZyBwcm9kdWN0IG51bVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9pZiB0byB6ZXJvLCByZW1vdmUgaXQgYWx0b2dldGhlclxuXHRcdFx0XHRpZiAocXVhbnRpdHlDaGFuZ2UgKyBjYXJ0LnByb2R1Y3RzW2NhcnRJZHhdLnByb2R1Y3RPcmRlci5xdWFudGl0eSA8PSAwKSB7XG5cdFx0XHRcdFx0Y2FydC5wcm9kdWN0cy5zcGxpY2UoY2FydElkeCwgMSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly9vdGhlcndpc2UganVzdCBkZWNyZWFzZSB0aGUgcXVhbnRpdHkgKGNoYW5nZSBpcyBuZWcgbnVtYmVyKVxuXHRcdFx0XHRcdGNhcnQucHJvZHVjdHNbY2FydElkeF0ucHJvZHVjdE9yZGVyLnF1YW50aXR5ICs9IHF1YW50aXR5Q2hhbmdlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vVXBkYXRlIGNvb2tpZVxuXHRcdFx0XHQkY29va2llcy5wdXRPYmplY3QoXCJjYXJ0XCIsIGNhcnQpO1xuXHRcdFx0XHQvL3JldHVybiBhcyBwcm9taXNlXG5cdFx0XHRcdHJldHVybiAkcS53aGVuKGNhcnQpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LnNoaXAgPSBmdW5jdGlvbihvcmRlcklkKSB7XG5cdFx0cmV0dXJuICRodHRwLnB1dCgnL2FwaS9vcmRlcnMvJyArIG9yZGVySWQgKyAnL3N0YXR1cycsIHtzdGF0dXM6ICdzaGlwcGVkJ30pXG5cdFx0XHQudGhlbihmdW5jdGlvbiAoc2hpcHBlZE9yZGVyKSB7XG5cdFx0XHRcdHJldHVybiBzaGlwcGVkT3JkZXIuZGF0YTtcblx0XHRcdH0pXG5cdH1cblxuXHRPcmRlckZhY3Rvcnkuc2hpcEFsbCA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvb3JkZXJzL3NoaXBhbGwnLCB7c3RhdHVzOiAnc2hpcHBlZCd9KVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24gKHNoaXBwZWRPcmRlcnMpIHtcblx0XHRcdFx0cmV0dXJuIHNoaXBwZWRPcmRlcnMuZGF0YTtcblx0XHRcdH0pXG5cdH1cblxuXHRPcmRlckZhY3RvcnkuY2FuY2VsID0gZnVuY3Rpb24ob3JkZXJJZCkge1xuXHRcdHJldHVybiAkaHR0cC5wdXQoJy9hcGkvb3JkZXJzLycgKyBvcmRlcklkICsgJy9zdGF0dXMnLCB7c3RhdHVzOiAnY2FuY2VsZWQnfSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChjYW5jZWxlZE9yZGVyKSB7XG5cdFx0XHRcdHJldHVybiBjYW5jZWxlZE9yZGVyLmRhdGE7XG5cdFx0XHR9KVxuXHR9XG5cblx0T3JkZXJGYWN0b3J5LmZldGNoQWxsID0gZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuICRodHRwLmdldCgnL2FwaS9vcmRlcnMvJylcblx0XHRcdC50aGVuKGZ1bmN0aW9uIChhbGxPcmRlcnMpIHtcblx0XHRcdFx0cmV0dXJuIGFsbE9yZGVycy5kYXRhO1xuXHRcdFx0fSlcblx0fVxuXG5cdHJldHVybiBPcmRlckZhY3Rvcnk7XG59KVxuIiwiYXBwLmZhY3RvcnkoJ1Jldmlld0ZhY3RvcnknLCBmdW5jdGlvbigkaHR0cCwgU2Vzc2lvbikge1xuXHRcblx0dmFyIHJldmlld0ZhY3RvcnkgPSB7fTtcblxuXHRyZXZpZXdGYWN0b3J5LmZldGNoQnlQcm9kdWN0SWQgPSBmdW5jdGlvbihpZCkge1xuXHRcdHJldHVybiAkaHR0cC5nZXQoJy9hcGkvcHJvZHVjdHMvJyArIGlkICsgJy9yZXZpZXdzJylcblx0XHQudGhlbihmdW5jdGlvbiAocmV2aWV3cykge1xuXHRcdFx0Y29uc29sZS5sb2coXCJyZXZpZXdzOlwiLCByZXZpZXdzKVxuXHRcdFx0cmV0dXJuIHJldmlld3MuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cmV2aWV3RmFjdG9yeS5mZXRjaEJ5VXNlcklkID0gZnVuY3Rpb24oaWQpIHtcblx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3VzZXIvJyArIGlkICsgJy9yZXZpZXdzJylcblx0XHQudGhlbihmdW5jdGlvbiAocmV2aWV3cykge1xuXHRcdFx0cmV0dXJuIHJldmlld3MuZGF0YTtcblx0XHR9KVxuXHR9XG5cblx0cmV2aWV3RmFjdG9yeS5wb3N0UmV2aWV3ID0gZnVuY3Rpb24ocHJvZHVjdElkLCBkYXRhKXtcblx0XHRkYXRhLnByb2R1Y3RJZCA9IHByb2R1Y3RJZDtcblx0XHRpZiAoU2Vzc2lvbi51c2VyKSBkYXRhLnVzZXJJZCA9IFNlc3Npb24udXNlci5pZDtcblx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2FwaS9wcm9kdWN0cy8nK3Byb2R1Y3RJZCsnL3Jldmlldy9zdWJtaXQnLCBkYXRhKVxuXHRcdC50aGVuKGZ1bmN0aW9uKG5ld1Jldmlldyl7XG5cdFx0XHRyZXR1cm4gbmV3UmV2aWV3LmRhdGE7XG5cdFx0fSlcblx0fVxuXG5cdHJldHVybiByZXZpZXdGYWN0b3J5O1xufSkiLCJhcHAuZGlyZWN0aXZlKCdzdGFyUmF0aW5nJywgZnVuY3Rpb24oICkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHRlbXBsYXRlOlxuICAgICAgJzx1bCBjbGFzcz1cInN0YXItcmF0aW5nXCI+JyArXG4gICAgICAnPGxpIG5nLXJlcGVhdD1cInN0YXIgaW4gc3RhcnNcIiBjbGFzcz1cInN0YXJcIiBuZy1jbGFzcz1cIntmaWxsZWQ6IHN0YXIuZmlsbGVkfVwiIG5nLWNsaWNrPVwidG9nZ2xlKCRpbmRleClcIj4nICtcbiAgICAgICcgICAgPGkgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXN0YXJcIj48L2k+JyArIC8vIG9yICYjOTczM1xuICAgICAgJyAgPC9saT4nICtcbiAgICAgICc8L3VsPicsXG4gICAgc2NvcGU6IHtcbiAgICAgIHJhdGluZ1ZhbHVlOiAnPW5nTW9kZWwnLFxuICAgICAgcmVhZG9ubHk6ICc9PydcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICBmdW5jdGlvbiB1cGRhdGVTdGFycygpIHtcbiAgICAgICAgc2NvcGUuc3RhcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA1OyBpKyspIHtcbiAgICAgICAgICBzY29wZS5zdGFycy5wdXNoKHtcbiAgICAgICAgICAgIGZpbGxlZDogaSA8IHNjb3BlLnJhdGluZ1ZhbHVlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHVwZGF0ZVN0YXJzKCk7XG5cbiAgICAgIHNjb3BlLnRvZ2dsZSA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICAgIGlmIChzY29wZS5yZWFkb25seSA9PSB1bmRlZmluZWQgfHwgc2NvcGUucmVhZG9ubHkgPT09IGZhbHNlKXtcbiAgICAgICAgICBzY29wZS5yYXRpbmdWYWx1ZSA9IGluZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHNjb3BlLiR3YXRjaCgncmF0aW5nVmFsdWUnLCBmdW5jdGlvbihvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgdXBkYXRlU3RhcnMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbiIsImFwcC5mYWN0b3J5KCdVc2VyRmFjdG9yeScsIGZ1bmN0aW9uKCRodHRwKSB7XG5cbiAgZnVuY3Rpb24gZ2V0RGF0YShyZXMpIHsgcmV0dXJuIHJlcy5kYXRhOyB9XG5cbiAgdmFyIFVzZXIgPSB7fTtcblxuICBVc2VyLmZldGNoQWxsID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS91c2VyJylcbiAgICAgIC50aGVuKGdldERhdGEpO1xuICB9XG5cbiAgVXNlci5mZXRjaEJ5SWQgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9hcGkvdXNlci8nICsgaWQpXG4gICAgICAudGhlbihnZXREYXRhKTtcbiAgfTtcblxuICBVc2VyLmRlbGV0ZVVzZXIgPSBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9hcGkvdXNlci8nICsgaWQpO1xuICB9XG5cbiAgVXNlci5jcmVhdGVVc2VyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvYXBpL3VzZXIvJywgZGF0YSlcbiAgICAgIC50aGVuKGdldERhdGEpO1xuICB9XG5cbiAgVXNlci5tb2RpZnlVc2VyID0gZnVuY3Rpb24oaWQsIGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvYXBpL3VzZXIvJyArIGlkLCBkYXRhKVxuICAgICAgLnRoZW4oZ2V0RGF0YSk7XG4gIH1cblxuICByZXR1cm4gVXNlcjtcblxufSlcbiIsImFwcC5kaXJlY3RpdmUoJ2FkZHJlc3MnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgYWRkcmVzc1ZpZXc6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jaGVja291dC90ZW1wbGF0ZXMvYWRkcmVzc2Zvcm0uaHRtbCdcbiAgfVxufSk7XG4iLCJhcHAuZmFjdG9yeSgnRnVsbHN0YWNrUGljcycsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0I3Z0JYdWxDQUFBWFFjRS5qcGc6bGFyZ2UnLFxuICAgICAgICAnaHR0cHM6Ly9mYmNkbi1zcGhvdG9zLWMtYS5ha2FtYWloZC5uZXQvaHBob3Rvcy1hay14YXAxL3QzMS4wLTgvMTA4NjI0NTFfMTAyMDU2MjI5OTAzNTkyNDFfODAyNzE2ODg0MzMxMjg0MTEzN19vLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1MS1VzaElnQUV5OVNLLmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjc5LVg3b0NNQUFrdzd5LmpwZycsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1VajlDT0lJQUlGQWgwLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjZ5SXlGaUNFQUFxbDEyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0UtVDc1bFdBQUFtcXFKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0V2WkFnLVZBQUFrOTMyLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VnTk1lT1hJQUlmRGhLLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0VReUlETldnQUF1NjBCLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0NGM1Q1UVc4QUUybEdKLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FlVnc1U1dvQUFBTHNqLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FhSklQN1VrQUFsSUdzLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0FRT3c5bFdFQUFZOUZsLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQi1PUWJWckNNQUFOd0lNLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjliX2Vyd0NZQUF3UmNKLnBuZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjVQVGR2bkNjQUVBbDR4LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjRxd0MwaUNZQUFsUEdoLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQjJiMzN2UklVQUE5bzFELmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQndwSXdyMUlVQUF2TzJfLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQnNTc2VBTkNZQUVPaEx3LmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0o0dkxmdVV3QUFkYTRMLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0k3d3pqRVZFQUFPUHBTLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lkSHZUMlVzQUFubkhWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0dDaVBfWVdZQUFvNzVWLmpwZzpsYXJnZScsXG4gICAgICAgICdodHRwczovL3Bicy50d2ltZy5jb20vbWVkaWEvQ0lTNEpQSVdJQUkzN3F1LmpwZzpsYXJnZSdcbiAgICBdO1xufSk7XG4iLCJhcHAuZmFjdG9yeSgnUmFuZG9tR3JlZXRpbmdzJywgZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGdldFJhbmRvbUZyb21BcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgICAgICAgcmV0dXJuIGFycltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnIubGVuZ3RoKV07XG4gICAgfTtcblxuICAgIHZhciBncmVldGluZ3MgPSBbXG4gICAgICAgICdIZWxsbywgd29ybGQhJyxcbiAgICAgICAgJ0F0IGxvbmcgbGFzdCwgSSBsaXZlIScsXG4gICAgICAgICdIZWxsbywgc2ltcGxlIGh1bWFuLicsXG4gICAgICAgICdXaGF0IGEgYmVhdXRpZnVsIGRheSEnLFxuICAgICAgICAnSVxcJ20gbGlrZSBhbnkgb3RoZXIgcHJvamVjdCwgZXhjZXB0IHRoYXQgSSBhbSB5b3Vycy4gOiknLFxuICAgICAgICAnVGhpcyBlbXB0eSBzdHJpbmcgaXMgZm9yIExpbmRzYXkgTGV2aW5lLicsXG4gICAgICAgICfjgZPjgpPjgavjgaHjga/jgIHjg6bjg7zjgrbjg7zmp5jjgIInLFxuICAgICAgICAnV2VsY29tZS4gVG8uIFdFQlNJVEUuJyxcbiAgICAgICAgJzpEJyxcbiAgICAgICAgJ1llcywgSSB0aGluayB3ZVxcJ3ZlIG1ldCBiZWZvcmUuJyxcbiAgICAgICAgJ0dpbW1lIDMgbWlucy4uLiBJIGp1c3QgZ3JhYmJlZCB0aGlzIHJlYWxseSBkb3BlIGZyaXR0YXRhJyxcbiAgICAgICAgJ0lmIENvb3BlciBjb3VsZCBvZmZlciBvbmx5IG9uZSBwaWVjZSBvZiBhZHZpY2UsIGl0IHdvdWxkIGJlIHRvIG5ldlNRVUlSUkVMIScsXG4gICAgXTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGdyZWV0aW5nczogZ3JlZXRpbmdzLFxuICAgICAgICBnZXRSYW5kb21HcmVldGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFJhbmRvbUZyb21BcnJheShncmVldGluZ3MpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7XG4iLCJhcHAuZGlyZWN0aXZlKCdjYXJ0JywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL3RlbXBsYXRlcy9jYXJ0Lmh0bWwnLFxuICB9XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnb3JkZXJIaXN0b3J5JywgZnVuY3Rpb24gKCkge1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICB0ZW1wbGF0ZVVybDogJ2pzL29yZGVyL3RlbXBsYXRlcy9vcmRlci1oaXN0b3J5Lmh0bWwnLFxuICB9XG5cbn0pO1xuXG4iLCJhcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbG9nby9sb2dvLmh0bWwnXG4gICAgfTtcbn0pO1xuXG5hcHAuZGlyZWN0aXZlKCdmdWxsc3RhY2tMb2dvVHdvJywgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiAnanMvY29tbW9uL2RpcmVjdGl2ZXMvbG9nby9sb2dvLmh0bWwnXG4gICAgfTtcbn0pOyIsImFwcC5kaXJlY3RpdmUoJ25hdmJhcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCBBdXRoU2VydmljZSwgQVVUSF9FVkVOVFMsICRzdGF0ZSkge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICB0ZW1wbGF0ZVVybDogJ2pzL2NvbW1vbi9kaXJlY3RpdmVzL25hdmJhci9uYXZiYXIuaHRtbCcsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSkge1xuXG4gICAgICAgICAgICBzY29wZS5pdGVtcyA9IFtcbiAgICAgICAgICAgICAgICAvLyB7IGxhYmVsOiAnSG9tZScsIHN0YXRlOiAnaG9tZScgfSxcbiAgICAgICAgICAgICAgICB7IGxhYmVsOiAnQWJvdXQnLCBzdGF0ZTogJ2Fib3V0JyB9XG4gICAgICAgICAgICAgICAgLy8geyBsYWJlbDogJ0FjY291bnQgSW5mb3JtYXRpb24nLCBzdGF0ZTogJ21lbWJlcnNPbmx5JywgYXV0aDogdHJ1ZSB9XG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBzY29wZS5hY2NvdW50ID0ge2xhYmVsOiAnQWNjb3VudCBJbmZvcm1hdGlvbicsIHN0YXRlOiAnYWNjb3VudCcsIGF1dGg6IHRydWV9O1xuXG4gICAgICAgICAgICBzY29wZS51c2VyID0gbnVsbDtcbiAgICAgICAgICAgIHNjb3BlLnRpdGxlID0gdHJ1ZTtcblxuICAgICAgICAgICAgc2NvcGUuaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQXV0aFNlcnZpY2UuaXNBdXRoZW50aWNhdGVkKCk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdob21lJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB2YXIgc2V0VXNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBBdXRoU2VydmljZS5nZXRMb2dnZWRJblVzZXIoKS50aGVuKGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLnVzZXIgPSB1c2VyO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIHJlbW92ZVVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUudXNlciA9IG51bGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzY29wZS5sZWF2ZUhvbWUgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzY29wZS50aXRsZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NvcGUuY29tZUhvbWUgPSBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICBzY29wZS50aXRsZSA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldFVzZXIoKTtcblxuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMubG9naW5TdWNjZXNzLCBzZXRVc2VyKTtcbiAgICAgICAgICAgICRyb290U2NvcGUuJG9uKEFVVEhfRVZFTlRTLmxvZ291dFN1Y2Nlc3MsIHJlbW92ZVVzZXIpO1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kb24oQVVUSF9FVkVOVFMuc2Vzc2lvblRpbWVvdXQsIHJlbW92ZVVzZXIpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbn0pO1xuIiwiYXBwLmRpcmVjdGl2ZSgnc2VhcmNoYmFyJywgZnVuY3Rpb24gKCRzdGF0ZSwgUHJvZHVjdEZhY3RvcnkpIHtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcblxuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9uYXZiYXIvc2VhcmNoYmFyLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIHNjb3BlLmdldFByb2R1Y3RzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUHJvZHVjdEZhY3RvcnkuZmV0Y2hBbGwoKVxuICAgICAgfVxuICAgIH1cblxuICB9XG5cbn0pXG4iLCJhcHAuZGlyZWN0aXZlKCdyYW5kb0dyZWV0aW5nJywgZnVuY3Rpb24gKFJhbmRvbUdyZWV0aW5ncykge1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdqcy9jb21tb24vZGlyZWN0aXZlcy9yYW5kby1ncmVldGluZy9yYW5kby1ncmVldGluZy5odG1sJyxcbiAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlKSB7XG4gICAgICAgICAgICBzY29wZS5ncmVldGluZyA9IFJhbmRvbUdyZWV0aW5ncy5nZXRSYW5kb21HcmVldGluZygpO1xuICAgICAgICB9XG4gICAgfTtcblxufSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
