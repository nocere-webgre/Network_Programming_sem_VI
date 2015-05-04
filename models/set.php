<?php


setcookie("login", $_POST['login'], time()+3600);
$page = $_SERVER['PHP_SELF'];
$sec = "0";
header("Refresh: $sec; url=$page");

?>