//Starting functions. Will refactor to make things private and move into a Service or Controller.

var app = angular.module('RetirementProject', ['WeatherModule']);
app.controller('MainController', MainController);
app.service('NumbeoService', NumbeoService);
//Locations dictionary
// cost of living indexed to New York
//weather is an array of values - high, low and average yearly temeperatures in F

function MainController(NumbeoService, WeatherService) {
	var vm = this;
	vm.cities = [];
	vm.compare = function () {
	    NumbeoService.getCity(vm.startingCity).then(function (startData) {
	        vm.start = startData;
	        getWeather(vm.startingCity.latitude, vm.startingCity.longitude, function (weather) {
	            vm.startWeather = weather;
	        });
	        NumbeoService.getCity(vm.destinationCity).then(function (destinationData) {
	            vm.destination = destinationData;
	            getWeather(vm.destinationCity.latitude, vm.destinationCity.longitude, function (weather) {
	                vm.destinationWeather = weather;
	            });
	            calcDifference(startData, destinationData);
	        });
	    });
	}

	var getWeather = function (latitude, longitude, cb) {
	    WeatherService.getWeather(latitude, longitude).then(function (weather) {
	        cb(weather);
	    })
	}
	
	var calcDifference = function (start, dest) {
	    vm.comparedData = {};
	    for (var key in start) {
	        if (dest[key]) {
	            var quotient = dest[key] / start[key];
	            var abs = Math.abs(quotient - 1);
	            var percent = abs * 100;
	            vm.comparedData[key] = percent;
	        }
	    }
	}

	NumbeoService.getAllCites(function (allCities) {
	    vm.cities = allCities;
	});

	

}

function NumbeoService($http) {
    var service = this;

    var _cities;

    function alphabetical(a, b) {
        var A = a.city.toLowerCase();
        var B = b.city.toLowerCase();
        if (A < B) {
            return -1;
        } else if (A > B) {
            return 1;
        } else {
            return 0;
        }
    }

    function prepUrl(url, query) {
        query = query || '';
        var baseUrl = 'http://www.numbeo.com/api/';
        var key = '?api_key=hlvoconsai9jbj';
        var bcwGet = "http://bcw-getter.herokuapp.com/?url=" + encodeURIComponent(baseUrl + url + key + query);
        return bcwGet;
    }

    service.getAllCites = function (cb) {
        var c = localStorage.getItem('cities');
        if (c) {
            _cities = JSON.parse(c);
            return cb(_cities);
        }
        var url = prepUrl('cities');
        if (_cities) {
            return cb(_cities);
        }
        return $http.get(url).then(function (res) {
            _cities = res.data.cities;
            _cities = _cities.sort(alphabetical);
            localStorage.setItem('cities', JSON.stringify(_cities));
            return cb(_cities);
        });
    }

    service.getCity = function (dest) {
        var url = prepUrl('indices', '&query=' + dest.city);
        return $http.get(url).then(function (res) {
            return res.data;
        });
    }

}
