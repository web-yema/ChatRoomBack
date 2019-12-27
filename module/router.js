// 路由模块
const express = require("express");
const admin = require("./routes/admin");
const home = require("./routes/home");
const friend = require("./routes/friend");
const messagesfriend = require("./routes/messagesfriend");
const groupUser = require("./routes/group-user");





let router = express.Router();
// 路由

router
  // 登录
  .post("/login", admin.Login)
  // // 获取用户信息
  .get("/info", admin.GetInfo)
  // // 退出
  // .post("/logout", admin.Logout)
  // 注册
  .post("/register", admin.Register)
  // 查找好友
  .post('/lookforsb', admin.LookForsb)
  // 上传头像
  .post('/headportrait', admin.Headportrait)
  //  修改密码
  .post('/upadatapassword', admin.upaDataPassword)
  // 添加好友
  .post("/addfriends", home.addFriends)
  // 添加好友状态 
  .post("/addfriendstates", home.addFriendStates)
  .post("/agree", home.Agree)
  // 
  // 创建群 2
  .post('/creategroup', groupUser.createGroup)
  // 获取群列表
  .post('/getgrouplist', groupUser.getGroupList)
  // 查询群
  .post('/getaddgroup',groupUser.getaddgroup)

  // 添加好友 2
  // .post('/addfriend', friend.AddFriend)
  .post('/addfriend', messagesfriend.AddFriend)

  // 获取好友分类
  .post('/friendslist', friend.friendslist)
  // 删除好友
  .post('/deletefriend', friend.DeleteFriend)
  // 同意好友 2
  .post('/consentfriend', messagesfriend.ConsentFriend)
  // 添加好友查询 2
  .post('/newfriendlist', messagesfriend.newFriendlist)

module.exports = router