/* global io, document */
(function (io, document) {
	'use strict';
	
	io = io.connect();

	// Listen for the talk event.
	io.on('start', function(strdata) {
	    var data = JSON.parse(strdata);
	    drawMap(data.map);
	    placePlayers(data.players);
	});

	io.on('move', function(strdata) {
	    var players = JSON.parse(strdata);
		var names = Object.keys(players);
		names.forEach(function (name) {
			move(players[name]);
		});
	});

	function drawMap (map) {
		var $tr;
		var $td;
		var $table = $$('map');
		$table.innerHTML = '';
		map.rows.forEach(function (row, y) {
			$tr = el('TR');
			row.forEach(function (tile, x) {
				$td = el('TD');
				$td.id = 'tile-' + x + '-' + y;
				$td.className = '';
				if (tile.castle) {
					$td.appendChild(icon('fi-shield'));
				} else if (tile.treasure) {
					$td.appendChild(icon('fi-crown'));
					$td.className += 'treasure ';
				} else if (tile.type === 'forest') {
					$td.appendChild(icon('fi-trees'));
				} else if (tile.type === 'mountain') {
					$td.appendChild(icon('fi-mountains'));
				}
				$td.className += 'tile ' + tile.type;
				$tr.appendChild($td);
			});
			$table.appendChild($tr);
		});
	}

	function placePlayers (players) {
		var names = Object.keys(players);
		var i=1;
		var $players = $$('players');
		var $pdiv;
		var $avatar;
		names.forEach(function (name) {
			$pdiv = $players.getElementsByClassName('player' + i)[0];
			$pdiv.innerHTML = '';
			$pdiv.appendChild(icon('fi-torso'));
			$pdiv.appendChild(t(' ' + name));

			// link player to avatar
			$avatar = document.getElementsByClassName('avatar player' + i)[0];
			$avatar.id = name;

			move(players[name]);

			i++;
		});
	}

	function move(player) {
		var $avatar        = $$(player.name);
		var boundingRect   = $$('tile-' + player.pos.x + '-' + player.pos.y).getBoundingClientRect();
		$avatar.style.top  = boundingRect.top + 'px';
		$avatar.style.left = boundingRect.left + 'px'; 
	}

	function t (text) {
		return document.createTextNode(text);
	}

	function el (nodeName) {
		return document.createElement(nodeName);
	}

	function icon (type) {
		var $i = el('I');
		$i.className = type;
		return $i;
	}

	function $$ (id) {
		return document.getElementById(id);
	}
})(io, document);