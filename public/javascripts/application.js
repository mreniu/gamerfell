$(function() {
    var var1=0;
    var var2=0;

    $("#botoProva1").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>NOM NOM</div><div class='desc'>desc desc</div></div>"
        var div=$('<div/>',{id:'friend'+var1,class:'friend ui-widget-content draggable'}).append( string )
        div.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
        $("#friendsList").append(div);
        var1=var1+1;

        //####PROVA SOCKET###
         if(socket != '')
         {
            socket.emit('missatge',$('#username').val());
            alert($('#username').val());
         }
         else
            alert('Socket no està creat!!!');
       //####################

    });


    $("#botoProva2").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>NOM NOM</div><div class='desc'>WIN: 0 LOSE:999</div></div>"
        var div2=$('<div/>',{id:'game'+var1,class:'game ui-widget-content draggable'}).append( string )
        div2.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
        $("#gamesList").append(div2);
        var2=var2+1;
        //####PROVA SOCKET###
        connect(function(userId1,userId2,jocId){
            socket.emit('peticioJugar',"{'myId':"+userId1+",'hisId':"+userId2+",'jocId:"+jocId+"}");
        });
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
            connect(function(userId1,userId2,jocId){
                socket.emit('peticioJugar',"{'myId':"+userId1+",'hisId':"+userId2+",'jocId:"+jocId+"}");
            });
        else
            socket.emit('peticioJugar',"{'myId':"+userId1+",'hisId':"+userId2+",'jocId:"+jocId+"}");


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
        var peticioObj=JSON.parse(peticio);
        $.post("/", function(data) {
            alert("Data Loaded: " + data);
            var string= "<li><a href='#'>"+peticioObj.myId+" vol jugar a peticioObj</a></li>"   ;
            var div=$('<div/>',{id:'friend'+var1,class:'friend ui-widget-content draggable'}).append( string )

            $('#llistaPeticions').append()
        });


    });
    //#6 Si nos desconectamos, muestra el log y cambia el mensaje.
    socket.on('disconnect', function () {
        console.log('Desconectado!');
        alert('DESCONECTAT!');
    });
}
//###########################