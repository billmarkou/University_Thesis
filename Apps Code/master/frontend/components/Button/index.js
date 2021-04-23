import css from './styles.scss'
import css_green from './styles_green.scss'

export default class Button extends React.Component {

  static types = {
    default: '0',
    green: '1'
  }

  get css() {

    let type = this.props.type

    if (!type || type == Button.types.default) {
      return css
    } else if (type == Button.types.green) {
      return css_green
    }

  }

  handleClick() { 
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render() { 
    return (
      <div className={`${this.css.wrapper} ${this.props.className}`}>
        <button className={this.css.button} onClick={this.handleClick.bind(this)}>
          {this.props.children}
        </button>
      </div>
    )
  }
}

