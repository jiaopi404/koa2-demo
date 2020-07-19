const { Sequelize } = require('sequelize')
const config = require('./config')

// console.log('[database sequelize] init ...', config)

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false
  }
)

// sequelize.authenticate().then(res => {
//   console.log('Connection has been established successfully.', res)
// }).catch(err => {
//   console.error('Unable to connect to the database:', err)
// })

module.exports = sequelize
