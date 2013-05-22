
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * GET User by ID
 */

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

/*
 * Get Users
 */

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

/*
 * POST Add User
 */

exports.addUser = function(req, res) {
    console.log('Data: '+ req.body )

    // Obtenim numero de usuaris al sistema
    count(function(counter){
        var u= {
            USERID: 'user'+(counter+1),
            user: req.body.user,
            name: req.body.name,
            surnames: req.body.surnames,
            email: req.body.email,
            password: req.body.password
        };
        // Busquem usuari per USER i per EMAIL
        db.collection('users', function(err, collection) {
            collection.findOne({$or: [{user: req.body.user},{email: req.body.email}]}, function(err, result) {
                if (result != null) {
                    console.log('ERROR: User already exist');
                    if (result.email == req.body.email) { // MAtch en EMAIL
                        res.send({'error':"Ja existeix un usuari amb aquest email"});
                    } else { // MATCH en USER
                        res.send({'error':"Ja existeix un usuari amb el mateix nom d'usuari"});
                    }

                } else {
                    // Afegim usuari al sistema
                    console.log('Adding user: ' + JSON.stringify(u));
                    db.collection('users', function(err, collection) {
                        collection.insert(u, {safe:true}, function(err, result) {
                            if (err) {
                                res.send({'error':'An error has occurred'});
                            } else {
                                console.log('Success: ' + JSON.stringify(result[0]));
                                req.session.id_user = result[0].USERID;
                                // Retornem el USERID del usuari
                                res.send({'id': result[0].USERID});
                            }
                        });
                    });
                }
            });
        });
    });
}

/*
 * POST Update User
 *      No es fa servir
 */

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

/*
 * DELETE Erase User
 *      No es fa servir
 */
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

/*
 * POST Get USERID from login
 */
exports.loginUser = function(req, res) {
    console.log("USER: "+req.body.user+" PASS: "+req.body.password)
    // Busquem usuari per USER i PASSWORD
    db.collection('users', function(err, collection) {
        collection.findOne({'user': req.body.user,'password': req.body.password}, function(err, item) {
            console.log('ITEM: '+ item);
            if (item == undefined) { // No hem trobat usuari
                console.log('ERROR')
                res.send({"error": "Usuari i/o password no són correctes"});
            } else {
                console.log('SUCCESS')
                req.session.id_user = item._id;
                // Retornem el USERID del usuari
                res.send({'success': 'Loguejat','id':item.USERID})
            }
        });
    });
}

/*
 * POST Get User from cookie
 */
exports.getLogin = function(req, res) {
    var id = req.body.id;
    console.log('ID ARRIVE: ' + id);
    if (id == null) {
        res.send({'error': "No hi ha sessio"});
    } else {
        // Busquem usuari amb USERID
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

/*
 * FUNCTION Get number of users
 */
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
            user: "JohnSmith",
            name: "John",
            surnames: "Smith",
            email: "j.h@yahoo.com",
            password: "asdasdasd"
        },
        {
            USERID: "user2",
            user: "Marilu",
            name: "Maria",
            surnames: "Lucrecia",
            email: "lucmar@gmail.com",
            password: "asdasdasd"
        },
        {
            USERID: "user3",
            user: "xavier",
            name: "Xavier",
            surnames: "Sendra Granell",
            email: "sendra.granell@hotmail.com",
            password: "asdasd"
        },
        {
            USERID: "user4",
            user: "marc",
            name: "Marc",
            surnames: "Reniu Sanchez",
            email: "reniu.sanchez@gmail.com",
            password: "qweqwe"
        }];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });
};