
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , game = require('./routes/game')
  , friendship = require('./routes/friendship')
  , match = require('./routes/match')
  , player= require('./routes/player')
  , http = require('http')
  , path = require('path');

var app = express();

var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var Server = mongo.Server,
    Db = mongo.Db
var BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('gamerfell', server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'gamerfell' database");
        db.collection('gamerfell', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'gamerfell' collection doesn't exist. Creating it with sample data...");
                user.populateDB();
                game.populateDB();
                friendship.populateDB();
                match.populateDB();
                player.populateDB();
            }
        });
    }
});



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({ secret: 'admin1234'}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/signup', routes.signup);

// API REST of GAMES
app.post('/games', game.findById);
app.get('/games', game.findAll);

// API REST of MATCHS
app.get('/matchs', match.findAll);
app.post('/matchs', match.addMatch);
app.put('/matchs', match.updateMatchWinner);

//APLI REST of PLAYERS
app.get('/players', player.findAll);
app.post('/players', player.addPlayer);


// API REST of FRIENDSHIPS
app.get('/friendships', friendship.findAll);
app.post('/friendships', friendship.addFriend);
app.post('/friendships/findfriends', friendship.findFriends);

// API REST of USERS
app.get('/users', user.findAll);
app.get('/users/:id', user.findById);
app.post('/users', user.addUser);
app.put('/users/:id', user.updateUser);
app.delete('/users/:id', user.deleteUser);
app.post('/users/login', user.loginUser);
app.post('/users/getLogin', user.getLogin);

var usersConn=[];  //llista usuaris connectats
var sockets=[];   //llista de sockets de cada usuari
var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    //PROGRAMACIO DELS SOCKETS
    var io = require('socket.io').listen(server);

    //QUAN UN CLIENT FACI PETICIO DE INICIAR CONNECIO
    io.sockets.on('connection', function(socket){
        console.log('Connecton recived');
        //EL SERVIDOR CONTESTA DEMANANT LA IDENTIFICACIO DEL CLIENT
        socket.emit('WhoAreYou');

        //SI EL SERVIDOR REB MISSATGES CONSESTA HOLA I EL MISSATGE REGUT
        //S?UTILITZARA PER FER EL XAT
        socket.on('missatge', function(data){
            console.log('Missatge rebut:'+data);
            socket.emit('missatgeRem', 'Hola '+data+'!');
        });
        //QUAN EL SERVIDOR REB UN MISSATGE DE PRESENTACIO COM A RESPOSTA DEL WhoAreYou
        socket.on('IAm',function(idUser){
            console.log('Presentacio rebuda:'+idUser);
            //SI L USUARI JA TENIA UNA CONNEXIO  la eliminem   per evitar duplicitat
            var index=usersConn.indexOf(idUser);
            if(index>=0)
            {
                usersConn.splice(index, 1);
                var sock=sockets[index];
                sock.disconnect();
                sockets.splice(index, 1);
            }
            //AFEGIRM L'USUARI I EL SEU SOCKET
            usersConn.push(idUser);
            sockets.push(socket);
            //AVISEM AL CLIENT QUE EL PROCES DE CONNEXIO S'HA Finalitzat
            socket.emit('connected');
            getFriends(idUser,function(items)
            {
                console.log("AVISAR AMICS CONN"+JSON.stringify(items));
                   for(i=0;i<items.length;i++)
                   {
                       if(items[i].USERID!=idUser)
                       {
                           var index=usersConn.indexOf(items[i].USERID);
                           console.log("AVISAR "+items[i].USERID);
                           if(index>=0)
                            sockets[index].emit("friendConnect",idUser);
                       }else if(items[i].USERID2!=idUser)
                       {
                           var index=usersConn.indexOf(items[i].USERID2);
                           if(index>=0)
                               sockets[index].emit("friendConnect",idUser);
                       }
                   }
            });
        });
        //QUAN REBEM UNA DESCONNEXIO ELIMINEM L'USUARI DE LA LLISTA
        socket.on('disconnect', function () {
            console.log('Desconectado!');
            var index=sockets.indexOf(socket);
            if(index>=0)
            {
                var userid=usersConn[index];
                sockets.splice(index, 1);
                usersConn.splice(index, 1);
                getFriends(userid,function(items)
                {
                    console.log("AVISAR AMICS DISCONN"+JSON.stringify(items));
                    for(i=0;i<items.length;i++)
                    {
                        if(items[i].USERID!=userid)
                        {
                            var index=usersConn.indexOf(items[i].USERID);
                            if(index>=0)
                                sockets[index].emit("friendDisconnect",userid);
                        }else if(items[i].USERID2!=userid)
                        {
                            var index=usersConn.indexOf(items[i].USERID2);
                            if(index>=0)
                                sockets[index].emit("friendDisconnect",userid);
                        }
                    }
                });
            }
        });
        //QUAN REBEM UNA PETICIO DE JUGAR LA REENVIEM A EL DESTINATARI SI SON AMICS
        socket.on('peticioJugar',function(peticio){
            console.log('Peticio rebuda:'+peticio);
            var peticioObj=JSON.parse(peticio);
            //Comprovar que son amics
            existFriendship(peticioObj.myId,peticioObj.hisId,function(result){
                if(result>0)
                {
                    //BUSQUEM EL SOCKET QUE CORRESPON AL USUARI
                    var index=usersConn.indexOf(peticioObj.hisId);
                    if(index>=0)
                    {
                        socket2=sockets[index];
                        if(socket2!=undefined)
                        {
                            socket2.emit('peticioJugar',peticio);
                            console.log('Peticio reenviada a:'+peticioObj.hisId);
                        } else
                        {
                            console.log("Socket undefined:"+peticioObj.hisId);
                        }
                    }else
                    {
                        console.log("Usuari no connectat:"+peticioObj.hisId);
                    }
                }else
                {
                    console.log('ERROR: no es pot reevnar Peticio:'+peticioObj.hisId);
                    socket.emit('ERROR','No es pot enviar peticio de jugar a '+peticioObj.hisId);
                }
            }) ;

        });
        socket.on('chat',function(chat){
            console.log('Peticio rebuda:'+chat);
            var chatObj=JSON.parse(chat);
            //Comprovar que son amics
            existFriendship(chatObj.USERID1,chatObj.USERID2,function(result){
                if(result>0)
                {
                    //BUSQUEM EL SOCKET QUE CORRESPON AL USUARI
                    var index=usersConn.indexOf(chatObj.USERID2);
                    if(index>=0)
                    {
                        socket2=sockets[index];
                        if(socket2!=undefined)
                        {
                            socket2.emit('chat',chat);
                            console.log('Chat reenviada a:'+chatObj.USERID2);
                        } else
                        {
                            console.log("Socket undefined:"+chatObj.USERID2);
                        }
                    }else
                    {
                        console.log("Usuari no connectat:"+chatObj.USERID2);
                    }
                }else
                {
                    console.log('ERROR: no es pot reevnar Peticio:'+chatObj.USERID2);
                    socket.emit('ERROR','No es pot enviar peticio de jugar a '+chatObj.USERID2);
                }
            }) ;

        });
        //REBEM UNA ACCEPTAR JUGAR I ES REENVIA A EL USUARI DESTI SI ES QUE SON AMICS
        socket.on('acceptarJugar',function(acceptar){
            console.log('Acceptar peticio rebuta:'+acceptar);
            var peticioObj=JSON.parse(acceptar);
            //Comprovar que son amics
            existFriendship(peticioObj.myId,peticioObj.hisId,function(result){
                if(result>0)
                {
                    var index=usersConn.indexOf(peticioObj.hisId);
                    if(index>=0)
                    {
                        socket2=sockets[index];
                        if(socket2!=undefined)
                        {
                            socket2.emit('acceptarJugar',acceptar);
                            console.log('Acceptar reenviat a:'+peticioObj.hisId);
                        }else
                        {
                            console.log('Socket2 undefined:'+peticioObj.hisId);
                            usersConn.slice(index,1);
                        }
                    }else
                        console.log("L'usuari no esta connectat:"+peticioObj.hisId);
                }else
                {
                    console.log('ERROR: no es pot reevnar Peticio:'+peticioObj.hisId);
                    socket.emit('ERROR','No es pot enviar peticio de jugar a '+peticioObj.hisId);
                }
            }) ;
        });
        //SI REBEM UNA JUGADA LA REEINVIEM AL USUARI DESTI SI ES QUE SON AMICS
        socket.on('Jugada',function(jugada){
            console.log('Jugada rebuta:'+jugada);
            var jugadaObj=JSON.parse(jugada);
            //Comprovar que son amics
            existFriendship(jugadaObj.myId,jugadaObj.hisId,function(result){
                if(result>0)
                {
                    var index=usersConn.indexOf(jugadaObj.hisId);
                    socket2=sockets[index];
                    socket2.emit('Jugada',jugada);
                    console.log('Jugada reenviat a:'+jugadaObj.hisId);
                }else
                {
                    console.log('ERROR: no es pot reevnar la jugada:'+jugadaObj.hisId);
                    socket.emit('ERROR','No es pot enviar jugada a '+jugadaObj.hisId);
                }
            }) ;
        });
        socket.on("getConnectedFriends",function(userid){
            var array=[];
            getFriends(userid,function(items){
                console.log("AMICS OBTINGUTS:"+items) ;
                for(i=0;i<items.length;i++)
                {
                    if(items[i].USERID!=userid)
                    {
                        var index=usersConn.indexOf(items[i].USERID);
                        if(index>=0)
                            array.push({userid:items[i].USERID});
                    }else if(items[i].USERID2!=userid)
                    {
                        var index=usersConn.indexOf(items[i].USERID2);
                        if(index>=0)
                            array.push({userid:items[i].USERID2});
                    }
                }
                socket.emit('ConnectedFiends',JSON.stringify(array));
            });
        });
    });
    //############################
});

//FUNCIO QUE COMPROVA SI 2 USUARIS SON AMICS , si funcio>0--> son amics
function existFriendship(idUser1,idUser2,callback)
{
    db.collection('friendships', function(err, collection) {
        collection.find({$or:[{USERID:idUser1,USERID2:idUser2},{USERID:idUser2,USERID2:idUser1}]}).count(function(err, count) {
            console.log('existeix:count?:'+count);
            callback(count);
        });
    });
}

function getFriends(idUser1,callback)
{
    db.collection('friendships', function(err, collection) {
        collection.find({$or:[{USERID:idUser1},{USERID2:idUser1}]}).toArray(function(err, items) {
            callback(items);
        });
    });
}
