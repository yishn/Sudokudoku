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
            editVertex: null
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
        let markup = state.puzzle ? state.puzzle.getCurrentMarkup() : null
        let numbers = [...Array(9)].map((_, i) => i + 1)

        let getExcluded = ([x, y]) => numbers.filter(i => !markup[y][x].includes(i))

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
                        editVertex: [x, y]
                    })
                }
            }),
            h(CellEditor, {
                excluded: state.editVertex ? getExcluded(state.editVertex) : [],
                position: state.cellEditorPosition,
                show: state.editVertex != null,

                onSubmit: evt => {
                    this.setState({editVertex: null})
                }
            })
        )
    }
}

module.exports = App
