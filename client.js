/*global require,console*/
'use strict';

var Http = require('http');

var player = { name : 'clembot42' };

function options (opts, length) {
	var options = {
		host: 'localhost',
		port: 3000,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': length
		}		
	};
	for (var key in opts) {
		options[key] = opts[key]; 
	}
	return options;
}

var i=0;
function move () {
	i++;
	var data = JSON.stringify({
		'player'    : player.name,
		'direction' : 'up'
	});
	var req = Http.request(options ({ path: '/move/' }, data.length), function(res) {
		var responseString = '';

		res.on('data', function(data) {
			responseString += data;
		});
		res.on('end', function() {
			console.log(JSON.parse(responseString));
			if (i<10) {
				move();
			}
		});
	});

	req.write(data);
	req.end();
}

move();