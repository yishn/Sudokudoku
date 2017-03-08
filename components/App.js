const {h, Component} = require('preact')
const SudokuGrid = require('./SudokuGrid')
const Sudoku = require('../datatypes/sudoku')

class App extends Component {
    render() {
        return h(SudokuGrid, {sudoku: new Sudoku().solve()})
    }
}

module.exports = App
