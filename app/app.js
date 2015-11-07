//Starting functions. Will refactor to make things private and move into a Service or Controller.

var app = angular.module('RetirementProject', ['RetirementProject-weather']);
app.controller('MainController', MainController);
app.service('NumbeoService', NumbeoService);
//Locations dictionary
// cost of living indexed to New York
//weather is an array of values - high, low and average yearly temeperatures in F

function MainController(NumbeoService) {
	var vm = this;
	vm.cities = [];
	vm.compare = function () {
	    NumbeoService.getCity(vm.startingCity).then(function (data) {
	        vm.start = data;
	    });
	    NumbeoService.getCity(vm.destinationCity).then(function (data) {
	        vm.destination = data;
	    });
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
