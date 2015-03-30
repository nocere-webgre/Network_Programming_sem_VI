<!doctype html>
<html>
<head>
    <title>Projekt programowanie sieciowe</title>
    <link rel="Stylesheet" type="text/css" href="static/styles/style.css" />
</head>
<body>
<div class="users">
    Użytkowników: <span>0</span>
</div>
<ul id="messages"></ul>
<form action="">
    <label id="nick"></label>
    <input id="m" autocomplete="off" /><button>Send</button>
</form>
<script src="https://cdn.socket.io/socket.io-1.2.0.js"></script>
<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script>
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

    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('con', function(data){
        $('#messages').append($('<li>').text("witaj "+data.yournick));
        console.log(data);
    });

    socket.on('countusers', function(x){

        $('.users span').text(x);

    });


</script>
</body>
</html>
