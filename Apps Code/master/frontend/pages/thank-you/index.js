
import BasicLayout from '../../layouts/BasicLayout'
import pageContext from "../../core/page-context"
import GlobalComponent from '../../components/GlobalComponent';
import css from "./styles.scss"
import TopMenu from '../../components/TopMenu';
import Squeezer from '../../components/Squeezer';
import Link from "next/link"

export default class ThankYou extends GlobalComponent {

  static async getInitialProps(ctx) {
    let initialContext = await pageContext(ctx);


    return {
      initialContext
    }
  }



  update() {

    return (
      <React.Fragment>
        <TopMenu />

        <Squeezer className={css.contents}>
          <div>
            Ευχαριστούμε για την παραγγελία
            <br/>
            <Link href="/">
              <a style={{color: 'blue'}}> 
                Επιστροφή στην αρχική
              </a>
            </Link>
          </div>
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