class Sudoku {
    constructor() {
        this.arrangement = [...Array(9)].map(_ => Array(9).fill(null))
        this.solids = []
    }
}

exports.module = Sudoku
