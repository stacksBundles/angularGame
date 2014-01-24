var controllers = angular.module('AndThenApp.controllers', [])
 
controllers.controller('MainCtrl', function ($scope, GameService, $location) {
  	$scope.step = 0;
  	$scope.setLine = function(value) {
  		$scope.line = value;
  		$scope.step++;
  	}
  	$scope.setHint = function(value) {
  		$scope.hint = value;
  		$scope.hintstring = (value == "true" ? 'Yes': 'No');
  		$scope.step++;
  		$scope.gamecode = GameService.set($scope.line, $scope.hint);

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
  	$scope.log = function() {
  		GameService.log();
  	}
  	
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
	$scope.allowJoin = true;
	$scope.gameover = false;

	function finder() {
		$scope.getPath = $location.path().slice(1);
		GameService.load($scope.getPath);
	}

	finder();

	$scope.$on('loadSuccess', function() {
		console.log('game loaded ...');
		$scope.gameObject = GameService.results;
		$scope.allowJoin = false;
	});



	$scope.join = function() {

		if ($scope.username) {
			if ($scope.gameObject.players.length == 0) {
				GameService.join($scope.username);
				console.log('join worked ...');
				$scope.playing = true;
			}
			else if ($scope.gameObject.players.length == 1) {
				if ($scope.gameObject.players[0] == $scope.username) {
					$scope.playing = true;
				}
				else {
					GameService.join($scope.username);
					console.log('join worked ...');
					$scope.playing = true;
				}
			}
			else {
				if ($scope.gameObject.players[0] == $scope.username  || $scope.gameObject.players[1] == $scope.username ) {
					$scope.playing = true;
				}
				else {
					console.log('game full ...')
					$scope.error = true;
					$scope.errormess = 'Game full :(';
				}
			}
		
		}
		
	}

	var poller = function tick() {
		GameService.query($scope.gameObject.gameCode);
		$scope.$on('querySuccess', function() {
			console.log('polled... ');
			$scope.gameObject = GameService.results;
			$scope.turnAnnounce = $scope.gameObject.players[$scope.gameObject.turn];
			if ($scope.gameObject.state == false) {
				$scope.gameover = true;
				$scope.playing = true;
				return;
			}
			else {
				if ($scope.gameObject.players[$scope.gameObject.turn] == $scope.username) {
					$scope.notMyTurn = false;
				}
				else {
					$scope.notMyTurn = true;
				}
				
			}
		});
		$timeout(tick, 10000);
		
	};
	
	$scope.notMyTurn = true;

	poller();

	$scope.add = function() {
		$scope.notMyTurn = true;
		var flipTurn = ($scope.gameObject.turn == 0) ? 1 : 0;
		packet = {
			line: {
				text: $scope.newline,
				author: $scope.username
			},
			turn: flipTurn
		};
		GameService.addLine($scope.gameObject.gameCode, packet);
	};

	$scope.newGame = function() {
		GameService.delete($scope.gameObject.gameCode);
		$scope.$on('deleteSuccess', function() {
			$location.path('/');
		});
	}


})