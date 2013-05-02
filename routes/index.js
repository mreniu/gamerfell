
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'GamerFell' });
};

exports.signup = function(req, res) {
    res.render('signup', {title: 'GamerFell' });
}