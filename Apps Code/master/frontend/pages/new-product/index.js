import BasicLayout from '../../layouts/BasicLayout'
import pageContext from "../../core/page-context"
import GlobalComponent from '../../components/GlobalComponent';
import Request from "../../core/request"
import TextBox from "../../components/TextBox"
import TextArea from "../../components/TextArea"
import Label from "../../components/Label"
import Img from '../../components/Img';
import { v4 as uuidv4 } from 'uuid';
import shortHash from "short-hash";
import IntegerField from "../../components/IntegerField"
import SearchField from "../../components/SearchField"
import css from "./styles.scss"
import Button from '../../components/Button';
import isomorphicRedirect from '../../core/isomorphic-redirect';
import OpenFileDialog from '../../components/OpenFIleDIalog';


async function generateUniqueCode(request) {

  let uniqueId = shortHash(uuidv4())
  let exists = await request.fetch("GET", "/api/product/is_unique_code/", {
    code: uniqueId
  })

  if (!exists) {
    return uniqueId
  } else {
    return await generateUniqueCode(request);
  }

}



export default class NewProduct extends GlobalComponent {

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
    code: this.props.code,
    name: null,
    image: null,
    imagePreview: null,
    description: null,
    potition: null,
    category: null,
    categoryId: null,
    quantity: null,
  }

  get value() {
    if (Array.isArray(this.props.value)) {
      return this.props.value
    } else {
      return []
    }
  }

  createItemFromCategory(category) {
    if (!category) return null

    return {
      value: category._id,
      category: category,
      label: product.name
    }
  }


  async handleSubmit() {
    let request = new Request()
    let stateData = this.state

    let isValid = true

    if (!stateData.name || !stateData.potition || !stateData.quantity || !stateData.categoryId) {
      isValid = false
    }

    if (isValid) {
      let res = await request.fetch('POST', '/api/product/new/', {
        code: this.state.code,
        name: this.state.name,
        image: this.state.image, 
        description: this.state.description,
        potition: this.state.position, 
        categoryId: this.state.categoryId,
        quantity: this.state.quantity,
      });
      isomorphicRedirect("/products");

    } else {
      alert("Please fill all the required fields.")
    }
  }

  async handleImageChange(newImage) {
    await this.setState({
      image: newImage
    })

    var FR = new FileReader();

    FR.addEventListener("load",  (e) => {
      this.setState({
        imagePreview: e.target.result
      }) 
    });

    FR.readAsDataURL(newImage);


  }


  update() {
    console.log(this.state)
    return (

      <div className={css.container}>
        <div className={css.code}>
          <Label>
            Code:
          </Label>
          <div>
            {this.state.code}
          </div>
        </div>
        <div className={css.name}>
          <TextBox
            onChange={n => this.setState({ name: n })}
            value={this.state.name}>
          </TextBox>
        </div>
        <div className={css.image}>
          <Button onClick={() => this.fileDialog.show()}>
            Select image
          </Button>
          <OpenFileDialog
            onChange={this.handleImageChange.bind(this)}
            filter="image/jpeg, image/png"
            ref={r => this.fileDialog = r} />
          <Img className={css.image_inner} src={this.state.imagePreview} />
        </div>
        <div className={css.description}>
          <TextArea
            onChange={d => this.setState({ description: d })}
            rows={"15"} cols={"50"}
          />
        </div>
        <div className={css.quantity}>
          <div>
            <div className={css.quantity_container}>
              <IntegerField
                onChange={q => this.setState({ quantity: q })}
                value={this.state.quantity}
              />
            </div>
          </div>
        </div>
        <div className={css.position}>
          <TextBox
            onChange={p => this.setState({ potition: p })}
            value={this.state.position} />
        </div>

        <div className={css.category}>
          <SearchField className={css.category}
            onSearch={async (text) => {
              let results = await new Request().fetch("GET", "/api/category/search", {
                query: text
              })

              return results.map((c) => {
                return {
                  label: c.name,
                  value: c._id,
                }
              })
            }}

            onChange={(categoryItem) => this.setState({
              category: categoryItem,
              categoryId: categoryItem.value
            })}
            value={this.state.category}
          />
        </div>
        <Button onClick={this.handleSubmit.bind(this)}>
          Done
        </Button>
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