const moment = require('moment')
const path = require('path')
const fs = require('fs')
const util = require('util')
const colors = require('colors/safe') // 打印控制台添加颜色

const LOG_DIR = './logs'

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

  async log (ctx) {
    try {
      const res = ctx.body
      if (!res) {
        // console.log(colors.red(`[${this._getTime()}] Error '${this.url}' Internal Server Error`))
        const logMessage = `[${this._getTime()}] Error '${this.url}' Internal Server Error \n`
        await this._writeToLog({ logMessage })
        return
      }
      const { code, msg, data, message } = res
      let logMsg = ''
      if (code === 200) {
        logMsg = `[${this._getTime()}] Success '${this.url}' ${JSON.stringify(data)} \n`
      } else {
        logMsg = `[${this._getTime()}] Error '${this.url}' ${msg} ${message} \n`
      }
      await this._writeToLog({ logMessage: logMsg })
    } catch (err) {
      console.log(err)
    }
    // console.log(logMsg)
  }

  _getTime () {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }

  /**
   * 写入文件方法
   * @param logMessage 传入的 log message
   * @returns {Promise<void>}
   * @private
   */
  async _writeToLog ({ logMessage }) {
    try {
      // 检查文件夹
      const mkdir = util.promisify(fs.mkdir)
      if (!fs.existsSync(path.resolve(__dirname, LOG_DIR))) {
        // 表示没有 log 文件夹
        await mkdir(path.resolve(__dirname, LOG_DIR))
      }
      // 写入文件
      const currentDay = moment().format('YYYY-MM-DD') // 文件名
      const appendFile = util.promisify(fs.appendFile)
      await appendFile(path.resolve( __dirname, LOG_DIR + '/' + currentDay + '.txt'), logMessage)
      console.log(logMessage)
    } catch (err) {
      const errorMessage = colors.red(`[${this._getTime()}] Error ${err.message}`)
      console.log(errorMessage)
    }
  }
}

module.exports = Logger
