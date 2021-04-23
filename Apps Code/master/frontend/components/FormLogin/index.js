import isomorphicRedirect from "../../core/isomorphic-redirect";
import Request from "../../core/request"
import Cookies from "js-cookie";
import TextBox from "../TextBox";
import Button from "../Button";
import Label from "../Label";

import css from "./styles.scss"

export default class LoginForm extends React.Component {

  state = {
    username: "",
    password: ""
  }

  async send() {
    let usr = this.state.username;
    let pass = this.state.password;

    let requrest = new Request()

    try {
      let result = await requrest.fetch("POST", "/api-token-auth/", {
        username: usr,
        password: pass
      })

      if (result.token) {
        Cookies.set("authToken", result.token, {
          expires: 365// one year
        })
      }

      isomorphicRedirect("/")
    } catch (ex) {
      console.log(ex)
    }
  }

  handleUsrInputChange(value) { 
    this.setState(
      {
        username: value
      }
    )
  }

  handlePassInputChange(value) { 
    this.setState(
      {
        password: value
      }
    )
  }

  render() {
    return (
      <div className={`${this.props.className} ${css.form}`}>
        <Label className={css.form_field}>
          Username
        </Label>
        <TextBox
          className={css.form_field}
          value={this.state.username}
          onChange={this.handleUsrInputChange.bind(this)}
        />

        <Label className={css.form_field}>
          Password
        </Label>
        <TextBox
          className={css.form_field}
          type="password"
          value={this.state.password}
          onChange={this.handlePassInputChange.bind(this)}
        />

        <div>
          <Button onClick={this.send.bind(this)}> Login </Button>
        </div>
      </div>
    )
  }
}

