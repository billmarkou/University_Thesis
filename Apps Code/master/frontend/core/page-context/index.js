import isomorphicRedirect from "../isomorphic-redirect"
import isoCookies from "../isomorphic/cookies"
import Request from "../request"

export default async function pageContext(ctx, cancelRedirects) {
  let sessionId = isoCookies(ctx).get("session_id")
  let request
  if (!sessionId) {
    request = new Request(ctx.req)
    sessionId = await request.fetch("GET", "/api/user/create_session/")

    isoCookies(ctx).set("session_id", sessionId) 
    ctx.req.cookies.session_id = sessionId
  }
   
  request = new Request(ctx.req)
   
  /* ============ GET USER ============ */
  let isAuthenticated = false

  try {
    isAuthenticated =  await request.fetch("GET", "/api/user/authenticated/")
  } catch (ex) {}

  isAuthenticated = isAuthenticated === true
  let user = null

  if (isAuthenticated) {
    user = await request.fetch("GET", "/api/user/current/")
  } 



  /* ============ GET TYPES ============ */
  const types = await request.fetch("GET", "/api/type/get/")

  
  
  return { 
    isAuthenticated, 
    user,
    types
  }
} 