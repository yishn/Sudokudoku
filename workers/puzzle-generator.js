let {generatePuzzle} = require('../datatypes/sudoku')
let puzzle = generatePuzzle()
self.postMessage([puzzle.arrangement, puzzle.solids])
