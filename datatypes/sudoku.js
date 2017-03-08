let range = n => [...Array(n)].map((_, i) => i)
let tuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let hasDuplicates = arr => [...arr].sort().some((x, i) => i === 0 || arr[i - 1] === x)
let equals = v => w => v[0] === w[0] && v[1] === w[1]
let grid = tuples(range(9))

class Sudoku {
    constructor() {
        this.arrangement = {}
        this.excluded = {}
        this.solids = {}

        for (let v of grid) {
            this.arrangement[v] = null
            this.excluded[v] = []
            this.solids[v] = null
        }
    }

    isValid() {
        return this.getBoxes().every(box =>
            box.map(v => !hasDuplicates(this.arrangement[v].filter(x => x !== null)))
        )
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
        ].filter(box => !vertex || box.some(equals(vertex))
    }

    getTrivialMarkup() {
        let result = {}

        for (let v of grid) {
            result[v] = range(9).map(i => i + 1)

            for (let box of this.getBoxes(v)) {
                for (let w of box) {
                    let index = result[v].indexOf(this.arrangement[w])
                    if (index >= 0) result[v].splice(index, 1)
                }
            }
        }

        return result
    }
}

exports.module = Sudoku
