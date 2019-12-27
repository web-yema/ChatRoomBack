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

let groupSchema = new mongoose.Schema({
    roomNumber: String,
    username: String,
    user: String,
    groupMembers: Array,
    autograph: String,
    portrait: String,
    date: Date,
}, {
    collection: 'groupUser'
})
// groupUser

let Group = mongoose.model('groupUser', groupSchema)


//  创建群
exports.setGroup = (data) => {
    return Group.create(data)
}

// // 查找群
exports.getGrouporsb = (data) => {
    return Group.find(data)
}
// 修改
exports.UpdateGroupor = (roomNumber,data) => {
    return Group.updateOne(roomNumber,{
        $set: data
    })
}