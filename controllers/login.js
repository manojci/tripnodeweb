var app = require('../index'),
    helper = require('../utils/helper');
module.exports.loginHandler = function (req, res) {
    helper.authenticate(req, res, function (err, user) {
        if (user) {
            req.session.regenerate(function () {
                req.session.user = user;
                req.session.success = 'Authenticated as ' + user.username + ' click to <a href="/logout">logout</a>. ' + ' You may now access <a href="/restricted">/restricted</a>.';
                res.redirect('/cleartrip');
            });
        } else if (err) {
            req.session.error = err.message;
            res.redirect('/cleartrip/login');
        }
    });
}