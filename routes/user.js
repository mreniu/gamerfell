
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving user: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {

    var u= {
        user: req.body.user,
        name: req.body.name,
        surnames: req.body.surnames,
        email: req.body.email,
        password: req.body.password
    };

    console.log('Adding user: ' + JSON.stringify(u));
    db.collection('users', function(err, collection) {
        collection.insert(u, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.render('index', { title: 'GamerFell' });
            }
        });
    });
}

exports.updateUser = function(req, res) {
    var id = req.params.id;
    var u= {
        user: req.body.user,
        name: req.body.name,
        surnames: req.body.surnames,
        email: req.body.email,
        password: req.body.password
    };
    console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, u, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating user: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(user);
            }
        });
    });
}

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*---------------------------------------------------*/
exports.populateDB = function() {
    db.collection('users', function(err, collection) {
        collection.remove();
    });
    db.collection('game', function(err, collection) {
        collection.remove();
    });

    var users = [
        {
            user: "LamarLamiouen",
            name: "Marc",
            surnames: "Reniu Sanchez",
            email: "reniu@marc.com",
            password: "asdasdasd"
        },
        {
            user: "ElRubius",
            name: "Soup",
            surnames: "Of Kitchen",
            email: "el@rubius.com",
            password: "asdasdasd"
        }];
    var games = [
        {
            GAMEID: "01",
            NAME: "Pedra-Paper-Tisores",
            DESCRIPTION: "Pedra, paper, tisores de tota la vida...",
            NPlayers: "2",
            GAMEPATH: "games/pedrapapertisores/pedrapapertisores.js"
        }];


    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
    db.collection('games', function(err, collection) {
        collection.insert(games, {safe:true}, function(err, result) {});
    });

};