
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};
exports.findById = function(req, res) {
    var GAMEID = req.body.gameid;
    console.log('Adding wine: ' + GAMEID);
    db.collection('games', function(err, collection) {
        collection.findOne({'GAMEID':GAMEID}, function(err, item) {
            res.send(item);
        });
    });
};
exports.findAll = function(req, res) {
    db.collection('games', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};


/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*---------------------------------------------------*/
exports.populateDB = function() {
   db.collection('games', function(err, collection) {
        collection.remove();
    });
    var games = [
        {
            GAMEID: "game1",
            NAME: "Pedra-Paper-Tisores",
            DESCRIPTION: "Pedra, paper, tisores de tota la vida...",
            NPlayers: "2",
            GAMEPATH: "games/pedrapapertisores/pedrapapertisores.js"
        }];


   db.collection('games', function(err, collection) {
        collection.insert(games, {safe:true}, function(err, result) {});
    });

};