/**
 * Created with JetBrains WebStorm.
 * User: Shilko
 * Date: 16/05/13
 * Time: 19:58
 * To change this template use File | Settings | File Templates.
 */
function initPPP() {

    $('#boardContent').empty();
    var div=$('<div/>',{id:'pedrapapertisoresPanel'}).append( "<img class='imgJoc' src = 'games/pedrapapertisores/how-to-play-rock-paper-scissors-spock.jpg' alt = 'HOW TO' />FUCK THE POLICE!");
    $('#boardContent').append(div);
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
