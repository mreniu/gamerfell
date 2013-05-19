
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.findById = function(req, res) {
    var id = req.query.id;
    console.log('SEARCHING USER: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'USERID': id}, function(err, item) {
            console.log("ITEM: "+item);
            console.log("ERROR: "+err);
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
    console.log('Data: '+ req.body )
    count(function(counter){
        var u= {
            USERID: 'user'+(counter+1),
            user: req.body.user,
            name: req.body.name,
            surnames: req.body.surnames,
            email: req.body.email,
            password: req.body.password
        };
        db.collection('users', function(err, collection) {
            collection.findOne({$or: [{user: req.body.user},{email: req.body.email}]}, function(err, result) {
                if (result != null) {
                    console.log('ERROR: User already exist');
                    if (result.email == req.body.email) {
                        res.send({'error':"Ja existeix un usuari amb aquest email"});
                    } else {
                        res.send({'error':"Ja existeix un usuari amb el mateix nom d'usuari"});
                    }

                } else {
                    console.log('Adding user: ' + JSON.stringify(u));
                    db.collection('users', function(err, collection) {
                        collection.insert(u, {safe:true}, function(err, result) {
                            if (err) {
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('Success: ' + JSON.stringify(result[0]));
                                req.session.id_user = result[0].USERID;
                                res.send({'id': result[0].USERID});
                            }
                        });
                    });
                }
            });
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

exports.loginUser = function(req, res) {
    console.log("USER: "+req.body.user+" PASS: "+req.body.password)
    db.collection('users', function(err, collection) {
        collection.findOne({'user': req.body.user,'password': req.body.password}, function(err, item) {
            console.log('ITEM: '+ item);
            if (item == undefined) {
                console.log('ERROR')
                res.send({"error": "Usuari i/o password no són correctes"});
            } else {
                console.log('SUCCESS')
                req.session.id_user = item._id;
                res.send({'success': 'Loguejat','id':item.USERID})
            }
        });
    });
}

exports.getLogin = function(req, res) {
    var id = req.body.id;
    console.log('ID ARRIVE: ' + id);
    if (id == null) {
        res.send({'error': "No hi ha sessio"});
    } else {
        db.collection('users', function(err, collection) {
            collection.findOne({'USERID': id}, function(err, item) {
                if (err) {
                    res.send({'error': "Error a get login - " + err})
                } else {
                    res.send(item);
                }
            });
        });
    }
}

function count(cb) {
    console.log('COUNT ELEMS')
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('LONG: '+items.length)
            cb(items.length);
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
    var users = [
        {
            USERID: "user1",
            user: "LamarLamiouen",
            name: "Marc",
            surnames: "Reniu Sanchez",
            email: "reniu@marc.com",
            password: "asdasdasd"
        },
        {
            USERID: "user2",
            user: "ElRubius",
            name: "Soup",
            surnames: "Of Kitchen",
            email: "el@rubius.com",
            password: "asdasdasd"
        },
        {
            USERID: "user3",
            user: "asd",
            name: "Soup",
            surnames: "Of Kitchen",
            email: "asd@asd.com",
            password: "asdasd"
        },
        {
            USERID: "user4",
            user: "qwe",
            name: "Soup",
            surnames: "Of Kitchen",
            email: "qwe@qwe.com",
            password: "qweqwe"
        }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
};