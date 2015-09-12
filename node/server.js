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
    roomsDetails['room1'] = [];
    roomsDetails['room2'] = [];
    roomsDetails['room3'] = [];
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
        users[socket.username] = {
            'name' : socket.username,
            'room' : socket.room,
            'id': socket.id
        };
        roomsDetails[socket.room][socket.username] = [];
        roomsDetails[socket.room][socket.username][0] = socket.username;
        roomsDetails[socket.room][socket.username][1] = socket.id;

        roomsCount[socket.room] = roomsCount[socket.room]+1;

		// send client to room X
		socket.join(nrRoom);


        if(roomsCount[socket.room] > 1) {
            //console.log(users);
            socket.emit('ready-to-play', users[socket.username]);
        }

        //send to index
        socket.broadcast.emit('available', roomsCount, online);
	});

    // when the user disconnects.. perform this
    socket.on('disconnect', function(){

        //Zmniejszenie licznika online
        online--;
        socket.broadcast.emit('users-online', online, roomsCount);

        //Usunięcie
        try {
            delete users[socket.username];
            delete roomsDetails[socket.room][socket.username];
            socket.broadcast.to( socket.room ).emit('player-leave', socket.username);
        } catch(e) {
            console.log(e);
        }

        //console.log(users);
        roomsCount[socket.room] = roomsCount[socket.room]-1;
        socket.broadcast.emit('deleterocket', socket.id);
        socket.leave(socket.room);
        socket.broadcast.emit('available', roomsCount, online);

    });

    socket.on('mouse_activity', function(data) {
       //console.log(data);
        socket.broadcast.to(socket.room).emit('all_mouse_activity', {session_id: socket.id, coords: data});
    });

    socket.on('to_user', function(data) {
        //console.log(data);

        console.log('GRACZE '+socket.room);
        var players = roomsDetails[socket.room];
        console.log(players);
        socket.emit('from-second-player', getPlayers(players));
        socket.broadcast.to( data.room ).emit('from-second-player', getPlayers(players));
    });

    socket.on('start-game', function(data) {
        socket.emit('ball-position', data);
        socket.broadcast.to( socket.room ).emit('ball-position', data);
    });

    socket.on('point', function(data) {
        var players = roomsDetails[socket.room];
        socket.emit('set-point', data, getPlayers(players));
        socket.broadcast.to( socket.room ).emit('set-point', data, getPlayers(players));

    });

});

function getPlayers(players) {
    var numeric_array = [];
    for ( var item in players ){
        numeric_array.push( players[ item ] );
    }
    return numeric_array;
}