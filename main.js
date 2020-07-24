const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const WS = require('./ws')
const router = require('./api')
const Logger = require('./logger')
const JWT = require('./tools/jwt')
const app = new Koa()

const wss = new WS({ port: 9106 })
wss.init().then(() => {
  wss.ws.on('message', (message) => {
    console.log('received: %s', message);
  })
})

const port = 9104
const jwtExclude = ['register', 'login']

// body parser
app.use(bodyParser())

// logger
app.use(async (ctx, next) => {
  await next()
  new Logger({ url: ctx.request.url }).log(ctx)
})

// jwt
app.use(async (ctx, next) => {
  const url = ctx.request.url
  const isExcluded = jwtExclude.some(item => new RegExp(item).test(url))
  if (isExcluded) {
    await next()
  } else {
    const { authorization } = ctx.headers
    if (!authorization) {
      ctx.body = { code: 500, msg: '未认证', message: '未认证' }
    } else {
      const _token = authorization.split(' ')[1]
      if (!_token) {
        ctx.body = { code: 500, msg: '未认证', message: '未认证' }
      } else {
        try {
          ctx.JWT = await JWT.verify({ _token })
          await next()
        } catch (err) {
          ctx.body = { code: 500, msg: '认证失败', message: err.message }
        }
      }
    }
    // await next()
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(port, () => {
  console.log('[start] server is starting at localhost:' + port)
})
