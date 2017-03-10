const {h, Component} = require('preact')

let texts = [
    'Loading Sudokudoku',
    'Generating puzzle',
    'Removing numbers',
    'This may take a while',
    'Adjusting difficulty',
    'Making puzzle extra difficult',
    'Just for you',
    'I hope you are ready',
    'It should be done soon',
    'Very soon',
    'I promise',
    'Just a little bit',
    'Here we go'
]

class Throbber extends Component {
    constructor() {
        super()

        this.state = {
            textCounter: 0,
            ellipsisCounter: 0
        }
    }

    componentDidMount() {
        this.textCounterId = setInterval(() => {
            this.setState(({textCounter}) => ({textCounter: Math.min(textCounter + 1, texts.length - 1)}))
        }, 3000)

        this.ellipsisCounterId = setInterval(() => {
            this.setState(({ellipsisCounter}) => ({ellipsisCounter: (ellipsisCounter + 1) % 4}))
        }, 750)
    }

    componentWillUnmount() {
        clearInterval(this.textCounterId)
        clearInterval(this.ellipsisCounterId)
    }

    render({progress}, {textCounter, ellipsisCounter}) {
        return h('section', {id: 'throbber'},
            h('div', {class: 'sk-cube-grid'},
                [...Array(9)].map((_, i) =>
                    h('div', {class: `sk-cube sk-cube${i + 1}`})
                )
            ),
            h('div', {class: 'progress'},
                h('div', {class: 'bar', style: {width: Math.round(progress * 100) + '%'}})
            ),
            h('p', {},
                h('span', {style: {visibility: 'hidden'}}, Array(ellipsisCounter).fill('.').join('')),
                texts[textCounter] + Array(ellipsisCounter).fill('.').join('')
            )
        )
    }
}

module.exports = Throbber
