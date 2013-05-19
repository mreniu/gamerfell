$(function() {
    socket='';
    jocSel= '';
    jugadorSel='';
    nomJocSel='';
    matchId=undefined;
    var peticions;
    if($.cookie('id_user')!=undefined)
        connect();
   if($.cookie('peticions')!=undefined)
    {
        var peticionsCookie= JSON.parse($.cookie('peticions'));

        for(i=0;i<peticionsCookie.length;i++)
        {
            var peticioObj=peticionsCookie[i];
            var nomJoc='';
            $.ajax({
                type: 'POST',
                url: '/games',
                data: 'gameid='+peticioObj.jocId
            }).done(function(data){
                if (data.error == undefined) {
                    console.log('SUCCES: ' + data);
                    nomJoc=data.NAME;
                    var li=$('<li/>',{id:"li_"+peticioObj.myId+"_"+peticioObj.jocId, user:peticioObj.myId,joc:peticioObj.jocId,nomjoc:nomJoc, class:'game ui-widget-content draggable'})
                   getNomByUserId(peticioObj.myId, function(nomJugador){
                        var string= "<a href='#'><strong>"+nomJugador+"</strong> vol jugar a <strong>"+nomJoc+"</strong></a>";
                        li.append(string);
                        li.click(function()
                        {
                            jocSel=$(this).attr('joc');
                            jugadorSel=$(this).attr('user');
                            var str="Peticions("+ peticionsCookie.length+")<span class='caret'></span>";
                            $('#botoPeticions').empty();
                            $('#botoPeticions').append(str);
                            $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR)
                            {
                                socket.emit('acceptarJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
                                li.remove();
                                if($.cookie("peticions")!=undefined)
                                {
                                    var peticions=JSON.parse($.cookie("peticions"));

                                    findAndRemove(peticions,JSON.parse('{"myId":"'+jugadorSel+'","hisId":"'+$.cookie("id_user")+'","jocId":"'+jocSel+'"}'),function()
                                    {
                                        if(peticions!=undefined)
                                        {
                                            $.cookie("peticions",JSON.stringify(peticions));
                                            var string2="Peticions("+ peticions.length+")<span class='caret'></span>";
                                            $('#botoPeticions').empty();
                                            $('#botoPeticions').append(string2);
                                        }else
                                        {
                                            var string2="Peticions(0)<span class='caret'></span>";
                                            $('#botoPeticions').empty();
                                            $('#botoPeticions').append(string2);
                                        }
                                    }) ;
                                }

                            });
                        });
                        $('#llistaPeticions').append(li);
                        var string2="Peticions("+ peticionsCookie.length+")<span class='caret'></span>";
                        $('#botoPeticions').empty();
                        $('#botoPeticions').append(string2);
                   });
                }
            });
        }
    }

    // Creació de l'event Droppable al tauler
    $('#boardContent').droppable({
        accept: ".friend,.game",
        hoverClass: 'hoverDrop',
        drop: handle_drop_patient
    });
});
function handle_drop_patient(event, ui) {
    $(ui.draggable).addClass("ui-state-selected");
    if(ui.draggable.hasClass("friend")) // Hem afegit un amic al tauler
    {
        // Petició de l'objecte User de amic
        jugadorSel=($(ui.draggable).attr("id"));
        $.ajax({
            type: 'GET',
            url: '/users/:id',
            data: {'id': jugadorSel},
            dataType: 'json'
        }).done(function(data){
            // Creació i adhesió del amic al DOM del tauler
            var divJugador=$('<div/>',{id:'jugadorContent'}).append( "<div class='image'><img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /></div><div class='text'>"+data.user+"</div><div class='data'><strong>Nom: </strong>"+data.name+"<br/><strong>Cognoms: </strong>"+data.surnames+"<br/><strong>Email: </strong>"+data.email+"</div>");
            $('#boardContent #jugadorContent').remove();
            $('#boardContent').append(divJugador);
        });
    }else // Hem afegit un joc al tauler
    {
        //Petició de l'objecte Game
        jocSel=($(ui.draggable).attr("id"));
        $.ajax({
            type: 'GET',
            url: '/games/:id',
            data: {'id': jocSel},
            dataType: 'json'
        }).done(function(data){
            // Creació i addhesió del joc al DOM del tauler
            var divJoc=$('<div/>',{id:'gameContent'}).append( "<div class='image'><img class='imgPerfil' src = '../images/faceGame.jpg' alt = 'Picture of a happy monkey' /></div><div class='text'>"+data.NAME+"</div><div class='data'><strong>Descripció: </strong>"+data.DESCRIPTION+"<br/><strong>Nº jugadors: </strong>"+data.NPlayers+"</div>");
            $('#boardContent #gameContent').remove();
            $('#boardContent').append(divJoc);
        });
    }

    // Existeix un amic i un joc al tauler
    if(jocSel != '' && jugadorSel !='')
    {
        // Esborrem l'antic botó de petició
        $('#boardContent #botoPeticioPPT').remove();

        // Creació del DOM
        var botoPeticio=$('<a/>',{id:"botoPeticioPPT",class:"btn"});
        botoPeticio.append("Enviar petició de jugar!");
        botoPeticio.click(function()
        {
            // Comprovació de socket
            if(socket==='')
            {
                connect(function(userId1,userId2,jocId){
                    socket.emit('peticioJugar','{"myId":"'+userId1+'","hisId":"'+userId2+'","jocId":"'+jocId+'"}');
                });
            }
            else
            {
                socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
            }
            $('#boardContent').append("<div class='avisPeticio'>Petició enviada!</div>") ;
        });
        // Afegir boto al DOM
        $('#boardContent').append(botoPeticio);

    }
}

 //####PROVES SOCKET######
