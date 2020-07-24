const { DataTypes, Model } = require('sequelize')
const sequelize = require('../database/db')

class User extends Model {
  constructor () {
    super()
  }
  /**
   * 静态方法, get user info by id
   * @param id
   * @returns {Promise<User>}
   */
  static async getUserInfoById ({ id }) {
    console.log('id is: ', id)
    const result = await super.findByPk(id)
    if (Object.prototype.toString.call(result) === '[object Null]') {
      throw new Error('找不到此用户')
    } else {
      return result
    }
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    unique: true
  },
  password: DataTypes.STRING(100),
  deleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  }
}, {
  sequelize,
  // 默认 true; false 时,  会自动给表名表示为复数, user => users
  freezeTableName: true,
  // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
  timestamps: true,
  tableName: 'users'
})

// // TODO: 尝试改写为 class 样式
// const User = sequelize.define('users', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   username: {
//     type: DataTypes.STRING(100),
//     unique: true
//   },
//   password: DataTypes.STRING(100)
// }, {
//   // 默认 true; false 时,  会自动给表名表示为复数, user => users
//   freezeTableName: true,
//   // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
//   timestamp: true
// })

// User.getUserInfoById = async function (id) {
//   const result = await User.findAll({
//     where: {
//       id: id
//     }
//   })
//   if (result.length === 0) {
//     throw new Error('无数据')
//   } else {
//     return result[0]
//   }
// }
// 创建表
// User.sync({
//   // 默认 false, true 则是删除原有的表, 再创建
//   force: false
// })
;(async () => {
  await User.sync({ force: false, alter: true })
})()

module.exports = User
