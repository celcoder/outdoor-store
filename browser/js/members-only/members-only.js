app.config(function ($stateProvider) {

    $stateProvider.state('membersOnly', {
        url: '/user/:id',
        templateUrl: '/js/members-only/account-info.html' ,
        controller: 'UserCtrl',
        resolve: { user: function (UserFactory, $stateParams) {
            return UserFactory.fetchById($stateParams.id)
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.controller('UserCtrl', function ($scope, user) {
 $scope.user = user;

});
