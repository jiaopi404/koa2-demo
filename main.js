const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const WS = require('./ws')
const router = require('./api')
const Logger = require('./logger')
const app = new Koa()

const wss = new WS({ port: 9106 })
wss.init().then(() => {
  wss.ws.on('message', (message) => {
    console.log('received: %s', message);
  })
})

const port = 9104

// body parser
app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
  await next()
  new Logger({ url: ctx.request.url }).log(ctx)
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log('[start] server is starting at localhost:' + port)
})