function connect(callback) {
    socket = io.connect('http://localhost');
    socket.on('WhoAreYou',function () {
        socket.emit('IAm',$.cookie('id_user'));
    });
    //#3 Si estamos conectados, muestra el log y cambia el mensaje
    socket.on('connected', function () {
        console.log('Conectado!');
        if(callback!=undefined)
            callback($.cookie('id_user'),jugadorSel,jocSel);
    });
    //#5 El servidor nos responde al click con este evento y nos da el número de clicks en el callback.
    socket.on('missatgeRem', function(missatge){
        console.log('Missatge: '+missatge);
    });
    socket.on('peticioJugar',function(peticio){
        console.log('Peticio rebuda: '+peticio);
        //demanar a usuari si vol jugar
        var peticioObj=JSON.parse(peticio);
        var nomJoc='';
        getNomByUserId(peticioObj.myId,function(nomJugador){

            $.ajax({
                type: 'POST',
                url: '/games',
                data: 'gameid='+peticioObj.jocId
            }).done(function(data){
                if (data.error == undefined) {
                    console.log('SUCCES: ' + data);
                    nomJoc=data.NAME;
                    if($.cookie("peticions")===undefined)
                    {
                        peticions=[];
                        peticions.push(peticioObj);
                    }
                    else
                    {
                        peticions=JSON.parse($.cookie("peticions"));
                        peticions.push(peticioObj);
                    }
                    $.cookie("peticions", JSON.stringify(peticions));
                    var li=$('<li/>',{id:"li_"+peticioObj.myId+"_"+peticioObj.jocId, user:peticioObj.myId,joc:peticioObj.jocId,nomjoc:nomJoc, class:'game ui-widget-content draggable'})
                    var string= "<a href='#'><strong>"+nomJugador+"</strong> vol jugar a <strong>"+nomJoc+"</strong></a>";
                    li.append(string);
                    li.click(function()
                    {
                        jocSel=$(this).attr('joc');
                        jugadorSel=$(this).attr('user');
                        $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR)
                        {
                            socket.emit('acceptarJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
                            li.remove();
                            var peticions;
                            if($.cookie("peticions")!=undefined)
                            {
                                peticions=JSON.parse($.cookie("peticions"));

                                var index=findAndRemove(peticions,JSON.parse('{"myId":"'+jugadorSel+'","hisId":"'+$.cookie('id_user')+'","jocId":"'+jocSel+'"}'),function(){
                                    if(peticions !=undefined)
                                    {
                                        $.cookie("peticions", JSON.stringify(peticions));
                                        var string2="Peticions("+ peticions.length+")<span class='caret'></span>";
                                        $('#botoPeticions').empty();
                                        $('#botoPeticions').append(string2);
                                    }else
                                    {
                                        var string2="Peticions(0)<span class='caret'></span>";
                                        $('#botoPeticions').empty();
                                        $('#botoPeticions').append(string2);
                                    }
                                });

                            }

                        });
                    });
                    $('#llistaPeticions').append(li);
                    var string2="Peticions("+ peticions.length+")<span class='caret'></span>";
                    $('#botoPeticions').empty();
                    $('#botoPeticions').append(string2);
                } else {
                    alert('ERROR: '+ data.error);
                    console.log('ERROR: '+ data.error);
                }
            });
        });
    });
    socket.on('acceptarJugar',function(data)
    {
        var accept=JSON.parse(data);
        jugadorSel=accept.myId;
        jocSel=accept.jocId;
        crearPartida($.cookie('id_user'),jugadorSel,jocSel);
        $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR)
        {});
    });

    //#6 Si nos desconectamos, muestra el log y cambia el mensaje.
    socket.on('disconnect', function () {
        console.log('Desconectado!');
        alert('DESCONECTAT!');
    });
}
//###########################

