import Select from "react-select"
import Request from "../../core/request"

export default class SearchField extends React.Component {

  state = {
    results: [],
    loading: false,  
  }

  timeout = null

  handleInputChange(text) {
      
    this.setState({
      loading: true
    })
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      
      this.timeout = null
      
      this.search(text)

    }, 300);

    return text
  }

  async search(text) {
    let results = []

    if (this.props.onSearch && text) { 
      results = await this.props.onSearch(text) 
    }

    this.setState({
      results: results,
      loading: false
    }) 
  }

  handleChange(e){
    this.setState({
      loading: false
    }) 

    if (this.props.onChange)  {
      this.props.onChange(e)
    }
  }

  render() {
    return (
      <Select   
        value={this.props.value}
        options={this.state.results}
        isLoading={this.state.loading}
        onInputChange={this.handleInputChange.bind(this)} 
        onChange={this.handleChange.bind(this)}
        onSelectResetsInput={false} 
        
        onBlurResetsInput={false}
      />
    )  
  }
}