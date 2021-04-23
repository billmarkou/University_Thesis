
import BasicLayout from '../layouts/BasicLayout'
import pageContext from "../core/page-context"
import GlobalStateContext from "../components/GlobalStateContext"
import GlobalComponent from '../components/GlobalComponent';
import TopMenu from '../components/TopMenu';
import css from "./css/index.scss"
import Squeezer from '../components/Squeezer';
import Product from '../components/Product';
import Request from '../core/request';

export default class Index extends GlobalComponent {

  static async getInitialProps(ctx) {
    let initialContext = await pageContext(ctx);

    let request = new Request(ctx.req)

    let featured = await request.fetch("GET", "/api/product/get_featured")


    return {
      initialContext,
      featured
    }
  }

  renderBanner() {
    return (
      <div className={css.banner}>
        <div className={css.banner_content}>
          <Squeezer>
            <div className={css.banner_title}>
              Welcome To Our E-shop
            </div>
            <div className={css.banner_description}>
              Find the <strong>best</strong>,<br />
              with the lowest price
            </div>
          </Squeezer>
        </div>
      </div>
    )
  }

  renderFeatured() {
    return (
      <Squeezer>
        <div className={css.featured_title}>Προτεινόμενα προϊόντα</div>
        <div className={css.featured}>
          {
            this.props.featured 
              .map(product => <Product product={product.product_id} />)
          }
        </div>
      </Squeezer>
    )
  }

  update() {
    return (
      <React.Fragment>
        <TopMenu />
        {this.renderBanner()}
        {this.renderFeatured()}
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