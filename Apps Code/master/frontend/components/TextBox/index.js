import css from "./styles.scss"
export default class TextBox extends React.Component {

  handleChange(e) {

    if (this.props.numeric && /\D/g.test(e.target.value)) return;

    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }
  }

  handleBlur() {
    if (this.props.onBlur) {
      this.props.onBlur()
    }
  }

  render() {
    return (
      <div className={this.props.className}>
        <input
          className={css.tb}
          onChange={this.handleChange.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          type={this.props.type}
          value={this.props.value}
        />
      </div>
    )
  }
}