/******    LOGIN      ******/

$(document).ready(function(){
    // Creació de l'event de petició de login
    $('#botoLogin').click(function(){
        console.log('Login user');
        // Petició login a User
        $.ajax({
            type: 'POST',
            url: '/users/login',
            data: $('#loginHere').serialize()
        }).done(function(data){
            if (data.error === undefined) { // El login no ha trobat cap error
                console.log('SUCCES: ' + data.success);
                // Creem la cookie de sessió
                $.cookie('id_user', data.id);
                // Si estem a la pagina de Registre, redireccionar al root
                if (window.location.pathname.match(/signup/) != undefined) {
                    window.location.href = "/";
                } else {
                    // Actualitzem panell d'usuari, i llistat d'amics i jocs
                    uploadUser(data.id);
                    getGameList();
                    getFriendList();
                }
                connect();
            } else {
                alert('ERROR: '+data.error);
                console.log('ERROR: '+ data.error);
            }
        });
    });

    $('#botoLogout').click(function(){
        $.cookie('id_user', null, {expires: -1});
        window.location.href = "/";
    });
});
$(function(){
    // Si existeix la cookie de sessió d'usuari...
    if ($.cookie('id_user') != undefined){
        uploadUser($.cookie('id_user'));
        getGameList();
        getFriendList();
        $('#user').css('display','');
    } else {
        $('#login').css('display','');
    }
});

// Actualitzem el panell d'usuari
function uploadUser(userID){
    console.log('getlogin');
    $.ajax({
        type: 'POST',
        url: '/users/getLogin',
        data: {'id': userID}
    }).done(function(data){
        //alert('Doned: change login form for user\r\n'+data);
        $('#user-panel .user-name').html(data.user);
        $('#login').css('display','none');
        $('#user').css('display','');
    });
}

/******    FRIENDS      ******/
$(document).ready(function(){
    // Creació de l'event per afegir amic
    $('#botoAddFriend').click(function(){
        console.log('Adding user');
        // Petició addFriend
        $.ajax({
            type: 'POST',
            url: '/friendships',
            data: {'id_user':$.cookie('id_user'), 'id_friend': $('#addFriendHere input#friend_username').val()}
        }).done(function(data){
            if (data.error != undefined){
                console.log('ERROR: '+ data.error);
                alert('ERROR: '+ data.error);
            } else {
                alert(data.success);
                // Afegim amics al llistat d'amics
                addFriendToList(data.friend);
                $('#addFriendHere input#friend_username').val('');
                $('#addFriendPanel').hide();
            }
        });
    });
});

// Busquem llistat d'amics
function getFriendList(){
    $.ajax({
        type: 'POST',
        url: '/friendships/findfriends',
        data: {'id_user': $.cookie('id_user')}
    }).done(function(data){
        $.each(data.friends, function(index, value){
            addFriendToListWithSearch(value);
        })
    });
};

// Afegim un usuari al llistat d'amics segons un objecte USER
function addFriendToList(friend) {
    // Creem estructura DOM
    var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='connected-icon'></div><div class='text'><div class='title'>"+friend.user+"</div><div class='desc'>desc desc</div></div><div class='chat-button'><a onclick='showChat('"+friend.USERID+"')'><img class='ic-chat'></a></div>"
    var div=$('<div/>',{id: friend.USERID,class:'friend ui-widget-content draggable no-connected message'}).append( string )
    var chat_div=$('<div/>',{id: 'chat_'+friend.USERID, class:'chat'})
    div.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });

    // Afegim usuari al llistat d'amics
    $("#friendsList").append(div);
    $(div).after(chat_div);
};

