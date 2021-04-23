import config from "../../config";
import GlobalComponent from "../GlobalComponent";

export default class Img extends GlobalComponent {
  update() {

    let noImage = "/static/images/index.jpeg"
    let hasImage = this.props.src? true: false
    
    let image = noImage
    
    if (hasImage) {
      if (this.props.media) {
        image = config.mediaPath + this.props.src
      } else if (this.props.static) {
        image = config.staticPath + this.props.src 
      } else {
        image = this.props.src
      }
    }

    return (
      <img 
        src={image}
        alt={this.props.alt}
        title={this.props.title}
        rel={this.props.rel}
        height={this.props.height}
        width={this.props.width}
        className={this.props.className}
        style={this.props.style}
      />
    ) 
  }
}