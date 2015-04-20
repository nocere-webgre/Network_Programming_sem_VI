
if($('.index').length > 0){

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

    $('.button-play').hover(function(){
        snd1.play();
    });

}