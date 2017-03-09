const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

const Throbber = require('./Throbber')
const SudokuGrid = require('./SudokuGrid')
const CellEditor = require('./CellEditor')

class App extends Component {
    constructor() {
        super()

        this.state = {
            loadingProgress: 0,
            puzzle: null,
            editMode: false
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

        worker.postMessage(null)
    }

    render(_, state) {
        return h('section', {id: 'root'},
            state.puzzle == null
            ? h(Throbber, {
                progress: state.loadingProgress
            })
            : h(SudokuGrid, {
                app: this,
                puzzle: state.puzzle
            }),
            h(CellEditor, {
                excluded: [2, 3, 9],
                position: [438, 252],
                show: state.editMode,

                onSubmit: ({data}) => {
                    console.log(data)
                    this.setState({editMode: false})
                }
            })
        )
    }
}

module.exports = App
