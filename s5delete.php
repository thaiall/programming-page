<body>
<form action=s5delete.php>
<input name=delid value=1001>
<input type=submit value=s5delete.php>
</form>
<?php
require("s1connect.php");
if (!isset($_GET['delid'])) { exit; }
$sql="delete from worker ";
$sql.="where eid ='".$_GET['delid']."'";
if(!$result=mysql_db_query($db,$sql))
echo "$sql : not found";
else echo "$sql : ok";
mysql_close($connect);
?>
</body>