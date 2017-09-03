<?php
require("s1connect.php");
$sql="select * from $tb";
if (!$result=mysql_db_query($db,$sql)) die("Query : failed");
echo "Display all records : <br/>";
while ($object = mysql_fetch_object($result)) {
  echo $object->eid . "  " . $object->ename . "<br/>";
}
echo "Total " . mysql_num_rows($result) ." records";
mysql_close($connect);
?>
