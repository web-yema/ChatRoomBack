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


function Informations(usernaem) {
    let InformationSchema = new mongoose.Schema({
        newFriendUsername: String,
        stateValue: Number,
        roomNumber: String,
        groupChat: Number,
    }, {
        collection: usernaem
    })
    let Information = mongoose.model(usernaem, InformationSchema)
    return Information
}


let Informationa = {}
// 添加好友
exports.AddFriends = (username, data, callback) => {
    if (Informationa[username] === undefined) {
        Informationa[username] = Informations(username)
    }
    Informationa[username].find({
        newFriendUsername: data.newFriendUsername
    }).then(datas => {
        if (datas.length > 0) {
            callback({
                code: 444,
                data: datas,
            })
            return
        }
        Informationa[username].create(data).then(times => {
            callback({
                code: 20000,
                data: times,
            })
        })
    })
}
// 获取要添加的好友列表
exports.AddFriendState = (username, data, callback) => {
    // console.log(username, data);
    if (Informationa[username] === undefined) {
        Informationa[username] = Informations(username)
    }
    Informationa[username].find(data).sort({
        'date': 1
    }).then(datas => {
        if (datas.length == 0) {
            callback({
                code: 444,
                data: '暂无请求',
            })
            return
        }
        callback({
            code: 20000,
            data: datas
        })
    })
}
// 同意
exports.setAgree = (username, condition, data, callback) => {
    if (Informationa[username] === undefined) {
        Informationa[username] = Informations(username)
    }
    Informationa[username].updateOne({
        newFriendUsername: condition
    }, {
        $set: {
            stateValue: data
        }
    }).then(times => {
        callback({
            code: 20000,
            data: times,
        })
    })
}