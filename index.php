<?php
$logged = false;
if(isset($_POST['set-login']) && isset($_POST['room-number'])) {
    $logged = true;
}


if(!$logged){

    require 'views/index/header.php';
    require 'views/index/content.php';
    require 'views/index/footer.php';

}
else{
    $login = $_POST['set-login'];
    $room = $_POST['room-number'];
    require 'views/game/header.php';
    require 'views/game/board.php';
    require 'views/game/chat.php';
    require 'views/game/footer.php';

}


?>

