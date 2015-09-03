$(document).ready(function() {
        if($('.index').length > 0){

        //check if server is avaliable && steps to start game
        buttonPlay.click(function(){

            if(steps.name.val().length > 0){
                steps.first.hide();
                steps.second.show();
            }
            else {
                steps.name.addClass('shake');

                setTimeout(function () {
                    steps.name.removeClass('shake');
                },500)
            }

        });

        socket.on('available', function(players, online){
            $('.online-count span').html(online);

            if(available == false){
                available = true;
                steps.first.show();
                steps.error.hide();
            }

            steps.second.children('ul').empty();

            console.log(players);
            var CountRomms = 1;

            $.each(players, function(key, value) {

                if(key != "undefined"){
                    steps.second.children('ul').append(rooms({nr: CountRomms, key: key, players: value}));
                    //console.log(key+" "+value);
                    CountRomms++;
                }
            });

        });

        socket.io.on('connect_error', function() {
            available = false;
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

        socket.on('users-online', function(online) {
            console.log('Użytkowników online: '+online);
            $('.online-count span').html(online);
        });
    }
});