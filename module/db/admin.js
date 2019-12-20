let mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
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
      callback({
        code: 20000,
        data: "success",
        message: "注册成功"
      })
    })
    MongoClient.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, function (err, db) {
      if (err) throw err;
      var dbase = db.db("chatRoom");
      dbase.createCollection(data.username, function (err, res) {
        if (err) throw err;
        db.close();
      });
    });
  })
}

// 查找好友
exports.getLookforsb = (data, callback) => {
  Admin.find(data).then(item => {
    callback(item)
  })
}