// Afegim un usuari al llistat d'amics segons un objecte FRIENDSHIP
function addFriendToListWithSearch(friend){
    // Busquem el USERID del amic
    var id_friend;
    if (friend.USERID == $.cookie('id_user')) {
        id_friend = friend.USERID2;
    } else { id_friend = friend.USERID; }
    console.log('FRIEND: '+id_friend);

    // Petició de userByID
    $.ajax({
        type: 'GET',
        url: '/users/:id',
        data: {'id': id_friend},
        dataType: 'json'
    }).done(function(data){
            // Creem estructura DOM
            var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='connected-icon'></div><div class='text'><div class='title'>"+data.user+"</div><div class='desc'>desc desc</div></div><div class='chat-button'><a onclick='showChat(\""+data.USERID+"\")'><img class='ic-chat'></a></div>"
            var div=$('<div/>',{id: data.USERID,class:'friend ui-widget-content draggable no-connected message'}).append( string )
            var chat_div=$('<div/>',{id: 'chat_'+data.USERID, class:'chat'})
            div.draggable(
                {
                    revert:'invalid',
                    helper: 'clone',
                    opacity: 0.5
                });
            // Afegim usuari al llistat d'amics
            $("#friendsList").append(div);
            $(div).after(chat_div);
    });
}
function getNomByUserId(userId,callback)
{
    $.ajax({
        type: 'GET',
        url: '/users/:id',
        data: {'id': userId},
        dataType: 'json'
    }).done(function(data){
         callback(data.user);
    });
}
/******    GAMES      ******/
// Obtenim llistat de GAMES del sistema
function getGameList(){
    $.ajax({
        type: 'GET',
        url: '/games'
    }).done(function(data){
            $.each(data, function(index, value){
                addGameToList(value);
            })
        });
};

// Afegeix un GAME a la llista segons un objecte GAME
function addGameToList(game) {
    var string= "<img class='imgPerfil' src = '../images/faceGame.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>"+game.NAME+"</div><div class='desc'>WIN: 0 LOSE:999</div></div>"
    var div=$('<div/>',{id: game.GAMEID,class:'game ui-widget-content draggable'}).append( string )
    div.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
    $("#gamesList").append(div);
};

/*****     CHAT      *****/
// Mostrem o ocultem el DOM del CHAT
function showChat(userID) {
    if ($('#'+userID).attr('class').match(/message/)){
        $('#'+userID).removeClass('message').addClass('open-message');
    } else {
        $('#'+userID).removeClass('open-message');
    }
    $('#chat_'+userID).slideToggle('slow');
}

function findAndRemove(array, valor,callback) {
    $.each(array, function(index, result) {

        if(result!=undefined && result.myId === valor.myId && result.hisId === valor.hisId && result.gameId === valor.gameId) {
            //Remove from array
            array.splice(index, 1);
            console.log("ELIMINAT DE COOKIE inde:"+index+"!");
            if(callback!=undefined)
                callback();
            return false;
        }
    });
}

function guardarResultatPartida(playerId,matchid,gameId)
{
    $.ajax({
        type: 'PUT',
        url: '/matchs',
        data: 'MATCHID='+matchid+'GAMEID='+gameid+'&STATE=1&WINNER='+playerId
    });
}

function crearPartida(user1,user2,gameid)
{
    $.ajax({
        type: 'POST',
        url: '/matchs',
        data: 'GAMEID='+gameid+'&STATE=0&WINNER=""'
    }).done(function(match_id){
        if (match_id.error != undefined){
            console.log('ERROR: '+ match_id.error);
        }else
        {
            matchId=match_id;
            console.log("###MATCHID="+matchId);
            $.ajax({
                type: 'POST',
                url: '/players',
                data: 'MATCHID='+match_id+'&USERID='+user1+'&SCORE=""'
            }).done(function(player_id1){
                if (player_id1.error != undefined){
                    console.log('ERROR: '+ player_id1.error);
                }else
                {
                    playerId1=player_id1;
                    $.ajax({
                        type: 'POST',
                        url: '/players',
                        data: 'MATCHID='+match_id+'&USERID='+user2+'&SCORE=""'
                    }).done(function(player_id2){
                        if (player_id2.error != undefined){
                            console.log('ERROR: '+ player_id2.error);
                        }else
                        {
                            playerId2=player_id2;
                        }
                    });
                }
            });
        }
    });
}