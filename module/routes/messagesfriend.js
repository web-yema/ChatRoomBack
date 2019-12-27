let {

    getFindesMessages,
    upDateMessages
} = require('../db/friend-message')
let {
    getFindes
} = require('../db/admin')
let {
    getGrouporsb,
    UpdateGroupor
} = require('../db/group')
let {
    friendsListS,
    FriendUpdate
} = require('../db/friends-list')
let {
    findGroupUser,
    UpdateGroupUser
} = require('../db/group-list')
// 
// 添加好友
exports.AddFriend = (req, res) => {
    let {
        username,
        nweusername,
        remarks,
        newuser,
        title,
        roomNumber,
        messageValue
    } = req.body

    messageValue = messageValue ? messageValue : 1
    roomNumber = roomNumber ? roomNumber : username + nweusername
    getFindesMessagess(username, roomNumber, {
        username: nweusername,
        roomNumber,
        remarks: remarks,
        stateValue: 2,
        messageList: [],
        messageValue,
    })
    getFindesMessagess(nweusername, roomNumber, {
        username: username,
        roomNumber,
        remarks: newuser,
        stateValue: 1,
        messageList: [],
        messageValue,
    })
    async function getFindesMessagess(username, roomNumber, datalist) {
        if (messageValue !== 2) {
            if (username === req.body.username) {
                datalist = {
                    ...datalist,
                    title
                }
            } else {
                datalist = {
                    ...datalist,
                    title: '我的好友'
                }
            }
        }
        let data = await getFindesMessages({
            username
        })
        let datas = JSON.parse(JSON.stringify(data))
        if (datas.massageList.length === 0) {
            datas.massageList = [...datas.massageList, datalist]
            let dates = await upDateMessages(username, {
                massageList: datas.massageList
            })
            if (username !== req.body.username) {

                if (dates.n === 1 && dates.ok === 1) {
                    res.json({
                        code: 20000,
                        message: '添加成功'
                    })
                }
            }
            return
        }
        let users = datas.massageList.find(item => item.roomNumber === roomNumber&&item.username===username)
        if (users) {
            datas.massageList = datas.massageList.map(item => {
                if (item.roomNumber === roomNumber) {
                    return {
                        ...item,
                        ...datalist
                    }
                }
                return item
            })
            let dates = await upDateMessages(username, {
                massageList: datas.massageList
            })
            if (username !== req.body.username) {

                if (dates.n === 1 && dates.ok === 1) {
                    res.json({
                        code: 20000,
                        message: '添加成功'
                    })
                }
            }
        } else {
            datas.massageList = [...datas.massageList, datalist]
            let dates = await upDateMessages(username, {
                massageList: datas.massageList
            })
            if (username !== req.body.username) {
                if (dates.n === 1 && dates.ok === 1) {
                    res.json({
                        code: 20000,
                        message: '添加成功'
                    })
                }
            }
        }
    }
}

// 好友查询
exports.newFriendlist = async (req, res) => {
    let data = await getFindesMessages(req.body)
    let datas = JSON.parse(JSON.stringify(data))

    if (datas.massageList.length === 0) {
        return res.json({
            code: 20000,
            data: datas.massageList
        })
    }
    let dataList = []
    let id = 0
    datas.massageList.map(async (item, index) => {
        if (item.messageValue !== 2) {
            let admins = await getFindes({
                username: item.username
            })
            let adminsa = JSON.parse(JSON.stringify(admins[0]))
            delete adminsa.password
            dataList = [{
                ...item,
                ...adminsa
            }, ...dataList]
            id++
            if (datas.massageList.length === id) {
                res.json({
                    code: 20000,
                    data: dataList
                })
            }
        } else {
            let groupor = await getGrouporsb({
                roomNumber: item.roomNumber
            })
            let groupors = JSON.parse(JSON.stringify(groupor[0]))
            dataList = [{
                ...groupors,
                ...item
            }, ...dataList]
            id++
            if (datas.massageList.length === id) {
                res.json({
                    code: 20000,
                    data: dataList
                })
            }
        }

    })
}


// 同意
exports.ConsentFriend = (req, res) => {
    let {
        username,
        nweusername,
        roomNumber
    } = req.body
    ConsentFriends(username, nweusername)
    ConsentFriends(nweusername, username)

    async function ConsentFriends(username, nweusername) {
        let data = await getFindesMessages({
            username
        })

        let datas = JSON.parse(JSON.stringify(data))
        datas.massageList = datas.massageList.map(item => {
            if (item.username == nweusername) {
                return {
                    ...item,
                    stateValue: 3
                }
            }
            return item
        })
        let friender = datas.massageList.find(item => item.roomNumber === roomNumber&&item.username===nweusername)

        // 同意
        let dates = await upDateMessages(username, {
            massageList: datas.massageList
        })
        if (friender.messageValue === 1) {
            // 好友
            let frienddata = await friendsListS({
                username
            })
            let frienddatas = JSON.parse(JSON.stringify(frienddata))
            // 好友同意
            frienddatas.data = frienddatas.data.map(item => {
                if (item.title !== friender.title) return item
                delete friender.title
                friender['date'] = new Date()
                return {
                    ...item,
                    FriendsList: [...item.FriendsList, friender]
                }
            })
            if (dates.n === 1 && dates.ok === 1) {
                let frindes = await FriendUpdate({
                    username
                }, {
                    data: frienddatas.data
                })
                if (username !== req.body.username) {
                    if (frindes.n === 1 && frindes.ok === 1) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }
                }
            }
        } else {

            if (req.body.nweusername == username) {
                let groupUser = await findGroupUser({
                    username
                })
                let groupUsers = JSON.parse(JSON.stringify(groupUser))
                let aass = groupUsers.addGroupList.find(item => item.roomNumber === roomNumber)
                if (aass) {
                    if (username !== req.body.username) {

                        res.json({
                            code: 20000,
                            message: '你已经加入该群'
                        })

                    }
                    return
                }
                groupUsers.addGroupList = [...groupUsers.addGroupList, {
                    roomNumber,
                    dateTime: new Date()
                }]
                let Updategroupor = await UpdateGroupUser(username, {
                    addGroupList: groupUsers.addGroupList
                })
                if (Updategroupor.n === 1 && Updategroupor.ok === 1) {
                    if (username !== req.body.username) {
                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }

                }
            } else {
                let groupor = await getGrouporsb({
                    roomNumber
                })
                let groupors = JSON.parse(JSON.stringify(groupor[0]))
                let aass = groupors.groupMembers.find(item => item === req.body.nweusername)
                if (aass) {
                    if (username !== req.body.username) {
                        res.json({
                            code: 20000,
                            message: '你已经加入该群'
                        })
                    }
                    return
                }
                groupors.groupMembers = [...groupors.groupMembers, req.body.nweusername]

                let Updategroupor = await UpdateGroupor({
                    roomNumber
                }, {
                    groupMembers: groupors.groupMembers
                })
                if (Updategroupor.n === 1 && Updategroupor.ok === 1) {
                    if (username !== req.body.username) {

                        res.json({
                            code: 20000,
                            message: '添加成功'
                        })
                    }

                }

            }
        }
    }
}