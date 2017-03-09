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
        let worker = new Worker('workers/puzzle-generator-bundle.js')

        worker.addEventListener('message', evt => {
            let [arrangement, solids] = evt.data
            let puzzle = new Sudoku(arrangement)
            puzzle.solids = solids

            this.setState({puzzle})
        })

        worker.postMessage('')
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
