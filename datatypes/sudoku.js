let range = n => [...Array(n)].map((_, i) => i)
let makeTuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let hasDuplicates = arr => arr.sort().some((x, i) => i > 0 && arr[i - 1] === x)
let equals = v => w => v[0] === w[0] && v[1] === w[1]
let random = n => Math.floor(Math.random() * n)
let swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]])
let shuffle = arr => (range(arr.length).map(i => arr.length - i).forEach(i => swap(arr, i - 1, random(i))), arr)
let grid = makeTuples(range(9))

class Sudoku {
    constructor(arrangement = {}) {
        this.arrangement = {}
        this.excluded = {}
        this.solids = []

        for (let v of grid) {
            this.arrangement[v] = arrangement[v] || null
            this.excluded[v] = []
        }
    }

    clone() {
        return new Sudoku(this.arrangement)
    }

    isValid() {
        return this.getBoxes().every(box =>
            !hasDuplicates(box.map(v => this.arrangement[v]).filter(x => x != null))
        )
    }

    getBoxes(vertex = null) {
        return [
            // Rows
            ...range(9).map(i => range(9).map(j => [i, j])),
            // Columns
            ...range(9).map(i => range(9).map(j => [j, i])),
            // Squares
            ...makeTuples([0, 3, 6]).map(([tx, ty]) =>
                makeTuples(range(3)).map(([i, j]) => [i + ty, j + tx])
            )
        ].filter(box => !vertex || box.some(equals(vertex)))
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

    toString() {
        return JSON.stringify(this.arrangement)
    }
}

Sudoku.generateRandomSolution = function(sudoku = null) {
    if (sudoku == null) sudoku = new Sudoku()

    let emptyVertices = grid.filter(v => sudoku.arrangement[v] == null)
    if (emptyVertices.length == 0) return sudoku

    for (let vertex of emptyVertices) {
        let neighbor = sudoku.clone()
        let shuffled = shuffle(range(9).map(i => i + 1))

        for (let number of shuffled) {
            neighbor.arrangement[vertex] = number
            if (!neighbor.isValid()) continue

            let result = Sudoku.generateRandomSolution(neighbor)
            if (result != null) return result

            neighbor.arrangement[vertex] = null
        }

        return null
    }

    return null
}

module.exports = Sudoku
