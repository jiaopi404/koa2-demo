const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    unique: true
  },
  password: DataTypes.STRING(100)
}, {
  // 默认 true, 会自动给表名表示为复数, user => users
  freezeTableName: true,
  // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
  timestamp: true
})

User.getUserInfoById = async function (id) {
  const result = await User.findAll({
    where: {
      id: id
    }
  })
  if (result.length === 0) {
    throw new Error('无数据')
  } else {
    return result[0]
  }
}
// 创建表
// User.sync({
//   // 默认 false, true 则是删除原有的表, 再创建
//   force: false
// })
;(async () => {
  await sequelize.sync({ force: false })
  // Code here
})()

module.exports = User
