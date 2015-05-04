<?php

    if(isset($_POST['set-login']) && isset($_POST['room-number'])){

        setcookie('login', $_POST['set-login'], time()+3600);
        setcookie('room-number', $_POST['room-number'], time()+3600);

        $page = $_SERVER['PHP_SELF'];
        $sec = '0';
        header("Refresh: $sec; url=$page");

    }

    if(!isset($_COOKIE['set-login']) && !isset($_COOKIE['room-number'])){

        require 'views/index/header.php';
        require 'views/index/content.php';
        require 'views/index/footer.php';

    }
    else{

        setcookie('set-login', '', time()-3600);
        setcookie('room-number', '', time()-3600);

        require 'views/game/header.php';
        require 'views/game/game.php';
        require 'views/game/board.php';
        require 'views/game/chat.php';
        require 'views/game/footer.php';

    }


?>

