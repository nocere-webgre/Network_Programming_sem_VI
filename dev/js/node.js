socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
});
socket.on('con', function(data){
    $('#messages').append($('<li>').text("witaj "+data.yournick));
    console.log(data);
});

socket.on('countusers', function(x){

    $('.users span').text(x);

});