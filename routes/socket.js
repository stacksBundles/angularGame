var userName = (function () {
	var names = {};

	var claim = function (name) {
		if (!name || names[name]) {
			return false;
		} else {
			names[name] = true;
			return true;
		}
	};

	var getGuestName = function () {
		var name,
			nextUserId = 1;

		do {
			name = 'Guest ' + nextUserId;
			nextUserId += 1;
		} while (!claim(name));

		return name;
	};

	var get = function () {
		var res = [];
		for (user in names) {
			res.push(user);
		}

		return res;
	}

	var free = function (name) {
		if (names[name]) {
			delete names[name];
		}
	};

	return {
		claim: claim,
		free: free,
		get: get,
		getGuestName: getGuestName
	};
}());

module.exports = function (socket) {
	var name = userNames.getGuestName();

	socket.emit('init', {
		name: name,
		users: userNames.get()
	});

	socket.broadcast.emit('user:join', {
		name: name
	});

	socket.on('send:message', function (data) {
		socket.boradcast.emit('send:message', {
			user: name,
			text: data.message
		});
	});

	socket.on('change:name', function (data, fn) {
		if (userNames.claim(data.name)) {
			var oldName = name;
			userNames.free(oldName);

			name = data.name;

			socket.broadcast.emit('change:name', {
				oldName: oldName,
				newName: name
			});

			fn(true);
		} else {
			fn(false)
		}
	});

	socket.on('disconnect', function () {
		socket.broadcast.emit('user:left', {
			name: name
		});
		userNames.free(name);
	});
};