const moment = require('moment')
const colors = require('colors/safe') // 打印控制台添加颜色

class Logger {
  constructor ({ url }) {
    this.url = url
  }

  success (msg) {
    return `[${this._getTime()} Success '${this.url}'] ${msg}`
  }

  err (err) {
    return `[${this._getTime()} Error '${this.url}'] ${err.message}`
  }

  log (ctx) {
    const res = ctx.body
    if (!res) {
      console.log(colors.red(`[${this._getTime()}] Error '${this.url}' Internal Server Error`))
      return
    }
    const { code, msg, data, message } = res
    let logMsg = ''
    if (code === 200) {
      logMsg = colors.magenta(`[${this._getTime()}] Success '${this.url}' ${JSON.stringify(data)}`)
    } else {
      logMsg = colors.red(`[${this._getTime()}] Error '${this.url}' ${msg} ${message}`)
    }
    console.log(logMsg)
  }

  _getTime () {
    return moment().format('YYYY-MM-DD hh:mm:ss')
  }
}

module.exports = Logger
