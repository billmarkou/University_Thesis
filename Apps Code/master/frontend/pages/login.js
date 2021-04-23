
import pageContext from "../core/page-context"
import GlobalStateContext from "../components/GlobalStateContext"
import EmptyLayout from "../layouts/EmptyLayout";

import FormLogin from "../components/FormLogin";
import isomorphicRedirect from "../core/isomorphic-redirect";

import css from "./css/login.scss"

export default class Login extends React.Component {

  static async getInitialProps(ctx) {
    let initialPageData = await pageContext(ctx, true)

    if (initialPageData.isAuthenticated) {
      isomorphicRedirect("/", ctx)
    }

    return {
      initialPageData
    }
  }

  renderPage() {
    return (
      <div className={css.page_container}>
        <div className={css.form} >
          <div className={css.header}>
            <div className={css.header_inner}>
              <h1>Welcome to Storage Handler</h1>
              <p> Please fill the form with your credentials</p>
            </div>
          </div>
          <FormLogin />
        </div>
      </div>
    )
  }

  render() {
    return (
      <EmptyLayout initialData={this.props.initialPageData}>

        <GlobalStateContext.Consumer>
          {
            message => {
              this.context = message
              return this.renderPage()
            }
          }
        </GlobalStateContext.Consumer>

      </EmptyLayout>
    )


  }
}