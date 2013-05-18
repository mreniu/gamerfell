$(function() {
    if($.cookie('id_user')!=undefined)
        connect();
    var var1=0;
    var var2=0;
    socket='';
    jocSel= '';
    jugadorSel='';
    nomJocSel='';
    $("#botoProva1").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>user"+var1+"</div><div class='desc'>desc desc</div></div>"
        var div=$('<div/>',{id:'user'+var1,class:'friend ui-widget-content draggable'}).append( string )
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
        alert("Enviar petició?");
        if(socket==='')
        {
            connect(function(userId1,userId2,jocId){
                socket.emit('peticioJugar','{"myId":"'+userId1+'","hisId":"'+userId2+'","jocId":"'+jocId+'"}');
            });
       }
        else
        {
            socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
            alert("NO FALTA CONNECTAR?");
        }
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
        $.ajax({
            type: 'POST',
            url: '/games',
            data: 'gameid='+peticioObj.jocId
        }).done(function(data){
            if (data.error == undefined) {
                console.log('SUCCES: ' + data);
                nomJoc=data.NAME;
                var li=$('<li/>',{id:"li_"+peticioObj.myId+"_"+peticioObj.jocId, user:peticioObj.myId,joc:peticioObj.jocId,nomjoc:nomJoc, class:'game ui-widget-content draggable'})
                var string= "<a href='#'><strong>"+peticioObj.myId+"</strong> vol jugar a <strong>"+nomJoc+"</strong></a>";
                li.append(string);
                li.click(function()
                {
                    jocSel=$(this).attr('joc');
                    jugadorSel=$(this).attr('user');
                    var str="Peticions("+ $('#llistaPeticions').length+")<span class='caret'></span>";
                    $('#botoPeticions').empty();
                    $('#botoPeticions').append(str);
                    $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR)
                    {
                        socket.emit('acceptarJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
                        li.remove();
                    });
                });
                $('#llistaPeticions').append(li);
                var string2="Peticions("+ $('#llistaPeticions').length+")<span class='caret'></span>";
                $('#botoPeticions').empty();
                $('#botoPeticions').append(string2);
            } else {
                alert('ERROR: '+ data.error);
                console.log('ERROR: '+ data.error);
            }
        });
    });
    socket.on('acceptarJugar',function(data)
    {
        var accept=JSON.parse(data);
        jugadorSel=accept.myId;
        jocSel=accept.jocId;
        $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR)
        {});
    });
    //socket.emit('acceptarJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+$(this).attr('user')+'","jocId":"'+$(this).attr('joc')+'"}');
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
                //alert('SUCCES: '+data.success);
                if (window.location.pathname.match(/signup/) != undefined) {
                    window.location.href = "/";
                } else {
                    uploadUser(data.id);
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
    if ($.cookie('id_user') != undefined){
        uploadUser($.cookie('id_user'));
        $('#user').css('display','');
    } else {
        $('#login').css('display','');
    }
});
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
