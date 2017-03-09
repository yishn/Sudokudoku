const {h, Component} = require('preact')

class CellEditor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            excluded: props.excluded || []
        }
    }

    render({position: [left, top], show = false, onSubmit = () => {}}, {excluded}) {
        return h('section',
            {
                id: 'cell-editor',
                class: {show},

                onClick: () => onSubmit({data: this.state.excluded})
            },
            h('section', {class: 'inner', style: {left, top}},
                h('ul', {},
                    [...Array(9)].map((_, i) => i + 1).map(i => h('li', {
                        class: {'excluded': excluded.includes(i)},
                        
                        onClick: evt => {
                            evt.stopPropagation()

                            this.setState(state => ({
                                excluded: state.excluded.includes(i)
                                    ? state.excluded.filter(x => x != i)
                                    : [...state.excluded, i]
                            }))
                        }
                    }, i))
                )
            )
        )
    }
}

module.exports = CellEditor
