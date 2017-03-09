let {generatePuzzle} = require('../datatypes/sudoku')

let {arrangement, solids} = generatePuzzle({
    onProgress: percent => {
        self.postMessage({
            inProgress: true,
            percent,
            puzzle: null
        })
    }
})

self.postMessage({
    inProgress: false,
    percent: 1,
    puzzle: [arrangement, solids]
})
