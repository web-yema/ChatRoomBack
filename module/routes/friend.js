let {
    friendslist,
    AddFriend,
    UpdateFriend,
} = require('../db/friends-list')
let {
    getLookforsb,
    getFindes
} = require('../db/admin')

// 添加好友
exports.AddFriend = (req, res) => {
    let {
        username,
        title,
        nweusername,
        newuser,
        remarks
    } = req.body
    addfriends(username, title, {
        username: nweusername,
        roomNumber: username + nweusername,
        remarks: remarks,
        stateValue: 2,
        messageList: [],
        messageValue: 1,
    })

    addfriends(nweusername, title, {
        username: username,
        roomNumber: username + nweusername,
        remarks: newuser,
        stateValue: 1,
        messageList: [],
        messageValue: 1,
    })

    function addfriends(username, title, FriendsData) {
        if (username != req.body.username) {
            title = '我的好友'
        }
        let obj = {
            title: title,
            FriendsList: [
                FriendsData
            ]
        }

        friendslist({
            username
        }, (data) => {
            if (data.length === 0) {
                let AddFriendObj = {
                    username,
                    data: [{
                            title: '我的好友',
                            FriendsList: []
                        },
                        {
                            title: '同学',
                            FriendsList: []
                        }
                    ],
                    prestorage: [
                        obj
                    ]
                }
                AddFriend(AddFriendObj, (datas) => {
                    if (username != req.body.username) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }
                })
                return
            }
            let prestorage = data[0].prestorage.find(item => item.title === title)
            if (!prestorage) {
                data[0].prestorage = [...data[0].prestorage, obj]
                UpdateFriend({
                    username,
                }, {
                    prestorage: data[0].prestorage
                }, (datat) => {
                    if (username != req.body.username) {
                        if (datat.n === 1 && datat.ok === 1) {
                            res.json({
                                code: 20000,
                                message: '添加成功'
                            })
                        } else {
                            res.json({
                                code: 4004,
                                message: '添加失败'
                            })
                        }
                    }
                })
                return
            }
            let friendsState = prestorage.FriendsList.find(item => item.username === FriendsData.username)
            if (friendsState) {
                if (username != req.body.username) {
                    res.json({
                        code: 20000,
                        message: '该好友已经从在'
                    })
                }
                return
            }
            prestorage.FriendsList = [...prestorage.FriendsList, FriendsData]
            UpdateFriend({
                username,
            }, {
                prestorage: data[0].prestorage
            }, (datat) => {
                if (username != req.body.username) {
                    if (datat.n === 1 && datat.ok === 1) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    } else {
                        res.json({
                            code: 4004,
                            message: '添加失败'
                        })
                    }
                }
            })
        })
    }
}

// 获取好友分类
exports.friendslist = (req, res) => {
    friendslist(req.body, (data) => {
        // 存储一份
        let datas = JSON.parse(JSON.stringify(data[0]))
        let idx = datas.data.filter(item => item.FriendsList.length !== 0).length - 1
        let ids = datas.data.filter(item => item.FriendsList.length == 0).length
        let arrList = []
        datas.data.map((item, index) => {
            if (item.FriendsList.length == 0) {
                arrList[index] = datas.data[index]
                if (datas.data.length == ids) {
                    res.json({
                        code: 20000,
                        data: arrList
                    })
                }
            }
            //  通过账号获取每一个学生的详细信息
            item.FriendsList.map(async (items, indexa) => {
                let aa = await getFindes({
                    username: items.username
                })
                let ime = JSON.parse(JSON.stringify(items))
                // 把详细信息里面的密码删除
                delete ime.password
                let dat = JSON.parse(JSON.stringify(aa[0]))
                // 合并数据
                datas.data[index].FriendsList[indexa] = {
                    ...ime,
                    ...dat
                }
                if (item.FriendsList.length - 1 == indexa) {
                    arrList[index] = datas.data[index]
                    if (index == idx) {
                        setTimeout(() => {
                            console.log(arrList);
                            // let ssss = arrList.map(item => item)
                            // console.log(ssss);
                            res.json({
                                code: 20000,
                                data: arrList
                            })
                        }, 10)
                    }
                }
            })
        })
    })
}


