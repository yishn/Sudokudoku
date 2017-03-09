const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

class SudokuGrid extends Component {
    render({sudoku}) {
        let contradiction = sudoku.getContradiction()

        return h('section', {id: 'sudoku-grid'},
            [...Array(9)].map((_, y) => h('ol', {},
                [...Array(9)].map((__, x) => h('li',
                    {
                        class: {
                            [`pos-${x}-${y}`]: true,
                            'solid': sudoku.solids.some(Sudoku.vertexEquals([x, y])),
                            'contradiction': contradiction.some(Sudoku.vertexEquals([x, y]))
                        }
                    },
                    h('div', {}, sudoku.arrangement[[x, y]])
                ))
            ))
        )
    }
}

module.exports = SudokuGrid
