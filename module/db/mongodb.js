// 封装mongodb模块
var MongoClient = require('mongodb').MongoClient;

var db_url = "mongodb://root:123456@47.94.12.180:27017";

function AdminConnect(biao, callbak) {
    MongoClient.connect(db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db(biao);
        callbak(dbo, db)
    })
}


exports.Logins = (data, callback) => {
    AdminConnect('mobileBack', (dbo, db) => {
        dbo.collection("adminBack").find({
            adminName: data.adminName
        }).toArray(function (err, result) {
            callback(result)
        })
    })
}

exports.Registers = (data, callback) => {
    AdminConnect('mobileBack', (dbo, db) => {
        dbo.collection("adminBack").find({
            adminName: data.adminName
        }).toArray(function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                return callback({
                    code: 20000,
                    data: "warning",
                    message: "用户名已存在"
                })
            }
            AdminConnect('mobileBack', (dbo, db) => {
                dbo.collection("adminBack").find({
                    adminName: data.adminName
                }).toArray(function (err, datas) {
                    if (err) throw err;
                    if (datas.length > 0) {
                        return callback({
                            code: 20000,
                            data: "warning",
                            message: "邮箱已存在"
                        })
                    }
                    AdminConnect('mobileBack', (dbo, db) => {
                        dbo.collection("adminBack").insertOne(data, function (err, res) {
                            if (err) throw err;
                            callback({
                                code: 20000,
                                data: "success",
                                message: "注册成功"
                            })
                            db.close();
                        });
                    })
                    db.close();
                })
            })
            db.close();
        });
    })
}



exports.HomeBanner = (data, callback) => {
    console.log(data);
    AdminConnect('mobileBack', (dbo, db) => {
        dbo.collection("loop").insertOne(data, function (err, res) {
            if (err) throw err;
            callback({
                code: 20000,
                data: "success",
                message: "上传成功"
            })
            db.close();
        });

    })
}