<script>
    var socket = io.connect('http://localhost:3000');

    // on connection to server, ask for user's name with an anonymous callback
    socket.on('connect', function(){
        // call the server-side function 'adduser' and send one parameter (value of prompt)
        socket.emit('adduser', '<?php echo $_COOKIE['login']; ?>');
    });

    // listener, whenever the server emits 'updatechat', this updates the chat body
    socket.on('updatechat', function (username, data) {
        $('#conversation').append('<li><span class="login">'+username + ':</span> ' + data + '</li>');
        $('#conversation').animate({scrollTop: $('#conversation').prop("scrollHeight")}, 500);
    });

    // listener, whenever the server emits 'updaterooms', this updates the room the client is in
    socket.on('updaterooms', function(rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
            if(value == current_room){
                $('#rooms').append('<div class="current room-button">' + value + '</div>');
            }
            else {
                $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
            }
        });
    });

    socket.on('updatecount', function(x, y) {
        console.log(x);
        console.log(y);
    });

    $(document).mousemove(function( event ){
        socket.emit('mouse_activity', {x: event.pageX, y: event.pageY});
    });

    socket.on('all_mouse_activity',function(data){
        if($('.pointer[session_id="'+data.session_id+'"]').length <= 0){
            $('body').append('<div class="pointer" session_id="'+data.session_id+'"></div>')
        }

        var $pointer = $('.pointer[session_id="'+data.session_id+'"]');

        /*if(currentMousePos.x > 500){
            degrees = (currentMousePos.x-500)*(1/5);
        }
        else{
            degrees = -(-currentMousePos.x+500)*(1/5);*/

        var x = data.coords.x;
        var ratio = 9/25;

        x = x*ratio;


            if(data.coords.x > 500){
                $pointer.css('left', (1000-data.coords.x)*(5/15)+320).css({
                    'transform' : 'rotate('+(data.coords.x-500)*(1/5)+'deg)',
                    'zoom' : 1
                });
            }
            else{
                $pointer.css('left', (-data.coords.x+1000)*(5/15)+320).css({
                    'transform' : 'rotate('+(data.coords.x/10)+'deg)',
                    'zoom' : 1
                });
            }



    });

    function switchRoom(room){
        socket.emit('switchRoom', room);
    }

    // on load of page
    $(function(){
        // when the client clicks SEND
        $('#datasend').click( function() {
            var message = $('#data').val();
            $('#data').val('');
            // tell server to execute 'sendchat' and send along one parameter
            socket.emit('sendchat', message);
        });

        // when the client hits ENTER on their keyboard
        $('#data').keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#datasend').focus().click();
            }
        });
    });

</script>