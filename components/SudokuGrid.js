const {h, Component} = require('preact')

class SudokuGrid extends Component {
    render({sudoku}) {
        return h('section', {id: 'sudoku-grid'},
            [...Array(9)].map((_, y) => h('ol', {},
                [...Array(9)].map((__, x) => h('li',
                    {
                        class: {
                            [`pos-${x}-${y}`]: true,
                            'solid': sudoku.solids.some(v => v[0] === x && v[1] === y)
                        }
                    },
                    h('div', {}, sudoku.arrangement[[x, y]])
                ))
            ))
        )
    }
}

module.exports = SudokuGrid
