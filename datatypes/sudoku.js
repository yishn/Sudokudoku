let range = n => [...Array(n)].map((_, i) => i)
let makeTuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])
let hasDuplicates = arr => arr.sort().some((x, i) => i > 0 && x != null && arr[i - 1] === x)
let random = n => Math.floor(Math.random() * n)
let swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]], arr)
let shuffle = arr => (arr.forEach((_, i) => swap(arr, arr.length - i - 1, random(arr.length - i))), arr)

let range9 = range(9)
let _grid = makeTuples(range9)
let _boxes = [
    // Rows
    ...range9.map(i => range9.map(j => [i, j])),
    // Columns
    ...range9.map(i => range9.map(j => [j, i])),
    // Squares
    ...makeTuples([0, 3, 6]).map(([tx, ty]) =>
        makeTuples(range(3)).map(([i, j]) => [i + ty, j + tx])
    )
]

class Sudoku {
    constructor(arrangement = null) {
        this.arrangement = []
        this.excluded = []
        this.solids = []

        for (let y = 0; y < 9; y++) {
            this.arrangement[y] = arrangement ? [...arrangement[y]] : Array(9).fill(null)
            this.excluded[y] = [...Array(9)].map(_ => [])
        }
    }

    set([x, y], number) {
        this.arrangement[y][x] = number
    }

    get([x, y]) {
        return this.arrangement[y][x]
    }

    clone() {
        let puzzle = new Sudoku(this.arrangement)
        puzzle.solids = this.solids
        return puzzle
    }

    hasContradictions(box) {
        if (box != null) return hasDuplicates(box.map(v => this.get(v)))
        return this.getBoxes().some(this.hasContradictions.bind(this))
    }

    getGrid() {
        return _grid
    }

    getContradiction() {
        for (let box of this.getBoxes()) {
            for (let v of box) {
                if (this.get(v) == null) continue

                for (let w of box) {
                    if (Sudoku.vertexEquals(v)(w) || this.get(v) !== this.get(w))
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
        let result = [...Array(9)].map(_ => Array(9).fill(null))

        for (let [x, y] of this.getGrid()) {
            result[y][x] = range9.map(i => i + 1)

            for (let box of this.getBoxes([x, y])) {
                for (let w of box) {
                    let index = result[y][x].indexOf(this.get(w))
                    if (index >= 0) result[y][x].splice(index, 1)
                }
            }

            if (this.get([x, y]) != null) {
                result[y][x].push(this.get([x, y]))
            }
        }

        return result
    }

    getCurrentMarkup() {
        let markup = this.getTrivialMarkup()

        for (let [x, y] of this.getGrid()) {
            markup[y][x] = markup[y][x].filter(i => !this.excluded[y][x].includes(i))
        }

        return markup
    }

    solve(options = {}) {
        let {timeout = Infinity, startTime = Date.now()} = options
        let noEmptyVertices = true

        for (let vertex of this.getGrid()) {
            if (this.get(vertex) != null) continue

            let neighbor = this.clone()
            noEmptyVertices = false

            for (let number of shuffle(range(9))) {
                neighbor.set(vertex, number + 1)
                if (neighbor.hasContradictions()) continue

                if (Date.now() - startTime > timeout)
                    throw new Error('Timeout')

                let result = neighbor.solve(options)
                if (result != null) return result

                neighbor.set(vertex, null)
            }

            return null
        }

        if (noEmptyVertices) return this
        return null
    }
}

Sudoku.vertexEquals = v => w => v[0] === w[0] && v[1] === w[1]

Sudoku.generatePuzzle = function(options = {}) {
    let {timeout = Infinity, givens = 0, onProgress = () => {}} = options
    let puzzle = new Sudoku().solve()
    let notEmpty = v => puzzle.get(v) != null
    let startTime = Date.now()
    let i = 0
    let n = 0

    for (let vertex of shuffle([...puzzle.getGrid()])) {
        let number = puzzle.get(vertex)
        let boxes = puzzle.getBoxes(vertex)
        let feasible = boxes.some(box => box.filter(notEmpty).length === 9)

        if (!feasible) {
            // Check for multiple solutions

            feasible = true

            for (let n of shuffle(range(9))) {
                if (n + 1 === number) continue
                puzzle.set(vertex, n + 1)

                try {
                    feasible = puzzle.solve({timeout: 1000}) == null
                } catch (err) {
                    feasible = false
                }

                if (!feasible || Date.now() - startTime > timeout) {
                    feasible = false
                    break
                }
            }
        }

        puzzle.set(vertex, feasible ? null : number)

        if (feasible) i++
        if (i >= 81 - givens) break

        onProgress(++n / puzzle.getGrid().length)
    }

    puzzle.solids = puzzle.getGrid().filter(v => puzzle.get(v) != null)

    return puzzle
}

Sudoku.parse = function(string) {
    let arr = [...string]
    let arrangement = [...Array(9)].map((_, i) =>
        arr.slice(i * 9, (i + 1) * 9).map(x => x === '.' ? null : +x)
    )

    let puzzle = new Sudoku()
    puzzle.arrangement = arrangement
    puzzle.solids = puzzle.getGrid().filter(v => puzzle.get(v) != null)

    return puzzle
}

module.exports = Sudoku
