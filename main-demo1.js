const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const app = new Koa()

const Router = require('koa-router')

const home = new Router()
const page = new Router()
const api = new Router()

home.get('/', async ctx => {
  const result = await pageRender({ url: '/index' })
  logger(ctx, result)
  const [err, data] = result
  if (err) {
    ctx.body = '<h1>Error Occurred!</h1>'
  } else {
    ctx.body = data
  }
})

page.get('/404', async ctx => {
  const result = await pageRender(ctx.request)
  logger(ctx, result)
  const [err, data] = result
  if (err) {
    ctx.body = '<h1>Error Occurred!</h1>'
  } else {
    ctx.body = data
  }
}).get('/helloworld', async ctx => {
  const result = await pageRender(ctx.request)
  logger(ctx, result)
  const [err, data] = result
  if (err) {
    ctx.body = '<h1>Error Occurred!</h1>'
  } else {
    ctx.body = data
  }
})

api.get('/user/:id', async ctx => {
  console.log('[restfulAPI request] ', ctx)
  console.log('[ctx params] ', ctx.params)
  console.log('[ctx query] ', ctx.query)
  ctx.body = {
    code: 0,
    data: [
      { id: 1, user: 'JIAOPI' }
    ]
  }
})

const router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/page', page.routes(), page.allowedMethods())
router.use('/api', api.routes(), api.allowedMethods())

app.use(router.routes()).use(router.allowedMethods())

const port = 9104
app.listen(port, () => {
  console.log('[demo] server is starting at port ' + port)
})

/**
 * page render
 * @param req ctx.request
 * @returns {Promise<unknown[]|*[]>}
 */
async function pageRender (req) {
  try {
    const files = await readdirAsync()
    for (const file of files) {
      if (testReqUrl(req.url, file)) {
        const data = await readFileAsync('./public/' + file)
        return [null, data]
      }
    }
  } catch (err) {
    return [err, null]
  }
}

/**
 * readdir 的 async/await 版本
 * @returns {Promise<unknown>}
 */
function readdirAsync () {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './public'), 'utf8', (err, files) => {
      if (err) {
        reject(err)
      }
      console.log('[files] ', files)
      resolve(files)
    })
  })
}

/**
 * readFile 的 async 版本
 * @returns {Promise<unknown>}
 */
function readFileAsync (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath), 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

/**
 * 验证路由最后一个片段信息是否跟静态文件相符合
 * @param reqUrl
 * @param localFileName
 * @returns {boolean}
 */
function testReqUrl (reqUrl, localFileName) {
  const routeSeg = reqUrl.split('/')
  const reqFileName = routeSeg[routeSeg.length - 1]
  // console.log('[reqFileName] ', reqFileName)
  // console.log('[localFileName] ', localFileName)
  const reg = new RegExp(reqFileName, 'g')
  return reg.test(localFileName)
}

/**
 * 通用 logger
 * @param ctx
 * @param result
 */
function logger (ctx, result) {
  const [err, data] = result
  const curTime = moment().format('YYYY-MM-DD hh:mm:ss')
  let logPrefix= `[logging] ${curTime} ${ctx.request.url} `
  if (err) {
    logPrefix += 'Error: ' + err.message
    console.log(logPrefix)
  } else {
    logPrefix += 'Success!'
    console.log(logPrefix)
  }
}
