module.exports = function(router) {
    router.post('/login', function(req, res) {
        var id = req.body.id;
        var pwd = req.body.pwd;

        if (pwd != "snake") {
            res.end('login failed');
            return;
        }
        
        req.session.userid = id;
        // req.session.pwd = pwd;

        res.redirect('/fight');
    });
}