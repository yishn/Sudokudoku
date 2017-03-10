const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

const Throbber = require('./Throbber')
const SudokuGrid = require('./SudokuGrid')
const CellEditor = require('./CellEditor')

let numbers = [...Array(9)].map((_, i) => i + 1)

class App extends Component {
    constructor() {
        super()

        this.state = {
            loadingProgress: 0,
            puzzle: null,

            cellEditorPosition: [0, 0],
            editVertex: [0, 0],
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

    showCellEditor([x, y]) {
        let element = document.querySelector(`#sudoku-grid .pos-${x}-${y}`)
        let rect = element.getBoundingClientRect()
        let left = (rect.left + rect.right) / 2
        let top = (rect.top + rect.bottom) / 2

        this.setState({
            cellEditorPosition: [left, top],
            editVertex: [x, y],
            editMode: true
        })
    }

    render(_, state) {
        let markup = state.puzzle ? state.puzzle.getTrivialMarkup() : null

        let getExcluded = ([x, y]) => state.puzzle ? state.puzzle.excluded[y][x] : []
        let getDisabled = ([x, y]) => markup ? numbers.filter(i => !markup[y][x].includes(i)) : []
        let getAllowed = ([x, y]) => markup ? markup[y][x].filter(i => !getExcluded([x, y]).includes(i)) : numbers

        return h('section', {id: 'root'},
            state.puzzle == null
            ? h(Throbber, {
                progress: state.loadingProgress
            })
            : h(SudokuGrid, {
                puzzle: state.puzzle,

                onCellClick: ({vertex}) => {
                    let [x, y] = vertex

                    if (state.puzzle.get(vertex) == null) {
                        if (markup[y][x].length == 1) {
                            // Fill cell

                            state.puzzle.set(vertex, markup[y][x][0])
                            this.setState({puzzle: state.puzzle})
                        } else {
                            // Show cell editor

                            this.showCellEditor(vertex)
                        }
                    } else {
                        // Clear cell

                        state.puzzle.set(vertex, null)
                        state.puzzle.excluded[y][x] = []

                        this.setState({puzzle: state.puzzle})
                    }
                }
            }),
            h(CellEditor, {
                excluded: getExcluded(state.editVertex),
                disabled: getDisabled(state.editVertex),
                position: state.cellEditorPosition,
                show: state.editMode,

                onSubmit: evt => {
                    let allowed = getAllowed(state.editVertex).filter(i => !evt.data.includes(i))

                    if (allowed.length == 1) {
                        // Fill cell

                        state.puzzle.set(state.editVertex, allowed[0])
                    } else {
                        // Update excluded numbers

                        let [x, y] = state.editVertex
                        let excluded = evt.data.filter(i => markup[y][x].includes(i))

                        state.puzzle.excluded[y][x] = excluded
                    }

                    this.setState({puzzle: state.puzzle, editMode: false})
                }
            })
        )
    }
}

module.exports = App
