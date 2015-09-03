$(document).ready(function() {
        if($('.index').length > 0){

        //check if server is avaliable && steps to start game

        socket.on('available', function(players, online){
            $('.online-count span').show().html(online);

            if(available == false){
                available = true;
                steps.first.show();
                steps.error.hide();
            }

            roomsList(players);

        });

        socket.io.on('connect_error', function() {
            available = false;
            $('.online-count span').hide();
            steps.first.hide();
            steps.second.hide();
            steps.error.show();
            console.log('Error connecting to server - available: '+available);
        });

        /*socket.on('updatecount', function(usernames, rooms, playersID) {
            console.log(usernames);
            console.log(rooms);
            console.log(playersID);
        });*/

        socket.on('users-online', function(online, roomsCount) {
            console.log('Użytkowników online: '+online);
            $('.online-count span').html(online);

            roomsList(roomsCount);

        });
    }
});

function roomsList(roomsCount) {
    steps.second.children('ul').empty();

    console.log(roomsCount);
    var CountRomms = 1;

    $.each(roomsCount, function(key, value) {

        if(key != "undefined"){
            steps.second.children('ul').append(rooms({nr: CountRomms, key: key, players: value}));
            //console.log(key+" "+value);
            CountRomms++;
        }
    });
}