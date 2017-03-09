let range = n => [...Array(n)].map((_, i) => i)
let makeTuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let hasDuplicates = arr => arr.sort().some((x, i) => i > 0 && arr[i - 1] === x)
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
        return new Sudoku(this.arrangement)
    }

    hasContradictions() {
        return this.getBoxes().some(box =>
            hasDuplicates(box.map(v => this.arrangement[v]).filter(x => x != null))
        )
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
        return _boxes.filter(box => !vertex || box.some(Sudoku.vertexEquals(vertex)))
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
        let emptyVertices = _grid.filter(v => this.arrangement[v] == null)
        if (emptyVertices.length == 0 && !this.hasContradictions()) return this

        for (let vertex of emptyVertices) {
            let neighbor = this.clone()

            for (let number of shuffle(range(9).map(i => i + 1))) {
                neighbor.arrangement[vertex] = number
                if (neighbor.hasContradictions()) continue

                let result = neighbor.solve()
                if (result != null) return result

                neighbor.arrangement[vertex] = null
            }

            return null
        }

        return null
    }
}

Sudoku.vertexEquals = v => w => v[0] === w[0] && v[1] === w[1]

Sudoku.generatePuzzle = function(options = {}) {
    let {timeout = 2000, sparsity = 3, maximum = 50} = options
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
        if (i >= maximum) break
    }

    puzzle.solids = _grid.filter(v => puzzle.arrangement[v] != null)

    return puzzle
}

module.exports = Sudoku
