var app = angular.module('AndThenApp', ['AndThenApp.directives', 'AndThenApp.services', 'AndThenApp.controllers'])

app.config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'MainCtrl',
		})
		.when('/join', {
			templateUrl: 'partials/join.html',
			controller: 'JoinCtrl',
		})
		.when('/find', {
			templateUrl: 'partials/find.html',
			controller: 'FindCtrl',
		})
		.otherwise({
			templateUrl: 'partials/play.html',
			controller: 'PlayCtrl',
		});
	});		