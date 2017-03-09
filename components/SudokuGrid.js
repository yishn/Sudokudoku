const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

class SudokuGrid extends Component {
    render({puzzle, onCellClick = () => {}}) {
        let contradiction = puzzle.getContradiction()
        let markup = puzzle.getTrivialMarkup()

        return h('section', {id: 'sudoku-grid'},
            [...Array(9)].map((_, y) => h('ol', {},
                [...Array(9)].map((__, x) => h('li',
                    {
                        class: {
                            [`pos-${x}-${y}`]: true,
                            'solid': puzzle.solids.some(Sudoku.vertexEquals([x, y])),
                            'contradiction': contradiction.some(Sudoku.vertexEquals([x, y]))
                        }
                    },
                    puzzle.get([x, y]) != null
                    ? h('div', {class: 'number'}, puzzle.get([x, y]))
                    : h('ul',
                        {
                            class: 'markup',

                            onClick: evt => {
                                evt.vertex = [x, y]
                                onCellClick(evt)
                            }
                        },
                        [...Array(9)].map((_, i) => i + 1).map(i => h('li', {
                            class: {
                                'excluded': !markup[y][x].includes(i)
                                    || puzzle.excluded[y][x].includes(i)
                            }
                        }, i))
                    )
                ))
            ))
        )
    }
}

module.exports = SudokuGrid
