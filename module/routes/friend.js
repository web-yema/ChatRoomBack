let {
    friendslist,
    AddFriend,
    UpdateFriend,
} = require('../db/friends-list')
let {
    getLookforsb,
    getFindes
} = require('../db/admin')
let {getFindesMessages,upDateMessages} = require('../db/friend-message')



// 获取好友分类
exports.friendslist = (req, res) => {
    let {
        username
    } = req.body
    if (!username) {
        return res.json({
            code: 3230,
            message: '重新发送'
        })
    }
    friendslist(req.body, (data) => {
        // 存储一份
        let datas = JSON.parse(JSON.stringify(data[0]))
        let idx = datas.data.filter(item => item.FriendsList.length !== 0).length
        let ids = datas.data.filter(item => item.FriendsList.length == 0).length
        let arrList = []
        let idsss = 0
        if (datas.data.length == ids) {
            return res.json({
                code: 20000,
                data: datas.data
            })
        }
        datas.data.map((item, index) => {
            if (item.FriendsList.length == 0) {
                arrList[index] = datas.data[index]
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
                    idsss++
                    arrList[index] = datas.data[index]
                    if (idsss == idx) {
                        setTimeout(() => {
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


// 删除好友
exports.DeleteFriend = (req, res) => {
    let {
        username,
        newusername
    } = req.body
    deleteFriends(username, newusername)
    deleteFriends(newusername, username)

    async function deleteFriends  (username, newusername) {
        let findesMessages =  await getFindesMessages({username})
        findesMessages.massageList= findesMessages.massageList.filter(item=>item.username!=newusername)
        let upDate=await upDateMessages(username,{massageList:findesMessages.massageList})
        // console.log(upDate);
        friendslist({
            username
        }, (data) => {

            data[0].data = data[0].data.map(item => {
                    item.FriendsList = item.FriendsList.filter(items=>items.username!==newusername)
                    return item
                } )
                
                    UpdateFriend({
                        username,
                    },{data:data[0].data}, (datat) => {
                        if(username!= req.body.username){
                            if (datat.n === 1 && datat.ok === 1&&upDate.n===1&&upDate.ok===1) {
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
                        }
                       
                    })

        })
    }

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
            let datas = JSON.parse(JSON.stringify(data[0]))
            let prestorageLsit = datas.prestorage.find(item => item.FriendsList.find(items => items.username === nweusername))
            let FriendsList = prestorageLsit.FriendsList.find(item => item.username === nweusername)

            FriendsList['stateValue'] = 3
            FriendsList['dateTime'] = new Date()

            let aa = datas.data.find(item => item.title == prestorageLsit.title)

            if (!aa) {
                datas.data = [...datas.data, prestorageLsit]
                UpdateFriend({
                    username,
                }, {
                    data: datas.data,
                    prestorage: datas.prestorage
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
                datas.data = datas.data.map(item => {
                    if (item.title == prestorageLsit.title) {
                        return item = {
                            title: item.title,
                            FriendsList: [...item.FriendsList, FriendsList]
                        }
                    }
                    return item
                })
                UpdateFriend({
                    username,
                }, {
                    data: datas.data,
                    prestorage: datas.prestorage
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