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

let groupUserSchema = new mongoose.Schema({
    username: String,
    // 我创建的群
    myGroupList: Array,
    // 我添加的群
    addGroupList: Array,
    // 我管理的群
    myManagedList: Array,
}, {
    collection: 'groupUserList'
})

let GroupUser = mongoose.model('groupUserList', groupUserSchema)

//  创建群
exports.setGroupUser = (data, callback) => {
    GroupUser.create(data).then(times => {
        callback(data)
    })
}
// 给每个群成员添加群账号
exports.UpdateGroupUser = (username, data) => {
    return GroupUser.updateOne({
        username
    }, {
        $set: data
    })
}

// 获取每个用户的群
exports.findGroupUser = (username) => {
    return GroupUser.findOne(username)
}