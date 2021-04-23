export default function isoUrl(ctx) {

  let originalUrl = process.browser? location.pathname+location.search: ctx.req.originalUrl
  let url = process.browser? location.pathname: ctx.req.url
  let fullUrl = process.browser? location.href : ctx.req.protocol + '://' + ctx.req.get('host') + ctx.req.originalUrl

  return {
    originalUrl,
    url,
    fullUrl
  }
  

}