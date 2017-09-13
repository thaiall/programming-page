<?php
/* updated for php7 and php 5 on 2560-09-13 */
require("s1connect.php");
$sql="select * from $tb";
if((int)phpversion() >= 7) {
	$result = $connect->query($sql);
	if ($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			echo "id: " . $row["eid"]. "- Name: " . $row["ename"]. "<br/>";
		}
	} else {
		echo "no results";
	}
	$connect->close();
} else {	
	if (!$result=mysql_db_query($db,$sql)) die("Query : failed");
	echo "Display all records : <br/>";
	while ($object = mysql_fetch_object($result)) {
		echo $object->eid . "  " . $object->ename . "<br/>";
	}
	echo "Total " . mysql_num_rows($result) ." records";
	mysql_close($connect);
}
?>
