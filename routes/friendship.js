
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.findAll = function(req, res) {
    db.collection('friendships', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addFriend = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.findOne({'user': req.body.id_friend}, function(err, user_friend) {
            if (user_friend == null) {
                console.log('FRIEND: '+ req.body.id_friend);
                res.send({'error': 'No existeix cap usuari amb aquest nom'});
            } else {
                if (user_friend.USERID == req.body.id_user) {
                    res.send({'error': 'No et pots fer amic a tu mateix (FOREVER ALONE: lvl 9999)'});
                } else {
                    db.collection('friendships', function(err, collection) {
                       collection.findOne({$or: [{USERID: req.body.id_user,USERID2: user_friend},{USERID: req.body.id_friend,USERID2: req.body.id_user}]}, function (err, result){
                           if (result != null) {
                               console.log('FRIEND: '+ req.body.id_friend);
                               res.send({'error': 'Ja existeix una amistat amb aquest usuari'});
                           } else {
                               var friends = {
                                   USERID: req.body.id_user,
                                   USERID2: user_friend.USERID
                               };
                               db.collection('friendships', function(err, collection) {
                                   collection.insert(friends, {safe:true}, function(err, result) {
                                       if (err) {
                                           res.send({'error':'An error has occurred'});
                                       } else {
                                           console.log('Success: ' + JSON.stringify(result[0]));
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