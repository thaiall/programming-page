<?php
include("s1connect.php");
$tb="worker";
echo "Display records : ";
$query="select * from $tb";
$result = mysql_db_query($db,$query);
if ($result) { echo "OK<br/>"; } else { exit; }
while ($object = mysql_fetch_object($result)) {
  echo $object->eid . "  " . $object->ename . "<br/>";
}
echo "Total records : ".mysql_num_rows($result);
mysql_close($connect);
?>