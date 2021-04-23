import Link from "next/link"
import css from "./styles.scss" 

export default class PaginatorNav extends React.Component {

  renderPageNumber(pageNumber) {
    if (pageNumber == this.currentPage) {
      return <span className={css.current}> {pageNumber} </span>
    } else {
      return (
        <Link href={{
          pathname: this.props.urlPattern,
          query: { pageSlug: pageNumber },
        }}>
          <a className={css.link}> 
              {pageNumber} 
          </a>
        </Link>
      )
    } 
  }

  render() {
    this.allPages = parseInt(this.props.allPages)
    this.hasNext = this.props.hasNext   
    this.hasPrevius = this.props.hasPrevius
    this.currentPage = parseInt(this.props.currentPage)

    let numbers = []

    for (let x = 1; x <= this.allPages; x++) {
      let number = this.renderPageNumber(x)
      numbers.push(number)
    }

    return (
      <div>
        {numbers}
      </div>
    )
  }
}