import GlobalStateContext from "../../components/GlobalStateContext"
import pageContext from "../../core/page-context"
import Request from "../../core/request"
import BasicLayout from "../../layouts/BasicLayout"
import Order from "../../components/Order"
import PaginatorNav from "../../components/PaginatorNav"
import css from "./styles.scss"
import TextBox from "../../components/TextBox"
import Button from "../../components/Button"
import { Search } from 'react-feather';
import isomorphicRedirect from "../../core/isomorphic-redirect"

export default class Orders extends React.Component {

  static async getInitialProps(ctx) {
    const request = new Request(ctx.req)
    let initialPageData = await pageContext(ctx)

    let page_slug = ctx.query.slug[0]
    let querySearch = ctx.query.q

    let orders = null

    if (querySearch) {
      orders = await request.fetch("GET", "/api/order/search", {
        page: page_slug,
        query: querySearch
      })
    } else {
      orders = await request.fetch("GET", "/api/order/get", {
        page: page_slug
      })

    }



    return {
      initialPageData,
      orders,
      querySearch
    }
  }

  state = {
    searchValue: this.props.querySearch,
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.querySearch != this.state.searchValue) {
  //     this.setState({
  //       searchValue: nextProps.querySearch
  //     })
  //   }
  // }

  handleSearch() {
    isomorphicRedirect("/orders/1?q=" + this.state.searchValue)
  }

  renderPage() {
    return (
      <div>
        <div className={css.search_container}>
          <TextBox
            onChange={(value) => this.setState({ searchValue: value })}
            value={this.state.searchValue} />
          <Button onClick={this.handleSearch.bind(this)}>
            <Search />
          </Button>
        </div>
        <div className={css.container}>
          {
            this.props.orders.items.map(
              (item) => {
                return (
                  <Order orders={item}> </Order>
                )
              }
            )
          }
        </div>
        <PaginatorNav
          allPages={this.props.orders.pages}
          currentPage={this.props.orders.currentPage}
          hasNext={this.props.orders.hasNext}
          hasPrevious={this.props.orders.hasPrevious}
          urlPattern="/orders/[pageSlug]"
        />
      </div>
    )
  }


  render() {
    console.log(this.props.orders)


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