const { DataTypes, Model, Op } = require('sequelize')
const sequelize = require('../database/db')

const GET_USER_INFO_BY_ID = 'GET_USER_INFO_BY_ID'
const ADD_USER = 'ADD_USER'
const DEL_USER_BY_ID = 'DEL_USER_BY_ID'
const GET_ALL_USERS = 'GET_ALL_USERS'

// class User extends Model {
//   constructor () {
//     super()
//   }
//   /**
//    * 静态方法, get user info by id
//    * @param id
//    * @returns {Promise<User>}
//    */
//   static async getUserInfoById ({ id }) {
//     console.log('id is: ', id)
//     const result = await super.findByPk(id)
//     if (Object.prototype.toString.call(result) === '[object Null]') {
//       throw new Error('找不到此用户')
//     } else {
//       return result
//     }
//   }
// }

// User.init({
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   username: {
//     type: DataTypes.STRING(100),
//     unique: true
//   },
//   password: DataTypes.STRING(100),
//   deleted: {
//     type: DataTypes.TINYINT,
//     defaultValue: 0,
//     allowNull: false
//   }
// }, {
//   sequelize,
//   // 默认 true; false 时,  会自动给表名表示为复数, user => users
//   freezeTableName: true,
//   // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
//   timestamps: true,
//   tableName: 'users'
// })

// 尝试改写为 class 样式, 以失败告终, 具体表现:
// 改写为 class 样式之后, 如上所示, 获取到的实例信息结构: { id: null, deleted: 0 }, 且未找到解决方法
// 因此沿用此方式
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
  password: DataTypes.STRING(100),
  deleted: {
    type: DataTypes.TINYINT,
    defaultValue: 0,
    allowNull: false
  }
}, {
  // 默认 true; false 时,  会自动给表名表示为复数, user => users
  freezeTableName: true,
  // 默认 true, 表示数据库中是否会自动更新 createAt 和 updateAt 字段, false 表示不会增加这个字段
  timestamp: true
})

/**
 * 根据 id 获取用户信息 通用方法
 * @param id
 * @returns {Promise<Model<any, TModelAttributes>>}
 * @constructor
 */
User[GET_USER_INFO_BY_ID] = async function ({ id }) {
  const result = await User.findOne({
    where: {
      id: [id],
      deleted: {
        [Op.not]: 1
      }
    }
  })
  if (Object.prototype.toString.call(result) === '[object Null]') {
    throw new Error('找不到此用户')
  } else {
    return result
  }
}

/**
 * 创建用户
 * @param username 用户名
 * @param password 密码, 照理说应该使用 md5 加密
 * @returns {Promise<Model<any, TModelAttributes>>}
 * @constructor
 */
User[ADD_USER] = async function ({ username, password }) {
  const result = await User.create({ username, password })
  if (!result) {
    throw new Error('创建失败')
  }
  return result
}

/**
 * 获取所有用户, 添加 deleted 验证
 * @returns {Promise<Model<TModelAttributes, TCreationAttributes>[]>}
 * @constructor
 */
User[GET_ALL_USERS] = async function () {
  return await User.findAll({
    where: {
      deleted: {
        [Op.not]: 1
      }
    }
  })
}

/**
 * 根据 id 删除某用户; 软删除, 改 deleted 为 1
 * @param id
 * @returns {Promise<[number, Model<TModelAttributes, TCreationAttributes>[]]>}
 * @constructor
 */
User[DEL_USER_BY_ID] = async function ({ id }) {
  return await User.update({ deleted: 1 }, {
    where: {
      id: [id]
    }
  })
}

;(async () => {
  // alter 同步, 并做整合
  await User.sync({ force: false, alter: true })
})()

module.exports = User
