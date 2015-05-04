socket.on('adduser', function(username){

    console.log(players['room1']);
    // store the username in the socket session for this client
    socket.username = username;
    // store the room name in the socket session for this client
    socket.room = 'room1';
    // add the client's username to the global list
    usernames[username] = {
        'username': username,
        'id' : socket.id,
        'room': 'room1'
    };

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