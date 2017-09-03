<body>
<form action=s6update.php>
<input name=updid value=1003>
<input name=updename value=chula>
<input type=submit value=s6update.php>
</form>
<?php
require("s1connect.php");
if (!isset($_GET['updid'])) { exit; }
$sql="update worker set ";
$sql.="eid='". $_GET['updid'] ."', ";
$sql.="ename='". $_GET['updename'] ."' ";
$sql.="where eid='". $_GET['updid'] ."'";
if(!$result=mysql_db_query($db,$sql))
echo "$sql : not found";
else echo "$sql : ok";
mysql_close($connect);
?>
</body>