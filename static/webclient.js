/* global io, document */
(function (io, document) {
	'use strict';

	// io = io.connect();

	// io.on('start', function(strdata) {
	//     var data = JSON.parse(strdata);
	//     $$('result').style.display = 'none';
	//     Array.prototype.slice.call(document.getElementsByClassName('fi-crown')).forEach(function (el) { el.remove(); });
	//     drawMap(data.map);
	//     placePlayers(data.players);
	// });

	// io.on('move', function(strdata) {
	//     var players = JSON.parse(strdata);
	// 	var names = Object.keys(players);
	// 	names.forEach(function (name) {
	// 		move(players[name]);
	// 	});
	// });

	// io.on('pickup', function (strdata) {
	// 	var player = JSON.parse(strdata);
	// 	var $treasure = $$('tile-' + player.pos.x + '-' + player.pos.y).getElementsByClassName('fi-crown')[0];
	// 	$$(player.name).appendChild($treasure);
	// });

	// io.on('gameover', function (strdata) {
	// 	var res = JSON.parse(strdata);
	// 	var $result = $$('result');
	// 	if (res.result === 'draw') {
	// 		$result.innerText = 'DRAW';
	// 	} else {
	// 		$result.innerText = 'Winner: ' + res.winner;
	// 	}
	// 	$result.style.display = 'block';
	// });

	function drawMap (map) {
        var num = map.rows.length;
        var $body = document.getElementsByTagName('body')[0];
        var height = $body.scrollHeight; 
        var size = parseInt(height / num, 10);
        var $r, $c, row;
		for (var y=map.rows.length-1; y>=0; y--) {
			row = map.rows[y];
            $r = el('DIV');
            $r.style.height = size + 'px';
            $r.className='row';
			row.forEach(function (tile, x) {
                $c = mapTile(tile.type, size, 'tile-' + x + '-' + y);
                if (tile.castle) $c.appendChild(mapTile('castle', size));
                if (tile.treasure) $c.appendChild(mapTile('treasure', size));
                $r.appendChild($c);
            });
            $body.appendChild($r);
        }
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

    function mapTile(type, size, id) {
        var $tile = el('DIV');
        $tile.className = 'tile ' + type; 
        $tile.style.width = $tile.style.height = size + 'px';
        if (id) $tile.id = id;
        return $tile;
    }

	function icon (type) {
		var $i = el('I');
		$i.className = type;
		return $i;
	}

	function $$ (id) {
		return document.getElementById(id);
	}
    
    drawMap({"size":9,"rows":[[{"type":"water"},{"type":"forest"},{"type":"mountain"},{"type":"mountain"},{"type":"grass"},{"type":"water"},{"type":"grass"},{"type":"mountain"},{"type":"forest"}],[{"type":"forest"},{"type":"mountain"},{"type":"mountain"},{"type":"water"},{"type":"mountain"},{"type":"grass"},{"type":"forest"},{"type":"grass"},{"type":"grass"}],[{"type":"grass"},{"type":"grass"},{"type":"grass"},{"type":"mountain"},{"type":"grass"},{"type":"mountain"},{"type":"grass","treasure":true},{"type":"forest","treasure":true},{"type":"grass"}],[{"type":"grass"},{"type":"grass"},{"type":"grass"},{"type":"mountain", "treasure": true},{"type":"forest"},{"type":"grass"},{"type":"forest"},{"type":"forest"},{"type":"grass"}],[{"type":"grass"},{"type":"mountain"},{"type":"grass"},{"type":"forest"},{"type":"mountain"},{"type":"mountain"},{"type":"mountain"},{"type":"grass"},{"type":"grass"}],[{"type":"mountain"},{"type":"mountain"},{"type":"grass","castle":"clembot-71"},{"type":"grass"},{"type":"mountain"},{"type":"forest"},{"type":"grass"},{"type":"mountain"},{"type":"grass"}],[{"type":"forest"},{"type":"forest"},{"type":"grass"},{"type":"forest"},{"type":"grass"},{"type":"mountain"},{"type":"water"},{"type":"grass", "treasure": true},{"type":"grass"}],[{"type":"grass","castle":"clembot-68"},{"type":"mountain"},{"type":"grass"},{"type":"grass"},{"type":"grass"},{"type":"grass"},{"type":"mountain"},{"type":"grass"},{"type":"grass"}],[{"type":"water"},{"type":"grass"},{"type":"mountain"},{"type":"grass"},{"type":"forest"},{"type":"mountain"},{"type":"grass"},{"type":"grass"},{"type":"grass"}]]});
})(io, document);
