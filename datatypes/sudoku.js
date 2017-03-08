class Sudoku {
    constructor() {
        this.arrangement = [...Array(9)].map(_ => [...Array(9)].map(__ => []))
        this.excluded = [...Array(9)].map(_ => [...Array(9)].map(__ => []))
        this.solids = []
    }

    getBoxes() {
        let tuples = arr => arr.map(x => arr.map(y => [x, y])).reduce((sum, x) => [...sum, ...x], [])

        return [
            // Rows
            ...[...Array(9)].map((_, i) => [...Array(9)].map((__, j) => [i, j])),
            // Columns
            ...[...Array(9)].map((_, i) => [...Array(9)].map((__, j) => [j, i])),
            // Squares
            ...tuples([0, 3, 6]).map(([tx, ty]) =>
                [...Array(3)].map((_, i) => [...Array(3)].map((__, j) => [i + ty, j + tx]))
            )
        ]
    }
}

exports.module = Sudoku
