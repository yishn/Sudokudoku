const {h, Component} = require('preact')
const SudokuGrid = require('./SudokuGrid')

class App extends Component {
    render() {
        return h(SudokuGrid, {

        })
    }
}

module.exports = App
