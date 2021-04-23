
import isomorphicCookie from "isomorphic-cookie";

export default function isoCookies(ctx) {

  if (process.browser) {
    return {
      get: (name) => isomorphicCookie.load(name),
      set: (name, value) => isomorphicCookie.save(name, value, { secure: false })
    }
  } else {
    return {
      get: (name) => isomorphicCookie.load(name, ctx.req),
      set: (name, value) => isomorphicCookie.save(name, value, { secure: false }, ctx.res)
    }
  }
 
}