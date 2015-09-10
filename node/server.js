var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

var online = 0;
var rooms = ['room1','room2','room3'];
var roomsCount = {
    'room1': 0,
    'room2': 0,
    'room3': 0
};
var roomsDetails = [];
var users = [];

io.sockets.on('connection', function (socket) {
    online++;
    socket.broadcast.emit('users-online', online, roomsCount);

    console.log('start - osób online: '+online);
    socket.emit('available', roomsCount, online);

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username, nrRoom){

        socket.username = username;
        socket.room = nrRoom;
        users[socket.username] ={
            'name' : socket.username,
            'room' : socket.room
        };
        console.log(users);
        roomsCount[socket.room] = roomsCount[socket.room]+1;

		// send client to room 1
		socket.join(nrRoom);

        //send to index
        socket.broadcast.emit('available', roomsCount, online);
	});

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){
        console.log('SOCKET username: '+socket.username);

        //Zmniejszenie licznika online
        online--;
        socket.broadcast.emit('users-online', online, roomsCount);

        //Usunięcie
        delete users[socket.username];
        console.log(users);
        roomsCount[socket.room] = roomsCount[socket.room]-1;
        socket.broadcast.emit('deleterocket', socket.id);
        socket.leave(socket.room);
        socket.broadcast.emit('available', roomsCount, online);

    });


    socket.on('mouse_activity', function(data) {
       //console.log(data);
        socket.broadcast.to(socket.room).emit('all_mouse_activity', {session_id: socket.id, coords: data});
    });


});

