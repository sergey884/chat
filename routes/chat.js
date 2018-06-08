exports.get = function(req, res) {
    res.render('chat', {
        userId: req.session.user
    })
}