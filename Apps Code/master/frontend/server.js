var express = require('express'); 
const next = require('next');
const settings = require("./next.config");

const dev = process.env.NODE_ENV !== 'production'
const port = (dev) ? settings.portDev : settings.portProduction
const app = next({ dev })
const handle = app.getRequestHandler()
const path = require("path")

async function main() {

  try {
    await app.prepare()
  } catch {
    console.error(ex.stack)
    process.exit(1)
  }
 
  const server = express()

  server.use('/static', express.static(path.join(__dirname, '../static')))
  server.use('/media', express.static(path.join(__dirname, '../media')))
  
  // server.use((req,res,next)=>{
  //   next()
  //   res.setHeader("Access-Control-Allow-Headers", "Session-Id, Authorization")
  // })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + port)
  })

  

}

main();
