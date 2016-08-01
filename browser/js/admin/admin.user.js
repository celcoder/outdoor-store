app.config(function($stateProvider) {
  $stateProvider.state('adminUsers', {
    url: '/admin/users',
    templateUrl: 'js/admin/admin-users.html',
    controller: 'AdminUsersCtrl',
    resolve: {
      getAllUsers: function(UserFactory) {
        return UserFactory.fetchAll();
      }
    }
  })
})


app.controller('AdminUsersCtrl', function($scope, getAllUsers, $filter){
  $scope.users = getAllUsers;

  var userId = 'id';
  var lastName = 'last_name';
  var email = 'email';

  $scope.filterByUserId = function() {
    if (userId === 'id') {
      userId = '-id';
      $scope.users = $filter('orderBy')($scope.users, userId);
    } else {
      userId = 'id';
      $scope.users = $filter('orderBy')($scope.users, userId);
    }
  }

  $scope.filterByEmail = function() {
    if (email === 'email') {
      email = "-email";
      $scope.users = $filter('orderBy')($scope.users, email);
    } else {
      email = 'email';
      $scope.users = $filter('orderBy')($scope.users, email);
    }
  }

  $scope.filterByLastName = function() {
    if (lastName === 'last_name') {
      lastName = "-last_name";
      $scope.users = $filter('orderBy')($scope.users, lastName);
    } else {
      lastName = 'last_name';
      $scope.users = $filter('orderBy')($scope.users, lastName);
    }
  }

})