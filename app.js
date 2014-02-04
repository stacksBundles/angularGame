

var express = require('express'),
	fs = require('fs'),
 	routes = require('./routes'),
 	api = require('./routes/api'),
 	path = require('path'),
 	mongoose = require('mongoose');

var app = module.exports = express();
var server = require('http').createServer(app);
var port = process.env.PORT || CONFIG.port;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://stacksBundles:tiK7meLx@ds027809.mongolab.com:27809/gameprovider-mongodb');

var gameSchema = new Schema({
	gamecode: Number,
	lines: Number,
	givehint: Boolean,
	players: [String],
	text: [
		{
			author: String, text: String
		}
	],
	turn: Number,
	state: Boolean
})

var success = function() {
	console.log('connection to mongodb successful ... ');
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'error when attempting to establish connection to mongodb ... '));
db.once('open', success);

var Game = mongoose.model('Game', gameSchema);

// SERVER CONFIGURATION

app.set('views', __dirname + '/views');
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname + '/public')));
app.use(app.router);

if(app.get('env') === 'development') {
	app.use(express.errorHandler());
}

if (app.get('env') === 'production') {

}


app.configure('development', function() {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

// ROUTES

app.get('/', routes.index);

app.post('/api/gameCreate', function (req, res) {

	console.log(req.param);

	game = new Game({
		gamecode: req.param('gamecode'),
		lines: req.param('lines'),
		players: [],
		text: req.param('text'),
		turn: req.param('turn'),
		state: req.param('state')
	})

	console.log('initialized model ... ');

	game.save(function (error) {
		if (error) {
			console.log('create failed');
			console.log(error);
			res.send('failure', 500);
		}
		else {
			console.log('success');
			res.send('success', 201);
		}
	});

});

app.get('/api/gameQuery/:id', function (req, res) {

	console.log('api received query ... ' + req.params.id)

	Game.findOne({'gamecode': req.params.id}, function (error, data) {
		if(error) {
			console.log(error);
			res.send('failure', 500)
		}
		else {
			console.log(data);
			res.send(data);
		}
	})
});

app.get('/api/gameDelete/:id', function (req, res) {

	Game.remove({'gamecode': req.params.id}, function (err) {
		if (err) {
			console.log(error);
			res.send('failure', 500);
		}
		else {
			res.send('success', 201);
		}
	});
})

app.post('/api/gamePatch', function (req, res) {
	if (req.param('opType') == 'userAdd') {
		console.log('received user push request: ' + req.param('gamecode'));
		Game.findOneAndUpdate({'gamecode': req.param('gamecode')}, {$push: {players: req.param('name')}}, function (err, game) {
			if (!err) {
				game.save( function (error) {
					if (error) {
						console.log(error);
						res.send('failure', 500);
					}
					else {
						res.send(game, 201);
					}
				});
			}
			else {
				console.log(err);
				res.send('failure', 500);
			}
		});
	}
	else if (req.param('opType') == 'gameEnd') {
		console.log('received game over command');
		Game.findOneAndUpdate({'gamecode': req.param('gamecode')}, {$set: {'state': false}}, function (err, game) {
			if (err) {
				console.log(error);
				res.send('failure', 500);
			}
			else {
				res.send('success', 201);
			}
		})
	}
	else {
		console.log('received line push request, opType = ' + req.param('opType'));

		Game.findOneAndUpdate({'gamecode': req.param('gamecode')}, {$push: {text: {author: req.param('author'), text: req.param('text')}}, $inc: {lines: -1}, $set: {turn: req.param('turn')}}, function (err, game) {
			if (!err) {
				game.save( function (error) {
					if (error) {
						console.log(error);
						res.send('failure', 500);
					}
					else {
						res.send(game, 201);
					}
				})
			}
			else {
				console.log(err);
				res.send('failure', 500);
			}
		});
	}
})

// redirect all others to the index (HTML5 history)

app.get('*', routes.index);

// START SERVER

app.listen(port, function(){
	console.log('Express server listening on port ' + port);
});






