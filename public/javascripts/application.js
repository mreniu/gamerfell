$(function() {
    var var1=0;
    var var2=0;
    /*
    $("#botoLogin").click(function () {
        var div=$('<div/>',{id:'friend'+var1,class:'friend ui-widget-content draggable'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />Xavi Sendra "+var1+"<button id='ideliminar"+var1+"' class='titol'>eliminar</button>")
        div.draggable(
            {
                revert:'invalid',
                helper: 'clone',
                opacity: 0.5
            });
        $("#friendsList").append(div);

        var1=var1+1;
    });
    */
    /*
    $("#botoSignup").click(function () {
        var div2=$('<div/>',{id:'game'+var1,class:'game ui-widget-content draggable'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />TIC-TAC-TOE "+var2+"<button id='ideliminarA"+var2+"' class='titol'>eliminar</button>")
        div2.draggable(
            {
                revert:'invalid',
                helper: 'clone',
                opacity: 0.5
            });
        $("#gamesList").append(div2);

        var2=var2+1;
    });
    */
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
        var divJugador=$('<div/>',{id:'jugadorContent'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />Xavier Sendra Granell");
        $('#boardContent').append(divJugador);
    }else
    {
        var divJoc=$('<div/>',{id:'gameContent'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />TIC-TAC-TOE");
        $('#boardContent').append(divJoc);
    }
    $(ui.draggable).remove();
}

