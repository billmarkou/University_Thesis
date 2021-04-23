import isomorphicRedirect from "../../core/isomorphic-redirect";
import React from 'react'

export default class Products extends React.Component {
  static async getInitialProps(ctx) {
    isomorphicRedirect('/products/1', ctx);
    return {}
  }
  render() {
    return null
  }
}