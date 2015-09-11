$(document).ready(function() {
    var game = $('.game');
    var startGame = false;
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

        socket.on('all_mouse_activity',function(data){
            if($('.pointer[session_id="'+data.session_id+'"]').length <= 0 && ($('.pointer').length) < 1){
                $('body').append('<div class="pointer" session_id="'+data.session_id+'"></div>');

                if(!$('.ball').length == 1){
                    //$('.board').append('<div class="ball"></div>');
                    //alert('odliczanie');
                }
            }

            var $pointer = $('.pointer[session_id="'+data.session_id+'"]');

            if(data.coords.x > 500){
                $pointer.css('left', (1000-data.coords.x)*(5/15)+320).css({
                    'transform' : 'rotate('+((-(data.coords.x+500)*(1/5))+180)+'deg)',
                    'zoom' : 1
                });
            }
            else{
                $pointer.css('left', (-data.coords.x+1000)*(5/15)+320).css({
                    'transform' : 'rotate('+(-(data.coords.x-500)*(1/5))+'deg)',
                    'zoom' : 1
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
            //console.log(users);
            $('#results .first-name').html(users[0][0]+" <span>("+users[0][1]+")</span>");
            $('#results .first-score').html(0);
            $('#results .second-name').html(users[1][0]+" <span>("+users[1][1]+")</span>");
            $('#results .second-score').html(0);

            if(!startGame) {
                startGame = true;

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
                            console.log('Gre rozpocznie gracz: '+users[0][0]);
                        }, 1000);
                    }
                }, 1000);
            }
        });

        socket.on('player-leave', function(name) {
           alert(name+ ' left the room, you win!');
            window.location.href = '/';
        });

    }

});