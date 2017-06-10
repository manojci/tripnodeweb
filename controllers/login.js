var app = require('../index'),
    helper = require('../utils/helper');
module.exports.loginHandler = function (req, res) {
    helper.authenticate(req.body.username, req.body.password, function (err, user) {
        if (user) {

            req.session.regenerate(function () {

                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/cleartrip');
            });
        } else {
            req.session.error = 'Authentication failed, please check your ' + ' username and password.';
            res.redirect('/cleartrip/login');
        }
    });
}