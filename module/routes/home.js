let {
    AddFriends,
    AddFriendState,
    setAgree
} = require('../db/home')

let {
    getLookforsb
} = require('../db/admin')

// 添加好友
exports.addFriends = (req, res) => {
    // console.log('sdsd', req.body);
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
    console.log(req.boby);

}

// 好友查询
exports.addFriendStates = (req, res) => {
    let {
        username,
    } = req.body
    let aaa = req.body.stateValue ? {
        stateValue: req.body.stateValue
    } : {}
    AddFriendState(username, aaa, (datas) => {
        if (datas.code === 20000) {
            let arrs = []
            datas.data.map((item, index) => {
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