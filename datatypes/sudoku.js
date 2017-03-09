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
                    if (equals(v)(w) || this.arrangement[v] !== this.arrangement[w])
                        continue

                    return [v, w]
                }
            }
        }

        return null
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

    solve() {
        let emptyVertices = grid.filter(v => this.arrangement[v] == null)
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

Sudoku.generatePuzzle = function() {
    let puzzle = new Sudoku().solve()
    let i = 0

    for (let vertex of grid) {
        let number = puzzle.arrangement[vertex]
        let boxes = puzzle.getBoxes(vertex)
        let feasible = true

        if (boxes.some(box => box.filter(v => puzzle.arrangement[v] != null).length < 4)) {
            feasible = false
        }

        if (!feasible) continue

        for (let n = 1; n <= 9; n++) {
            if (n === number) continue
            puzzle.arrangement[vertex] = n

            if (puzzle.solve() != null) {
                feasible = false
                break
            }
        }

        if (feasible) i++
        puzzle.arrangement[vertex] = feasible ? null : number

        console.log(vertex, feasible, i)
        if (i >= 50) break
    }

    return puzzle
}

module.exports = Sudoku
