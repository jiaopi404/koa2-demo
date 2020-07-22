const WebSocket = require('ws')

class WS {
  constructor ({ port }) {
    this.ws = null
    this.wss = null
    this.port = port
  }

  init () {
    return new Promise((resolve ,reject) => {
      this.wss = new WebSocket.Server({ port: this.port }, (server) => {
        console.log('[websocket server]')
      })
      this.wss.on('connection', ws => {
        console.log('[websocket connected!]')
        this.ws = ws
        resolve()
      })
    })
  }
}

module.exports = WS
