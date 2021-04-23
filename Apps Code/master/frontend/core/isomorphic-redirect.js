import Router from 'next/router'

export default function isomorphicRedirect (href, ctx) {
  if (process.browser) {  
    Router.push(href) 
  } else {
    ctx.res.writeHead(302, { Location: href }).end()
  }
}