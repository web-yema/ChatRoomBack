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

let friendsSchema = new mongoose.Schema({
    username: String,
    data: Array,
    prestorage: Array,
}, {
    collection: 'FriendsList'
})

let friendSchema = mongoose.model('FriendsList', friendsSchema)
// 添加好友
exports.AddFriend = (data, callback) => {
    friendSchema.create(data).then(item => {
        callback(item)
    })
}
// 修改好友列表
exports.UpdateFriend = (condition, data, callback) => {
    friendSchema.updateOne(condition, {
        $set: data
    }).then(item => {
        callback(item)
    })
}
// 获取好友列表
exports.friendslist = (data, callback) => {
    friendSchema.find(data).then(item => {
        callback(item)
    })
}

// 获取好友列表
exports.friendsListS = (data) => {
    return friendSchema.findOne(data)
}

// 修改好友列表
exports.FriendUpdate = (condition, data) => {
    return friendSchema.updateOne(condition, {
        $set: data
    })
}