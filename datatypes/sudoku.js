let range = n => [...Array(n)].map((_, i) => i)
let makeTuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let hasDuplicates = arr => arr.sort().some((x, i) => i > 0 && x != null && arr[i - 1] === x)
let random = n => Math.floor(Math.random() * n)
let swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]], arr)
let shuffle = arr => (range(arr.length).map(i => arr.length - i).forEach(i => swap(arr, i - 1, random(i))), arr)

let _grid = makeTuples(range(9))
let _boxes = [
    // Rows
    ...range(9).map(i => range(9).map(j => [i, j])),
    // Columns
    ...range(9).map(i => range(9).map(j => [j, i])),
    // Squares
    ...makeTuples([0, 3, 6]).map(([tx, ty]) =>
        makeTuples(range(3)).map(([i, j]) => [i + ty, j + tx])
    )
]

class Sudoku {
    constructor(arrangement = {}) {
        this.arrangement = {}
        this.excluded = {}
        this.solids = []

        for (let v of _grid) {
            this.arrangement[v] = arrangement[v] || null
            this.excluded[v] = []
        }
    }

    clone() {
        let puzzle = new Sudoku(this.arrangement)
        puzzle.solids = this.solids
        return puzzle
    }

    hasContradictions(box) {
        if (box != null) return hasDuplicates(box.map(v => this.arrangement[v]))
        return this.getBoxes().some(this.hasContradictions.bind(this))
    }

    getContradiction() {
        for (let box of this.getBoxes()) {
            for (let v of box) {
                if (this.arrangement[v] == null) continue

                for (let w of box) {
                    if (Sudoku.vertexEquals(v)(w) || this.arrangement[v] !== this.arrangement[w])
                        continue

                    return [v, w]
                }
            }
        }

        return []
    }

    getBoxes(vertex) {
        if (!vertex) return _boxes
        return _boxes.filter(box => box.some(Sudoku.vertexEquals(vertex)))
    }

    getTrivialMarkup() {
        let result = {}

        for (let v of _grid) {
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

    solve() {
        let noEmptyVertices = true

        for (let vertex of _grid) {
            if (this.arrangement[vertex] != null) continue

            let neighbor = this.clone()
            noEmptyVertices = false

            for (let number of shuffle(range(9).map(i => i + 1))) {
                neighbor.arrangement[vertex] = number
                if (neighbor.hasContradictions()) continue

                let result = neighbor.solve()
                if (result != null) return result

                neighbor.arrangement[vertex] = null
            }

            return null
        }

        if (noEmptyVertices)
            return this

        return null
    }
}

Sudoku.vertexEquals = v => w => v[0] === w[0] && v[1] === w[1]

Sudoku.generatePuzzle = function(options = {}) {
    let {timeout = 2000, sparsity = 3, givens = 31} = options
    let puzzle = new Sudoku().solve()
    let notEmpty = v => puzzle.arrangement[v] != null
    let startTime = Date.now()
    let i = 0

    for (let vertex of shuffle([..._grid])) {
        let number = puzzle.arrangement[vertex]
        let boxes = puzzle.getBoxes(vertex)
        let feasible = boxes.some(box => box.filter(notEmpty).length === 9)

        if (boxes.some(box => box.filter(notEmpty).length <= sparsity))
            continue

        if (!feasible) {
            // Check for multiple solutions

            feasible = true

            for (let n = 1; n <= 9; n++) {
                if (n === number) continue
                puzzle.arrangement[vertex] = n

                if (Date.now() - startTime > timeout || puzzle.solve() != null) {
                    feasible = false
                    break
                }
            }
        }

        puzzle.arrangement[vertex] = feasible ? null : number

        if (feasible) i++
        console.log(vertex, feasible, i)
        if (i >= 81 - givens) break
    }

    puzzle.solids = _grid.filter(v => puzzle.arrangement[v] != null)

    return puzzle
}

module.exports = Sudoku
