module.exports = function(router, io) {
    require('./login')(router);
    require('./fight')(router, io);
}