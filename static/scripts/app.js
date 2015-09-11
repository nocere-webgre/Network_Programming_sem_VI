(function($){  'use strict'; var buttonPlay = $('.button-play');

var socket = io.connect('http://37.233.103.234:3000/');
var available = false;
var steps = {
    name: $('#set-login'),
    first: $('.first-step'),
    second: $('.second-step'),
    error: $('.error')
};
/*
var board = $('.board');
var ball = $('.ball');
var isStart = false;

if(board.length > 0) {
    $("#conversation").animate({ scrollTop: $(document).height() }, "slow");

    board.click(function(e) {

        if(isStart == false) {
            ball.removeClass('my');
            ballStart('my', ball, e.pageX);
            isStart = true;
        }
    });
}

function ballStart(start, ball, x) {

    var direction;
    var defaultBallCss = {
        start: 350+'px',
        end: 185+'px',
        startScale: 1,
        endScale: 0.5
    };

    if(x < 500){
        direction = 350;
    }
    else{
        direction = 650;
    }

    var ballCss;
    if(start == 'my') {

        ballCss = {
            start: defaultBallCss.start,
            end: defaultBallCss.end,
            startScale: defaultBallCss.startScale,
            endScale: defaultBallCss.endScale
        };
    }
    else if(start == 'opp'){

        ballCss = {
            start:defaultBallCss.end,
            end: defaultBallCss.start,
            startScale: defaultBallCss.endScale,
            endScale: defaultBallCss.startScale
        };
    }

   */
/* ball.css({

        'top'                 : ballCss.start,
        '-webkit-transform' : 'scale(' + ballCss.startScale + ')',
        '-moz-transform'    : 'scale(' + ballCss.startScale + ')',
        '-ms-transform'     : 'scale(' + ballCss.startScale + ')',
        '-o-transform'      : 'scale(' + ballCss.startScale + ')',
        'transform'         : 'scale(' + ballCss.startScale + ')'
    }) ;*//*


    var x = 0;
    setInterval(function(){

        if(x == 0){
            ball.css({
                'left'              : direction+'px',
                'top'               : ballCss.end,
                '-webkit-transform' : 'scale(' + ballCss.endScale + ')',
                '-moz-transform'    : 'scale(' + ballCss.endScale + ')',
                '-ms-transform'     : 'scale(' + ballCss.endScale + ')',
                '-o-transform'      : 'scale(' + ballCss.endScale + ')',
                'transform'         : 'scale(' + ballCss.endScale + ')'
            }) ;
            x = 1;

            var p = $( "#my-racket" );
            var position = p.position();
            console.log( "left: " + position.left + ", top: " + position.top );
        }
        else if(x == 1) {
            ball.css({
                top                 : ballCss.start,
                '-webkit-transform' : 'scale(' + ballCss.startScale + ')',
                '-moz-transform'    : 'scale(' + ballCss.startScale + ')',
                '-ms-transform'     : 'scale(' + ballCss.startScale + ')',
                '-o-transform'      : 'scale(' + ballCss.startScale + ')',
                'transform'         : 'scale(' + ballCss.startScale + ')'
            }) ;
            x = 0;
        }


    },1000);

}
*/

var rooms = _.template(
    '<li>' +
        '<div class="rackets <% if (players == 1) { %>one-player<% } if (players > 1 ) { %>full<% } %>"></div>' +
        '<div class="btn <% if (players < 2) { %>join-to-game<% } %>" data-join="<%- key %>">' +
            '<div></div>' +
        '</div>' +
    '</li>'
);

$(document).ready(function() {
    var game = $('.game');
    var startGame = false;
    var ballInMove = false;

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
;
                            if($('.pointer[session_id="'+users[0][1]+'"]').length <= 0 && ($('.pointer').length) == 1 && !ballInMove){
                                $('body').append('<div class="ball opp"></div>');
                                console.log('pilka dla przeciwnika');
                            }
                            else if(!ballInMove){
                                $('body').append('<div class="ball my"></div>');
                                console.log('pilka dla Ciebie');
                            }

                        }, 1000);
                    }
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

        socket.on('player-leave', function(name) {
           alert(name+ ' left the room, you win!');
            window.location.href = '/';
        });

    }

});
$(document).ready(function() {
    if ($('.index').length > 0) {
        //music
        var snd1 = new Audio();
        var src1 = document.createElement("source");
        src1.type = "audio/mpeg";
        src1.src = "/static/sounds/hover.ogg";
        snd1.appendChild(src1);
        snd1.volume = 1;

        var snd2 = new Audio();
        var src2 = document.createElement("source");
        src2.type = "audio/mpeg";
        src2.src = "/static/sounds/index.mp3";
        snd2.appendChild(src2);
        /*
         snd2.volume = 0.05;*/
        snd2.volume = 0.0;

        snd2.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        snd2.play();

        buttonPlay.hover(function () {
            snd1.play();
        });

        $('ul').on({
            mouseenter: function () {
                snd1.play();
            },
            click: function () {

                $('#room-number').val($(this).attr('data-join'));
                $('#start-game').submit();

            }
        }, '.join-to-game');
    }
});

$(document).ready(function() {

    if($('.index').length > 0) {
        buttonPlay.click(function () {
            validForm(steps);
        });

        $('#start-game').on('keyup keypress', function (e) {
            var code = e.keyCode || e.which;
            if (code == 13) {
                validForm(steps);
                e.preventDefault();
                return false;

            }
        });
    }
});

function validForm(steps) {
    if (steps.name.val().length > 0) {
        steps.first.hide();
        steps.second.show();
    }
    else {
        steps.name.addClass('shake');

        setTimeout(function () {
            steps.name.removeClass('shake');
        }, 500)
    }
}


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
}}(jQuery));