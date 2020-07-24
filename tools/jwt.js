const jwt = require('jsonwebtoken')
const globalConfig = require('../global-config')

class JWT {}

JWT.sign = ({ payload }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, globalConfig.privateKey, { expiresIn: '7d' }, (err, token) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

JWT.verify = ({ _token }) => {
  return new Promise((resolve, reject) => {
    jwt.verify(_token, globalConfig.privateKey, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })
}

module.exports = JWT
