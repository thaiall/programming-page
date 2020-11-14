Short code : php+mysql+insert (2563) <?php exit(); ?>
/* 1- use phpmyadmin in test database */
create table mem(uid int not null auto_increment,u  varchar(50), p varchar(50), 
t varchar(1), primary key (uid));
insert into mem values (0,"admin","nation","a");
insert into mem values (0,"boy","girl","u");
/* 2 - index.php */
<a href="signin.php">signin.php</a>
<a href="signout.php">signout.php</a>
<a href="list.php">list.php</a>
<a href="insert.php">insert.php</a>
/* 3 - signin.php */
<form action="check.php">
<input name=u><input name=p>
<input type=submit></form>
/* 4 - signout.php */
<?php session_start();
$_SESSION["t"] = "";
echo '<a href=index.php>back</a>'; ?>
/* 5 - check.php */
<?php session_start();
$connect = new mysqli("127.0.0.1", "root", "", "test");
$result = $connect->query("select * from mem");
$_SESSION["t"] = "";
if ($result->num_rows > 0) 
  while($row = $result->fetch_assoc()) {
    if($row["u"] == $_REQUEST["u"] && $row["p"] == $_REQUEST["p"]) $_SESSION["t"] = $row["t"];
  }
echo '<a href="index.php">back</a><br/>' . $_SESSION["t"];
$connect->close(); ?>
/* 6 - list.php */
<?php session_start();
if(!isset($_SESSION["t"]) || strlen($_SESSION["t"]) == 0) {
echo '<a href=index.php>back</a> exit()';
}
$connect = new mysqli("127.0.0.1", "root", "", "test");
$result = $connect->query("select * from mem");
echo $result->num_rows . "<br/>";
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    echo  $row['u'] .  $row['p'] .  $row['t'] . "<br/>";
  } }
echo '<a href=index.php>back</a>' ;
$connect->close(); ?>
/* 7 - insert.php */
<form action="addrec.php" method="post">
<input name=u><input name=p><input name=t><input type=submit>
</form>
/* 8 - addrec.php */
<?php session_start();
if(!isset($_SESSION["t"]) || strlen($_SESSION["t"]) == 0) {
die ('<a href=index.php>back</a>');
}
$connect = new mysqli("127.0.0.1", "root", "", "test");
$sql = "insert into mem values (0,'" .$_POST["u"] ."','" . $_POST["p"] ."','". $_POST["t"] ."')";
$result = $connect->query($sql);
if($result === FALSE)  echo "$sql : failed"; else echo "$sql : succeeded";
echo '<br/><a href=index.php>back</a>' ;
$connect->close(); ?>