// 获取添加列表
exports.newFriendlist = (req, res) => {
    friendslist(req.body, (data) => {

        // 存储一份
        let datas = JSON.parse(JSON.stringify(data[0]))
        // console.log(datas);
        let idx = datas.prestorage.filter(item => item.FriendsList.length !== 0).length - 1
        let ids = datas.prestorage.filter(item => item.FriendsList.length == 0).length
        let arrList = []
        datas.prestorage.map((item, index) => {
            if (item.FriendsList.length == 0) {
                arrList[index] = datas.prestorage[index]
                if (datas.prestorage.length == ids) {
                    res.json({
                        code: 20000,
                        data: arrList
                    })
                }
            }
            //  通过账号获取每一个学生的详细信息
            item.FriendsList.map(async (items, indexa) => {
                let aa = await getFindes({
                    username: items.username
                })
                let ime = JSON.parse(JSON.stringify(items))
                // 把详细信息里面的密码删除
                delete ime.password
                let dat = JSON.parse(JSON.stringify(aa[0]))
                // 合并数据
                datas.prestorage[index].FriendsList[indexa] = {
                    ...ime,
                    ...dat
                }
                if (item.FriendsList.length - 1 == indexa) {
                    arrList[index] = datas.prestorage[index]
                    if (index == idx) {
                        let aa = arrList.map(itemss => itemss.FriendsList[0])
                        res.json({
                            code: 20000,
                            data: aa
                        })
                    }
                }
            })
        })
    })
}



// 删除好友
exports.DeleteFriend = (req, res) => {
    let {
        username,
        title,
        FriendsData
    } = req.body
    friendslist({
        username
    }, (data) => {
        let friendsfind = data[0].data.find(item => item.title === title)
        let aa = friendsfind.FriendsList.filter(item => item.username === FriendsData.username)
        if (aa.length !== 0) {
            friendsfind.FriendsList = friendsfind.FriendsList.filter(item => item.username !== FriendsData.username)
            UpdateFriend({
                username,
            }, data[0].data, (datat) => {
                if (datat.n === 1 && datat.ok === 1) {
                    res.json({
                        code: 20000,
                        message: '删除成功'
                    })
                } else {
                    res.json({
                        code: 4004,
                        message: '删除失败'
                    })
                }
            })
        } else {
            res.json({
                code: 4004,
                message: '删除失败'
            })
        }
    })
}


// 好友同意
exports.ConsentFriend = (req, res) => {
    let {
        username,
        nweusername
    } = req.body
    consentfriend(username, nweusername)
    consentfriend(nweusername, username)

    function consentfriend(username, nweusername) {
        friendslist({
            username
        }, (data) => {
            let prestorageLsit = data[0].prestorage.find(item => item.FriendsList.find(items => items.username === nweusername))
            let FriendsList = prestorageLsit.FriendsList.find(item => item.username === nweusername)
            if (FriendsList.stateValue === 3) {
                if (username !== req.body.username) {
                    res.json({
                        code: 4004,
                        message: '好友已经添加'
                    })
                }
                return
            }

            FriendsList['stateValue'] = 3
            FriendsList['dateTime'] = new Date()
            prestorageLsit['FriendsList'] = [FriendsList]
            let aa = data[0].data.find(item => item.title == prestorageLsit.title)
            if (!aa) {
                data[0].data = [...data[0].data, prestorageLsit]
                UpdateFriend({
                    username,
                }, {
                    data: data[0].data,
                    prestorage: data[0].prestorage
                }, (datat) => {
                    if (username !== req.body.username) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }
                })
                return
            } else {
                aa.FriendsList = [...aa.FriendsList, FriendsList]
                UpdateFriend({
                    username,
                }, {
                    data: data[0].data,
                    prestorage: data[0].prestorage
                }, (datat) => {
                    if (username !== req.body.username) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }
                })
            }
        })
    }

}