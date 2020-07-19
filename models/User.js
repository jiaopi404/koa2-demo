const { Sequelize } = require('sequelize')
const sequelize = require('../database/db')

const User = sequelize.define('users', {
  username: {
    type: Sequelize.STRING(100),
    unique: true
  },
  password: Sequelize.STRING(100)
}, {
  // 默认 true, 会自动给表名表示为复数, user => users
  freezeTableName: false,
  // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
  timestamp: true
})

// 创建表
User.sync({
  // 默认 false, true 则是删除原有的表, 再创建
  force: false
})

module.exports = User
