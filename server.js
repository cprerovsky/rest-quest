/*global require,console*/
'use strict';

var Express = require('express.io');
var Maps = require('lib/map');


var app = new Express();
var state = {
	players : [],
	map     : Maps.create()
};


app.post('/register/', function (req, res) {
	var player = {
		id   : req.params.id,
		pos  : initPos(),
		turn : 0
	};

	if (state.players.length > 2) {
		throw 'more than 2 players in game - disqualified: ' + player.id;
	}
	
	state.players.push(player);
	res.send(JSON.stringify({ok : true}));
});

app.post('/move/', function (req, res) {
	console.log('move');
	setTimeout(function () {
		res.send(JSON.stringify({ 'ok' : true }));
	}, 2000);
});

function initPos () {
	return [0, 0];
}


app.listen(3000);
console.log('Server started on localhost:3000');