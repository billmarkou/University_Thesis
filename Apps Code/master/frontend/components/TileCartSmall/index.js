import GlobalComponent from "../GlobalComponent"; 
import css from "./styles.scss" 

export default class TileCartSmall extends GlobalComponent {
  
  update() {
    return (
      <div className={css.tile}>  
           
          <div className={css.title}>
            {this.props.product.name}
          </div>  
          
          <div className={css.code}>
            Κωδικός: {this.props.product.code}
          </div>

          <div className={css.price}>
            Τιμή: <strong>{this.props.product.price}&euro;</strong>
          </div>

          <div className={css.amount}>
            Ποσότητα: {this.props.count}
          </div> 
      </div>
    )
  }
}