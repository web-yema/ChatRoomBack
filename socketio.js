// 管理系统
//  入口文件
const express = require("express");
const path = require("path");
const router = require("./module/router");
const bodyParser = require("body-parser");
const cors = require("cors");
let app = express();
const {
    AddFriendState
} = require('./module/db/home')
//挂载参数处理中间件
app.use(cors());
//处理json格式的参数
app.use(bodyParser.json());
// 处理表单数据
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
// // 设置静态资源目录
app.use(express.static(path.resolve("./public")));
// 将路由引入
app.use(router);
let objRoomNumber = {}
let arrText = {}
var http = require('http').Server(app);

var io = require('socket.io')(http);
io.on('connection', function (socket) {
    socket.on('login', function (msg) {
        // AddFriendState(msg.username, {}, (data) => {
        //   console.log(data.data);
        //   let datalist = data.data || []
        //   datalist.map(item => {
        //     if (objRoomNumber[item.roomNumber] === undefined) {
        //       objRoomNumber[item.roomNumber] = item.roomNumber
        //     }
        //   })
        // })
    });
    // 添加好友提示
    socket.on('AddFriends', function (msg) {
        io.emit(`${msg.username}`, {
            user: msg.user,
            usernamel: msg.usernamel,
            title: msg.text
        });
    });
    // 私聊
    socket.on('sendMsg', function (msg) {
        if (!arrText[msg.roomNumber]) {
            arrText[msg.roomNumber] = []
        }
        if (!msg.text) {
            io.sockets.emit(msg.roomNumber, arrText[msg.roomNumber]);
            return
        }
        arrText[msg.roomNumber] = [...arrText[msg.roomNumber], msg]
        io.sockets.emit(msg.roomNumber, arrText[msg.roomNumber]);
    })










    // socket.on('logout', function (msg) {
    // });
    // socket.on('chat message', function (msg) {
    //   io.emit('chat message', msg);
    // });
    // 添加好友提示
    // socket.on('AddFriends', function (msg) {
    //   io.emit(`${msg.username}`, {
    //     user: msg.user,
    //     usernamel: msg.usernamel,
    //     title: msg.text
    //   });
    // });


});



http.listen(3000, function () {
    console.log("http://localhost:3000");
});