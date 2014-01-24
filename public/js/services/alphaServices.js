var services = angular.module('AndThenApp.services', [])

services.factory('GameService', function($rootScope, $http) {
	
	var GameService = {};

	GameService.results = {};

	var games = [];

	GameService.save = function(gamecode) {
		var URL = 'http://localhost:3000/api/gameCreate';

		for (i = 0; i < games.length; i++) {
			if (games[i].gamecode == gamecode) {
				gameObject = games[i];
			}
		};

		var temp = JSON.stringify(gameObject);

		console.log(temp);

		$http.post(URL, temp).success( function() {
			console.log('saved successfully');
		});
	}

	GameService.query = function(id) {

		var URL = 'http://localhost:3000/api/gameQuery/' + id;

		$http.get(URL).success(function (data) {
			GameService.results = data;
			$rootScope.$broadcast('querySuccess');
		});

	}

	GameService.addLine = function(gamecode, textObject) {

		var URL = 'http://localhost:3000/api/gamePatch';
		
		var packet = {
			opType: 'lineAdd',
			code: gamecode,
			line: textObject.line,
			turn: textObject.turn
		};

		$http.post(URL, packet).success( function (data) {
			console.log('saved new line ...');
			console.log('linecount = '+ GameService.results.lines);
			if (GameService.results.lines == 1) {
				packet.opType = 'gameEnd'
				$http.post(URL, packet).success( function (data) {
					console.log('game over');
				})
			}
		});

	}

	GameService.set = function(line, hint) {
		
		var generate = Math.floor((Math.random() * 100) + 1);

		var newGame = {
			gamecode: generate,
			lines: line,
			givehint: hint,
			players: [],
			text: [],
			turn: 0,
			state: true
		}

		games.push(newGame);

		return newGame.gamecode;

	};

	GameService.load = function(gamecode) {

		var URL = 'http://localhost:3000/api/gameQuery/' + gamecode;

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

		console.log(GameService.results.players);
		
		// then check to see if the room is full, and whether 
		// someone else is already using your username
		if (game.players.length < 2) {

			game.players.push(username);

			var URL = 'http://localhost:3000/api/gamePatch';
			var packet = {
				opType: 'userAdd',
				code: game.gameCode,
				name: username
			};

			$http.post(URL, packet).success( function (data) {
				console.log('saved new username ...');
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

	GameService.delete = function(gamecode) {
		var URL = 'http://localhost:3000/api/gameDelete/' + gamecode;
		$http.get(URL).success( function (data) {
			$rootScope.$broadcast('deleteSuccess');
		});
	}

	GameService.log = function() {
		var URL = 'http://localhost:3000/api/gameLog/';
		$http.get(URL).success( function (data) {
			console.log('log success ... ');
		});
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
			console.log('searching for game with code: ' + gameCode);
		}, 2000);
	};

	return JoinService;
})