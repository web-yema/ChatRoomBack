let {
    AddFriends,
    AddFriendState,
    setAgree
} = require('../db/home')

let {
    getLookforsb
} = require('../db/admin')
let {
    setGroup,
    getGrouporsb
} = require('../db/group')

// 添加好友
exports.addFriends = (req, res) => {
    console.log(req.body);
    let {
        newFriendUsername,
        username
    } = req.body
    // 我添加好友的
    AddFriends(username, {
        newFriendUsername: newFriendUsername,
        roomNumber: newFriendUsername + username,
        stateValue: 2,
        groupChat: 1,
    }, (data) => {
        newAddFriends()
    })

    function newAddFriends() {
        AddFriends(newFriendUsername, {
            newFriendUsername: username,
            roomNumber: newFriendUsername + username,
            stateValue: 1,
            groupChat: 1,
        }, (datas) => {
            res.json({
                code: 200,
                message: '已经添加等待验证'
            })
        })
    }
}
// 创建群
exports.createGroup = (req, res) => {
    // groupAccount:String,
    // username: String,
    // user: String,
    // portrait: String,
    // autograph: String,
    // groupMembers:Array,
    let {
        username,
        groupMembers,
        user,
    } = req.body
    let userId = username.slice(0, 3) + new Date().getTime()
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
    setGroup({
        groupAccount: userId,
        username,
        user,
        groupMembers,
        portrait: img[idxa],
        autograph: `${user}欢迎建群`,
        date: new Date().getTime(),
    }, (data) => {
        if (data.code === 20000) {
            // 我添加好友的
            groupMembers.map((item, index) => {
                // console.log(item);
                AddFriends(userId, {
                    newFriendUsername: item,
                    stateValue: 3,
                    roomNumber: userId,
                    groupChat: 2,
                }, (datas) => {})
                AddFriends(item, {
                    newFriendUsername: userId,
                    stateValue: 3,
                    roomNumber: userId,
                    groupChat: 2,
                }, (items) => {
                    if (groupMembers.length - 1 === index) {
                        res.json({
                            code: 20000,
                            message: '创建成功'
                        })
                    }
                })
            })
        }
    })
}

// 好友查询
exports.addFriendStates = (req, res) => {

    let {
        username,
        stateValue,
        groupChat
    } = req.body
    let aaa = {}
    if (stateValue && groupChat) {
        aaa = {
            stateValue,
            groupChat
        }

    } else if (stateValue) {
        aaa = {
            stateValue,
        }
    } else {
        aaa = {}
    }
    // console.log(username);
    // console.log(username, aaa);
    AddFriendState(username, aaa, (datas) => {
        if (datas.code === 20000) {
            let arrs = []
            let arrsGroup = []
            let chaList = []
            let ids = datas.data.length
            datas.data.map((item, index) => {

                if (stateValue && item.groupChat === 2) {
                    getGrouporsb({
                        username: item.newFriendUsername
                    }, (data) => {
                        let obj = JSON.parse(JSON.stringify(data[0]))
                        let items = JSON.parse(JSON.stringify(item))
                        arrsGroup.push({
                            ...obj,
                            ...items
                        })

                        if (arrsGroup.length == datas.data.length) {
                            res.json({
                                code: 20000,
                                data: arrsGroup
                            })
                        }
                    })
                } else if (stateValue) {
                    getLookforsb({
                        username: item.newFriendUsername
                    }, (data) => {
                        let obj = JSON.parse(JSON.stringify(data[0]))
                        let items = JSON.parse(JSON.stringify(item))
                        // 删除对象里面的password
                        delete obj.password
                        delete obj.username
                        arrs.push({
                            ...obj,
                            ...items
                        })
                        if (arrs.length == datas.data.length) {
                            res.json({
                                code: 20000,
                                data: arrs
                            })
                        }
                    })
                } else {
                    // console.log(item);
                    if (item.groupChat == 2) {
                        ids--
                        getGrouporsb({
                            username: item.newFriendUsername
                        }, (data) => {
                            let obj = JSON.parse(JSON.stringify(data[0]))
                            AddFriendState(obj.username, {
                                stateValue: {
                                    $ne: 3
                                }
                            }, (datas) => {
                                // console.log(datas);
                            })
                            // chaList.push(obj)
                            // if (chaList.length == datas.data.length) {
                            //     res.json({
                            //         code: 20000,
                            //         data: chaList
                            //     })
                            // }
                        })
                    } else {
                        getLookforsb({
                            username: item.newFriendUsername
                        }, (data) => {
                            let obj = JSON.parse(JSON.stringify(data[0]))
                            let items = JSON.parse(JSON.stringify(item))
                            // 删除对象里面的password
                            delete obj.password
                            delete obj.username
                            chaList.push({
                                ...obj,
                                ...items
                            })
                            if (chaList.length == ids) {
                                res.json({
                                    code: 20000,
                                    data: chaList
                                })
                            }
                        })
                    }
                }

            })
        }
    })
}
// 同意
exports.Agree = (req, res) => {
    let {
        newFriendUsername,
        username,
        stateValue
    } = req.body
    setAgree(username, newFriendUsername, stateValue, (data) => {
        setAgree(newFriendUsername, username, stateValue, (datas) => {
            res.json({
                code: 20000,
                data: "添加成功"
            })
        })

    })
}

// 查询列表