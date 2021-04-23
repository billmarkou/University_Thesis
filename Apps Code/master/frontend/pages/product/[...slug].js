import Button from "../../components/Button"
import GlobalStateContext from "../../components/GlobalStateContext"
import Img from "../../components/Img"
import Squeezer from "../../components/Squeezer"
import TopMenu from "../../components/TopMenu"
import pageContext from "../../core/page-context"
import Request from "../../core/request"
import BasicLayout from "../../layouts/BasicLayout"
import css from "./styles.scss"
import { storageSave, storageLoad } from "../../core/local-storage"
import isomorphicRedirect from "../../core/isomorphic-redirect"

export default class Products extends React.Component {

  static async getInitialProps(ctx) {
    const request = new Request(ctx.req)

    let initialPageData = await pageContext(ctx)
    let productId = ctx.query.slug[0]

    let product = await request.fetch("GET", '/api/product/get_one', {
      id: productId
    })

    return {
      initialPageData,
      product
    }

  }

  async handleAddToCart() { 
    const request = new Request()

    const response = await request.fetch("GET", "/api/cart/add/", {
      product: this.props.product._id
    })

    if (response == "ok") {
      isomorphicRedirect("/cart")
    } else if (response == "overflow") {
      alert("Δεν υπάρχει δοαθέσιμο απόθεμα")
    } else {  
      alert("Σφάλμα")
    }

  }

  renderInfo() {
    return (
      <React.Fragment>
        <Img
          media
          className={css.img}
          src={this.props.product.image}
          alt={"no image"}
        />

        <div className={css.price}>
          Τιμή: {this.props.product.price}&euro;
        </div>
      </React.Fragment>
    )
  }

  renderDetails() {
    return (
      <React.Fragment>
        <div className={css.title}>
          {this.props.product.name}
        </div>

        <div>
          Κατηγορία: {this.props.product.category.name}
        </div>

        <div className={css.description}>
          {this.props.product.description}
        </div>

        <div>
          <Button className={css.order_button} onClick={this.handleAddToCart.bind(this)}>
            Προσθήκη στο καλάθι
          </Button> 
        </div>

      </React.Fragment>
    )
  }

  renderPage() { 

    return (
      <React.Fragment>
        <TopMenu />

        <Squeezer className={css.main_layout}>
          <div className={css.layout_left}>
            {this.renderInfo()}
          </div>
          <div className={css.layout_col}>
            {this.renderDetails()}
          </div>
        </Squeezer>
      </React.Fragment>
      // <div className={css.container}>

      //   <p className={css.code}>
      //     Product's code :
      //     {" " + this.props.product.code}
      //   </p>
      //   <p className={css.pos}>
      //     Product's position :
      //     {" " + this.props.product.position}
      //   </p>
      //   <p className={css.quan}>
      //     Products left :
      //     {" " + this.props.product.quantity}
      //   </p>
      //   <p className={css.categ}>
      //     Product's category :
      //     {" " + this.props.product.category.name}
      //   </p>
      //   <Img 
      //     media
      //     className={css.img}
      //     src={image}
      //     alt={"no image"}
      //   />
      //   <p className={css.name}>
      //     Product's name : {this.props.product.name}
      //   </p>
      //   <p className={css.desc}>
      //     Product's description : {this.props.product.description}
      //   </p>
      // </div>
    )
  }



  render() {
    return (
      <BasicLayout initialData={this.props.initialPageData}>

        <GlobalStateContext.Consumer>

          {message => {
            this.context = message
            return this.renderPage()
          }}

        </GlobalStateContext.Consumer>


      </BasicLayout>
    )
  }
}