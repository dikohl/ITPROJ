var http = require('http');
var apiKey = '68C3D' + 'EE7' + '0F5' + '7D520' + '36' + '7C9' + '18B' + '692' + 'BEDF2';
var hostname = 'api.steampowered.com';

exports.getFriends = function(user, appId, callback) {
	var path = '/ISteamUser/GetFriendList/v0001/?key=' + apiKey + '&steamid=' + user + '&relationship=friend&format=json';
	getFriendsFromSteam(path, function(response){
		if(response.type == 'friends'){
			callback({
				type: response.type,
				friends: response.friends
			});
		}
		//handle error
		else{
			callback({
				type: response.type,
				state: response.state
			});
		}	
		
	});
	
}

exports.getFriendsWithSameGame = function(user, appId, friends, callback){
	friendsWithGame = []
	
	if(friends.type == 'friends'){
		//look at every friend
		var allFriends = friends.friends;
		for(var i = 0; i < allFriends.length; i++){
			var friend = allFriends[i]
			//getOwnedGames with filter on specific game
			var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + friend.steamid + '&include_appinfo=1&format=json&appids_filter[0]=' + appId;
			hasGame(path,i,function(response){
				if(response.owned == 'true'){
					//if friend has the game add him to the list
					friendsWithGame.push(allFriends[response.index].steamid);
				}
				//bad solution it doesn't continue until we have looped all, to mask this we could sen updates
				if(response.index == allFriends.length-1){
					// give back list with all freinds that own the game
		
					// *****the algorithm for looking for new friends should do it's job here*****
					console.log(friendsWithGame);
					callback({
						type: 'friends',
						friends: friendsWithGame
					});
				}
			});
		}

	}
	//handle error
	else{
		callback({
			type: callback.type,
			state: callback.state
		});
	}	
}


exports.getGames = function(user, callback){
	var path = '/IPlayerService/GetOwnedGames/v0001/?key=' + apiKey + '&steamid=' + user + '&include_appinfo=1&format=json';
	getGamesFromSteam(path, function(response){
		//handle callback
		if(response.type == 'games'){
			callback({
				type: response.type,
				games: response.games
			});
		}
		//handle error
		else{
			callback({
				type: response.type,
				state: response.state
			});
		}	
	});
}

var getGamesFromSteam = function (path, callback){
	//500 if unknown ID
	//200 if wrong APIKEY
	
	//options for http.get
	var options = {
		hostname: hostname,
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}
	
	var games_list = [];
	
	http.get(options).on('response', function(response){
		//callback function
		
		//if something else than ok (200) is returned
		if(response.statusCode != 200){
			callback({
				type: 'error',
				state: response.statusCode
			});
		}
		
		//handle data
		else{
			var output = '';
			//gather JSON chunks
			response.on('data', function(chunk){
				output += chunk;
			});

			response.on('end',function(){
				var data = JSON.parse(output);
				var games = data.response.games;
				//get clean list of games with ID and name
				for (var i = 0; i < games.length; i++){
					var game = {
						appid: games[i].appid,
						name: games[i].name
					}
					games_list.push(game);
				}
				//give back clean list of games
				callback({
					type: 'games',
					games: games_list
				});
			});
		}
	});
}

function getFriendsFromSteam(path, callback){
	
	//options for http.get
	var options = {
		hostname: hostname,
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}

	http.get(options).on('response', function(response){
		/*
		console.log(JSON.stringify(response.headers))
		console.log(response.statusCode);
		*/
		
		
		//callback function
	
		//if something else than ok (200) is returned
		if(response.statusCode != 200){
			callback({
				type: 'error',
				state: response.statusCode
			});
		}
		//handle data
		else{
			var output = '';
			//gather JSON chunks
			response.on('data', function(chunk){
				output += chunk;
			});

			response.on('end',function(){
				var data = JSON.parse(output);
				//give back list of friends
				callback({
					type: 'friends',
					friends: data.friendslist.friends
				});
			});
		}
	});
}

function hasGame(path,index, callback){
	
	var options = {
		hostname: hostname,
		path: path,
		headers: {
		            accept: 'application/json'
		        }
	}
	
	http.get(options).on('response', function(response){
		/*
		console.log(JSON.stringify(response.headers))
		console.log(response.statusCode);
		*/
		
		
		//callback function
	
		//if something else than ok (200) is returned
		if(response.statusCode != 200){
			callback({
				type: 'error',
				state: response.statusCode
			});
		}
		//handle data
		else{
			var output = '';
			//gather JSON chunks
			response.on('data', function(chunk){
				output += chunk;
			});

			response.on('end',function(){
				var data = JSON.parse(output);
				//determine if user has game or not
				//with the filter the games list has either 1 or 0 length
				
				// perhaps it would make sense to test the data further but probably not
				if(data.response.game_count =! 0){
					callback({
						type: 'owned',
						owned: 'true',
						index: index
						//could read out time played here and check if it is really the same game
					});
				}
				else{
					callback({
						type: 'owned',
						owned: 'false',
						index: index
					});
				}
			});
		}
	});
}