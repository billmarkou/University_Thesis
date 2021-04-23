import css from "./styles.scss"
import Button from "../Button"
import GlobalStateContext from "../GlobalStateContext"
import Label from "../Label"
import Link from "next/link"
import Request from "../../core/request"
import isomorphicRedirect from "../../core/isomorphic-redirect"

import Cookies from "js-cookie";
export default class SidebarMenu extends React.Component {
  static contextType = GlobalStateContext

  renderNewOrder() {
    var comp
    this.context.global.user.job_placement == "storekeeper" ?
      comp = (<Link
        href="/new-order"
      >
        <a>
          <Button className={css.item}>
            NEW ORDER
          </Button>
        </a>
      </Link>) : null
    return (comp)
  }

  renderNewProduct(){
    var comp 
    this.context.global.user.job_placement == "storekeeper" ?
    comp = (<Link
      href="/new-product"
    >
      <a>
        <Button className={css.item}>
          NEW PRODUCT
        </Button>
      </a>
    </Link>) : null
  return (comp)
  }

  async logout() {
    let req = await new Request().fetch("GET", "/api/user/logout/");
    
    Cookies.remove("authToken")

    isomorphicRedirect("/")
  }

  render() {

    return (
      <div className={`${css.menu_panel} ${this.props.className}`}>
        <div className={css.user_panel}>
          <Label className={css.item}>
            {this.context.global.user.name}
          </Label>
          <Label className={css.item}>
            {this.context.global.user.surname}
          </Label>
          <Link
            href={{
              pathname: "/orders/[slug]",
              query: { slug: '1' }
            }}
          >
            <a>
              <Button
                className={css.item}>
                ORDERS
              </Button>
            </a>
          </Link>
          {this.renderNewOrder()}
          <Link
            href={{
              pathname: "/products/[slug]",
              query: { slug: '1' }
            }}
          >
            <a>
              <Button className={css.item}>
                PRODUCTS
           </Button>
            </a>
          </Link>
          {this.renderNewProduct()}
        </div>
        <div className={css.nav_panel}>

          <Button onClick={this.logout.bind(this)} className={css.item}>
            SIGN OUT
          </Button>
        </div>
      </div>
    )
  }

}