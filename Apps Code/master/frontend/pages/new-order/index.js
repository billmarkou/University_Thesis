
import BasicLayout from '../../layouts/BasicLayout'
import pageContext from "../../core/page-context"
import GlobalComponent from '../../components/GlobalComponent';
import DatePicker from 'react-date-picker';
import TextBox from "../../components/TextBox"
import Select from 'react-select'
import OrderProductList from '../../components/OrderProductList';
import css from "./styles.scss"
import { v4 as uuidv4 } from 'uuid';
import shortHash from "short-hash";
import Request from "../../core/request"
import Label from "../../components/Label"
import Button from '../../components/Button';
import Moment from "moment"
import isomorphicRedirect from '../../core/isomorphic-redirect';

async function generateUniqueCode(request) {

  let uniqueId = shortHash(uuidv4())
  let exists = await request.fetch("GET", "/api/order/is_unique_code/", {
    code: uniqueId
  })

  if (!exists) {
    return uniqueId
  } else {
    return await generateUniqueCode(request);
  }

}

export default class NewOrder extends GlobalComponent {

  static async getInitialProps(ctx) {
    let initialContext = await pageContext(ctx);

    let request = new Request(ctx.req)
    let uniqueId = await generateUniqueCode(request)

    return {
      initialContext,
      code: uniqueId
    }
  }

  state = {
    orderCode: this.props.code,
    orderType: null,
    startDate: null,
    endDate: null,
    products: [],
    publisherId : this.props.initialContext.user.username,
    publisherSname : this.props.initialContext.user.surname
  }

  orderTypes = [
    { value: "receiving", label: "Receiving" },
    { value: "sending", label: "Sending" }
  ]

  async handleSubmit() {
    let request = new Request()
    let stateData = this.state

    let codeExists = await request.fetch("GET", "/api/order/is_unique_code/", {
      code: stateData.orderCode
    })

    if (codeExists) {
      await this.setState({
        orderCode: generateUniqueCode(request)
      })
    }


    let isValid = true

    if (!stateData.startDate || !stateData.orderType) {
      isValid = false
    }

    if (!stateData.products || stateData.products.length == 0) {
      isValid = false
    }

    if (isValid) {

      let data = {
        code: stateData.orderCode,
        orderType: stateData.orderType.value,
        startDate: Moment(stateData.startDate).format('DD/MM/YYYY'),
        endDate: Moment(stateData.endDate).format('DD/MM/YYYY'),
        products: JSON.stringify(stateData.products),
        publisherId : stateData.publisherId,
        publisherSname : stateData.publisherSname
      }

      let res = await request.fetch('POST', '/api/order/new/', data);

      isomorphicRedirect("/orders");

    } else {
      alert("Please fill all the required fields.")
    }


  }

  update() {
    console.log(this.props.initialContext)
    console.log(this.state)
    return (
      <div className={css.page}>
        <div className={css.box}>
          <div className={css.container}>

            <div className={css.code}>
              <Label>
                Code:
              </Label>
              <div>
                {this.state.orderCode}
              </div>
            </div>

            <div className={css.dateS}>
              <DatePicker
                onChange={d => this.setState({ startDate: d })}
                value={this.state.startDate}
              />
            </div>

            <div className={css.dateE}>
              <DatePicker
                onChange={d => this.setState({ endDate: d })}
                value={this.state.endDate}
              />
            </div>

            <div className={css.type}>
              <Select
                value={this.state.orderType}
                onChange={d => this.setState({ orderType: d })}
                options={this.orderTypes}
              />
            </div>


          </div>

          <div className={css.product_list}>
            <OrderProductList
              receiving={this.state.orderType?.value == "receiving"}
              className={css.prod}
              onChange={products => this.setState({ products: products })}
              value={this.state.products}
            />
          </div>

          <div className={css.submit_button}>
            <Button onClick={this.handleSubmit.bind(this)}>
              Submit
            </Button>
          </div>

        </div>

      </div>
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