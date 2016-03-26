
var contendants = ['Sebastian', 'Manuel E.', 'Flo',
//'Michael B',
'Thomas', 'Stefan', 'Klaus-M.', 'Patrick H.', 'Norbert', 'Johannes2', 'Wolfgang',
'Petro',
'Berni',
'Bernhard R.',
'David'];

console.log(contendants.length + ' contendants.');

var shuffled = shuffle(contendants);

shuffled.forEach(function (contendant) {
	console.log(contendant);
});


// fisher-yates shuffle
// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}
