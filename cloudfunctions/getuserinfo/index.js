// 云函数入口文件
const cloud = require('wx-server-sdk')


cloud.init({
  env: 'poem-bot-ggcfz'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  resolve(event)
})