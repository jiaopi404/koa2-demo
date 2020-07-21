const model = require('../models')
const Router = require('koa-router')

const router = new Router()
const User = model.User

const GET_ALL_USER = '/get_all'
const CREATE_USER = '/create_user'
const GET_USER_BY_ID = '/get_user/:id'

router.get(GET_ALL_USER, async ctx => {
  try {
    const result = await User.findAll()
    if (result) {
      ctx.body = {
        code: 200,
        data: result
      }
    } else {
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
  try {
    const { username, password } = ctx.request.body
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
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

router.get(GET_USER_BY_ID, async ctx => {
  try {
    const { id } = ctx.params
    if (!id) {
      ctx.body = { code: -1, msg: '缺失 id 参数', data: {} }
      return
    }
    const queryResult = await User.getUserInfoById(id)
    ctx.body = { code: 200, data: queryResult }
  } catch (err) {
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

module.exports = router
