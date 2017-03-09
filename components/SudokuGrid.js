const {h, Component} = require('preact')
const Sudoku = require('../datatypes/sudoku')

class SudokuGrid extends Component {
    render({sudoku}) {
        let contradiction = sudoku.getContradiction()
        let markup = sudoku.getTrivialMarkup()

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
                    sudoku.arrangement[[x, y]] != null
                    ? h('div', {class: 'number'}, sudoku.arrangement[[x, y]])
                    : h('ul', {class: 'markup'},
                        [...Array(9)].map((_, i) => i + 1).map(i => h('li', {
                            class: {
                                'excluded': !markup[[x, y]].includes(i)
                                    || sudoku.excluded[[x, y]].includes(i)
                            }
                        }, i))
                    )
                ))
            ))
        )
    }
}

module.exports = SudokuGrid
