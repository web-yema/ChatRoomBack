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

let groupSchema = new mongoose.Schema({
    user: String,
    username: String,
    portrait: String,
    autograph: String,
    date: Date,
}, {
    collection: 'groupUser'
})

let Group = mongoose.model('groupUser', groupSchema)


//  创建群
exports.setGroup = (data, callback) => {
    Group.create(data).then(times => {
        callback({
            code: 20000,
            data: "success",
            message: "建群成功"
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
exports.getGrouporsb = (data, callback) => {
    Group.find(data).then(item => {
        callback(item)
    })
}