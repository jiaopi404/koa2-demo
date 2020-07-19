const Router = require('koa-router')
const globalConfig = require('../global-config')
const UserApi = require('./user-api')

const apiList = {
  '/user': UserApi
}

function apiInstaller (list, router) {
  for (const [path, api] of Object.entries(list)) {
    router.use(globalConfig.version + path, api.routes())
  }
}

const router = new Router()

apiInstaller(apiList, router)

module.exports = router
