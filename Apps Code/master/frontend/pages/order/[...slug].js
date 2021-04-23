import GlobalStateContext from "../../components/GlobalStateContext"
import pageContext from "../../core/page-context"
import Request from "../../core/request"
import BasicLayout from "../../layouts/BasicLayout"
import Product from "../../components/Product"
import css from "./styles.scss"
import Button from "../../components/Button"
import GlobalComponent from "../../components/GlobalComponent"
import isomorphicRedirect from "../../core/isomorphic-redirect"
import Moment from "moment"

export default class Order extends GlobalComponent {

  static async getInitialProps(ctx) {
    const request = new Request(ctx.req)

    let initialPageData = await pageContext(ctx)
    let orderId = ctx.query.slug[0]

    let order = await request.fetch("GET", '/api/order/get_one', {
      id: orderId
    })

    return {
      initialPageData,
      order
    }
  }

  state = { 
    order : this.props.order, 
  }

  renderHandleButton() { 
    var comp;
    if (this.state.order.state  == "open") {
      comp =
        <Button onClick = {this.buttonHandle.bind(this)}>
          Handle
      </Button>

    } else if (this.state.order.state == "in_progres" && this.props.order.executives_Id == this.state.userId) {
      comp =
        <Button onClick = {this.buttonClose.bind(this)}>
          Close
      </Button>
    } else {
      comp = null
    }
    return comp
  }


 async  buttonHandle(){
    let request = new Request()
    let result = await request.fetch("PUT", "/api/order/handle_order/", {
      orderId: this.props.order._id,
      state: "in_progres"
    })

    this.state.order.state = "in_progres"

    this.setState({order: this.state.order}) 
    
    isomorphicRedirect(`/order/${this.props.url.query.slug[0]}`)
    
  }

  async buttonClose(){
    let request = new Request()
    let result = await request.fetch("PUT", "/api/order/handle_order/", {
      orderId: this.props.order._id,
      state: "closed"
    })

    this.state.order.state = "closed"

    this.setState({order: this.state.order}) 

    isomorphicRedirect("/orders")
  }



  update() { 
    console.log(this.props)
    return (
      <div className={css.container}>
        <div className={css.code}>
          Code :
          {" " + this.props.order.code}
        </div>
        <div className={css.type}>
          Type :
          {" " + this.props.order.order_type}
        </div>
        <div className={css.state}>
          State :
          {" " + this.state.order.state}
        </div>
        <div className={css.dateS}>
          Date of start :
          {" " + Moment(this.props.order.date_of_start).format("DD/MM/YYYY HH:mm")}
        </div>
        <div className={css.dateE}>
          Date of end :
          {this.props.order.date_of_end ? " " + Moment(this.props.order.date_of_end).format("DD/MM/YYYY HH:mm") : ""}
        </div>
        <div className={css.pId}>
          Publisher's ID :
          {" " + this.props.order.publisher_id}
        </div>
        <div className={css.eId}>
          Executive's ID :
          {this.props.order.executive_id?.id? this.props.order.executive_id.username + " with id "+ this.props.order.executive_id.id : " Not yet handled" }
        </div>
        <div className={css.prod}>
          {
            this.props.order.products.map(
              (product) => {

                return (
                  <div>
                    <div>
                      {product.quantity} x
                    </div>
                    <Product product={product.product_id}></Product>
                  </div>

                )
              }
            )
          }
        </div>
        <div className = {css.b}>
          {this.renderHandleButton()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <BasicLayout initialData={this.props.initialPageData}>
        {super.render()} 
      </BasicLayout>
    )
  }
}

