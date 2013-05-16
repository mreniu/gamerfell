
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
/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*---------------------------------------------------*/
exports.populateDB = function() {
   db.collection('friendships', function(err, collection) {
        collection.remove();
    });
    var friendships = [
        {
            USERID: "xavi",
            USERID2: "friend1"
        }];


   db.collection('friendships', function(err, collection) {
        collection.insert(friendships, {safe:true}, function(err, result) {});
    });

};