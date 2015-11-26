var http = require('http');
var apiKey = process.argv.slice(2);

exports.getData = function(user, game, callback){
	
}

exports.getFriends = function(user) {
	var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + user.slice(1) + '&include_appinfo=1&format=json';
	var friends = getFriendsFromSteam(path);
	
}

exports.getGames = function(user, callback){
	var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + user.slice(1) + '&include_appinfo=1&format=json';
	var hostname = 'api.steampowered.com';
	
	var options = {
		hostname: hostname,
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}
	
	callback = function(response){
		var games_list = [];
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
	http.request(options, callback).end();
	
	/*if (suc){
		callback({
			type: 'succ',
			state: 'Request successful'
		});
	}
	else{
		callback({
			type: 'err',
			state: 'An error uccurred'
		});
	}*/

}

function getGamesFromSteam(path){
	/*console.log('-----------------------------------------');
	console.log('STATUS: ' + response.statusCode);
	console.log('HEADERS: ' + JSON.stringify(response.headers));
	console.log('-----------------------------------------');*/
	
	//500 if unknown ID
	//200 if wrong APIKEY
	
}

function getFriendsFromSteam(path){
	/*console.log('-----------------------------------------');
	console.log('STATUS: ' + response.statusCode);
	console.log('HEADERS: ' + JSON.stringify(response.headers));
	console.log('-----------------------------------------');*/
	
	//500 if unknown ID
	//200 if wrong APIKEY
	var options = {
		hostname: 'api.steampowered.com',
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}
	
	callback = function(response){
		
		if(response.statusCode != 200){
			return;
		}
			
		var output = '';
		response.on('data', function(chunk){
			output += chunk;
		});
		
		response.on('end',function(){
			var friends_list = [];
			var data = JSON.parse(output);
			//console.log(data.response.games[0]);
			
		});
	}
	http.request(options, callback).end();
	
}