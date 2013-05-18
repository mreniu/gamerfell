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
        var jugada1=JSON.parse(jugada);
       if(jugadaMeva != undefined)
       {
           var imgEnem=$('<img/>',{id:"imgEnemic", fitxa:jugada1.jugada, class:'imgJocPPT imgJocPPTJo', src:"/javascripts/games/pedrapapertisores/"+jugada1.jugada+".png", alt: jugada1.jugada});
           $('#pptDestiEnemic').empty();
           $('#pptDestiEnemic').append(imgEnem);
           var resultat=$('<div/>',{id:'resultatPPT'});
           var botoTancar=$('<a/>',{id:"botoTancarPPT",class:"btn"});
           botoTancar.append("Tancar joc");
           botoTancar.click(function()
           {
               $('#resultatPPT').remove() ;
               $('#boardContent').empty();
           });
           var botoTornar=$('<a/>',{id:"botoTornarPPT",class:"btn"});
           botoTornar.append("Tornar a jugar");
           botoTornar.click(function()
           {
               $('#resultatPPT').remove();
               $('#boardContent').empty();
               socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
           });
           if(heGuanyat(jugadaMeva,jugada1.fitxa))
           {
               var img1=$('<img/>',{id:"guanyatPPT", class:'imgResultatPPT imgGuanyatPPT', src:"/javascripts/games/pedrapapertisores/youwin.png", alt: "GUANYAT"});
               resultat.append(img1);
               resultat.append(botoTancar);
               resultat.append(botoTornar);
          }else
           {
               var img1=$('<img/>',{id:"perdutPPT", class:'imgResultatPPT imgPerdutPPT', src:"/javascripts/games/pedrapapertisores/youlose.png", alt: "PERDUT"});
               resultat.append(img1);
               resultat.append(botoTancar);
               resultat.append(botoTornar);
           }
           jugadaEnemic=undefined;
           jugadaMeva=undefined;
           $(document.body).append(resultat);
       }else
       {
           jugadaEnemic=jugada1.jugada;
           var imgEnem=$('<img/>',{id:"imgEnemic", fitxa:'interrogant', class:'imgJocPPT imgJocPPTJo', src:"/javascripts/games/pedrapapertisores/interrogant.png", alt: 'interrogant'});
           $('#pptDestiEnemic').empty();
           $('#pptDestiEnemic').append(imgEnem);
       }
    });
});
function handle_drop_patient(event, ui) {
    $(ui.draggable).addClass("ui-state-selected");
    $('#pptDestiJo').empty();
    $('#pptDestiJo').append(ui.draggable.clone());
    jugadaMeva=ui.draggable.attr('fitxa');
    socket.emit("Jugada",'{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'","jugada":"'+ui.draggable.attr('fitxa')+'"}');
    if(jugadaEnemic != undefined)
    {
        var imgEnem=$('<img/>',{id:"imgEnemic", fitxa:jugadaEnemic, class:'imgJocPPT imgJocPPTJo', src:"/javascripts/games/pedrapapertisores/"+jugadaEnemic+".png", alt: jugadaEnemic});
        $('#pptDestiEnemic').empty();
        $('#pptDestiEnemic').append(imgEnem);
        var resultat=$('<div/>',{id:'resultatPPT'});
        var botoTancar=$('<a/>',{id:"botoTancarPPT",class:"btn"});
        botoTancar.append("Tancar joc");
        botoTancar.click(function()
        {
            $('#resultatPPT').remove() ;
            $('#boardContent').empty();
        });
        var botoTornar=$('<a/>',{id:"botoTornarPPT",class:"btn"});
        botoTornar.append("Tornar a jugar");
        botoTornar.click(function()
        {
            $('#resultatPPT').remove();
            $('#boardContent').empty();
            $.getScript( "/javascripts/games/pedrapapertisores/pedrapapertisores.js", function(script, textStatus, jqXHR){});
        });
        if(heGuanyat(jugadaMeva,jugadaEnemic))
        {
            var img1=$('<img/>',{id:"guanyatPPT", class:'imgResultatPPT imgGuanyatPPT', src:"/javascripts/games/pedrapapertisores/youwin.png", alt: "GUANYAT"});
            resultat.append(img1);
            resultat.append(botoTancar);
            resultat.append(botoTornar);
        }else
        {
            var img1=$('<img/>',{id:"perdutPPT", class:'imgResultatPPT imgPerdutPPT', src:"/javascripts/games/pedrapapertisores/youlose.png", alt: "PERDUT"});
            resultat.append(img1);
            resultat.append(botoTancar);
            resultat.append(botoTornar);
        }
        $(document.body).append(resultat);
    }
}
function heGuanyat(meva,seva)
{
    console.log("MEVA:"+meva+" SEVA:"+seva);
    if(meva==='scissors' && seva==='paper'
        || meva==='spock' && seva==='scissors'
        || meva==='lizard' && seva==='spock'
        || meva==='rock' && seva==='lizard'
        || meva==='paper' && seva==='rock'
        || meva==='paper' && seva==='spock'
        || meva==='lizard' && seva==='paper'
        || meva==='rock' && seva==='scissors'
        || meva==='scissors' && seva==='lizard'
        || meva==='spock' && seva==='rock')
    {
        console.log("HE GUANYAT");
        return true;
    }
    else
    {
        console.log("HE PERDUT");
    }    return false;
}