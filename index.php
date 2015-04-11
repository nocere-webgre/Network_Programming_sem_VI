<?php

    if(isset($_POST['login'])){
        setcookie("login", $_POST['login'], time()+3600);
        $page = $_SERVER['PHP_SELF'];
        $sec = "0";
        header("Refresh: $sec; url=$page");
    }

    if(!isset($_COOKIE['login'])){
        require 'views/index/header.php';
        require 'views/index/content.php';
        require 'views/index/footer.php';
        echo 1;
    }
    else{
        setcookie("login", "", time()-3600);
        echo 2;
        require 'views/game/header.php';
        require 'views/game/board.php';
        require 'views/game/footer.php';
    }


?>

