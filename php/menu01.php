<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <!-- script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script -->
  <!-- script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script -->
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
      <li><a href="http://www.thaiall.com/java">Javascript</a></li>
      <li><a href="http://www.thaiall.com/mysql">MySQL</a></li>
      <li class="m600"><a href="http://www.thaiall.com/web2">Web 2.0</a></li>
      <li class="m600"><a href="http://www.thaiall.com/project/projectdbnwind.htm">North Wind</a></li>
      <li class="m600"><a href="https://github.com/thaiall/programming-page/tree/master/php">Github.com</a></li>
    </ul>
  </div>
</nav>
<div class="container">
<h3>Basic Navbar Example</h3>
<p>A navigation bar is a navigation header that is placed at the top of the page.</p>
<h3>ชี้แจงเพิ่มเติม</h3>
<p>เมนู (Navigator Bar) แบบนี้ใช้ 
<a href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">bootstrap.min.css</a> 
ควบคุมการแสดงผลของ Bar รองรับ Responsive Web Design
และเพิ่มการควบคุมตัวเลือกผ่าน class=m600 ที่เขียนเพิ่ม หากจอภาพกว่้างไม่ถึง 600 px ก็จะมีตัวเลือกหายไป
โดยค่า default ของการเปลี่ยนจอภาพเป็นกว้าง 768 px</p>
<p><a href="https://getbootstrap.com/docs/3.3/components/#navbar">https://getbootstrap.com/docs/3.3/components/#navbar</a></p>
<p><a href="https://www.w3schools.com/bootstrap/bootstrap_navbar.asp">https://www.w3schools.com/bootstrap/bootstrap_navbar.asp</a></p>
</div>
</body>
</html>
