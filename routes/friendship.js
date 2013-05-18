
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
            USERID: "user3",
            USERID2: "user4"
        },{
            USERID: "user4",
            USERID2: "user3"
        }];


   db.collection('friendships', function(err, collection) {
        collection.insert(friendships, {safe:true}, function(err, result) {});
    });

};