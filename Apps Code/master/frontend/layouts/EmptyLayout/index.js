import "./global_styles.css"
import GlobalStateContext from "../../components/GlobalStateContext"
import Head from "next/head"
import RawStyle from "../../components/RawStyle"
export default class EmptyLayout extends React.Component {

  state = {
    globalState: this.props.initialData, 
  }

  async setGlobal(newState) {
    let myNewState = newState || {}
    
    let newGlobalState = {
      ...this.state.globalState,
      ...myNewState
    }

    return await this.setState({
      globalState: newGlobalState
    })
  }
 

  render() {

    let message = {
      global: this.state.globalState,
      setGlobal: this.setGlobal.bind(this)
    } 

    return (
      <GlobalStateContext.Provider value={message}> 
        {this.props.children}
      </GlobalStateContext.Provider>
    )
  }
}