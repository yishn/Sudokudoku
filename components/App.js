const {h, Component} = require('preact')
const SudokuGrid = require('./SudokuGrid')
const Sudoku = require('../datatypes/sudoku')

class App extends Component {
    constructor() {
        super()
        
        this.state = {
            sudoku: Sudoku.generatePuzzle()
        }
    }

    render(_, {sudoku}) {
        return h(SudokuGrid, {
            app: this,
            sudoku
        })
    }
}

module.exports = App
