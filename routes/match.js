
/*
 * GET MATCHS listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

/*
 * RETORNA TOTES LES PARTIDES
 */
exports.findAll = function(req, res) {
    db.collection('matchs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
/**
 * AFEGEIX UNA PARTIDA
 * @param req
 * @param res
 */
exports.addMatch = function(req, res) {
    console.log('Data: '+ req.body )
    count(function(counter){
        var u= {
            MATCHID: 'match'+(counter+1),
            GAMEID: req.body.GAMEID,
            STATE: req.body.STATE,
            WINNER: req.body.WINNER
        };
        db.collection('matchs', function(err, collection) {

            console.log('Adding match: ' + JSON.stringify(u));
            db.collection('matchs', function(err, collection) {
                collection.insert(u, {safe:true}, function(err, result) {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        console.log('Success: ' + JSON.stringify(result[0]));
                        res.send(result[0].MATCHID);
                    }
                });
            });
        });
    });
}
/**
 * CONTA LES PARTIDES EXISTENTS PER AUTOGENERAR EL CODI DE PARTIDA
 * @param cb
 */
function count(cb) {
    console.log('COUNT ELEMS')
    db.collection('matchs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('LONG: '+items.length)
            cb(items.length);
        });
    });
}
/**
 * FA L?UPDATE DE EL PARTIT PER PODER GUARDAR EL GUANYADOR
 * @param req
 * @param res
 */
exports.updateMatchWinner = function(req, res) {
   var u= {
        MATCHID: req.body.MATCHID,
        WINNER: req.body.WINNER,
        GAMEID: req.body.GAMEID,
        STATE: req.body.STATE,
        WINNER: req.body.WINNER
    };
    db.collection('matchs', function(err, collection) {
        collection.update({'MATCHID': u.MATCHID}, u, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating match: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(u.MATCHID);
            }
        });
    });
}




/*---------------------------------------------------*/
/*             INITIALIZING DATABASE                 */
/*---------------------------------------------------*/
exports.populateDB = function() {
   db.collection('matchs', function(err, collection) {
        collection.remove();
    });
    var matchs = {

        };


   db.collection('matchs', function(err, collection) {
        collection.insert(matchs, {safe:true}, function(err, result) {});
    });

};