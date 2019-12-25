// 路由模块
const express = require("express");
const admin = require("./routes/admin");
const home = require("./routes/home");
const friend = require("./routes/friend");



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
  // 添加好友
  .post("/addfriends", home.addFriends)
  // 添加好友状态
  .post("/addfriendstates", home.addFriendStates)
  .post("/agree", home.Agree)
  // 创建群
  .post('/creategroup', home.createGroup)
  // 添加好友
  .post('/addfriend', friend.AddFriend)
  // 获取好友分类
  .post('/friendslist', friend.friendslist)
  // 删除好友
  .post('/deletefriend', friend.DeleteFriend)
  // 同意好友
  .post('/consentfriend', friend.ConsentFriend)
  // 添加好友查询
  .post('/newfriendlist',friend.newFriendlist)

module.exports = router