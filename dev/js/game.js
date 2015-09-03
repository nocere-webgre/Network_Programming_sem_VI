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
