import css from "./product.scss"
import Link from "next/link"
import Img from "../Img"

export default class Product extends React.Component {

  render() {

    let image = this.props.product.image

    return (
      <Link href={{
        pathname: "/product/[pageSlug]",
        query: { pageSlug: this.props.product._id },
      }}>
        <a>
          <div className={`${css.card} ${this.props.className}`}>

            <Img
              media
              src={image}
              alt={"no image"}
              className={css.image}
            />

            <p className={css.name}>
              {this.props.product.name}
            </p>

            <p>
              Category: {this.props.product.category.name}
            </p>
            
          </div>
        </a>
      </Link>
    )
  }
}