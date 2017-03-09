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

            cellEditorPosition: [0, 0],
            editMode: null
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
                puzzle: state.puzzle,

                onCellClick: evt => {
                    let {vertex: [x, y]} = evt
                    let target = document.querySelector(`#sudoku-grid .pos-${x}-${y}`)
                    let rect = target.getBoundingClientRect()
                    let left = (rect.left + rect.right) / 2
                    let top = (rect.top + rect.bottom) / 2

                    this.setState({
                        cellEditorPosition: [left, top],
                        editMode: [x, y]
                    })
                }
            }),
            h(CellEditor, {
                excluded: [2, 3, 9],
                position: state.cellEditorPosition,
                show: state.editMode != null,

                onSubmit: evt => {
                    this.setState({editMode: null})
                }
            })
        )
    }
}

module.exports = App
