// // 1.引入管理员模块
// const admin = require("../db/admin");
// // jwt 加密文件
let jwt = require("jsonwebtoken");
// // let formidable = require("formidable");
// // const path = require("path");
let {
    Registers,
    Logins,
    getLookforsb
} = require('../db/admin')

// 注册
exports.Register = (req, res) => {

    let {
        username,
        password,
    } = req.body
    if (user.length === 0) {

        return res.json({
            coode: '444',
            message: '请输入昵称'
        })
    }
    if (username.length === 0) {
        return res.json({
            coode: '444',
            message: '请输入账号'
        })
    }
    if (password.length < 6) {
        return res.json({
            coode: '444',
            message: '请输入密码并且密码长度不能小于6位'
        })
    }
    let idxa = Math.floor(Math.random() * 7);
    let img = [
        'http://img4.imgtn.bdimg.com/it/u=3763361734,3803669044&fm=26&gp=0.jpg',
        'http://img2.imgtn.bdimg.com/it/u=184803235,1555534009&fm=11&gp=0.jpg',
        'http://img3.imgtn.bdimg.com/it/u=2399491043,784806262&fm=26&gp=0.jpg',
        'http://img1.imgtn.bdimg.com/it/u=3311096003,2459030550&fm=26&gp=0.jpg',
        'http://img4.imgtn.bdimg.com/it/u=3032770652,458815004&fm=26&gp=0.jpg',
        'http://img4.imgtn.bdimg.com/it/u=1825300561,2663961625&fm=26&gp=0.jpg',
        'http://img3.imgtn.bdimg.com/it/u=1363526049,1483812480&fm=11&gp=0.jpg'
    ]
    let rilist = {
        user,
        username,
        password,
        portrait: img[idxa],
        sex: '保密',
        age: 0,
        autograph: user + '欢迎您的加入',
        date: new Date()
    }
    Registers(rilist, (data) => {
        res.json(data)
    })
}

// 登录
exports.Login = (req, res) => {
    const {
        username,
        password
    } = req.body;
    Logins({
        username
    }, (datas) => {
        if (datas.length == 0) {
            res.json({
                code: 444,
                message: "该用户未注册"
            });
            return
        }
        if (datas[0].password !== password) {
            res.json({
                code: 444,
                message: "密码不正确"
            })
            return
        }
        res.json({
            code: 20000,
            data: {
                token: jwt.sign({
                    username: datas[0].username
                }, "abcd", {
                    // 过期时间
                    expiresIn: "1h"
                })
            },
            message: "登录成功"
        });
    })
}

// 获取当前登录用户信息
exports.GetInfo = (req, res) => {
    jwt.verify(req.query.token, 'abcd', function (err, decode) {
        if (err) {
            res.json({
                code: 5005,
                data: "success",
                message: "登录时间已过期，请重新登录"
            });
        } else {
            Logins({
                username: decode.username
            }, (data) => {
                if (data.length) {
                    res.json({
                        code: 20000,
                        data: {
                            user: data[0].user,
                            username: data[0].username,
                            portrait: data[0].portrait,
                            sex: data[0].sex,
                            age: data[0].age,
                            autograph: data[0].autograph,
                            token: jwt.sign({
                                username: data[0].username
                            }, "abcd", {
                                // 过期时间
                                expiresIn: "1h"
                            })
                        }
                    });
                } else {
                    res.json({
                        code: 50008,
                        message: "登录失败，无法获取用户详细信息"
                    });
                }
            });
        }
    })
}

// 查找好友
exports.LookForsb = (req, res) => {
    getLookforsb(req.body, (data) => {
        if (!data.length === 0) {
            return res.json({
                code: 444,
                message: '你查找的好友不存在'
            })
        }
        // 克隆
        let obj = JSON.parse(JSON.stringify(data[0]))
        // 删除对象里面的
        delete obj.password
        res.send({
            code: 200,
            data: obj
        })
    })

}

// // 


// // 退出登录
// exports.Logout = (req, res) => {
//     res.json({
//         code: 20000,
//         data: "success"
//     });
// }