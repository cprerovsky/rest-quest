"use strict";

var chalk = require('chalk');
var Player = require('../lib/player');
var Response = require('../lib/response');

/**
 * QuestMark: A Rest Quest benchmarking suite!
 *
 * QuestMark loads hard-coded Rest Quest maps and allows your client to test its skills in a
 * set environment, allowing for faster iteration on your client's algorithms and
 * reliable feedback on its performance.
 */


/**
 * Benchmark state and stats are recorded here
 */
var benchmarkState = {
    searchTurns: 0,
    returnTurns: 0,
    hasTreasure: false,
    result: 'in progress',
    reportSent: false
};

/**
 * The benchmark map to be loaded
 */
var map;

/**
 * Callback to invoke when the benchmark ends. Set with the exported `onEnd()` function.
 */
var onEndCallback = () => {};

/**
 * The regex used to identify a valid map number argument.
 * @type {RegExp}
 */
var argRe = /^-\d{1,2}$/;

/**
 * Load the contents of the map
 * @param mapNumber
 */
function loadMap(mapNumber) {
    mapNumber = argRe.test(mapNumber) ? mapNumber : '-1';
    mapNumber = mapNumber.replace('-', '');
    
    try {
        map = require('./map' + mapNumber + '.js');
    } catch (e) {
        qLog(chalk.red(`Error: Could not find file 'benchmark/map${mapNumber}.js'`));
        throw 'Aborting';
    }

    qLog(`Loading Map ${mapNumber}: ${map.description}`);

}

/**
 * Start the benchmark. Performs the same function as Game.register(), but registers both the player and
 * the fake enemy.
 *
 * @param State
 * @param req
 * @param res
 * @param io
 */
function start(State, req, res, io) {
    if (State.phase !== 'register') {
        res.send(Response.invalidOp());
        return;
    }

    qLog(chalk.blue('====== QuestMark Start ======'));
    qLog(`Registering player: ${JSON.stringify(req.body.name)}`);

    var player = Player.create(req.body.name);
    State.players[player.name] = player;
    State.players['enemy'] = Player.create('enemy');
    
    State.map = createTestMap(map, player.name);

    // Get the player starting position
    State.map.rows.forEach((row, y) => {
        row.forEach((tile, x) => {
            if (tile.castle === player.name) {
                player.pos = {
                    x: x,
                    y: y
                };
            }
        });
    });

    res.send(Response.view(player, State.map));
    player.moveTimer = Date.now();

    State.phase = 'in progress';
    io.broadcast('start', JSON.stringify(State));
}

/**
 * Converts a testMap object into a valid Map object.
 * 
 * @param blueprint - a blueprint for a Map object, with the following properties:
 * - mapString: a multi-line string, where each char represents a terrain tile:
 *      e.g.`gP g  g
 *           m  wE w
 *           g  f  fT`
 *      would result in a 3 x 3 map, with the player castle located at [0, 0],
 *      the enemy castle located at [1, 1] and the treasure at [2, 2]
 */
function createTestMap(blueprint, playerName) {
    var testMap = {
        size: 0,
        rows: []
    };
    
    testMap.rows = blueprint.mapString.trim().split('\n')
        .map(line => line.trim().split(/\s+/).map(chars => charsToTile(chars, playerName)));
    testMap.size = testMap.rows.length;
    
    return testMap;
}

/**
 * Given a char (g, m, w, f), returns a tile object
 * with the matching terrain type.
 * 
 * Also accounts for features:
 * - player castle (P)
 * - enemy castle (E)
 * - treasure (T)
 * 
 * @param chars
 */
