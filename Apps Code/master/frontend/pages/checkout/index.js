
import BasicLayout from '../../layouts/BasicLayout'
import pageContext from "../../core/page-context"
import GlobalComponent from '../../components/GlobalComponent';
import css from "./styles.scss"
import Request from "../../core/request"
import _, { toPath } from "lodash"
import TopMenu from '../../components/TopMenu';
import Squeezer from '../../components/Squeezer';
import TextBox from '../../components/TextBox';
import Button from '../../components/Button';
import TileCartSmall from '../../components/TileCartSmall';
import isomorphicRedirect from '../../core/isomorphic-redirect';



export default class Cart extends GlobalComponent {

  static async getInitialProps(ctx) {
    let initialContext = await pageContext(ctx);

    const request = new Request(ctx.req)

    let cartContents = await request.fetch("GET", "/api/cart/get/")

    if (!Array.isArray(cartContents) || cartContents.length == 0) {
      isomorphicRedirect("/cart", ctx)
    }

    let volumetricRanges = await request.fetch("GET", "/api/checkout/get_volumetric_ranges")
    let distanceRanges = await request.fetch("GET", "/api/checkout/get_distance_ranges")

    return {
      initialContext,
      cartContents,
      volumetricRanges,
      distanceRanges
    }
  }

  state = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    pc: "",
    shipping: "antikatabolh",
    distance: null
  }

  calculatePrice(includeShipping) {
    let totalPrice = 0
    let totalShipping = 0
    let totalExtraVat = 0
    let distanceCost = 0
    let cartContents = this.props.cartContents

    for (let c of cartContents) {
      let basePrice = c.product.price
      let volume = (c.product.sizeX || 1) * (c.product.sizeY || 1) * (c.product.sizeZ || 1)
      let weight = c.product.weight


      let extraVat = (c.product.vat / 100) * basePrice
      totalExtraVat += extraVat
      basePrice += extraVat

      if (includeShipping) {

        let volumeWeight = (volume * 0.01) / weight

        let shippingCost = volumeWeight
        if (Array.isArray(this.props.volumetricRanges)) {
          for (let range of this.props.volumetricRanges) {
            if (volumeWeight >= range.weight_from && volumeWeight < range.weight_to) {
              shippingCost = volumeWeight * range.cost
            }
          }
        }

        totalShipping += shippingCost
        basePrice += shippingCost

      }

      if (this.state.distance != null) {
        distanceCost = 0
        if (Array.isArray(this.props.distanceRanges)) {
          for (let range of this.props.distanceRanges) {
            if (this.state.distance >= range.distance_from && this.state.distance < range.distance_to) {
              distanceCost = range.cost
            }
          }
        }

        basePrice += distanceCost

      }

      totalPrice += basePrice * c.amount
    }

    return {
      totalPrice,
      totalExtraVat,
      totalShipping,
      distanceCost
    }
  }

  async handlePcChange() {
    let currentPc = this.state.pc

    if (currentPc.trim() != "") {
      let request = new Request()
      let distance = await request.fetch("GET", "/api/checkout/get_distance", {
        pc: currentPc
      })
      if (distance.error) {
        this.setState({
          distance: null
        })
      } else {
        this.setState({
          distance
        })
      }
    }

  }

  changeFormData(field, value) {
    this.setState({
      [field]: value
    })
  }

  handleShippingChange(e) {
    this.setState({
      shipping: e.target.value
    })
  }


  async handleSubmit() {
    let flag = true
    let alertMessage = ''
    if (this.state.name.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? ??????????")
      flag = false
    } else if (this.state.surname.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? ??????????????")
      flag = false
    } else if (this.state.email.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? E-mail")
      flag = false
    } else if (this.state.phone.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? ????????????????")
      flag = false
    } else if (this.state.city.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? ????????")
      flag = false
    } else if (this.state.address.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? ??????????????????")
      flag = false
    } else if (this.state.pc.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? T.K")
      flag = false
    } else if (this.state.shipping.trim() == "") {
      alertMessage = ("A???????????????????? ?????????? ?????? ?????????? Shipping")
      flag = false
    } else if (this.state.distance == null) {
      alertMessage = ("?????? ?????????????? ?? ???????????????????????? ?????????????? ?????? ????????????????")
      flag = false
    }

    let {
      totalPrice,
      totalExtraVat,
      totalShipping
    } = this.calculatePrice(this.state.shipping == "antikatabolh")

    let data = {
      ...this.state,
      totalVat: totalExtraVat,
      totalPrice,
      totalShipping,
      products: JSON.stringify(
        this.props.cartContents.map(i => { return { _id: i.product._id, amount: i.amount } })
      )
    }
   
    const request = new Request()

    if (flag == true) {
      await request.fetch("POST", "/api/checkout/submit/", data)
      isomorphicRedirect("/thank-you")
    } else {
      alert(alertMessage);
    }
  }

  renderPersonalForm() {
    return (
      <div className={css.form}>
        <div className={css.form_field}>
          <div>??????????:</div>
          <TextBox
            onChange={v => this.changeFormData("name", v)}
            value={this.state.name}
          />
        </div>
        <div className={css.form_field}>
          <div>??????????????:</div>
          <TextBox
            onChange={v => this.changeFormData("surname", v)}
            value={this.state.surname}
          />
        </div>
        <div className={css.form_field}>
          <div>Email:</div>
          <TextBox
            onChange={v => this.changeFormData("email", v)}
            value={this.state.email}
          />
        </div>
        <div className={css.form_field}>
          <div>????????????????:</div>
          <TextBox
            numeric
            onChange={v => this.changeFormData("phone", v)}
            value={this.state.phone}
          />
        </div>
        <div className={css.form_field}>
          <div>????????:</div>
          <TextBox
            onChange={v => this.changeFormData("city", v)}
            value={this.state.city}
          />
        </div>
        <div className={css.form_field}>
          <div>??????????????????:</div>
          <TextBox
            onChange={v => this.changeFormData("address", v)}
            value={this.state.address}
          />
        </div>
        <div className={css.form_field}>
          <div>????:</div>
          <TextBox
            onBlur={this.handlePcChange.bind(this)}
            numeric
            onChange={v => this.changeFormData("pc", v)}
            value={this.state.pc}
          />
        </div>
      </div>
    )
  }

  renderShipping() {
    return (
      <div>

        <div className={css.title}>
          ???????????? ??????????????????
        </div>

        <div onChange={this.handleShippingChange.bind(this)}>
          <input type="radio" id="antikatabolh" name="shipping" value="antikatabolh" checked={this.state.shipping == "antikatabolh"} />
          <label for="antikatabolh">????????????????????????</label> <br />
          <input type="radio" id="paralabh" name="shipping" value="paralabh" checked={this.state.shipping == "paralabh"} />
          <label for="paralabh">???????????????? ?????? ???? ??????????????????</label>  <br />
        </div>
      </div>
    )
  }


  update() {
    let {
      totalPrice,
      totalExtraVat,
      totalShipping,
      distanceCost
    } = this.calculatePrice(this.state.shipping == "antikatabolh")
    return (
      <React.Fragment>
        <TopMenu />

        <Squeezer className={css.contents}>
          <div className={css.title}>
            ?????????????????? ??????????????????????
          </div>

          <div className={css.container}>
            <div className={css.form_container}>
              {this.renderPersonalForm()}
              {this.renderShipping()}

              <div onClick={this.handleSubmit.bind(this)} className={css.submit_container}>
                <Button>???????????????? ??????????????????????</Button>
              </div>

            </div>
            <div className={css.cart}>
              {
                this.props.cartContents.map(i => {
                  return <TileCartSmall product={i.product} count={i.amount} />
                })
              }
              <div>
                <div>
                  <strong>??????: </strong>+{totalExtraVat}&euro;
                </div>
                <div>
                  <strong>????????????????????: </strong>+{totalShipping}&euro;
                </div>
                <div>
                  <strong>????????????????: </strong>+{distanceCost}&euro;
                </div>
                <div>
                  <strong>????????????: </strong>{totalPrice}&euro;
                </div>
              </div>

            </div>
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