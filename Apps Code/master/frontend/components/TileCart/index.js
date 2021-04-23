import GlobalComponent from "../GlobalComponent";

import css from "./styles.scss"
import Img from "../Img"
import Link from "next/link"
import IntegerField from "../IntegerField"
import { Trash2 } from "react-feather";

export default class TileCart extends GlobalComponent {

  state = {
    loading: false
  }

  async handleAmountChange(val) {
    if (this.state.loading) return

    await this.setState({
      loading: true
    })

    if (this.props.onAmountChange) {
      await this.props.onAmountChange(val)
    }

    this.setState({
      loading: false
    })
  }


  async handleDelete() {
    if (this.state.loading) return

    await this.setState({
      loading: true
    })

    if (this.props.onDelete) {
      await this.props.onDelete()
    }

    this.setState({
      loading: false
    })
  }

  update() {
    return (
      <div className={css.tile}>
        <Img className={css.image} src={this.props.product.image} media />
        <div className={css.content}>
          <Link href={{
            pathname: "/product/[slug]",
            query: { slug: this.props.product._id }
          }}>
            <a>
              <div className={css.title}>
                {this.props.product.name}
              </div>
            </a>
          </Link>

          <div className={css.category}>
            Κατηγορία: {this.props.product.category.name}
          </div>

          <div className={css.code}>
            Κωδικός: {this.props.product.code}
          </div>

          <div className={css.price}>
            Τιμή: <strong>{this.props.product.price}&euro;</strong>
          </div>
          
        </div>
        <div className={`${css.count} ${this.state.loading && css.disable}`}>
          <IntegerField value={this.props.count} onChange={this.handleAmountChange.bind(this)} />
        </div>
        <div>
          <div className={css.remove} onClick={this.handleDelete.bind(this)}>
            <Trash2 />
          </div>
        </div>
      </div>
    )
  }
}