function charsToTile(chars, playerName) {
    var type;
    var terrainType = chars.match(/[gmfw]/)[0];
    if (!terrainType) {
        qLog(chalk.red(`Error: map terrain symbol '${chars}' is invalid`));
        throw 'Aborting';
    }
    switch (terrainType) {
        case 'g':
            type = 'grass';
            break;
        case 'm':
            type = 'mountain';
            break;
        case 'f':
            type = 'forest';
            break;
        case 'w':
            type = 'water';
            break;
    }

    var tile = {type: type};

    var featureMatch = chars.match(/[PET]/);
    if (featureMatch) {
        switch (featureMatch[0]) {
            case 'P':
                tile.castle = playerName;
                // make sure the player castle is not in water
                if (type === 'water') {
                    qLog(chalk.red('Error: This benchmark map places the player castle in water!'));
                    throw 'Aborting';
                }
                break;
            case 'E':
                tile.castle = 'enemy';
                break;
            case 'T':
                tile.treasure = true;
                // make sure the treasure is not in water
                if (type === 'water') {
                    qLog(chalk.red('Error: This benchmark map places the treasure in water!'));
                    throw 'Aborting';
                }
                break;
        }
    }
    
    return tile;
}

// When playing the game, responses are sent alternately for the player and the the
// enemy. We only want to record state changes on the player's turns.
var playerMove = true;
/**
 * Monkey-patches the Express res.send() method so that Questmark can intercept the response before it
 * is sent back to the client. Needed to be able to catch events such as finding treasure and winning 
 * or losing the game.
 * @param res
 */
function patchResponse(res) {
    var _send = res.send.bind(res);

    res.send = function monkeySend(val) {
        var r = JSON.parse(val);
        var s = benchmarkState;

        if (playerMove) {
            if (r.game && r.game === 'over') {
                s.result = r.result;
                printReport();
            } else if (r.view) {
                if (!s.hasTreasure) {
                    s.searchTurns++;
                } else {
                    s.returnTurns++;
                }

                if (r.treasure === true) {
                    s.hasTreasure = true;
                }
            }
        }
        playerMove = !playerMove;

        _send(val);
    };
    
    return res;
}

/**
 * Output the benchmark result to the console.
 */
function printReport() {
    var s = benchmarkState;

    if (!s.reportSent) {
        if (s.result === 'won') {
            qLog(chalk.blue('====== YOU WON ======'));
        } else {
            qLog(chalk.red(`====== ${s.result.toUpperCase()} =======`));
        }
        var searchReport = s.hasTreasure ? 'Turns to find treasure' : 'Turns taken searching for treasure';
        var returnReport = s.result === 'won' ? 'Turns to return to castle' : 'Turns taken returning to castle';

        var tColor = s.hasTreasure ? 'blue' : 'red';
        qLog(`Found treasure? ` + chalk[tColor](`${s.hasTreasure}`));
        qLog(`${searchReport}: ${s.searchTurns}`);

        var rColor = s.result === 'won' ? 'blue' : 'red';
        qLog(`Returned to castle? ` + chalk[rColor](`${s.result === 'won'}`));
        qLog(`${returnReport}: ${s.returnTurns}`);

        var total = s.searchTurns + s.returnTurns;
        qLog(chalk.blue.underline.bold('Total turns: ' + total));

        s.reportSent = true;
        setTimeout(onEndCallback, 100);
    }
}

var lastEnemyMove = 'down';
/**
 * Returns an enemy move direction. The enemy just goes up and down. Pretty dumb.
 * @returns {string}
 */
function enemyMove() {
    return lastEnemyMove = lastEnemyMove == 'down' ? 'up' : 'down';
}

/**
 * Returns a fake request object to pass to the Game.move() method.
 */
function enemyReq() {
    return {
        body: {
            player: 'enemy',
            direction: enemyMove()
        }
    };
}

/**
 * Log with a prefix
 * @param message
 */
function qLog(message) {
    console.log(chalk.green(`[QuestMark] ` + message));
}

/**
 * Callback to execute when the benchmark ends.
 * @param fn
 */
function onEnd(fn) {
    onEndCallback = fn;
}

module.exports = {
    argRe: argRe,
    loadMap: loadMap,
    start: start,
    enemyReq: enemyReq,
    patchResponse: patchResponse,
    onEnd: onEnd
};
