const Koa = require('koa')
const router = require('./api')
const app = new Koa()

const port = 9104

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log('[start] server is starting at localhost:' + port)
})
