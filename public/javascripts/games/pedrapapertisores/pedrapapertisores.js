/*
   AQUESTA CLASSE INCLOU TOT EL CODI PER QUE S'EXECUTI EL JOC DEL PEDRA PAPER TISORES LLANGARDAIX SPOCK
 */
var jugadaMeva;
var jugadaEnemic;
$(function() {
    jugadaMeva=undefined;
    jugadaEnemic=undefined;
    //ELIMINEM TOTS ELS BINDS QUE S'HAGIN POGUT CREAR EN EXECUCIONS ANTERIORS
    $(".ppt").unbind();
    //AFEGIM EL CSS
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "/javascripts/games/pedrapapertisores/pedrapapertisores.css"
    }).appendTo("head");
    //GENERACIO DEL PANELL
    $('#boardContent').empty();
    var div=$('<div/>',{id:'pedrapapertisoresPanel', class:'ppt'});
    var divHeader=$('<div/>',{id:'pptHeader',class:'gameHeader ppt'});
    var divContent=$('<div/>',{id:'pptContent',class:'gameContent ppt'});
    var divPecesEnemig=$('<div/>',{id:'pptPecesEnemic',class:'pptPeces ppt'});
    var divDestiEnemig=$('<div/>',{id:'pptDestiEnemic',class:'pptDesti ppt'});

    var divDestiJo= $('<div/>',{id:'pptDestiJo',class:'pptDesti ppt'});

    divDestiJo.droppable({
        accept: ".imgJocPPTJo",
        hoverClass: 'hoverDrop',
        drop: handle_drop_patient
    });
    var divPecesJo=$('<div/>',{id:'pptPecesJo',class:'pptPeces ppt'});
    var arrayImgs= ["lizard", "paper", "rock", "scissors", "spock"];
    for(i=0;i<5;i++)
    {
        //ES POSICIONEN LES FITXES ALEATORIAMENT
        var rand=Math.floor(Math.random() * arrayImgs.length);
        var text=arrayImgs[rand];

        var img15=$('<img/>',{id:"img"+i, fitxa:text, class:'imgJocPPT imgJocPPTJo ppt', src:"/javascripts/games/pedrapapertisores/"+text+".png", alt: text});
        img15.draggable(
            {
                revert:'invalid',
                helper: 'clone',
                opacity: 0.5
            });
        divPecesJo.append(img15);
        arrayImgs=$.grep(arrayImgs, function(value) {
            return value != text;
        });
        var img25=$('<img/>',{id:"imgEnem"+i, fitxa:i, class:'imgJocPPT imgJocPPTEnem ppt', src:'/javascripts/games/pedrapapertisores/interrogant.png' ,alt: 'interrogant'});
        divPecesEnemig.append(img25);
    }

    divContent.append(divPecesEnemig);
    var textDestiEnemig=$('<div/>',{class: 'text'}).append('ESPERA')
    divDestiEnemig.append(textDestiEnemig);

    divContent.append(divDestiEnemig);
    var textDestJo=$('<div/>',{class: 'text'}).append('ESCULL!')
    divDestiJo.append(textDestJo)
    divContent.append(divDestiJo);
    divContent.append(divPecesJo);

    div.append(divHeader);
    div.append(divContent);
    var imgHelp="<img class='imgJoc ppt' src = '/javascripts/games/pedrapapertisores/how-to-play-rock-paper-scissors-spock.jpg' alt = 'HOW TO' />";
    $('#boardContent').append(div);

    //QUAN EL CLIENT REB UNA JUGADA PER SOCKET, SI JA HA FET LA SEVA MOSTRA LA JUGADA I FINALITZA EL JOC
    //SI ENCARA NO HEM FET LA JUGADA ES GUARDA LA JUGADA DE L ALTRE FINS QUE LA FEM i MOSTRA UNA FITXA AMB UN INTERROGANT
    socket.on('Jugada',function(jugada){
        console.log("jugadaEnemic12:"+jugada)
        var jugada2=JSON.parse(jugada);
        jugadaEnemic=jugada2.jugada;
        console.log("jugadaMeva:"+jugadaMeva)
        if(jugadaMeva != undefined)
        {
            var imgEnem7=$('<img/>',{id:"imgEnemic", fitxa:jugadaEnemic, class:'imgJocPPT imgJocPPTEnemic ppt', src:"/javascripts/games/pedrapapertisores/"+jugadaEnemic+".png", alt:jugadaEnemic});
            console.log("jugadaEnemic:"+jugadaEnemic)
            $('#pptDestiEnemic').empty();
            $('#pptDestiEnemic').append(imgEnem7);
            var resultat=$('<div/>',{id:'resultatPPT', class:'ppt'});
            var botoResultat=$('<div/>',{id:'botoResultatPPT'});
            var botoTancar=$('<a/>',{id:"botoTancarPPT",class:"btn ppt"});
            botoTancar.append("Tancar joc");
            botoTancar.click(function()
            {
                $('#resultatPPT').remove() ;
                $('#boardContent').empty();
            });
            var botoTornar=$('<a/>',{id:"botoTornarPPT",class:"btn ppt"});
            botoTornar.append("Tornar a jugar");
            botoTornar.click(function()
            {
                $('#resultatPPT').remove();
                $('#boardContent').empty();
                socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
            });
            //AVALUEM QUI HA GUANYAT I HO MOSTREM TAMBE GUARDEM EL RESULTAT A LA DB
            var result=heGuanyat(jugadaMeva,jugadaEnemic);
            if(result===0)
            {
                var img3=$('<img/>',{id:"guanyatPPT", class:'imgResultatPPT imgGuanyatPPT ppt', src:"/javascripts/games/pedrapapertisores/youwin.png", alt: "GUANYAT"});
                resultat.append(img3);
            }else if(result===1)
            {
                var img3=$('<img/>',{id:"perdutPPT", class:'imgResultatPPT imgPerdutPPT ppt', src:"/javascripts/games/pedrapapertisores/youlose.png", alt: "PERDUT"});
                resultat.append(img3);
            } else if(result===2)
            {
                var img3=$('<img/>',{id:"empatPPT", class:'imgResultatPPT imgEmpatPPT ppt', src:"/javascripts/games/pedrapapertisores/empat.png", alt: "Empat"});
                resultat.append(img3);
            }
            botoResultat.append(botoTancar);
            botoResultat.append(botoTornar);
            $(document.body).append(resultat);
            resultat.delay(2000).show('clip',1000);
            resultat.append(botoResultat);
            botoResultat.delay(4000).show('clip',1000);
        }else
        {
            var imgEnem6=$('<img/>',{id:"imgEnemic23", fitxa:'interrogant', class:'imgJocPPT imgJocPPTEnemic ppt', src:"/javascripts/games/pedrapapertisores/interrogant.png", alt: 'interrogant'});
            $('#pptDestiEnemic').empty();
            $('#pptDestiEnemic').append(imgEnem6);
        }
    });
    //OBTENIM EL NOM DEL CONTRINCANT
    getNomByUserId(jugadorSel,function(nom){
        divHeader.append("Estas jugant a <strong>Pedra-Paper-Tisores-Llangardaix-Spock</strong> contra <strong>"+ nom +"</strong>");
    });
});

