import GlobalComponent from "../GlobalComponent";
import css from "./styles.scss"
import SearchField from '../SearchField';
import IntegerField from "../IntegerField";
import Request from "../../core/request"
import Button from "../Button";
import { Trash2 } from 'react-feather';

export default class OrderProductList extends GlobalComponent {

  get value() {
    if (Array.isArray(this.props.value)) {
      return this.props.value
    } else {
      return []
    }
  }

  handleChange(newValue) {
    if (this.props.onChange) {
      this.props.onChange(newValue)
    }
  }

  handleChangeProduct(index, value) {
    this.value[index].product = value

    this.handleChange(this.value)
  }


  handleChangeAmount(index, value) {
    this.value[index].amount = value

    this.handleChange(this.value)
  }

  createItemFromProduct(product) {
    if (!product) return null

    return {
      value: product._id,
      product: product,
      label: product.code + " - " + product.name
    }
  }

  handleAddProduct() {
    this.value.push({
      product: null,
      amount: ""
    })

    this.handleChange(this.value)
  }

  handleDeleteProduct(index, value) {
    delete this.value.splice(index, 1)
    this.handleChange(this.value)
    console.log(this.value[index])
  }

  getMax(product) {
    if (this.props.receiving) {
      return 10000
    } else {
      return product ? parseInt(product.quantity) : 0
    }
  }



  update() {

    return (
      <div className={css.list}>
        {
          this.value.map((orderProduct, i) => {

            let product = orderProduct.product
            let amount = orderProduct.amount
            let productMax = this.getMax(product)
            return (
              <div className={css.list_item}>
                <div label="Search for a product">
                  <SearchField
                    onSearch={async (text) => {
                      let results = await new Request().fetch("GET", "/api/product/search", {
                        query: text
                      })

                      return results.items.map((p) => {
                        return this.createItemFromProduct(p)
                      })
                    }}

                    onChange={(product) => this.handleChangeProduct(i, product.product)}
                    value={this.createItemFromProduct(product)}
                  />
                </div>

                <div label="Product ammount">
                  <IntegerField
                    min={product ? 1 : 0}
                    max={productMax} 
                    className={css.intField}
                    onChange={(newAmount) => this.handleChangeAmount(i, newAmount)}
                    value={amount < productMax? amount: productMax}
                  />
                </div>
                <div label="Delete" className={css.remove_button}>
                  <Button
                    onClick={(test) => this.handleDeleteProduct(i, test)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            )
          })
        }
        <div>
          <Button onClick={this.handleAddProduct.bind(this)}>
            Add product
          </Button>
        </div>
      </div>
    )
  }

}