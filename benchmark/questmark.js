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

    qLog(`Registering player: ${JSON.stringify(req.body.name)}`);

    var player = Player.create(req.body.name);
    State.players[player.name] = player;
    State.players['enemy'] = Player.create('enemy');
    
    State.map = createTestMap(map);
    
    player.pos = {
        x: map.playerCastle[0],
        y: map.playerCastle[1]
    };

    // make sure the player castle is not in water
    if (State.map.rows[player.pos.y][player.pos.x].type === 'water') {
        qLog(chalk.red('Error: This benchmark map places the player castle in water!'));
        throw 'Aborting';
    }
    // make sure the treasure is not in water
    if (State.map.rows[map.treasure[1]][map.treasure[0]].type === 'water') {
        qLog(chalk.red('Error: This benchmark map places the treasure in water!'));
        throw 'Aborting';
    }
    
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
 *      e.g.`ggg
 *           mww
 *           gff`
 *      would result in a 3 x 3 map.
 * - playerCastle: [x, y] coordinates of the player castle, originating from top-left, e.g. [1, 1].
 * - enemyCastle: as above, for enemy castle.
 * - treasure: as above, for the treasure.
 */
function createTestMap(blueprint) {
    var testMap = {
        size: 0,
        rows: []
    };
    
    testMap.rows = blueprint.mapString.trim().split('\n')
        .map(line => line.trim().split(/\s*/).map(charToTile));
    testMap.size = testMap.rows.length;
    
    // place the player castle
    var pc = blueprint.playerCastle;
    testMap.rows[pc[1]][pc[0]].castle = 'player';
    
    // place the enemy castle
    var ec = blueprint.enemyCastle;
    testMap.rows[ec[1]][ec[0]].castle = 'enemy';
    
    // place the treasure
    var t = blueprint.treasure;
    testMap.rows[t[1]][t[0]].treasure = true;
    
    return testMap;
}

/**
 * Given a char (g, m, w, f), returns a tile object
 * with the matching type.
 * @param char
 */
function charToTile(char) {
    var type;
    
    switch (char) {
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
    
    return { type: type };
}

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
        
        if (r.game && r.game === 'over') {
            s.result = r.result;
            printReport();
        } else {

            if (!s.hasTreasure) {
                s.searchTurns++;
            } else {
                s.returnTurns++;
            }

            if (r.treasure === true) {
                s.hasTreasure = true;
            }
        }

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
            qLog('====== YOU WON ======');
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

module.exports = {
    argRe: argRe,
    loadMap: loadMap,
    start: start,
    enemyReq: enemyReq,
    patchResponse: patchResponse
};
