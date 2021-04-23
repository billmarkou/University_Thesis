import $ from 'jquery'
import css from "./styles.scss"

export default class OpenFileDialog extends React.Component {

  show() {
    $(this.input).trigger("click")
  }

  handleChange(e) { 
    if (this.props.onChange) {
      this.props.onChange(e.target.files[0])
    }
  }

  render() {
    return (
      <div className={css.wrapper}>
        <input 
          className={css.input} 
          onChange={this.handleChange.bind(this)} 
          accept={this.props.filter} 
          type="file" 
          ref={r => this.input = r} />
      </div>
    )
  }
}