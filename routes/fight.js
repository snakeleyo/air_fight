module.exports = function(router, io) {
    var HashMap = require('hashmap');
    var userlist = [];
    var readylist = [];
    var panelMap = new HashMap();

    router.get('/fight', function(req, res) {
        var id = req.session.userid;
        var ret = {
            id : id,
            mode : "0" // 初期化：準備待ち
        }


        res.render('fight', ret);
    });

    // 
    io.on('connection', (socket) => {
        //socket.userid = id;
        console.log("connection success... : ");

        socket.on('addUser', (userid) => {
            socket.userid = userid;
            userlist.push(userid);
            console.log("add user success... : " + socket.userid);
            console.log(userlist);
            io.emit('updUserList', userlist, readylist);
        });

        socket.on('onReady', (panel) => {
            console.log(socket.userid + " is on ready...");
            // console.log(socket.userid + ":" + panel);
            readylist.push(socket.userid);
            panelMap.set(socket.userid, panel);

            io.emit('updUserList', userlist, readylist);
        });

        socket.on('openFire', (fireInfo) => {
            console.log("firing...:" + fireInfo.fireRow + "," + fireInfo.fireCol);
            var targetPanel = panelMap.get(fireInfo.toId);
            var fireRet = targetPanel[fireInfo.fireRow][fireInfo.fireCol];
            console.log("fireRet  : " + fireRet);
            console.log("fireRetult 0  : " + targetPanel[0]);
            console.log("fireRetult 1  : " + targetPanel[1]);
            console.log("fireRetult 2  : " + targetPanel[2]);

            var ret = {
                fireRow : fireInfo.fireRow,
                fireCol : fireInfo.fireCol,
                fromId : fireInfo.fromId,
                toId : fireInfo.toId,
                result : fireRet
            };

            io.emit('updFightPanel', ret);
        });

        socket.on('disconnect', function() {
            console.log("disconnected ... : " + socket.userid);
            for (var i = 0; i < userlist.length; i++) {
                if (userlist[i] == socket.userid) {
                    userlist.splice(i, 1);
                    break;
                }
            }
            console.log(userlist);
        });
    });
}