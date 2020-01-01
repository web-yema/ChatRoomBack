let {
    getMessageTables,
    updateMessageTable
} = require('../db/message-table');
exports.setmessagelist = async (req, res) => {
    // console.log(req.body);
    let {
        userId,
        username,
        roomNumber,
        messageValue
    } = req.body
    let MessageTables = await getMessageTables({
        username: userId
    })
    // console.log(MessageTables);
    let isusername = MessageTables.messageList.find(item => item.username == username)
    if (!isusername) {
        MessageTables.messageList = [ {
            username,
            roomNumber,
            messageValue
        },...MessageTables.messageList]
     let data=  await updateMessageTable({username:userId},{messageList: MessageTables.messageList})
     if(data.n==1&&data.ok==1){
        res.json({
            code:20000,
            message:'成功'
        })
     }

    }
}
exports.getmessagelist=async (req,res)=>{
    // console.log(req.body);
    let {username}=req.body
    let MessageTables = await getMessageTables({
        username
    })
    res.json({
        code:20000,
        data:MessageTables.messageList
    })
}