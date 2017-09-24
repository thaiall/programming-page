<?php
/* 
Script_name : Northwind.php
Source_code : http://www.thaiall.com/perlphpasp/source.pl?9141
Version 1.2560-09-24
###########################
- Use function_exists for mysql_connect
- Test mysqli() on PHP 7.1 and PHP 5.6 
- Test mysql_connect() on PHP 5.6 because it failed on PHP 7.1 
- Can use php=7 and php=5 to control testing with XAMPP from https://www.apachefriends.org
- Northwind.mdb for mysql in SQL format was shared in http://www.thaiall.com/mysql/northwindwithsqlfile.zip
- Use "mytable" from http://www.thaiall.com/web2/rsp62.css
- Can read about subquery at http://www.dofactory.com/sql/subquery
- Test SQL command - online on https://www.w3schools.com/sql/sql_join_inner.asp
- Test SQL command - offline on http://www.alexnolan.net/software/mdb_viewer_plus.htm (Copyright 2004 - 2013)
########################### 
Requirement before start this script
- Download : http://www.thaiall.com/mysql/northwindwithsqlfile.zip
- Import northwindfromphpmyadmin.sql in to MySQL 
*/

/* Section 1 : Configuration */
$host 			= 	"localhost";
$uname 			= 	"root";
$upass 			= 	"";
$db 			= 	"northwind";

