<?php
$db = "perlphpasp";
$host = "127.0.0.1:3306";
$uname = "root";
$passwd = "";
if (!$connect=mysql_connect($host,$uname,$passwd)){
 echo 'Could not connect to mysql';
 exit;
}
?>