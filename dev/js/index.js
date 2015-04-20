
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
    snd2.appendChild(src2);
    snd2.volume = 0.05;

    snd2.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    snd2.play();

    buttonPlay.hover(function(){
        snd1.play();
    });


    //Check server
    var socket = io.connect('http://localhost:3000');
    var available = false;
    // on connection to server, ask for user's name with an anonymous callback

    buttonPlay.click(function(e){
        e.preventDefault();

    });

    socket.on('available', function(players){
        available = true;
        console.log(players);
    });

    socket.io.on('connect_error', function(err) {
        available = false;
        // handle server error here
        console.log('Error connecting to server - available: '+available);
    });

}