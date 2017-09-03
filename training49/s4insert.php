<body>
<form action=s4insert.php>
<input name=nid value=1004>
<input name=nname value=kmit>
<input type=submit value=s4insert.php>
</form>
<?php
require("s1connect.php");
if (!isset($_GET['nid']) || !isset($_GET['nname']))
  exit;
$sql="insert into worker values('$nid','$nname')";
if(!$result=mysql_db_query($db,$sql))
echo "$sql : not found";
else echo "$sql : ok";
mysql_close($connect);
?>
</body>