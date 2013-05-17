
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , game = require('./routes/game')
  , friendship = require('./routes/friendship')
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

app.post('/games', game.findById);
app.get('/games', game.findAll);

app.get('/friendships', friendship.findAll);

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
    //#######PROVES SOCKET#########
    var io = require('socket.io').listen(server);

    //Iniciamos la conexión.
    io.sockets.on('connection', function(socket){
        console.log('Connecton recived');
        //Emitimos nuestro evento connected
        socket.emit('WhoAreYou');

        //Permanecemos a la escucha del evento click
        socket.on('missatge', function(data){
            console.log('Missatge rebut:'+data);
            //Emitimos el evento que dirá al cliente que hemos recibido el click
            //y el número de clicks que llevamos
            socket.emit('missatgeRem', 'Hola '+data+'!');
        });
        socket.on('IAm',function(idUser){
            console.log('Presentacio rebuda:'+idUser);
            usersConn.push(idUser);
            sockets.push(socket);
            socket.emit('connected');
        });
        socket.on('peticioJugar',function(peticio){
            console.log('Peticio rebuda:'+peticio);
            var peticioObj=JSON.parse(peticio);
            //Comprovar que son amics
            existFriendship(peticioObj.myId,peticioObj.hisId,function(result){
                if(result>0)
                {
                    var index=usersConn.indexOf(peticioObj.hisId);
                    socket2=sockets[index];
                    socket2.emit('peticioJugar',peticio);
                    console.log('Peticio reenviada a:'+peticioObj.hisId);
                }else
                {
                    console.log('ERROR: no es pot reevnar Peticio:'+peticioObj.hisId);
                    socket.emit('ERROR','No es pot enviar peticio de jugar a '+peticioObj.hisId);
                }
            }) ;

        });
    });
    //############################
});
function existFriendship(idUser1,idUser2,callback)
{
    db.collection('friendships', function(err, collection) {
        collection.find({USERID:idUser1,USERID2:idUser2}).count(function(err, count) {
            console.log('existeix:count?:'+count);
            callback(count);
        });
    });
}
