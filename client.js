/*global require,console*/
'use strict';

var Request = require('request');

var Player = { name : 'clembot-' + parseInt(Math.random() * 1000, 10) };
var BASE_URL = 'http://localhost:3000';

var i=0;
function move() {
	i++;
	Request({
		uri    : BASE_URL + '/move/',
		method : 'POST',
		form   : {
			player    : Player.name,
			direction : 'up'
		}		
	}, function (error, res, body) {
		console.log(body);
		if (i<10) {
				move();
		}
	});
}

Request({
	uri    : BASE_URL + '/register/',
	method : 'POST',
	form   : {
		name : Player.name
	}
}, function (error, res, body) {
	console.log(body);
	move();
});
