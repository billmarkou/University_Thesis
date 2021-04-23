let isDev;

if (process.env.NODE_ENV == "production") isDev = false; else isDev = true

export default {
  isDev: isDev,
  mediaPath: '/media/',
  staticPath: '/static/',
  apiPath: isDev? 'http://localhost:8000': 'http://storage-handler.mydissent.net',
  apiPathServerSide: isDev? 'http://localhost:8000': 'http://backend:8000'
}