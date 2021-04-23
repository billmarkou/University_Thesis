export default class TextArea extends React.Component {

  handleChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
    }
  }

  render() {
    return (
      <div >
        <textarea
          cols = {this.props.cols}
          rows = {this.props.rows}
          onChange={this.handleChange.bind(this)}
          value={this.props.value}
        />
      </div>
    )
  }
}