<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<style>
@media only screen and (max-width:600px) {
.m600 {visibility:hidden;display:none;height:0px;} 
} 
</style>
</head>
<body>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="http://www.thaiall.com">Thaiall.com</a>
    </div>
    <ul class="nav navbar-nav">
      <li class="active"><a href="http://www.thaiall.com">Home</a></li>
      <li><a href="http://www.thaiall.com/php">PHP</a></li>
      <li class="dropdown">
        <a class="dropdown-toggle" data-toggle="dropdown" href="#">Scripts
        <span class="caret"></span></a>
        <ul class="dropdown-menu">
          <li><a href="http://www.thaiall.com/java">Javascript</a></li>
          <li><a href="http://www.thaiall.com/asp">ASP</a></li>
          <li><a href="http://www.thaiall.com/perl">Perl</a></li>          
          <li><a href="http://www.thaiall.com/mysql">MySQL</a></li>		  
        </ul>
      </li>
      <li class="m600"><a href="http://www.thaiall.com/web2">Web 2.0</a></li>
	  <button class="btn btn-danger navbar-btn" onclick="b1();">Github.com</button>
    </ul>	  
	
	  <script>
	  function b1() {
		  window.open("https://github.com/thaiall/programming-page/tree/master/php");
	  }
	  </script>
	  
    <ul class="nav navbar-nav navbar-right">
      <li><a href="http://www.gmail.com"><span class="glyphicon glyphicon-user"></span> Sign Up</a></li>
      <li><a href="http://www.gmail.com"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>
    </ul>
  </div> 
</nav>
<div class="container">
<h3>Basic Navbar Example</h3>
<p>A navigation bar is a navigation header that is placed at the top of the page.</p>
<h3>ชี้แจงเพิ่มเติม</h3>
<p>เมนู (Navigator Bar) แบบนี้ใช้ 
<a href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">bootstrap.min.css</a> 
และ <a href="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js">jquery.min.js</a> 
และ  <a href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">bootstrap.min.js</a> 
ควบคุมการแสดงผลของ Bar และ drop down รองรับ Responsive Web Design
และเพิ่มการควบคุมตัวเลือกผ่าน class=m600 ที่เขียนเพิ่ม หากจอภาพกว่้างไม่ถึง 600 px ก็จะมีตัวเลือกหายไป
โดยค่า default ของการเปลี่ยนจอภาพเป็นกว้าง 768 px และในตัวเลือกยังมีตัวเลือกแบบ drop down และแยกส่วนของเมนูทางด้านขวาเข้ามา และปุ่ม</p>
<p><a href="https://getbootstrap.com/docs/3.3/components/#navbar">https://getbootstrap.com/docs/3.3/components/#navbar</a></p>
<p><a href="https://www.w3schools.com/bootstrap/bootstrap_navbar.asp">https://www.w3schools.com/bootstrap/bootstrap_navbar.asp</a></p>
</div>
</body>
</html>
