var weatherModule = angular.module('WeatherModule', []);

weatherModule.factory('WeatherService', function ($http) {
    return {
        getWeather: function (lattitude, longitude) {
            debugger
            var url = "https://api.forecast.io/forecast/44ba3060252b5d3d506676961374b405/" + lattitude + ',' + longitude + ".json";
            return $http.get(url).then(function (res) {
                return res.data;
            });
        }
    };
});
