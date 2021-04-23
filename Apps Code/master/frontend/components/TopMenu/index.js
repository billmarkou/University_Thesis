import css from "./styles.scss"
import SearchField from "../SearchField"
import Button from "../Button"
import { AlignJustify, ShoppingCart } from 'react-feather';
import $ from "jquery"
import Link from "next/link"
import GlobalComponent from "../GlobalComponent";
import Request from "../../core/request";
import isomorphicRedirect from "../../core/isomorphic-redirect";


export default class TopMenu extends GlobalComponent {

  state = {
    categoryMenuOpen: false,
    selectedType: null,
    categories: null,
    selectedProduct: null
  }

  mouseInCategoryMenu = false

  componentDidMount() {
    $(document).on("click", () => {
      if (!this.mouseInCategoryMenu) {
        this.closeCategoryDropDown()
      }
    })
  }

  async closeCategoryDropDown() {
    await this.setState({ categoryMenuOpen: false, selectType: null, categories: null })
  }
  async openCategoryDropDown() {
    await this.setState({ categoryMenuOpen: true })
  }


  async selectType(id) {
    let request = new Request()

    let categories = await request.fetch("GET", '/api/category/get', {
      type: id
    })

    this.setState({
      categories,
      selectedType: id
    })

  }

  toggleCategories() {
    if (this.state.categoryMenuOpen) {
      this.closeCategoryDropDown()
    } else {
      this.openCategoryDropDown()
    }
  }

  renderLogo() {
    return (
      <Link href="/">
        <a> 
          <div className={css.logo}>
            E-Shop
          </div>
        </a>
      </Link>
    )
  }

  renderCategoryDropDown() {
    return (
      <div className={`${css.menu_dropdown} ${this.state.categoryMenuOpen && css.menu_dropdown_open}`}>
        <div className={css.type_menu}>
          {
            this.global.types.map(type => {
              return (
                <div
                  className={`${css.category_item} ${this.state.selectedType == type._id && css.selected_item}`}
                  onClick={this.selectType.bind(this, type._id)}>
                  {type.name}
                </div>
              )
            })
          }
        </div>

        {
          this.state.selectedType && Array.isArray(this.state.categories) && (
            <div className={css.category_menu}>
              {
                this.state.categories.map(c => {
                  return (
                    <Link href={{
                      pathname: "/products/[slug]",
                      query: { slug: '1', c: c._id }
                    }}>
                      <a>
                        <div className={css.category_item}>
                          {c.name}
                        </div>
                      </a>
                    </Link>
                  )
                })
              }
            </div>
          )
        }

      </div>
    )
  }

  renderCategories() {
    return (
      <div
        onMouseOver={() => this.mouseInCategoryMenu = true}
        onMouseLeave={() => this.mouseInCategoryMenu = false}
        className={css.categories}
      >
        <div className={css.categories_button} onClick={this.toggleCategories.bind(this)}>
          <AlignJustify />
        </div>

        {this.renderCategoryDropDown()}

      </div>
    )
  }

  createItemFromProduct(product) {
    if (!product) return null

    return {
      value: product._id,
      product: product,
      label: product.code + " - " + product.name
    }
  }


  handleChangeProduct(value) {
    this.setState({
      selectedProduct: value
    }) 
    isomorphicRedirect(`/product/${value._id}`)
  }

  renderSearch() {
    return (
      <div className={css.search}>
        <SearchField
          onSearch={async (text) => {
            let results = await new Request().fetch("GET", "/api/product/search", {
              query: text
            })

            return results.items.map((p) => {
              return this.createItemFromProduct(p)
            })
          }}

          onChange={(product) => this.handleChangeProduct(product.product)}
          value={this.createItemFromProduct(this.state.selectedProduct)}
        />
      </div>
    )
  }

  renderUser() {
    return (
      <div className={css.user}>
        <Link href="/cart">
          <a>
            <Button >
              <ShoppingCart className={css.cart_button}/>
            </Button>
          </a>
        </Link>
      </div>
    )
  }

  update() {
    return (
      <div className={css.ghost}>
        <div className={css.menu}>
          {this.renderLogo()}
          {this.renderCategories()}
          {this.renderSearch()}
          {this.renderUser()}
        </div>
      </div>
    )
  }

}