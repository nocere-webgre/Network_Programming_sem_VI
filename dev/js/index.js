
if($('.index').length > 0){

    var buttonPlay = $('.button-play');

    //music
    var snd1  = new Audio();
    var src1  = document.createElement("source");
    src1.type = "audio/mpeg";
    src1.src  = "/static/sounds/hover.ogg";
    snd1.appendChild(src1);
    snd1.volume = 1;

    var snd2  = new Audio();
    var src2  = document.createElement("source");
    src2.type = "audio/mpeg";
    src2.src  = "/static/sounds/index.mp3";
    snd2.appendChild(src2);/*
    snd2.volume = 0.05;*/
    snd2.volume = 0.0;

    snd2.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    snd2.play();

    buttonPlay.hover(function(){
        snd1.play();
    });

    $('ul').on({
        mouseenter: function () {
            snd1.play();
        },
        click: function(){

            $('#room-number').val($(this).attr('data-join'));
            $('#start-game').submit();

        }
    }, '.join-to-game');

    //check if server is avaliable && steps to start game
    var socket = io.connect('http://37.233.103.234:3000/');
    var available = false;
    var steps = {
        name: $('#set-login'),
        first: $('.first-step'),
        second: $('.second-step'),
        error: $('.error')
    };

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

    socket.on('available', function(players){
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



}