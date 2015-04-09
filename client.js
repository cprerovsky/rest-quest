/*global require,console*/
'use strict';

var request = require('request');
var Player = { name : 'clembot-' + parseInt(Math.random() * 100, 10) };
var BASE_URL = 'http://localhost:3000';

function takeTurn (pos, search) {
	var oldPos = pos;
	var dir = search ? nextSearchStep() : nextHomeStep(pos);
	pos = updatePos(pos, dir);
	move(dir, function (data) {
		takeTurn(pos, !data.treasure);
	});
}

function nextHomeStep(pos) {
	if (pos.x > 0) {
		return 'left';
	}
	return 'down';
}

function updatePos (pos, dir) {
	var x = pos.x;
	var y = pos.y;

	if (dir === 'up') {
		y++;
	} else if (dir === 'right') {
		x++;
	} else if (dir === 'down') {
		y--;
	} else if (dir === 'left') {
		x--;
	}

	return { x: x, y: y};
}

function move (dir, cb) {
	request({
		uri    : BASE_URL + '/move/',
		method : 'POST',
		form   : {
			player    : Player.name,
			direction : dir
		}
	}, function (error, res, body) {
		var data = JSON.parse(body);
		printView(data.view);
		if (data.game) {
			console.log(Player.name, data);
			reset();
		} else {
			cb(data);
		}
	});
}

var last = 'down';
function nextSearchStep () {
	return last = last == 'down' ? 'up' : 'down';
	//return Math.random() >= 0.5 ? 'right' : 'up';
}

function reset () {
	request({
		uri    : BASE_URL + '/reset/',
		method : 'GET',
	}, function () {});
}

function printView (data) {
	if (!data || !data.length) return;
	for (var y=0; y<data.length; y++) {
		var logstr = '';
		for (var x=0; x<data.length; x++) {
			logstr += data[y][x].castle ? 'C ' : data[y][x].type[0] + ' ';
		}
		console.log(logstr);
	}
	console.log('\n');
}


request({
	uri    : BASE_URL + '/register/',
	method : 'POST',
	form   : {
		name : Player.name
	}
}, function () {
	takeTurn({ x:0, y:0 }, true);
});
