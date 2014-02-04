var controllers = angular.module('AndThenApp.controllers', [])
 
controllers.controller('MainCtrl', function ($scope, GameService, $location) {
  	$scope.step = 0;
  	$scope.setLine = function(value) {
  		$scope.line = value;
  		$scope.step++;
  		$scope.gamecode = GameService.set($scope.line);
  	}
  	$scope.goBack = function(value) {
  		if ($scope.step > 1) {
  			$scope.step--;
  		};
  	}
  	$scope.start = function() {
  		$scope.step++;
  	}
  	$scope.letsGo = function() {
  		GameService.save($scope.gamecode);
  		$location.path('/' + $scope.gamecode);
  	}
  	// $scope.log = function() {
  	// 	GameService.log();
  	// }
  	
  });


controllers.controller('FindCtrl', function ($scope, GameService) {

	$scope.step = 1;

	$scope.next = function() {
		$scope.step++;
	}

	$scope.back = function() {
		if ($scope.step > 1) {
			$scope.step--;
		}
	}

	$scope.play = GameService.play;
	$scope.line = GameService.line;
	$scope.hint = GameService.hint;

	if ($scope.play == 4) {
		$scope.playList = [
			{
				email: ''
			},
			{
				email: '',
			},
			{
				email: ''
			},
			{
				email: ''
			}
		];
	}
	else if ($scope.play == 3) {
		$scope.playList = [
			{
				email: ''
			},
			{
				email: ''
			},
			{
				email: ''
			}
		];
	}
	else {
		$scope.playList = [
			{
				email: ''
			},
			{
				email: ''
			}
		];
	}

})

controllers.controller('JoinCtrl', function ($scope, JoinService, GameService, $location, $timeout) {

	$scope.loading = false;
	$scope.querying = false;

	$scope.findGame = function() {
  		GameService.query($scope.gamecode);
		$scope.loading = true;
		$scope.querying = true;
	};

	$scope.$on('querySuccess', function () {
		$scope.loading = false;
		$scope.querying = true;
		$scope.queryWin = true;
		$timeout( function () {
			$location.path('/' + $scope.gamecode);
		}, 2000);
		
	})

	$scope.$on('queryFailure', function() {
		$scope.loading = false;
		$scope.queryFail = true;
		$scope.querying = false;
	})

})

controllers.controller('PlayCtrl', function ($scope, $timeout, GameService, $location) {
	
	$scope.gameObject = {};
	$scope.playing = false;
	$scope.fail = false;
	$scope.errormess = '';
	$scope.error = false;
	$scope.disallowJoin = true;
	$scope.gameover = false;
	$scope.notMyTurn = true;

	$scope.join = function() {
		console.log($scope.gameObject);
		if ($scope.username) {
			if ($scope.gameObject.players.length == 0) {
				console.log('calling join ...')
				GameService.join($scope.username);
			}
			else if ($scope.gameObject.players.length == 1) {
				if ($scope.gameObject.players[0] == $scope.username) {
					console.log('already pushed username, joining ...');
					GameService.poll($scope.gameObject.gamecode);
					$scope.playing = true;
				}
				else {
					console.log('calling join ...')
					GameService.join($scope.username);
				}
			}
			else {
				if ($scope.gameObject.players[0] == $scope.username  || $scope.gameObject.players[1] == $scope.username ) {
					console.log('already pushed username, joining ...');
					GameService.poll($scope.gameObject.gamecode);
					$scope.playing = true;
				}
				else {
					console.log('game full ...')
					$scope.error = true;
					$scope.errormess = 'Game full :(';
				}
			}
		}
	};

	$scope.add = function() {
		$scope.notMyTurn = true;
		var flipTurn = ($scope.gameObject.turn == 0) ? 1 : 0;
		packet = {
			text: $scope.newline,
			author: $scope.username
		};
		GameService.addLine($scope.gameObject.gamecode, packet, $scope.gameObject.turn);
		$scope.newline = '';
	};

	$scope.newGame = function() {
		if ($scope.saved) {
			$location.path('/');
		}
		else {
			GameService.delete($scope.gameObject.gamecode);
			$scope.$on('deleteSuccess', function() {
				$location.path('/');
			});
		}
	}

	$scope.save = function() {
		$scope.saved = true;
	}

	function finder() {
		var regexStr = /\/(\d+)(?:\/|$)/;
		$scope.getPath = regexStr.exec($location.path());
		if ($scope.getPath) {
			console.log($scope.getPath[1]);
			GameService.load($scope.getPath[1]);
		}
		else {
			console.log('error');
		}
	}

	finder();

	$scope.$on('joinSuccess', function() {
		$scope.playing = true;
	})

	$scope.$on('loadSuccess', function() {
		console.log('game loaded ...');
		$scope.gameObject = GameService.results;
		$scope.disallowJoin = false;
	});

	$scope.$on('pollSuccess', function() {
		$scope.gameObject = GameService.results;
		if ($scope.gameObject.players[$scope.gameObject.turn] == $scope.username) {
			$scope.notMyTurn = false;
		}
		else {
			$scope.notMyTurn = true;
		}
		$scope.turnAnnounce = $scope.gameObject.players[$scope.gameObject.turn];
	});

	$scope.$on('gameOver', function() {
		$scope.playing = true;
		$scope.gameover = true;
		$scope.notMyTurn = true;
	});

})