/* Section 2 : Variable */
$maxField		= 	10; 
$lineperpage	= 	25;
$linenumber		= 	true;
if(isset($_GET["p"])) $currentpage = $_GET["p"]; else $currentpage = 1;
if((int)phpversion() >= 7) $php7 = true; else $php7 = false;
if(isset($_GET["php"])) { if($_GET["php"] == "7") $php7 = true; else $php7 = false; }
$mytable = "<style>	
.mytable { margin-left:auto; margin-right:auto; }
.mytable td {padding:3px; border-bottom: 1px solid #dddddd; }
.mytable tr:nth-child(even) {background-color: #ddffdd}
.mytable tr:nth-child(odd) {background-color: #ffffdd}
.mytable tr:hover {background-color: #ddddff}
</style>";

/* Section 3 : Connection */
if($php7) {
	$connect = new mysqli($host, $uname, $upass, $db);
	if ($connect->connect_error) die("Connection failed: " . $connect->connect_error);
} else {
	if (function_exists('mysql_connect')) {	
		if(!$connect = mysql_connect($host, $uname, $upass)) die("Connect failed : ");
	} else {
		die("function mysql_connect : not exist in PHP");
	}
}

/* Section 4 : SQL Command */
$sql		=	"select * from customers";
$sql_type 	= 	0; // SQL type
if(isset($_GET["t"])) {
	$sql_type = $_GET["t"];
	switch ($_GET["t"]) {	
	/* 1 - start here  */
	case "1": $sql="
	select * from orders
	"; break;	
	
	/* 2 - if we have space in table name, it need to use ascii 96 */
	case "2": $sql="
	select * from `order details`
	"; break; 
	
	/* 3 - selelct record in range of data */
	case "3": $sql="
	select * from products limit 0,5
	"; break; // 0 = start at first record, 5 = total record	
	
	/* 4 - order have desc and asc */
	case "4": $sql="
	select * from products order by productname desc
	"; break; // desc = descending and asc = ascending
	
	/* 5 - where = < > */
	case "5": $sql="
	select * from orders where employeeid = 4
	"; break;	// criteria = where
	
	/* 6 - another sample of where */
	case "6": $sql="
	select * from orders where freight > 100 and freight < 1000
	"; break; // freight = goods transport	
	
	/* 7 - like = almost same */
	case "7": $sql="
	select * from products where QuantityPerUnit like '%pieces%'
	"; break; // % = The percent sign represents zero, one, or multiple characters
	
	/* 8 - where to join table */
	case "8": $sql="
	select `order details`.*, products.* from `order details`,products 
	where `order details`.productid = products.productid
	"; break;	
	
	/* 9 - inner join  */
	case "9": $sql="
	select `order details`.*, products.* from 
	(`order details` inner join products on `order details`.productid = products.productid)
	"; break;
	
	/* 10 - group and alias */
	case "10": $sql="
	select orderid, count(orderid) as cnt from `order details` group by orderid
	"; break;
	
	/* 11 - function sum */
	case "11": $sql="
	select orderid, sum(quantity * unitprice) as total 
	from `order details` group by orderid
	"; break;	
	
	/* 12 - inner join and where */
	case "12": $sql="
	select `order details`.*, products.* 
	from (`order details` inner join products on `order details`.productid = products.productid)	
	where `order details`.unitprice > 100
	"; break;	
	
	/* 13 - inneer join and where to merge table */
	case "13": $sql="
	select orders.customerid, `order details`.*, products.* 
	from orders, (`order details` inner join products on `order details`.productid = products.productid) 
	where `order details`.unitprice > 100 and orders.orderid = `order details`.orderid
	"; break; 
	
	/* 14 - inner join 2 way */
	case "14": $sql="
	select orders.customerid, `order details`.*, products.* 
	from (orders inner join `order details` on orders.orderid = `order details`.orderid 
	inner join products on `order details`.productid = products.productid) 
	where `order details`.unitprice > 100
	"; break; // testing : [pass] in phpmyadmin but [fail] in MDBviewerplus			
	
	/* 15 - function sum in group by */
	case "15": $sql="
	select orderid, sum(quantity * unitprice) as total from `order details` 
	group by orderid 
	having sum(quantity * unitprice) > 1000
	"; break;
	
	/* 16 - subquery of select */
	case "16": $sql="
	select * from `order details` 
	where productid in 
	(select productid from products where unitsinstock = 0) order by productid
	"; break;		
	
	/* 17 - inner join to count >0 and no data of number 6 */
	case "17": $sql="
	select employees.employeeid, count(orders.orderid) as cnt_orderid 
	from (employees inner join orders on employees.employeeid = orders.employeeid) 
	where orders.shipcountry ='Spain' 
	group by employees.employeeid
	"; break;			
	
	/* 18 - subquery and inner join and count >0 and no data of number 6 */
	case "18": $sql="
	select * from employees where employeeid in 
	(select employees.employeeid from 
	(employees inner join orders on employees.employeeid = orders.employeeid) 
	where orders.shipcountry ='Spain' 
	group by employees.employeeid)
	"; break;			
	
	/* 19 - left join and subquery get >=0 and include number 6 */
	case "19": $sql="
	select emp_left.employeeid, emp_right.cnt_order 
	from employees emp_left left join
	(select orders.employeeid, count(orders.orderid) as cnt_order from orders 
	where orders.shipcountry ='Spain' group by orders.employeeid) emp_right
	on emp_right.employeeid= emp_left.employeeid
	"; break;				
	}
}	

/* Section 5 : Display data */
if(isset($_GET["sql"]) && $_GET["sql"] == "show") die($sql);
if($php7) { 
	$result = $connect->query($sql);
	if ($result->num_rows == 0) die("Query : failed<br/>" . $sql);
	$numField = mysqli_num_fields($result);
	if($numField < $maxField) $maxField = $numField;	
	echo $mytable . "<table class='mytable'><tr style='background-color:black;color:white;'>";
	if($linenumber) echo "<td>no.</td>";			
	$i = 0;
	while ($fieldinfo=mysqli_fetch_field($result)) {
		if ($i++ < $maxField) echo "<td style='text-align:center'>" . $fieldinfo->name . "</td>";
	}
	echo "</tr>";	
	$cntrec=1;
	$totalRec = mysqli_num_rows($result);
	while ($row = mysqli_fetch_array($result)) { 
		if ($cntrec >=firstrec($totalRec,$lineperpage,$currentpage) && $cntrec <=lastrec($totalRec,$lineperpage,$currentpage)) {
			echo "<tr>";
			if($linenumber) echo "<td>$cntrec</td>";
			for ($i=0; $i<$maxField ; $i++ ) { echo "<td>$row[$i]</td>"; }
			echo "</tr>";
		}
		$cntrec++;
	}	
	echo "</table>";	
	for($i=1;$i<=totalpage($totalRec,$lineperpage);$i++) {
		if ($i == $currentpage) 
			echo "$i : ";
		else
			echo "<a href='?t=$sql_type&p=$i'>$i</a> : ";
	}
	echo "Total $totalRec records";	
	$connect->close();
} else {	
	if (!$result=mysql_db_query($db,$sql)) die("Query : failed<br/>".$sql);
	$numField = mysql_num_fields($result);
	if($numField < $maxField) $maxField = $numField;
	echo "<style>table,th,td {border: 1px solid #dddddd;border-spacing:1px}</style>";
	echo "<table style='border-style:solid;border-width:2px;border-color:blue'><tr>";
	if($linenumber) echo "<td>no.</td>";			
	for ($i=0; $i<$maxField ; $i++ ) {
		echo "<td style='background-color:#ffffdd;text-align:center'>" . mysql_field_name($result, $i) . "</td>";
	}
	echo "</tr>";	
	$cntrec=1;
	$totalRec = mysql_num_rows($result);
	while ($row = mysql_fetch_array($result)) { 
		if ($cntrec >=firstrec($totalRec,$lineperpage,$currentpage) && $cntrec <=lastrec($totalRec,$lineperpage,$currentpage)) {
			echo "<tr>";
			if($linenumber) echo "<td>$cntrec</td>";
			for ($i=0; $i<$maxField ; $i++ ) { echo "<td>$row[$i]</td>"; }
			echo "</tr>";
		}
		$cntrec++;
	}	
	// while ($row = mysql_fetch_assoc($result)) { echo $row["CustomerID"]; }
	echo "</table>";	
	for($i=1;$i<=totalpage($totalRec,$lineperpage);$i++) {
		if ($i == $currentpage) 
			echo "$i : ";
		else
			echo "<a href='?t=$sql_type&p=$i'>$i</a> : ";
	}
	echo "Total $totalRec records";	
	mysql_close($connect);
}
echo '<br/><a href="?t=1">Table:Orders</a> : <a href="?t=0&sql=show">SQL show</a> : <a href="?t=1&php=5">PHP5</a> : <a href="?t=1&php=7">PHP7</a>';

/* Section 6 : Page number control */
/* 
Sample from http://www.thaiall.com/php/indexo.html#short47 
$totalrec = Total record in table such as 60
$lpp = Line per page || Record per page to display such as 25
$page = Page number such as (1:1-25, 2:26-50, 3:51-60)
*/ 
function totalpage($totalrec,$lpp) { return ceil($totalrec / $lpp); }
function firstrec($totalrec,$lpp,$page) { return (($lpp * ($page - 1) + 1) > $totalrec ? 1 : ($lpp * ($page - 1) + 1)); }
function lastrec($totalrec,$lpp,$page) { return (($lpp * $page) > $totalrec ? $totalrec : ($lpp * $page)); }
?>
