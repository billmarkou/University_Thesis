import GlobalStateContext from "../GlobalStateContext";
import _ from 'lodash'


export default class GlobalComponent extends React.Component { 
    static contextType = GlobalStateContext;

    constructor(...props) {
        super(...props);
        if (this.context) {
            this.global = this.context.global
            this.setGlobal = this.context.setGlobal
        }
    }
   
    update() { }

    render() { 
        return (
            <GlobalStateContext.Consumer>
                {(message)=>{
                    this.global = message.global
                    this.setGlobal = message.setGlobal
                    return this.update()   
                }}
            </GlobalStateContext.Consumer>
        ) 
    }
    
}