var person = prompt("Please enter your name", "");
$('#nick').text(person);
var count = 0;
var socket = io('http://localhost:3000');
socket.emit('join', person);

var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;

    //socket.emit('chat message', currentMousePos.x+ " "+currentMousePos.y);
});

$('form').submit(function(){

    var send = {
        text: $('#m').val(),
        nick: person
    };

    socket.emit('chat message', send);
    $('#m').val('');
    return false;
});