//QUAN L USUARI ARRASTRA UNA FITXA FINS A LA ZONA S?ENVIA PER SOCKET
//LA JUGADA, SI JA HEM REBUT LA JUGADA DEL CONTRINCANT FINALITZEM EL JOC
function handle_drop_patient(event, ui) {
    if(jugadaMeva===undefined)
    {
        $(ui.draggable).addClass("ui-state-selected");
        $('#pptDestiJo').empty();
        $('#pptDestiJo').append(ui.draggable.clone());
        jugadaMeva=ui.draggable.attr('fitxa');
        console.log("jugadaMeva:"+jugadaMeva);
        socket.emit("Jugada",'{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'","jugada":"'+ui.draggable.attr('fitxa')+'"}');
        if(jugadaEnemic != undefined)
        {
            var imgEnem5=$('<img/>',{id:"imgEnemic2", fitxa:jugadaEnemic, class:'imgJocPPT imgJocPPTEnemic ppt', src:"/javascripts/games/pedrapapertisores/"+jugadaEnemic+".png", alt: jugadaEnemic});
            $('#pptDestiEnemic').empty();
            $('#pptDestiEnemic').append(imgEnem5);
            var resultat=$('<div/>',{id:'resultatPPT', class:'ppt'});
            var botoResultat=$('<div/>',{id:'botoResultatPPT', class:'ppt'});
            var botoTancar=$('<a/>',{id:"botoTancarPPT",class:"btn ppt"});
            botoTancar.append("Tancar joc");
            botoTancar.click(function()
            {
                $('#resultatPPT').remove() ;
                $('#boardContent').empty();
            });
            var botoTornar=$('<a/>',{id:"botoTornarPPT",class:"btn ppt"});
            botoTornar.append("Tornar a jugar");
            botoTornar.click(function()
            {
                $('#resultatPPT').remove();
                $('#boardContent').empty();
                socket.emit('peticioJugar','{"myId":"'+$.cookie('id_user')+'","hisId":"'+jugadorSel+'","jocId":"'+jocSel+'"}');
            });
            //CALCULAR QUI HA GUANYAT I GUARDEM LES DADES A LA DB
            var result=heGuanyat(jugadaMeva,jugadaEnemic);
            if(result===0)
            {
                var img2=$('<img/>',{id:"guanyatPPT", class:'imgResultatPPT imgGuanyatPPT ppt', src:"/javascripts/games/pedrapapertisores/youwin.png", alt: "GUANYAT"});
                resultat.append(img2);
            }else if(result===1)
            {
                var img2=$('<img/>',{id:"perdutPPT", class:'imgResultatPPT imgPerdutPPT ppt', src:"/javascripts/games/pedrapapertisores/youlose.png", alt: "PERDUT"});
                resultat.append(img2);
            } else if(result===2)
            {
                var img2=$('<img/>',{id:"empatPPT", class:'imgResultatPPT imgEmpatPPT ppt', src:"/javascripts/games/pedrapapertisores/empat.png", alt: "Empat"});
                resultat.append(img2);
            }
            botoResultat.append(botoTancar);
            botoResultat.append(botoTornar);
            $(document.body).append(resultat);
            resultat.delay(2000).show('clip',1000);
            resultat.append(botoResultat);
            botoResultat.delay(4000).show('clip',1000);
        }
    }
}

//METODE QUE CALCULA QUI HA GUANYAT I HO GUARDA A LA DB
function heGuanyat(meva,seva)
{
    var resultat;
    console.log("MEVA:"+meva+" SEVA:"+seva);
    if((meva==='scissors' && seva==='paper')
        || (meva==='spock' && seva==='scissors')
        || (meva==='lizard' && seva==='spock')
        || (meva==='rock' && seva==='lizard')
        || (meva==='paper' && seva==='rock')
        || (meva==='paper' && seva==='spock')
        || (meva==='lizard' && seva==='paper')
        || (meva==='rock' && seva==='scissors')
        || (meva==='scissors' && seva==='lizard')
        || (meva==='spock' && seva==='rock'))
    {
        console.log("HE GUANYAT");
        resultat= 0;
    }
    else if((seva==='scissors' && meva==='paper')
        || (seva==='spock' && meva==='scissors')
        || (seva==='lizard' && meva==='spock')
        || (seva==='rock' && meva==='lizard')
        || (seva==='paper' && meva==='rock')
        || (seva==='paper' && meva==='spock')
        || (seva==='lizard' && meva==='paper')
        || (seva==='rock' && meva==='scissors')
        || (seva==='scissors' && meva==='lizard')
        || (seva==='spock' && meva==='rock'))
    {
        console.log("HE PERDUT");
        resultat= 1;
    }
    else
    {
        console.log("HE EMPATAT");
        resultat= 2;
    }
    console.log("###MATCHID A GUNYAR="+matchId);
    if(matchId !== undefined)
    {
        var winner;
        if(resultat===0)
           winner=playerId1;
        else if(resultat===1)
           winner=playerId2;
        if(winner!=undefined)
            guardarResultatPartida(winner,matchId,jocSel);
    }
    playerId1=undefined;
    playerId2=undefined;
    matchId=undefined;
    return resultat;
}
