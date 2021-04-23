import { from } from "form-data"

import css from "./styles.scss"

export default class Label extends React.Component {

  render(){
    return(
      <div>
        <div className={`${css.label} ${this.props.className}`}> 
          {this.props.children} 
        </div>
      </div>
    )
  }
}