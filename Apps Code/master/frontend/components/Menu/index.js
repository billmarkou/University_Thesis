import css from "./styles.scss"
import Button from "../Button"
import GlobalStateContext from "../GlobalStateContext"

export default class Menu extends React.Component {
  static contextType = GlobalStateContext;

  handleChangeGlobalState() {
    this.context.setGlobal({
      isAuthenticated: !this.context.global.isAuthenticated
    })
  }

  render() { 
    return (
      <div className={css.menu}>
        <div className={css.panel_left}>
          <Button onClick={this.handleChangeGlobalState.bind(this)} className={css.menu_item}>
            MENU
          </Button>

          <Button className={css.menu_item}>
            ORDERS
          </Button>

          <Button className={css.menu_item}>
            PRODUCT LIST
          </Button>
        </div>
        {
          this.context.global.isAuthenticated ? (
            <div className={css.panel_right}>
              <Button className={css.menu_item}>
                button 4
            </Button>
              <Button className={css.menu_item}>
                button 4
            </Button>
            </div>
          ) :
          <div className={css.panel_right}>
          <Button className={css.menu_item}>
            not logged in
        </Button>
          <Button className={css.menu_item}>
            signe in
        </Button>
        </div>
        }

      </div>
    )
  }
}