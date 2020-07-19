const moment = require('moment')

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
    const { code, msg, data } = res
    let logMsg = ''
    if (code === 200) {
      logMsg = `[${this._getTime()}] Success '${this.url}' ${JSON.stringify(data)}`
    } else {
      logMsg = `[${this._getTime()}] Error '${this.url}' ${msg}`
    }
    console.log(logMsg)
  }

  _getTime () {
    return moment().format('YYYY-MM-DD hh:mm:ss')
  }
}

module.exports = Logger
