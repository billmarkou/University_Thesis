
export default class TestListComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      textBoxValue: "",
      listValue: []
    }
  }

  handleAdd() {
    let newValue = this.state.textBoxValue;
    let newListValue = this.state.listValue;

    newListValue.push(newValue);

    this.setState({
      listValue: newListValue,
      textBoxValue: ""
    })
  }

  handleInputChange(event) {
    let newValue = event.target.value;
    this.setState({
      textBoxValue: newValue
    })
  }

  renderTextBoxAndButton() {
    return (
      <div>
        <input
          value={this.state.textBoxValue}
          onChange={this.handleInputChange.bind(this)} />

        <button onClick={this.handleAdd.bind(this)}> add </button>
      </div>
    )
  }

  renderList() {
    return (
      <div>
        {
          this.state.listValue.map(item => {
            return (
              <div>
                {item}
              </div>
            )
          })
        }
        <div>
          {this.props.x + this.props.y}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        { this.renderList() }
        { this.renderTextBoxAndButton() }
      </div>
    )
  }

}
