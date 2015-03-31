var socket = io('http://localhost:3000');
socket.emit('join', person);

socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});

socket.on('con', function(data){
    $('#messages').append($('<li>').text("witaj "+data.yournick+" twoje id:"+data.id));
    yourId = data.id;
    console.log(data);
});

socket.on('countusers', function(x){
    $('.users span').text(x);
});

socket.on('users', function(usersIdArray){

    if(usersIdArray.length == 1){
        $('#my-racket').addClass(usersIdArray[0]);
    }
    else if(usersIdArray.length == 2){
        var firstplayer = $('#my-racket').attr('class');

        if(firstplayer == usersIdArray[0]){
            $('#opponent-racket').addClass(usersIdArray[1]);
            $('#my-racket').addClass(usersIdArray[2]);
        }
        else{
            $('#opponent-racket').addClass(usersIdArray[0]);
            $('#my-racket').addClass(usersIdArray[1]);
        }
    }

});



socket.on('position', function(position){

    if(yourId != position.nick){
        var degrees = 0;
        //console.log(position);
        if(position.x > 500){
            degrees = (position.x-500)*(1/5);
        }
        else{
            degrees = -(-position.x+500)*(1/5);
        }


        $('.'+position.nick).css('left',position.x);
        /*$('.'+position.nick).css('left',position.x-56+'px').css({
            '-webkit-transform' : 'rotate('+ degrees +'deg)',
            '-moz-transform' : 'rotate('+ degrees +'deg)',
            '-ms-transform' : 'rotate('+ degrees +'deg)',
            'transform' : 'rotate('+ degrees +'deg)'});*/

    }

});