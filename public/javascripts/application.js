
$(function() {
	var var1=0;
	var var2=0;
	$("#botoLogin").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>NOM NOM</div><div class='desc'>desc desc</div></div>"
		var div=$('<div/>',{id:'friend"+var1+"',class:'friend ui-widget-content draggable'}).append( string )
		div.draggable({revert:"invalid"});
		$("#friendsList").append(div);
		
		var1=var1+1;
	});
	
	$("#botoSignup").click(function () {
        var string= "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' /><div class='text'><div class='title'>NOM NOM</div><div class='desc'>WIN: 0 LOSE:999</div></div>"
		var div2=$('<div/>',{id:'game"+var1+"',class:'game ui-widget-content draggable'}).append( string )
		div2.draggable({revert:"invalid"});
		$("#gamesList").append(div2);
		
		var2=var2+1;
	});
	$('#appBody').droppable({
		drop: handle_drop_patient	
	});
});
function handle_drop_patient(event, ui) {
    $(ui.draggable).addClass("ui-state-selected");
	var divJugador=$('<div/>',{id:'jugadorContent'}).append( "<img class='imgPerfil' src = '../images/faceXavi.jpg' alt = 'Picture of a happy monkey' />Xavier Sendra Granell");
	$('#boardPanel').append(divJugador);
	$(ui.draggable).remove();
}