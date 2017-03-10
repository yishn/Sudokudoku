const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

class SudokuGrid extends Component {
    constructor() {
        super()

        this.state = {
            highlightNumbers: []
        }
    }

    render({puzzle, onCellClick = () => {}}, {highlightNumbers}) {
        let contradiction = puzzle.getContradiction()
        let markup = puzzle.getCurrentMarkup()

        return h('section', {id: 'sudoku-grid'},
            [...Array(9)].map((_, y) => h('ol', {},
                [...Array(9)].map((__, x) => h('li',
                    {
                        class: {
                            [`pos-${x}-${y}`]: true,
                            'solid': puzzle.solids.some(Sudoku.vertexEquals([x, y])),
                            'contradiction': markup[y][x].length == 0
                                || contradiction.some(Sudoku.vertexEquals([x, y])),
                            'highlight': puzzle.get([x, y]) != null
                                ? highlightNumbers.includes(puzzle.get([x, y]))
                                : markup[y][x].some(i => highlightNumbers.includes(i))
                        },

                        onClick: evt => {
                            if (puzzle.solids.some(Sudoku.vertexEquals([x, y])))
                                return

                            evt.vertex = [x, y]
                            onCellClick(evt)
                        },
                        onMouseEnter: () => {
                            this.highlightId = setTimeout(() => {
                                let number = puzzle.get([x, y])

                                this.setState({
                                    highlightNumbers: number == null ? markup[y][x] : [number]
                                })
                            }, 1000)
                        },
                        onMouseLeave: () => {
                            clearTimeout(this.highlightId)
                            this.setState({highlightNumbers: []})
                        }
                    },
                    puzzle.get([x, y]) != null
                    ? h('div', {class: 'number'}, puzzle.get([x, y]))
                    : h('ul', {class: 'markup'},
                        [...Array(9)].map((_, i) => i + 1).map(i => h('li', {
                            class: {
                                'excluded': !markup[y][x].includes(i)
                            }
                        }, i))
                    )
                ))
            ))
        )
    }
}

module.exports = SudokuGrid
