/**
 * Created with JetBrains WebStorm.
 * User: Shilko
 * Date: 16/05/13
 * Time: 19:58
 * To change this template use File | Settings | File Templates.
 */
var jugadaMeva;
var jugadaEnemic;
$(function() {
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "/javascripts/games/pedrapapertisores/pedrapapertisores.css"
    }).appendTo("head");
    $('#boardContent').empty();
    var div=$('<div/>',{id:'pedrapapertisoresPanel'});
    var divHeader=$('<div/>',{id:'pptHeader',class:'gameHeader'});
    divHeader.append("Estas jugant a <strong>Pedra-Paper-Tisores-Llangardaix-Spock</strong> contra <strong> ?? </strong>");
    var divContent=$('<div/>',{id:'pptContent',class:'gameContent'});
    var divPecesEnemig=$('<div/>',{id:'pptPecesEnemic',class:'pptPeces'});
    var divDestiEnemig=$('<div/>',{id:'pptDestiEnemic',class:'pptDesti'});
    var divDestiJo=$('<div/>',{id:'pptDestiJo',class:'pptDesti'});
    divDestiJo.droppable({
        accept: ".imgJocPPTJo",
        hoverClass: 'hoverDrop',
        drop: handle_drop_patient
    });
    var divPecesJo=$('<div/>',{id:'pptPecesJo',class:'pptPeces'});
    var arrayImgs= ["lizard", "paper", "rock", "scissors", "spock"];
    for(i=0;i<5;i++)
    {
        var rand=Math.floor(Math.random() * arrayImgs.length);
        var text=arrayImgs[rand];

        var img1=$('<img/>',{id:"img"+i, fitxa:text, class:'imgJocPPT imgJocPPTJo', src:"/javascripts/games/pedrapapertisores/"+text+".png", alt: text});
        img1.draggable(
        {
            revert:'invalid',
            helper: 'clone',
            opacity: 0.5
        });
        divPecesJo.append(img1);
        arrayImgs=$.grep(arrayImgs, function(value) {
            return value != text;
        });
        var img2=$('<img/>',{id:"imgEnem"+i, fitxa:i, class:'imgJocPPT imgJocPPTEnem', src:'/javascripts/games/pedrapapertisores/interrogant.png' ,alt: 'interrogant'});
        divPecesEnemig.append(img2);
    }

    divContent.append(divPecesEnemig);
    divDestiEnemig.append("DESTI ENEMIG");
    divContent.append(divDestiEnemig);
    divDestiJo.append("DESTI JO!")
    divContent.append(divDestiJo);
    divContent.append(divPecesJo);

    div.append(divHeader);
    div.append(divContent);
    var imgHelp="<img class='imgJoc' src = '/javascripts/games/pedrapapertisores/how-to-play-rock-paper-scissors-spock.jpg' alt = 'HOW TO' />";
    $('#boardContent').append(div);
    socket.on('Jugada',function(jugada){
       if(jugadaMeva != undefined)
       {
           var resultat=$('<div/>',{id:'resultatPPT'});
           if(heGuanyat(jugadaMeva,jugada.fitxa))
           {
               var img1=$('<img/>',{id:"guanyatPPT", class:'imgResultatPPT imgGuanyatPPT', src:"/javascripts/games/pedrapapertisores/youwin.png", alt: "GUANYAT"});
               resultat.append(img1);
               var botoTancar=$('<a/>',{id:"botoTancarPPT",class:"btn"});
               botoTancar.append("Tancar joc");
               botoTancar.click(function()
               {
                   $('#resultatPPT').remove() ;
                   $('#boardContent').empty();
               });

               resultat.append("");

           }
       }
    });
});
function handle_drop_patient(event, ui) {
    $(ui.draggable).addClass("ui-state-selected");
    $('#pptDestiJo').empty();
    $('#pptDestiJo').append(ui.draggable.clone());
    socket.emit("Jugada",'{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+',jugada:'+ui.draggable.attr('fitxa')+'}');
    /*
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
            socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+userId2+'","jocId":"'+jocId+'"}');
            alert("NO FALTA CONNECTAR?");
        }
    }*/
}

/*
 function loadScript(url, callback)
 {
 // adding the script tag to the head as suggested before
 var head = document.getElementsByTagName('head')[0];
 var script = document.createElement('script');
 script.type = 'text/javascript';
 script.src = url;

 // then bind the event to the callback function
 // there are several events for cross browser compatibility
 script.onreadystatechange = callback;
 script.onload = callback;

 // fire the loading
 head.appendChild(script);
 }//http://stackoverflow.com/questions/950087/how-to-include-a-javascript-file-in-another-javascript-file


 */
