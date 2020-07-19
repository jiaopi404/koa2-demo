const model = require('../models')
const Router = require('koa-router')

const router = new Router()
const User = model.User

const GET_ALL_USER = '/get_all'
const CREATE_USER = '/create_user'

router.get(GET_ALL_USER, async ctx => {
  try {
    const result = User.getAll()
    if (result) {
      ctx.body = {
        code: 200,
        data: result
      }
    } else {
      console.log('[mysql] no data', result)
      ctx.body = {
        code: 200,
        data: []
      }
    }
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: err.message
    }
  }
})

router.get(CREATE_USER, async ctx => {
  const { username, password } = ctx.request.body
  try {
    if (!username) {
      ctx.body = { code: -1, msg: '缺失用户名', data: ctx.request.body }
    }
    if (!password) {
      ctx.body = { code: -1, msg: '缺失密码', data: ctx.request.body }
    }
    const result = await User.create({
      username,
      password
    })
    ctx.body = { code: 200, msg: '添加成功', data: result }
  } catch (err) {
    console.log(err)
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

module.exports = router
