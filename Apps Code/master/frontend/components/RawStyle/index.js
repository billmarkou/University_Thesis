 
export default class RawStyle extends React.Component{
  quickMinCss(incss) {
    incss = incss.replace(/(^\s*)|(\s*$)/gm, '').replace(/\r|\n/gm, '').replace(/\s+/gm, " ");
    return incss;
  }

  render(){ 
    if (!this.props.children) return null
    let html = this.quickMinCss(this.props.children)
    return (
      <style   
        type="text/css"  
        dangerouslySetInnerHTML={ { __html: html } }>
      </style>
    );
  }

}