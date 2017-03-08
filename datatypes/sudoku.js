let range = n => [...Array(n)].map((_, i) => i)
let tuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let grid = tuples(range(9))

class Sudoku {
    constructor() {
        this.arrangement = {}
        this.excluded = {}
        this.solids = {}

        for (let [x, y] of grid) {
            this.arrangement[[x, y]] = null
            this.excluded[[x, y]] = []
            this.solids[[x, y]] = null
        }
    }

    getBoxes(vertex = null) {
        return [
            // Rows
            ...range(9).map(i => range(9).map(j => [i, j])),
            // Columns
            ...range(9).map(i => range(9).map(j => [j, i])),
            // Squares
            ...tuples([0, 3, 6]).map(([tx, ty]) =>
                range(3).map(i => range(3).map(j => [i + ty, j + tx]))
            )
        ].filter(box => !vertex || box.some(v => v[0] == vertex[0] && v[1] == vertex[1]))
    }

    getTrivialMarkup() {
        let result = {}

        for (let [x, y] of grid) {
            result[[x, y]] = range(9).map(i => i + 1)

            for (let box of this.getBoxes([x, y])) {
                for (let [bx, by] of box) {
                    let index = result[[x, y]].indexOf(this.arrangement[[bx, by]])
                    if (index >= 0) result[[x, y]].splice(index, 1)
                }
            }
        }

        return result
    }
}

exports.module = Sudoku
