let mongoose = require('mongoose')
let {
  Admin: {
    db_url
  }
} = require('./mongo')

mongoose.connect(db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

let messageSchema = new mongoose.Schema({
    username: String,
    massageList: Array,
}, {
  collection: 'friendMessage'
})

let friendMessages = mongoose.model('friendMessage', messageSchema)
 
//添加好友提示列表
exports.AddFriendMessages = (data, callback) => {
    return friendMessages.create(data).then(data=>{
      callback(data)
    })
}

//  查找添加好友列表
exports.getFindesMessages = (data) => {
  return friendMessages.findOne(data)
}

//  修改添加好友列表
exports.upDateMessages = (username, data) => {
  return friendMessages.updateOne({
    username
  }, {
    $set: data
  })
}