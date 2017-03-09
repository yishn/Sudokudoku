const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

const Throbber = require('./Throbber')
const SudokuGrid = require('./SudokuGrid')

class App extends Component {
    constructor() {
        super()

        this.state = {
            puzzle: null
        }
    }

    componentDidMount() {
        setTimeout(() => {
            let puzzle = Sudoku.generatePuzzle()
            this.setState({puzzle})
        }, 1000)
    }

    render(_, {puzzle}) {
        return h('section', {id: 'root'},
            puzzle == null
            ? h(Throbber)
            : h(SudokuGrid, {
                app: this,
                puzzle
            })
        )

    }
}

module.exports = App
