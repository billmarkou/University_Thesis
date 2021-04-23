
import BasicLayout from '../../layouts/BasicLayout'
import pageContext from "../../core/page-context"
import GlobalComponent from '../../components/GlobalComponent';
import css from "./styles.scss"
import Request from "../../core/request"
import _ from "lodash"
import TopMenu from '../../components/TopMenu';
import Squeezer from '../../components/Squeezer';
import TileCart from '../../components/TileCart';
import Button from '../../components/Button';

import Link from 'next/link'

export default class Cart extends GlobalComponent {

  static async getInitialProps(ctx) {
    let initialContext = await pageContext(ctx);

    const request = new Request(ctx.req)


    let cartContents = await request.fetch("GET", "/api/cart/get/")


    return {
      initialContext,
      cartContents
    }
  }

  state = {
    cartContents: this.props.cartContents || []
  }

  async fetchContents() {
    const request = new Request()
    const contents = await request.fetch("GET", "/api/cart/get")

    return contents
  }

  async handleAmmountChange(_id, amount, maxAmount) {
    const request = new Request()

    if (amount == 0) return
    if (amount > maxAmount) {
      amount = maxAmount
    }


    await request.fetch("GET", "/api/cart/set_amount", {
      product: _id,
      amount: amount
    })


    await this.setState({
      cartContents: await this.fetchContents()
    })
  }

  async handleDelete(_id) {
    const request = new Request()

    await request.fetch("GET", "/api/cart/remove_all", {
      product: _id
    })

    await this.setState({
      cartContents: await this.fetchContents()
    })
  }

  update() {
    return (
      <React.Fragment>
        <TopMenu />

        <Squeezer className={css.contents}>
          <div className={css.title}>
            Καλάθι αγορών
          </div>

          {
            this.state.cartContents.map((item) => {
              return (
                <TileCart
                  product={item.product}
                  count={item.amount}
                  onAmountChange={async (amount) => await this.handleAmmountChange(item.product._id, amount, item.product.quantity)}
                  onDelete={async () => this.handleDelete(item.product._id)}
                />
              )
            })
          }
          {
            this.state.cartContents.length != 0 && (
              <div>
                <Link href={"/checkout"}>
                  <a>
                    <Button>
                      Ολοκλήρωση παραγγελίας
                    </Button>
                  </a>
                </Link>
              </div>
            )
          }
        </Squeezer>
      </React.Fragment>
    )
  }

  render() {
    return (
      <BasicLayout initialData={this.props.initialContext}>
        {super.render()}
      </BasicLayout>
    )
  }
}