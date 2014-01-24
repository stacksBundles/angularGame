

// THIS WILL BE A GET, HENCE THE ID IS EXTRACTED FROM THE URL USING REQ.PARAMS.ID
exports.gameQuery = function (req, res) {

	gameProvider.findById(req.params.id, function (error, data) {
		res.send(data);
	});
}

// THIS WILL BE A POST, HENCE THE PARAMS WILL BE EXTRACTED USING REQ.PARAMS('PARAM_NAME')
exports.gameCreate = function (req, res) {

	console.log(req.param);

	gameProvider.save({
		gameCode: req.param('gamecode'),
		lines: req.param('lines'),
		players: req.param('players'),
		text: req.param('text'),
		turn: req.param('turn'),
		state: req.param('state')
	}, function (error, data) {
		res.send('success', 201);
	});
}