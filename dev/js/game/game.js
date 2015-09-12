$(document).ready(function() {
    var game = $('.game');
    var board = $('.board');

    var readyToPlay = false;
    var startGame = false;
    var ballInMove = false;
    var doYouStart = false;
    var yourNumber = false;
    var $ball = null;
    var $myRacket = $('#my-racket #main-racket');
    var $myRacketPosition = null;
    var points = {
        first: 0,
        second: 0
    };

    if(game.length > 0){

        socket.on('connect', function(){
            console.log('Zostałeś połączony jako: '+game.attr('data-login')+' do pokoju: '+game.attr('data-room'));
            socket.emit('adduser', game.attr('data-login'), game.attr('data-room'));
        });

        socket.io.on('connect_error', function() {
            window.location.href='/';
            console.log('Error connecting to server - available: '+available);
        });

        $(document).mousemove(function( event ){

            var myracket = $('#my-racket');
            var deg = 0;

            if(event.pageX <= 1000){
                socket.emit('mouse_activity', {x: event.pageX, y: event.pageY});

                if(event.pageX < 500){
                    deg = (event.pageX-500)*(1/5);
                }
                else if(event.pageX >= 500){
                    deg = (event.pageX-500)*(1/5);
                }

                myracket.css({
                    'left': (event.pageX-myracket.width()/2)+'px',
                    'transform': 'rotate('+deg+'deg)'
                });

                $('.my').css({
                    'left': (event.pageX-15)+'px'
                });
            }
        });

        socket.on('deleterocket', function(id){
            var $pointer = $('.pointer[session_id="'+id+'"]');
            $pointer.remove();
        });

        socket.on('ready-to-play', function(users) {
            //console.log('jesteś gotowy?');
            socket.emit('to_user', users);
        });

        socket.on('from-second-player', function(users) {

            var yourUsername = $('.game').attr('data-login');
            var opponetId = null;

            if(yourUsername == users[0][0]) {
                opponetId = users[1][1];
            }
            else if(yourUsername == users[1][0]) {
                opponetId = users[0][1];
            }

            if($('.pointer[session_id="'+opponetId+'"]').length <= 0 && ($('.pointer').length) < 1){
                $('body').append('<div class="pointer" session_id="'+opponetId+'"></div>');
            }

            //console.log(users);
            $('#results .first-name').html(users[0][0]+" <span>("+users[0][1]+")</span>");
            $('#results .first-score').html(0);
            $('#results .second-name').html(users[1][0]+" <span>("+users[1][1]+")</span>");
            $('#results .second-score').html(0);

            if(!readyToPlay) {
                readyToPlay = true;

                var i = 3;
                var startCount = setInterval(function() {
                    console.log(i);
                    $('.counter').show();
                    $('.count-'+(i+1)).removeClass('show');
                    $('.count-'+i).addClass('show');
                    i--;
                    if(i == 0){
                        clearInterval(startCount);
                        setTimeout(function() {
                            $('.counter').hide();
                            //console.log('Gre rozpocznie gracz: '+users[0][0]);

                            if($('.pointer[session_id="'+users[0][1]+'"]').length <= 0 && ($('.pointer').length) == 1 && !ballInMove){
                                $('body').append('<div class="ball opp small"></div>');
                                //console.log('pilka dla przeciwnika');
                                doYouStart = false;
                                yourNumber = 2;
                            }
                            else if(!ballInMove){
                                $('body').append('<div class="ball my"></div>');
                                //console.log('pilka dla Ciebie');
                                doYouStart = true;
                                yourNumber = 1;
                            }
                            startGame = true;
                        }, 1000);
                    }
                }, 1000);
            }
        });

        $(document).mousedown(function(event) {
            document.oncontextmenu = function() {return false;};
            if(startGame && doYouStart && !ballInMove) {
                switch (event.which) {
                    case 1:
                        socket.emit('start-game', {
                            x: 250,
                            y: 350,
                            player: yourNumber
                        });
                        break;
                    default:
                        socket.emit('start-game',{
                            x: 750,
                            y: 350,
                            player: yourNumber
                        });
                }
                ballInMove = true;
            }
        });

        socket.on('ball-position', function(data) {
            //console.log(data);
            //console.log('YourNumber '+yourNumber);
            $ball = $('.ball');

            $ball.removeClass('opp').removeClass('my');

            if(data.player == yourNumber) {
                //console.log('Ty odbiłeś');
                $ball.addClass('small');

                if(data.x < 500){
                    $ball.css({
                        'top': 185+'px',
                        'left': ((1000-data.x)*(5/15)+320)+'px'
                    }) ;
                }
                else{
                    $ball.css({
                        'top': 185+'px',
                        'left': ((-data.x+1000)*(5/15)+320)+'px'
                    }) ;
                }
            }
            else {
                //console.log('przeciwnik odbił');
                $ball.removeClass('small');
                $ball.css({
                    'top': 350+'px',
                    'left': data.x+'px'
                });

                //moment kiedy Ty odbijasz
                setTimeout(function() {
                    var result = CheckIfPointIsInCircle(data.x, 350);
                    var x = Math.floor(Math.random() * 999) + 1;
                    console.info(result);
                    if(result.l <= result.r) {
                        socket.emit('start-game', {
                            x:  x,
                            player: data.player == 1 ? 2 : 1
                        });
                    }
                    else {
                        socket.emit('point', {
                            point: data.player,
                            x: x,
                            player: data.player == 1 ? 2 : 1
                        });
                    }
                    //tutaj liczenie x

                }, 1000);
            }
        });

        socket.on('all_mouse_activity',function(data){

            var $pointer = $('.pointer[session_id="'+data.session_id+'"]');

            if(data.coords.x > 500){
                $pointer.css('left', (1000-data.coords.x)*(5/15)+320).css({
                    'transform' : 'rotate('+((-(data.coords.x+500)*(1/5))+180)+'deg)',
                    'zoom' : 1
                });

                $('.opp').css({
                    'left': (1000-data.coords.x)*(5/15)+320+'px'
                });
            }
            else{
                $pointer.css('left', (-data.coords.x+1000)*(5/15)+320).css({
                    'transform' : 'rotate('+(-(data.coords.x-500)*(1/5))+'deg)',
                    'zoom' : 1
                });

                $('.opp').css({
                    'left': (-data.coords.x+1000)*(5/15)+320+'px'
                });
            }

        });

        socket.on('set-point', function(data, users) {
            ballInMove = false;
            console.log(users);
            data.point == 1 ? points.first++ : points.second++;
            $('.first-score').html(points.first);
            $('.second-score').html(points.second);

            var player =  data.point == 1 ? 0 : 1;
            $('.ball').remove();
            if($('.pointer[session_id="'+users[player][1]+'"]').length <= 0 && ($('.pointer').length) == 1 && !ballInMove){
                $('body').append('<div class="ball opp small"></div>');
                //console.log('pilka dla przeciwnika');
                doYouStart = false;
                yourNumber = 2;
            }
            else if(!ballInMove){
                $('body').append('<div class="ball my"></div>');
                //console.log('pilka dla Ciebie');
                doYouStart = true;
                yourNumber = 1;
            }

        });

        socket.on('player-leave', function(name) {
            alert(name+ ' left the room, you win!');
            window.location.href = '/';
        });

    }

});

function CheckIfPointIsInCircle(x, y) {

    //promien
    var r = 66;
    //środek okręgu S(a,b)
    var $centerPointer = $('#my-racket #main-racket .center-pointer');
    var s = $centerPointer.offset();
    //console.log(s.left + ' '+s.top);

    //(x-a)^2 + (y-b)^2 = r^2
    //console.log("("+x+"-"+s.left+")^2+("+y+"-"+s.top+")^2 = "+r+"^2");
    var L = Math.pow( (x - s.left), 2) + Math.pow( (y- s.top), 2);
    var R = Math.pow( r, 2);

    return {
        l: L,
        r: R
    }

}