

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

let messageTableSchema = new mongoose.Schema({
    username: String,
    messageList:Array
}, {
    collection: 'messageTable'
})

let messageTables = mongoose.model('messageTable', messageTableSchema)


//  消息列表
exports.setMessageTables = (data, callback) => {
    messageTables.create(data).then(times => {
        callback(times)
    })
}
// 给消息列表添加数据
// exports.setMessageTables = (data, callback) => {
//     messageTables.create(data).then(times => {
//         callback(times)
//     })
// }