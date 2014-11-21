/*global require,console*/
'use strict';

var Express = require('express.io');
var BodyParser = require('body-parser');
var Assert = require('./lib/assert');
var Maps = require('./lib/maps');
var Player = require('./lib/player');
var both = require('./lib/both');

var App = new Express();
var State = initState();

App.use(BodyParser.urlencoded({ extended: true }));


// ----- funcs -----

function initState () {
	return {
		players : {},
		map     : Maps.create()
	};
}

// ----- routes -----

App.post('/register/', function (req, res) {
	Assert.registryOpen(State.players);

	var player = Player.create(req.body.name, State.players);
	State.players[player.name] = player;
	
	var castlePlace = Maps.placementTile(State.map);
	castlePlace.tile.castle = player.name;
	player.pos = {
		x: castlePlace.x,
		y: castlePlace.y
	};

	console.log('registered player {' + player.name + '} at {' + player.pos.x + ',' + player.pos.y + '}');
	
	both('register', function () {
		
		res.send('OK');
	}).once(function () { console.log('once!'); });
});

App.post('/move/', function (req, res) {
	Assert.registryClosed(State.players);
	var player = Player.get(req.body.player);
	var newPos = Maps.move(player.pos, req.body.direction, State.map.size);
	player.pos = newPos;
	player.turn++;

	console.log('moved player {' + player.name + '} to {' + player.pos.x + ',' + player.pos.y + '} in turn {' + player.turn + '}');

	setTimeout(function () {
		res.send(JSON.stringify(Maps.view(player.pos, State.map)));
	}, 500);
});

App.listen(3000);
console.log('Server started on localhost:3000');