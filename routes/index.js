
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index');
};

exports.partials = function (req, res) {
	console.log('request for partial');
	var name = req.params.name;
	console.log(res.sendfile('partials/' + name));
	res.sendfile('public/partials/' + name);
};