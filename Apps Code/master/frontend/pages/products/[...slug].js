import GlobalStateContext from "../../components/GlobalStateContext"
import pageContext from "../../core/page-context"
import Request from "../../core/request"
import BasicLayout from "../../layouts/BasicLayout"
import Product from "../../components/Product"
import PaginatorNav from "../../components/PaginatorNav"
import css from "../css/products.scss"
import css1 from "./styles.scss"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button"
import { Search } from 'react-feather';
import isomorphicRedirect from "../../core/isomorphic-redirect"
import TopMenu from "../../components/TopMenu"
import Squeezer from "../../components/Squeezer"

export default class Products extends React.Component {

  static async getInitialProps(ctx) {
    const request = new Request(ctx.req)
    let initialPageData = await pageContext(ctx)

    let page_slug = ctx.query.slug[0] 
    let querySearch = ctx.query.q
    let category = ctx.query.c

    let products = null

    if (querySearch) {
      products = await request.fetch("GET", "/api/product/search", {
        page: page_slug,
        query: querySearch,
        category
      })
    } else {
      products = await request.fetch("GET", "/api/product/get", {
        page: page_slug,
        category
      })
    }
  
    return {
      initialPageData,
      products,
      querySearch
    }
  }

  state = {
    searchValue: this.props.querySearch,
  }
 
  // componentWillReceiveProps(nextProps){ 
  //   console.log("hello")
  //   if (nextProps.querySearch != this.state.searchValue) {
  //     this.setState({
  //       searchValue: nextProps.querySearch
  //     })
  //   }
  // }
  
  handleSearch() {
    isomorphicRedirect("/products/1?q=" + this.state.searchValue)
  }

  renderPage() {
    return (
      <React.Fragment>
        <TopMenu/>
        <Squeezer>
          <div className={css1.container}>
            {
              this.props.products.items.map(
                (item) => {
                  return (
                    <Product className={css.product_tile} product={item}> </Product>
                  )
                }
              )
            }
          </div>
          <PaginatorNav
            allPages={this.props.products.pages}
            currentPage={this.props.products.currentPage}
            hasNext={this.props.products.hasNext}
            hasPrevious={this.props.products.hasPrevious}
            urlPattern="/products/[pageSlug]"
          />
        </Squeezer>
      </React.Fragment>
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