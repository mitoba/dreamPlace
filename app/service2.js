var app = angular.module('RetirementProject-weather', []);

app.controller('MainController2', MainController);


app.controller('myController', function ($scope, data) {
    userRepository.getaverageWeather().success(function (startingCity) { $scope.startingCity = startingCity });  

    $scope.changeFirstUsersFirstName = function () {
        $scope.users[0].firstName = 'Jill'
    };

});

app.factory('data', function ($http) {
    return {
        getaverageWeather: function () {
            var url =http://api.wunderground.com/api/8f11ee4828782b4e/planner_07010731/q/France/Paris.js ;
            return $http.get(url);
        }
    };
});