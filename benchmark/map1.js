/**
 * Default benchmark map. A small, basic map which should be possible
 * to complete in a minimum of 10 moves.
 *
 * Terrain
 * =======
 * g = grass
 * m = mountain
 * f = forest
 * w = water
 *
 * Features
 * ========
 * P = player castle
 * E = enemy castle
 * T = treasure
 *
 * When writing maps, put 2 spaces between each tile, except when there is a
 * feature also on that tile, in which case there should be 1 space before the
 * next tile (to preserve the columns).
 *
 * In a benchmark there can be any number of treasure tiles.
 */


var map = `
g  g  g  g  g  m  f
m  w  w  g  g  w  f
g  fP f  g  w  g  g
m  m  f  f  f  w  w
f  f  w  w  gT g  g
g  g  g  g  g  g  g 
g  w  w  f  f  fE f
`;

module.exports = {
    mapString: map,
    description: 'A small, basic map. Best score = 10'
};
