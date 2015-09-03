$(document).ready(function() {
    var game = $('.game');

    if(game.length > 0){

        socket.on('connect', function(){
            console.log('Zostałeś połączony jako: '+game.attr('data-login')+' do pokoju: '+game.attr('data-room'))
            socket.emit('adduser', game.attr('data-login'), game.attr('data-room'));
        });

        socket.io.on('connect_error', function() {
            window.location.href='/';
            console.log('Error connecting to server - available: '+available);
        });

    }

});