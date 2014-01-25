

var express = require('express'),
	fs = require('fs'),
 	routes = require('./routes'),
 	api = require('./routes/api'),
 	path = require('path');

var app = module.exports = express();
var server = require('http').createServer(app);

var GameProvider = require('./gameprovider-mongodb').GameProvider;
// 27017  :27809/gameprovider-mongodb
var gameProvider = new GameProvider('mongodb://stacksBundles:tiK7meLx@ds027809.mongolab.com:27809/gameprovider-mongodb', 27809);


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

	gameProvider.save({
			gameCode: req.param('gamecode'),
			lines: req.param('lines'),
			players: req.param('players'),
			text: req.param('text'),
			turn: req.param('turn'),
			state: req.param('state')
		}, function (error, data) {
			if (error) {
				console.log(error);
			}
			res.send('success', 201);
		});
});

app.get('/api/gameQuery/:id', function (req, res) {
	gameProvider.findByGameCode(req.params.id, function (error, data) {
		res.send(data);
	});
});

app.get('/api/gameDelete/:id', function (req, res) {
	gameProvider.deleteGame(req.params.id, function (error, data) {
		if (error) {
			console.log(error);
		}
		console.log('delete success');
		res.send('success', 201);
	})
})

app.post('/api/gamePatch', function (req, res) {
	if (req.param('opType') == 'userAdd') {
		console.log('received user push request');
		gameProvider.addPlayer(req.param('code'), req.param('name'), function (error, data) {
			if (error) {
				console.log(error);
			}
			res.send('success', 201);
		})
	}
	else if (req.param('opType') == 'gameEnd') {
		console.log('received game over command');
		gameProvider.endGame(req.param('code'), function (error, data) {
			if (error) {
				console.log(error);
			}
			res.send('success', 201);
		})
	}
	else {
		console.log('received line push request, opType = ' + req.param('opType'));
		gameProvider.addLine(req.param('code'), req.param('line'), req.param('turn'), function (error, data) {
			if (error) {
				console.log(error);
			}
			res.send('success', 201);
		})
	}
})

app.get('/api/gameLog', function (req, res) {
	gameProvider.findAll( function (error, data) {
		if (error) {
			console.log(error);
		}
		console.log(data);
		var count = data.length;
		for (i = 0; i < count; i++) {
			console.log(data[i].gameCode);
		}
		res.send('success', 201);
	})
})

// redirect all others to the index (HTML5 history)

app.get('*', routes.index);

// START SERVER

app.listen(3000, function(){
	console.log('Express server listening on port 3000');
});






