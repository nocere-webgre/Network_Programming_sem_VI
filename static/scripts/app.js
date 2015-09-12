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