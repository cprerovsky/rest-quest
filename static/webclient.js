/* global io, document */
(function (io, document) {
	'use strict';
	
	io = io.connect();

	// Listen for the talk event.
	io.on('start', function(strdata) {
	    var data = JSON.parse(strdata);
	    drawMap(data.map);
	});

	function drawMap (map) {
		var $tr;
		var $td;
		var $table = $$('map');
		$table.innerHTML = '';
		map.rows.forEach(function (row) {
			$tr = el('TR');
			row.forEach(function (tile) {
				$td = el('TD');
				$td.className = '';
				if (tile.castle) {
					$td.appendChild(img('img/castle.png'));
				} else if (tile.treasure) {
					$td.appendChild(img('img/treasure.png'));
					$td.className += 'treasure ';
				} else if (tile.type !== 'grass') {
					$td.appendChild(img('img/' + tile.type + '.png'));
				}
				$td.className += 'tile ' + tile.type;
				$tr.appendChild($td);
			});
			$table.appendChild($tr);
		});
	}

	function el (nodeName) {
		return document.createElement(nodeName);
	}

	function img (src) {
		var $img = el('IMG');
		$img.src = src;
		return $img;
	}

	function $$ (id) {
		return document.getElementById(id);
	}
})(io, document);