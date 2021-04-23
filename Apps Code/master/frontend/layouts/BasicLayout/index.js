 
import EmptyLayout from "../EmptyLayout"; 

export default class BasicLayout extends React.Component {
  render() {
    return (
      <EmptyLayout initialData={this.props.initialData}> 
        
        {this.props.children}
      </EmptyLayout>
    )
  }
}