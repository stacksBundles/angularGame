var services = angular.module('AndThenApp.services', [])

services.factory('GameService', function($rootScope, $http, $timeout) {
	
	var GameService = {
		results: {}
	};

	var games = [];

	GameService.save = function(gamecode) {
		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gameCreate';

		for (i = 0; i < games.length; i++) {
			if (games[i].gamecode == gamecode) {
				gameObject = games[i];
			}
		};

		var temp = JSON.stringify(gameObject);

		$http.post(URL, temp).success( function() {
		}).error( function (data, status, headers, config) {
			console.log('error ... ' + status);
			console.log(data);
		});
	}

	GameService.query = function(id) {

		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gameQuery/' + id;

		$http.get(URL).success(function (data) {
			GameService.results = data;
			$rootScope.$broadcast('querySuccess');
		}).error( function (data, status, headers, config) {
			$rootScope.$broadcast('queryFailure');
			console.log('error ... ' + status);
			console.log(data);
		});

	}

	GameService.addLine = function(code, textObject, turn) {

		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gamePatch';

		var flipTurn = (turn == 0 ? 1 : 0);
		
		var packet = {
			opType: 'lineAdd',
			gamecode: code,
			text: textObject.text,
			author: textObject.author,
			turn: flipTurn
		};

		$http.post(URL, packet).success( function (data) {
			if (GameService.results.lines == 1) {
				packet = {
					opType: 'gameEnd',
					gamecode: code
				} 
				$http.post(URL, packet).success( function (data) {
					console.log('game over');
					$rootScope.$broadcast('gameOver');
				})
			}
			else {
				GameService.results = data;
			}
		})
		.error( function (response, status, headers) {
			console.log(response);
			console.log(status);
			console.log(headers);
		});

	}

	GameService.set = function(line) {
		
		var generate = Math.floor((Math.random() * 100) + 1);

		var newGame = {
			gamecode: generate,
			lines: line,
			players: [],
			text: [],
			turn: 0,
			state: true
		}

		games.push(newGame);

		return newGame.gamecode;

	};

	GameService.load = function(gamecode) {

		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gameQuery/' + gamecode;

		$http.get(URL).success(function (data) {
			GameService.results = data;
			$rootScope.$broadcast('loadSuccess');
		})

	}

	GameService.join = function(username) {

		var message = {
			pass: true,
			text: 'Success!'
		};

		var game = GameService.results;
		
		// then check to see if the room is full, and whether 
		// someone else is already using your username
		if (game.players.length < 2) {

			game.players.push(username);

			var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gamePatch/';
			var packet = {
				opType: 'userAdd',
				gamecode: game.gamecode,
				name: username
			};

			$http.post(URL, packet).success( function (data) {
				GameService.result = data;
				console.log('saved new username ... starting polling: ' + packet.gamecode);
				$rootScope.$broadcast('joinSuccess');
				GameService.poll(packet.gamecode);
			})
			
			return message;
		}
		else {
			console.log('fail');
			message.pass = false;
			message.text = 'Game full, please join another';
			return message;
		};
	}

	GameService.delete = function(code) {
		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gameDelete/' + gamecode;
		$http.get(URL).success( function (data) {
			$rootScope.$broadcast('deleteSuccess');
		});
	}

	GameService.log = function() {
		var URL = 'http://murmuring-escarpment-2549.herokuapp.com/';
		$http.get(URL).success( function (data) {
			
		});
	}

	GameService.poll = function(id) {
		var poller = function() {
			console.log('polling ... ');
			var URL = 'http://murmuring-escarpment-2549.herokuapp.com/api/gameQuery/' + id;
			$http.get(URL).success( function (response, status, headers) {
				GameService.results = response;
				$rootScope.$broadcast('pollSuccess');
				if (GameService.results.state == true) {
					$timeout(poller, 5000);
				}
				else if (GameService.results.state == false) {
					$rootScope.$broadcast('gameOver');
				}
			})
			.error( function (response, status, headers) {
				console.log('poll failure, waiting 10 seconds to try again');
				$timeout(poller, 10000);
			})
		};
		poller();
	}

	return GameService;
});

services.factory('JoinService', function($rootScope, $http, $timeout) {

	var JoinService = {};

	JoinService.fake = 1;

	JoinService.success = false;

	JoinService.query = function(gameCode) {
		$timeout( function() {
			JoinService.fake = (JoinService.fake == 1 ? 2 : 1);
			if (JoinService.fake == 1) {
				JoinService.success = true;
				//$rootScope.$broadcast('querySuccess');
			}
			else {
				JoinService.success = false;
				$rootScope.$broadcast('queryFailure');
			}
		}, 2000);
	};

	return JoinService;
})