var http = require('http');
var apiKey = process.argv.slice(2);

exports.getData = function(user, game, callback){
	
}

exports.getFriends = function(user) {
	var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + user + '&include_appinfo=1&format=json';
	var friends = getFriendsFromSteam(path);
	
}

exports.getGames = function(user, callback){
	var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + user + '&include_appinfo=1&format=json';
	var hostname = 'api.steampowered.com';
	getGamesFromSteam(path, hostname, function(response){
		
		console.log(response);
		if(response.type == 'games'){
			callback({
				type: response.type,
				games: response.games
			});
		}
		else{
			callback({
				type: response.type,
				state: response.state
			});
		}	
	});
}

var getGamesFromSteam = function (path, hostname, callback){
	//500 if unknown ID
	//200 if wrong APIKEY
	var options = {
		hostname: hostname,
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}
	
	var games_list = [];
	
	http.get(options).on('response', function(response){
		
		console.log('-----------------------------------------');
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		console.log('-----------------------------------------');
		
		if(response.statusCode != 200){
			callback({
				type: 'error',
				state: response.statusCode
			});
		}
		else{
			var output = '';
			response.on('data', function(chunk){
				output += chunk;
			});

			response.on('end',function(){
				var data = JSON.parse(output);
				var games = data.response.games;
				for (var i = 0; i < games.length; i++){
					var game = {
						appid: games[i].appid,
						name: games[i].name
					}
					games_list.push(game);
				}
				callback({
					type: 'games',
					games: games_list
				});
			});
		}
	});
}

function getFriendsFromSteam(path){
}