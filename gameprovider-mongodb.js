var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

GameProvider = function(host, port) {
	this.db = new Db('gameprovider-mongodb', new Server(host, port, {auto_reconnect: true}, {}));
	this.db.open(function(){});
};

GameProvider.prototype.save = function(games, callback) {

	this.getCollection(function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			if (typeof(games.length) == 'undefined') {
				games = [games];
			}
			for (var i = 0; i < games.length; i++) {
				game = games[i];
				game.created_at = new Date();
			}
			game_collection.insert(games, function() {
				callback(null, games);
			});
		}
	});

};

GameProvider.prototype.getCollection = function(callback) {
	this.db.collection('games', function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			callback(null, game_collection);
		}
	});
};

GameProvider.prototype.findAll = function(callback) {
	this.getCollection(function (error, game_collection) {
		if (error) {
			callback(error)
		}
		else {
			game_collection.find().toArray(function (error, results) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, results)
				}
			});
		}
	});
};

GameProvider.prototype.findByGameCode = function(gamecode, callback) {
	this.getCollection(function (error, game_collection) {
		if (error) {
			callback(error)
		}
		else {
			// game_collection.db.bson_serializer.ObjectID.createFromHexString(id)
			var num = parseInt(gamecode);
			game_collection.findOne({'gameCode': num}, function (error, result) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, result);
				}
			})
		}
	})
};

GameProvider.prototype.addPlayer = function(gamecode, username, callback) {
	this.getCollection( function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			var num = parseInt(gamecode);
			game_collection.update(
				{'gameCode' : num},
				{ 
					$push: {'players': username}
				},
				function (error, result) {
					if (error) {
						callback(error);
					}
					else {
						callback(null, result);
					}
				}
			);

		};
	});
};

GameProvider.prototype.addLine = function(gamecode, line, turn, callback) {
	this.getCollection( function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			var num = parseInt(gamecode);
			console.log('logging from db: ' + line.text + ', with gamecode = ' + num);
			game_collection.update(
				{'gameCode': num},
				{
					$push: {'text': line},
					$set: {'turn': turn},
					$inc: {'lines': -1}
				},
				function (error, result) {
					if (error) {
						callback(error);
					}
					else {
						callback(null, result);
					}
				}
			);
		}
	})
}

GameProvider.prototype.endGame = function(gamecode, callback) {
	this.getCollection( function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			var num = parseInt(gamecode);
			game_collection.update(
				{'gameCode': num},
				{
					$set: {'state': false}
				},
				function (error, result) {
					if (error) {
						callback(error);
					}
					else {
						callback(null, result);
					}
				}
			);
		}
	})
}

GameProvider.prototype.deleteGame = function(gamecode, callback) {
	this.getCollection( function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			var num = parseInt(gamecode);
			console.log('deleting game: ' + num);
			game_collection.remove({'gameCode': num}, function (error, result) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, result);
				}
			})
		}
	})
}

GameProvider.prototype.log = function(callback) {
	this.getCollection( function (error, game_collection) {
		if (error) {
			callback(error);
		}
		else {
			game_collection.find().toArray(function (error, result) {
				if (error) {
					callback(error);
				}
				else {
					callback(null, result);
				}
			})
		}
	})
}

exports.GameProvider = GameProvider;
