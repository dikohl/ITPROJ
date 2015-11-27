var express = require('express'), app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);

var caller = require('./caller');

app.get('/', function (request, response) {
	app.use(express.static(__dirname + '/public'));
	response.sendFile(__dirname + '/front/index.html');
});

app.use('/static', express.static('build'));

http.listen(process.env.PORT || 9999, () => {
	console.log('running...')
});

io.on('connection', function (socket) {
	socket.on('user', $0 => {
		caller.getGames(
			$0.username,
			(response) => { socket.emit('games', response) }
		);
	});
	
	socket.on('game', $0 => {
		caller.getFriends(
			$0.username,
			eval($0.game),
		 	(response) => { socket.emit('friends', response) }
		);
	});
});