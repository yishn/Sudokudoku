const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

const Throbber = require('./Throbber')
const SudokuGrid = require('./SudokuGrid')

class App extends Component {
    constructor() {
        super()

        this.state = {
            loading: true,
            sudoku: null
        }
    }

    render(_, {loading, sudoku}) {
        return h('section', {id: 'root'},
            loading
            ? h(Throbber)
            : h(SudokuGrid, {
                app: this,
                sudoku
            })
        )

    }
}

module.exports = App
