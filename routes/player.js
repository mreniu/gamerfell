
/*
 * GET players listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/**
 * RETORNA TOTS EL JUGADORS DE LA DB
 * @param req
 * @param res
 */
exports.findAll = function(req, res) {
    db.collection('players', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
/**
 * AFEGEIX UN NOU JUGADOR A LA DB
 * @param req
 * @param res
 */
exports.addPlayer = function(req, res) {
    console.log('Data: '+ req.body )
    count(function(counter){
        var u= {
            PLAYERID: 'player'+(counter+1),
            MATCHID: req.body.MATCHID,
            USERID: req.body.USERID,
            SCORE: req.body.SCORE
        };
        db.collection('player', function(err, collection) {
            console.log('Adding player: ' + JSON.stringify(u));
            db.collection('players', function(err, collection) {
                collection.insert(u, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0].PLAYERID);
                    }
                });
            });
        });
    });
}
/**
 * CONTA ELS JUGADORS EXISTENTS PER AUTOGENERAR EL CODI DE JUGADOR
 * @param cb
 */
function count(cb) {
    console.log('COUNT ELEMS')
    db.collection('players', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('LONG: '+items.length)
            cb(items.length);
        });
    });
}
/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*--------------------------------------------------- */
exports.populateDB = function() {
   db.collection('players', function(err, collection) {
        collection.remove();
    });
    var players = {

        };


   db.collection('players', function(err, collection) {
        collection.insert(players, {safe:true}, function(err, result) {});
    });

};
