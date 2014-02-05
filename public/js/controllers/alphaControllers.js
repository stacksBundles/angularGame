var controllers = angular.module('AndThenApp.controllers', [])
 
controllers.controller('MainCtrl', function ($scope, GameService, $location, $timeout) {
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
  		$timeout(
  			GameService.save($scope.gamecode), 5000
  		);
  		
  		$location.path('/' + $scope.gamecode);
  	}
  	$scope.joinRoute = function() {
  		$location.path('/join');
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
		$scope.gamecode = '';
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
	$scope.gameFull = false;

	$scope.join = function() {
		if ($scope.username) {
			if ($scope.gameObject.players.length == 0) {
				GameService.join($scope.username);
			}
			else if ($scope.gameObject.players.length == 1) {
				if ($scope.gameObject.players[0] == $scope.username) {
					GameService.poll($scope.gameObject.gamecode);
					$scope.playing = true;
				}
				else {
					GameService.join($scope.username);
				}
			}
			else {
				if ($scope.gameObject.players[0] == $scope.username  || $scope.gameObject.players[1] == $scope.username ) {
					GameService.poll($scope.gameObject.gamecode);
					$scope.playing = true;
				}
				else {
					$scope.error = true;
					$scope.errormess = 'Game full :(';
				}
			}
		}
	};

	$scope.add = function() {
		$scope.notMyTurn = true;
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
			GameService.load($scope.getPath[1]);
		}
		else {
			console.log('error');
		}
	}

	finder();

	$scope.$on('joinSuccess', function() {
		$scope.playing = true;
		if (GameService.results.state = false) {
			$scope.playing = false;
			$scope.gameover = true;
			$scope.notMyTurn = true;
		};
	})

	$scope.$on('loadSuccess', function() {
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
		if ($scope.gameObject.players.length == 2) {
			$scope.gameFull = true;
		}
		$scope.turnAnnounce = $scope.gameObject.players[$scope.gameObject.turn];
	});

	$scope.$on('gameOver', function() {
		$scope.playing = false;
		$scope.gameover = true;
		$scope.notMyTurn = true;
	});

})