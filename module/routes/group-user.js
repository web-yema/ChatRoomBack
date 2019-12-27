let {
    setGroup,
    getGrouporsb
} = require('../db/group')
// 
let {
    UpdateGroupUser,
    findGroupUser
} = require('../db/group-list')

// 创建群
exports.createGroup = async (req, res) => {
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

    let obj = {
        roomNumber: userId,
        username,
        user,
        groupMembers,
        portrait: img[idxa],
        autograph: `${user}欢迎建群`,
        date: new Date().getTime(),
    }
    // 创建群列表
    let data = await setGroup(obj)

    if (Object.keys(data).length === 0) {
        return res.json({
            code: 4004,
            message: '创建失败'
        })
    }
    // 给每个群成员添加群号
    let groupObj = {
        roomNumber: userId,
        dateTime: new Date().getTime(),
    }
    groupMembers.map(async (item, index) => {
        let findGroupUsers = await findGroupUser({
            username: item
        })
        if (item == username) {
            let UpdateGroups = await UpdateGroupUser(item, {
                myGroupList: [...findGroupUsers.myGroupList, groupObj]
            })
            if (UpdateGroups.n == 1 && UpdateGroups.ok == 1) {
                if (groupMembers.length - 1 == index) {

                    return res.json({
                        code: 20000,
                        message: '创建成功'
                    })
                }
            }
        } else {
            let UpdateGroups = await UpdateGroupUser(item, {
                addGroupList: [...findGroupUsers.addGroupList, groupObj]
            })
            if (UpdateGroups.n == 1 && UpdateGroups.ok == 1) {
                if (groupMembers.length - 1 == index) {
                    return res.json({
                        code: 20000,
                        message: '创建成功'
                    })
                }
            }

        }
    })
}
// 获取群列表
exports.getGroupList = async (req, res) => {
    let {
        username
    } = req.body
    if (!username) {
        return res.json({
            code: 3230,
            message: '重新发送'
        })
    }
    let findGroup = await findGroupUser(req.body)
    let findGroups = JSON.parse(JSON.stringify(findGroup))
    let idxs = Object.keys(findGroups).length
    for (const key in findGroups) {
        if (key == 'myGroupList' || key == 'addGroupList' || key == 'myManagedList') {
            if (findGroups[key].length === 0) {
                idxs--
            }
        } else {
            idxs--
        }
    }
    let objs = {}
    let aaa = 0
    for (const key in findGroups) {
        objs[key] = findGroups[key]
        if (key == 'myGroupList' || key == 'addGroupList' || key == 'myManagedList') {
            if (findGroups[key].length !== 0) {

                objs[key] = []
                findGroups[key].map(async (item, index) => {
                    let myGroupList = await getGrouporsb({
                        roomNumber: item.roomNumber
                    })
                    let myGroupLists = JSON.parse(JSON.stringify(myGroupList[0]))
                    objs[key] = [...objs[key], {
                        ...myGroupLists,
                        dateTime: item.dateTime
                    }]
                    if (findGroups[key].length - 1 === index) {
                        aaa++
                        if (aaa == idxs) {
                            res.json({
                                code: 20000,
                                data: objs
                            })
                        }
                    }
                })
            }
        }

    }
}

// 获取群是否存在
exports.getaddgroup= async (req,res)=>{
   let {username}= req.body
  
//    let grouporoom =await getGrouporsb()
let grouporuser =await getGrouporsb({ $or:[{roomNumber:{$regex:username,$options: '$i'}},{user: {$regex:username,$options: '$i'}}]})
// console.log(grouporuser);

    if(grouporuser.length===0){
       return res.json({
        code: 444,
        message: '你查找的群不存在'
       })
    }

    res.json({
        code: 200,
        data: grouporuser
    })
}   