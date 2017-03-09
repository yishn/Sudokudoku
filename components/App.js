const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

const Throbber = require('./Throbber')
const SudokuGrid = require('./SudokuGrid')

class App extends Component {
    constructor() {
        super()

        this.state = {
            loadingProgress: 0,
            puzzle: null
        }
    }

    componentDidMount() {
        let worker = new Worker('workers/puzzle-generator-bundle.js')

        worker.addEventListener('message', evt => {
            let {percent, puzzle} = evt.data

            if (puzzle != null) {
                let [arrangement, solids] = puzzle
                let p = new Sudoku(arrangement)
                p.solids = solids

                this.setState({puzzle: p})
            } else {
                this.setState({loadingProgress: percent})
            }
        })

        worker.postMessage('')
    }

    render(_, {loadingProgress, puzzle}) {
        return h('section', {id: 'root'},
            puzzle == null
            ? h(Throbber, {loadingProgress})
            : h(SudokuGrid, {
                app: this,
                puzzle
            })
        )

    }
}

module.exports = App
