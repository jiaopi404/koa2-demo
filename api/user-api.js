const model = require('../models')
const Router = require('koa-router')
const JWT = require('../tools/jwt')

const router = new Router()
const User = model.User

const GET_ALL_USER = '/get_all' // get
const GET_USER_BY_ID = '/get_user/:id' // get { params: id }
const REGISTER = '/register' // post { data: { username, password } }
const LOGIN = '/login' // post { data: { username, password } }
const GET_USER_INFO = '/get_user_info' // get
const DEL_USER = '/del_user/:id' // post { params: id }

router.get(GET_ALL_USER, async ctx => {
  try {
    const result = await User['GET_ALL_USERS']()
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

// TODO: 将创建用户的逻辑封装到 Model 层, 本初只做必要的验证
router.post(REGISTER, async ctx => {
  try {
    const { username, password } = ctx.request.body
    if (!username) {
      ctx.body = { code: -1, msg: '缺失用户名', data: ctx.request.body }
    }
    if (!password) {
      ctx.body = { code: -1, msg: '缺失密码', data: ctx.request.body }
    }
    const result = await User['ADD_USER']({ username, password })
    ctx.body = { code: 200, msg: '注册成功', data: result }
  } catch (err) {
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

router.post(LOGIN, async ctx => {
  try {
    const { username, password } = ctx.request.body
    if (!username) {
      ctx.body = { code: -1, msg: '缺失用户名', data: ctx.request.body }
    }
    if (!password) {
      ctx.body = { code: -1, msg: '缺失密码', data: ctx.request.body }
    }
    const result = await User.findAll({
      where: {
        username: [username],
        password: [password]
      }
    })
    if (result.length) {
      // 找到了
      const thatUser = result[0]
      const _token = await JWT.sign({
        payload: { id: thatUser.id, username: thatUser.username }
      })
      ctx.body = { code: 200, msg: '登录成功', data: result, _token }
    } else {
      ctx.body = { code: -1, msg: '登录失败', data: ctx.request.body }
    }
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
    const queryResult = await User['GET_USER_INFO_BY_ID']({ id })
    ctx.body = { code: 200, data: queryResult }
  } catch (err) {
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

router.post(DEL_USER, async ctx => {
  try {
    const { id } = ctx.params
    if (!id) {
      ctx.body = { code: -1, msg: '缺失 id 参数', data: {} }
      return
    }
    const queryResult = await User['DEL_USER_BY_ID']({ id })
    ctx.body = { code: 200, data: queryResult, msg: '删除成功' }
  } catch (err) {
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

router.get(GET_USER_INFO, async ctx => {
  try {
    const { id } = ctx.JWT
    const queryResult = await User['GET_USER_INFO_BY_ID']({ id })
    ctx.body = { code: 200, data: queryResult }
  } catch (err) {
    ctx.body = { code: 500, msg: '服务器内部错误', message: err.message }
  }
})

module.exports = router
