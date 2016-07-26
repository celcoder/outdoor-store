app.factory('UserFactory', function($http) {

  function getData(res) { return res.data; }

  var User = {};

  User.fetchById = function(id) {
    return $http.get('/api/user/' + id)
      .then(getData);
  };

  User.deleteUser = function(id) {
    return $http.delete('/api/user/' + id);
  }

  User.createUser = function(data) {
    return $http.post('/api/user/', data)
      .then(getData);
  }

  User.modifyUser = function(id, data) {
    return $http.put('/api/user/' + id, data)
      .then(getData);
  }

  return User;

})
