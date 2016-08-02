app.directive('updateInfo', function () {

  return {
    restrict: 'E',
    templateUrl: 'js/account/update-info.html',
    scope: {
      userView: '=',
      detailsView: '='
    }
  }

});
