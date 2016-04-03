/* global io, document */
(function (io, document) {
	'use strict';

	io = io.connect();

	io.on('start', function(strdata) {
	    var data = JSON.parse(strdata);
        clean();
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

	io.on('pickup', function (strdata) {
		var player = JSON.parse(strdata);
		setTimeout(function () {
            elByClass('treasure', $$('tile-' + player.pos.x + '-' + player.pos.y)).remove();
        }, 1000);
	});

	io.on('gameover', function (strdata) {
		var res = JSON.parse(strdata);
        var $result = $$('result');
		if (res.result === 'draw') {
			$result.getElementsByTagName('H1')[0].innerText = 'DRAW';
			$result.getElementsByTagName('DIV')[0].className = '';
		} else {
            $result.getElementsByTagName('H1')[0].innerText = res.winner + ' won!';
            $result.getElementsByTagName('DIV')[0].className = $$(res.winner).className;
		}
        removeClass($result, 'hide');
	});

    function clean() {
        $$('welcome').className = 'hide';
        $$('result').className = 'hide';
        removeClass(elByClass('avatar__player1'), 'hide');
        removeClass(elByClass('avatar__player2'), 'hide');
        Array.prototype.slice.call(document.getElementsByClassName('row')).forEach(function ($el) {
            $el.remove();
        });
    }

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
                if (tile.castle) $c.appendChild(mapTile('castle__player1', size));
                if (tile.treasure) $c.appendChild(mapTile('treasure', size));
                $r.appendChild($c);
            });
            $body.appendChild($r);
        }
        // though ugly, we will also resize the player sprites here
        resizePlayerSprite('avatar__player1', size);
        resizePlayerSprite('avatar__player2', size);
	}
    
    function resizePlayerSprite(className, size) {
        var $sprite = elByClass(className);
        $sprite.style.width = $sprite.style.height = size + 'px';
    }

	function placePlayers (players) {
		var $pdiv;
        var names = Object.keys(players);
		var i=1;
		names.forEach(function (name) {
			$pdiv = elByClass('avatar__player' + i);
            $pdiv.id = name;
            elByClass('name', $pdiv).innerText = name;
			move(players[name]);
			i++;
		});
	}

	function move(player) {
		var boundingRect   = $$('tile-' + player.pos.x + '-' + player.pos.y).getBoundingClientRect();
		var $avatar        = $$(player.name);
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

    function removeClass(el, className) {
        var classes = el.className.split(' ');
        var newClasses = [];
        classes.forEach(function (c) {
            if (c != className) newClasses.push(c);
        });
        el.className = newClasses.join(' ');
    }

	function $$ (id) {
		return document.getElementById(id);
	}
    
    function elByClass(className, rootNode) {
        rootNode = rootNode || document;
        return rootNode.getElementsByClassName(className)[0];
    }
})(io, document);
