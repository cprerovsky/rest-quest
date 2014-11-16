/*global require,console*/
'use strict';

var Http = require('http');

var data = JSON.stringify({'move' : 'up'});
var options = {
	host: 'localhost',
	port: 3000,
	path: '/move/',
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		'Content-Length': data.length
	}
};

var i=0;

function move () {
	i++;
	var req = Http.request(options, function(res) {
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