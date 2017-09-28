<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>jQuery UI Menu - Default functionality</title>
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="https://jqueryui.com/resources/demos/style.css">
  <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script>
  $( function() {
    $( "#menu" ).menu();
  } );
  </script>
  <style>
  .ui-menu { width: 200px; }
  li, ul { margin:0px 0px 0px 0px;
  </style>
</head>
<body>
<table><tr><td> 

<ul id="menu">
  <li class="ui-state-disabled"><div>Thaiall.com</div></li>
  <li><div><a href="http://www.thaiall.com/php">PHP</a></div></li>
  <li><div><a href="http://www.thaiall.com/html">HTML</a></div></li>
  <li><div>Scripts</div>
    <ul>
      <li class="ui-state-disabled"><div>Welcome</div></li>
      <li><div><a href="http://www.thaiall.com/asp">ASP</a></div></li>
      <li><div><a href="http://www.thaiall.com/perl">PERL</a></div></li>
	  <li><div><a href="http://www.thaiall.com/java">Javascript</a></div></li>
    </ul>
  </li>
  <li><div><a href="http://www.thaiall.com/handbill">Handbill</a></div></li>
  <li><div><a href="http://www.thaiall.com/search.htm">Search</a></div>
    <ul>
      <li><div>World search engin</div>
        <ul>
          <li><div>google.com</div></li>
          <li><div>yahoo.com</div></li>
		  <li><div>msn.com</div></li>
        </ul>
      </li>      
      <li><div><a href="https://github.com/thaiall/programming-page/">Github.com</a></div></li>
    </ul>
  </li>
  <li class="ui-state-disabled"><div>About me</div></li>
</ul>

</td><td valign="top">
code from <a href="https://jqueryui.com/menu/">https://jqueryui.com/menu/</a>
</td></tr></table> 
</body>
</html>