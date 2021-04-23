import css from "./styles.scss";

export default class IntegerField extends React.Component {

  get min() {
    return this.props.min || 0
  }

  get max() {
    return this.props.max || 10000
  }

  handleChange(newValue) {

    let value = newValue.target.value
    if (this.max  < parseInt(value)) {
      return
    }
    if (this.min > parseInt(value)) {
      return
    }
    if (this.props.onChange) {
      this.props.onChange(value)
    }
  }

  render() {
    return (
      <input 
        className={css.input}
        type="number"
        value={this.props.value}
        onChange={this.handleChange.bind(this)}  /> 
    )
  }
}