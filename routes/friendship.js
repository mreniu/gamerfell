
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * GET Friendships
 */
exports.findAll = function(req, res) {
    db.collection('friendships', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

/*
 * POST Add Friendship between Users
 */
exports.addFriend = function(req, res) {
    // Busquem usuari per USER
    db.collection('users', function(err, collection) {
        collection.findOne({'user': req.body.id_friend}, function(err, user_friend) {
            if (user_friend == null) { // No hem trobat cap usuari
                console.log('FRIEND: '+ req.body.id_friend);
                res.send({'error': 'No existeix cap usuari amb aquest nom'});
            } else {
                if (user_friend.USERID == req.body.id_user) { // Els usuaris són els mateixos
                    res.send({'error': 'No et pots fer amic a tu mateix (FOREVER ALONE: lvl 9999)'});
                } else {
                    // Busquem si ja existeix una amistat entre ells
                    db.collection('friendships', function(err, collection) {
                        console.log('USER: '+req.body.id_user+' FRIEND: '+user_friend.USERID);
                        collection.findOne({$or: [{USERID: req.body.id_user,USERID2: user_friend.USERID},{USERID: user_friend.USERID, USERID2: req.body.id_user}]}, function (err, result){
                            if (result != null) { // Ja existeix amistat
                                console.log('FRIEND: '+ req.body.id_friend);
                                res.send({'error': 'Ja existeix una amistat amb aquest usuari'});
                            } else {
                                var friends = {
                                    USERID: req.body.id_user,
                                    USERID2: user_friend.USERID
                                };
                                // Afegim amistat a Friendship
                                db.collection('friendships', function(err, collection) {
                                    collection.insert(friends, {safe:true}, function(err, result) {
                                        if (err) {
                                            res.send({'error':'An error has occurred'});
                                        } else {
                                            console.log('Success: ' + JSON.stringify(result[0]));
                                            // Retornem Friendship creat
                                            res.send({'success': 'Amic afegit correctament', 'friend': user_friend});
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
            }
        });
    });
}

/*
 * Get Frienship by USERID and USERID2
 */
exports.findFriends = function(req,res) {
    db.collection('friendships', function(err, collection){
        collection.find({$or: [{USERID: req.body.id_user},{USERID2: req.body.id_user}]}).toArray(function(err, items){
            if (err) {
                console.log('ERROR: '+error);
            } else {
                res.send({'friends': items});
            }
        });
    })
}


/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*---------------------------------------------------*/
exports.populateDB = function() {
   db.collection('friendships', function(err, collection) {
        collection.remove();
    });
    var friendships = {
            USERID: "user3",
            USERID2: "user4"
        };


   db.collection('friendships', function(err, collection) {
        collection.insert(friendships, {safe:true}, function(err, result) {});
    });

};