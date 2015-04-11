var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);

// routing


// usernames which are currently connected to the chat
var usernames = {};
var players = {
    'room1': 0,
    'room2': 0,
    'room3': 0
};
// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];

io.sockets.on('connection', function (socket) {
	console.log('start');

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'room1';
		// add the client's username to the global list
		usernames[username] = username;
        players['room1'] = players['room1']+1;
		// send client to room 1
		socket.join('room1');
		// wyslanie wiadomosc do osoby ktora sie polaczyla
		socket.emit('updatechat', 'SERVER', 'you have connected to room1');
		// wyslanie wiadomosc do wszystkich po za osoba ktora sie polaczyla
		socket.broadcast.to('room1').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'room1');

        socket.emit('updatecount', usernames, players);
        socket.broadcast.emit('updatecount', usernames, players);
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);

        players[socket.room] = players[socket.room]-1;
        players[newroom] = players[newroom]+1;

		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);

        socket.emit('updatecount', usernames, players);
        socket.broadcast.emit('updatecount', usernames, players);
	});

    socket.on('mouse_activity', function(data) {
       console.log(data);
        socket.broadcast.emit('all_mouse_activity', {session_id: socket.id, coords: data});
    });

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
        players[socket.room] = players[socket.room]-1;
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);

        socket.emit('updatecount', usernames, players);
        socket.broadcast.emit('updatecount', usernames, players);
	});
});
