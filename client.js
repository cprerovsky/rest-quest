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
			direction : 'right'
		}		
	}, function (error, res, body) {
		printView(body);
		if (i<10) {
				move();
		}
	});
}

function printView (str) {
	var data = JSON.parse(str);
	var logstr;

	for (var y=0; y<data.length; y++) {
		logstr = '';
		for (var x=0; x<data.length; x++) {
			logstr += data[y][x].type[0];
		}
		console.log(logstr);
	}
	console.log('\n');
}

Request({
	uri    : BASE_URL + '/register/',
	method : 'POST',
	form   : {
		name : Player.name
	}
}, function (error, res, body) {
	console.log(body);
	//move();
});
