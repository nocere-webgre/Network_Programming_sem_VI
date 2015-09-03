var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(3000);


// usernames which are currently connected to the chat
//var usernames = {};
var online = 0;
var playersID = {
    'room1': 0,
    'room2': 0,
    'room3': 0
};

// rooms which are currently available in chat
var rooms = ['room1','room2','room3'];
var roomsCount = {
    'room1': 0,
    'room2': 0,
    'room3': 0
};
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

		// wyslanie wiadomosc do osoby ktora sie polaczyla
		//socket.emit('updatechat', 'SERVER', 'you have connected to '+nrRoom);
		// wyslanie wiadomosc do wszystkich po za osoba ktora sie polaczyla
		//socket.broadcast.to(nrRoom).emit('updatechat', 'SERVER', username + ' has connected to this room');
		//socket.emit('updaterooms', rooms, nrRoom);

        //socket.emit('updatecount', usernames, roomsCount);
        //socket.broadcast.emit('updatecount', usernames, roomsCount);

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

        //socket.broadcast.emit('deleterocket', socket.id);

        // remove the username from global usernames list
        //delete usernames[socket.username];
        // update list of users in chat, client-side
        //io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        //socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);

        //socket.emit('updatecount', usernames, roomsCount);
        socket.broadcast.emit('available', roomsCount, online);

        //console.log(usernames);

        //socket.broadcast.emit('updatecount', usernames, roomsCount);
    });

	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);

        roomsCount[socket.room] = roomsCount[socket.room]-1;
        roomsCount[newroom] = roomsCount[newroom]+1;

		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);

        //usernames[socket.username]['room'] = newroom;

        //socket.emit('updatecount', usernames, roomsCount);
        //socket.broadcast.emit('updatecount', usernames, roomsCount);

        //send to index
        socket.broadcast.emit('available', roomsCount, online);
	});

    socket.on('mouse_activity', function(data) {
       console.log(data);
        socket.broadcast.to(socket.room).emit('all_mouse_activity', {session_id: socket.id, coords: data});
    });


});
