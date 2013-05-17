$(function() {
    var var1=0;
    var var2=0;
    socket='';
    jocSel= '';
    jugadorSel='';
    $("#botoProva1").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>friend"+var1+"</div><div class='desc'>desc desc</div></div>"
        var div=$('<div/>',{id:'friend'+var1,class:'friend ui-widget-content draggable'}).append( string )
        div.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
        $("#friendsList").append(div);
        var1=var1+1;

    });


    $("#botoProva2").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>game"+var2+"</div><div class='desc'>WIN: 0 LOSE:999</div></div>"
        var div2=$('<div/>',{id:'game'+var2,class:'game ui-widget-content draggable'}).append( string )
        div2.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
        $("#gamesList").append(div2);
        var2=var2+1;
        //####PROVA SOCKET###
        /*connect(function(userId1,userId2,jocId){
            socket.emit('peticioJugar',"{'myId':"+userId1+",'hisId':"+userId2+",'jocId:"+jocId+"}");
        });*/
        //##################
    });

    $('#boardContent').droppable({
        accept: ".friend,.game",
        hoverClass: 'hoverDrop',
        drop: handle_drop_patient
    });
});
function handle_drop_patient(event, ui) {
    $(ui.draggable).addClass("ui-state-selected");
    if(ui.draggable.hasClass("friend"))
    {
        jugadorSel=($(ui.draggable).attr("id"));
        var divJugador=$('<div/>',{id:'jugadorContent'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />Xavier Sendra Granell");
        $('#boardContent').append(divJugador);
    }else
    {
        jocSel=($(ui.draggable).attr("id"));
        var divJoc=$('<div/>',{id:'gameContent'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />TIC-TAC-TOE");
        $('#boardContent').append(divJoc);
    }
    $(ui.draggable).remove();
    if(jocSel != '' && jugadorSel !='')
    {
        myId=$('#username').val();
        alert("Enviar petició?");
        if(socket==='')
        {
            alert("CONNECTAT???¿¿");
            connect(function(userId1,userId2,jocId){
                socket.emit('peticioJugar','{"myId":"'+userId1+'","hisId":"'+userId2+'","jocId":"'+jocId+'"}');
            });


        }
        else
        {
            socket.emit('peticioJugar','{"myId":"'+userId1+'","hisId":"'+userId2+'","jocId":"'+jocId+'"}');
            alert("NO FALTA CONNECTAR?");
        }
    }
}

 //####PROVES SOCKET######
function connect(callback) {
    alert("Connecting...");
    socket = io.connect('http://localhost');
    socket.on('WhoAreYou',function () {
        alert('WhoAreYou Rebut!');
        socket.emit('IAm',myId);
    });
    //#3 Si estamos conectados, muestra el log y cambia el mensaje
    socket.on('connected', function () {
        console.log('Conectado!');
        alert('Connectat!');
        callback(myId,jugadorSel,jocSel);
    });
    //#5 El servidor nos responde al click con este evento y nos da el número de clicks en el callback.
    socket.on('missatgeRem', function(missatge){
        console.log('Missatge: '+missatge);
        alert('MISSATGE REBUT:'+missatge);
    });
    socket.on('peticioJugar',function(peticio){
        console.log('Peticio rebuda: '+peticio);
        //demanar a usuari si vol jugar
        alert("Peticio rebuda sdgsdfsdf");
        var peticioObj=JSON.parse(peticio);
        alert("Peticio rebuda aaaaaa");
        var nomJoc='';
        $.ajax({
            type: 'POST',
            url: '/games',
            data: 'gameid='+peticioObj.jocId
        }).done(function(data){
                alert("Data Loaded bb: " + data);
            if (data.error == undefined) {
                console.log('SUCCES: ' + data);
                nomJoc=data.NAME;
                alert("Data Loaded: " + data);
                var li=$('<li/>',{id:"li_"+peticioObj.myId+"_"+peticioObj.jocId, user:peticioObj.myId,joc:peticioObj.jocId, class:'game ui-widget-content draggable'})
                var string= "<a href='#'><strong>"+peticioObj.myId+"</strong> vol jugar a <strong>"+nomJoc+"</strong></a>";
                li.append(string);
                li.click(function()
                {
                    alert("JUGAR A:"+$(this).attr('joc'));
                    initPPP();
                });
                $('#llistaPeticions').append(li)
                var string2="Peticions de jugar("+ $('#llistaPeticions').length+")<span class='caret'></span>";
                $('#botoPeticions').empty();
                $('#botoPeticions').append(string2);
            } else {
                alert('ERROR: '+ data.error);
                console.log('ERROR: '+ data.error);
            }
        });
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
    $('#botoLogin').click(function(){
        console.log('Login user');
        $.ajax({
            type: 'POST',
            url: '/users/login',
            data: $('#loginHere').serialize()
        }).done(function(data){
                if (data.error === undefined) {
                    console.log('SUCCES: ' + data.success);
                    $.cookie('id_user', data.id);
                    alert('SUCCES: '+data.success);
                    uploadUser(data.id);
                } else {
                    alert('ERROR: '+data.error);
                    console.log('ERROR: '+ data.error);
                }
            });
    });
});

function uploadUser(userID){
    console.log('getlogin');
    $.ajax({
        type: 'POST',
        url: '/users/getLogin',
        data: {'id': userID}
    }).done(function(data){
        alert('Doned: change login form for user');
    });
}