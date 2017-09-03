<?php
require("s1connect.php");
$sql="drop database $db";
if (!$result=mysql_query($sql,$connect))
  echo "Database : not found";
else
  echo "Database : droped";
mysql_close($connect);
?>