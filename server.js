var express = require('express'), app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http);

var caller = require('./caller');

app.get('/', function (request, response) {
	app.use(express.static(__dirname + '/public'));
	app.use('/scripts', express.static(__dirname + '/node_modules/vis/dist/'));
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
			//call function to determine Friends with same Game
		 	(friendsResponse) => {
				caller.getFriendsWithSameGame(
				$0.username,
				eval($0.game),
				friendsResponse,
				(response) => {
					var friendslist = response.friends;
					console.log("friendslist: " + friendslist);
					
					// level 2 of friends
					for(var i = 0; i < response.friendsId.length; i++){
						var friendToQuery = response.friendsId[i];
						console.log("friend will be queried:" + friendToQuery + "/ " + friendslist[i]);
						caller.getFriends(
							friendToQuery,
							eval($0.game),
							//call function to determine Friends with same Game
						 	(friendsResponse) => {
								caller.getFriendsWithSameGame(
								//notdefined
								friendsResponse.user,
								eval($0.game),
								friendsResponse,
								(response) => {
									var friendoffriendlist = response.friends;
									console.log("friendsoffriendslist of" + response.user + ": " + response.friends);
									socket.emit('friends', response);
								}) 
							}
						);
					}
					
					socket.emit('friends', response) }
				) }
		);
	});
});