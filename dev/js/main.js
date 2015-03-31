var person = prompt("Please enter your name", "");
$('#nick').text(person);
var count = 0;
var yourId = null;

var degrees = 0;
var currentMousePos = { x: -1, y: -1 };
$(document).mousemove(function(event) {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;

    if(currentMousePos.x > 500){
        degrees = (currentMousePos.x-500)*(1/5);
    }
    else{
        degrees = -(-currentMousePos.x+500)*(1/5);
    }

    $('#my-racket').css('left',currentMousePos.x-56+'px')/*.css({
        '-webkit-transform' : 'rotate('+ degrees +'deg)',
        '-moz-transform' : 'rotate('+ degrees +'deg)',
        '-ms-transform' : 'rotate('+ degrees +'deg)',
        'transform' : 'rotate('+ degrees +'deg)'})*/;

    //socket.emit('chat message', currentMousePos.x+ " "+currentMousePos.y);
    $('#position-user span').text('x:'+currentMousePos.x+' y:'+currentMousePos.y);

    var setCurrentPosition = {
        x: currentMousePos.x,
        y: currentMousePos.y,
        nick: yourId
    };
    $(document).mousemove(function(event) {
        socket.emit('position', setCurrentPosition);
    });

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