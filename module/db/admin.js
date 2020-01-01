let mongoose = require('mongoose')
// var MongoClient = require('mongodb').MongoClient;
let {
  Admin: {
    db_url
  }
} = require('./mongo')

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let adminSchema = new mongoose.Schema({
  user: String,
  username: String,
  password: String,
  portrait: String,
  sex: String,
  age: Number,
  autograph: String,
  date: Date,
}, {
  collection: 'admin'
})

let Admin = mongoose.model('admin', adminSchema)

// 登录
exports.Logins = (data, callback) => {
  Admin.find(data).then(item => {
    callback(item)
  })
}
// 注册
exports.Registers = (data, callback) => {
  Admin.find({
    username: data.username
  }).then(datas => {
    if (datas.length > 0) {
      return callback({
        code: 444,
        data: "warning",
        message: "账号已存在"
      })
    }
    Admin.create(data).then(times => {
      return callback({
        code: 20000,
      })
    })
  })
}

// 查找好友
exports.getLookforsb = (data, callback) => {
  Admin.find(data).then(item => {
    callback(item)
  })
}
//  查找好友列表
exports.getFindes = (data) => {
  return Admin.find(data)
}

//  修改头像
exports.HeadPortrait = (username, data) => {
  return Admin.updateOne({
    username
  }, {
    $set: data
  })
}