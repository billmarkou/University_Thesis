import Link from "next/link"
import css from "./styles.scss"
import Moment from "moment"

export default class Order extends React.Component{

  render(){
    return(
      <Link href={{
        pathname: "/order/[pageSlug]",
        query: {pageSlug: this.props.orders._id},
      }}>
        <a>
          <div className={css.container}>
            <p className={css.code}>
              Order : {this.props.orders.code}
            </p>
            <p className={css.type}>
              {this.props.orders.order_type}
            </p>
            <p className={css.state}>
              {this.props.orders.state}
            </p>
            <p className={css.startDate}>
              {Moment(this.props.orders.date_of_start).format("DD/MM/YYYY HH:mm")}
            </p>
            <p className={css.endDate}>
              {Moment(this.props.orders.date_of_end).format("DD/MM/YYYY HH:mm")}
            </p>
          </div>
        </a>
      </Link>
    )
  }

}