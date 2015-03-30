var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var x = 0;


io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);

    socket.on('disconnect', function(){
        x=x-1;
        console.log( socket.name + '['+x+'] has disconnected from the chat.' + socket.id);
        io.emit('countusers', x);
        console.log('Liczba użytkowników: '+x);
    });

    socket.on('join', function (name) {
        x=x+1;

        var data = {
            users: x,
            yournick: name
        }

        socket.name = name;
        console.log(socket.name + '['+x+'] joined the chat.');
        io.emit('con', data);
        io.emit('countusers', x);
        console.log('Liczba użytkowników: '+x);
    });

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});