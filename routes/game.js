
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * GET Game by ID
 */
exports.findById = function(req, res) {
    var GAMEID = req.query.id;
    console.log('Adding wine: ' + GAMEID);
    db.collection('games', function(err, collection) {
        collection.findOne({'GAMEID':GAMEID}, function(err, item) {
            console.log('GAME: '+item);
            console.log('ERROR: '+err);
            res.send(item);
        });
    });
};

/*
 * GET Games
 */
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
            DESCRIPTION: "Pedra, paper, tisores, langardaix, Spock <img style='max-height: 200px;' src='/javascripts/games/pedrapapertisores/how-to-play-rock-paper-scissors-spock.jpg' />",
            NPlayers: "2",
            GAMEPATH: "games/pedrapapertisores/pedrapapertisores.js"
        },{
            GAMEID: "game2",
            NAME: "Pedra-Paper-Tisores2",
            DESCRIPTION: "Pedra, paper, tisores de tota la vida...",
            NPlayers: "2",
            GAMEPATH: "games/pedrapapertisores/pedrapapertisores.js"
        },{
            GAMEID: "game3",
            NAME: "Pedra-Paper-Tisores3",
            DESCRIPTION: "Pedra, paper, tisores de tota la vida...",
            NPlayers: "2",
            GAMEPATH: "games/pedrapapertisores/pedrapapertisores.js"
        }];


   db.collection('games', function(err, collection) {
        collection.insert(games, {safe:true}, function(err, result) {});
    });

};