<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>
<body>
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="http://www.thaiall.com">Thaiall.com</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="active"><a href="http://www.thaiall.com">Home <span class="sr-only">(current)</span></a></li>
        <li><a href="http://www.thaiall.com/php">PHP</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Scripts <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="http://www.thaiall.com/asp">ASP</a></li>
            <li><a href="http://www.thaiall.com/perl">PERL</a></li>
            <li role="separator" class="divider"></li>
            <li><a href="http://www.thaiall.com/article/teachpro.htm">Teach programming</a></li>			
            <li role="separator" class="divider"></li>
            <li><a href="http://www.thaiall.com/mysql">MySQL</a></li>
          </ul>
        </li>
      </ul>
      <form class="navbar-form navbar-left" action="http://www.thaiall.com/cgi/srchweb.pl" method="post">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Search" name="SearchText" size="5" value="test">
        </div>
        <button type="submit" class="btn btn-default">Search</button>
      </form>
      <ul class="nav navbar-nav navbar-right">
        <li><a href="http://www.thaiall.com/me">About me</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Social Media <span class="caret"></span></a>
          <ul class="dropdown-menu">
            <li><a href="http://www.facebook.com/ajburin">My profile</a></li>
            <li><a href="http://www.facebook.com/thaiall">Fan page</a></li>            
          </ul>
        </li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
<p><a href="https://getbootstrap.com/docs/3.3/components/#navbar">https://getbootstrap.com/docs/3.3/components/#navbar</a></p>
<p><a href="https://www.w3schools.com/bootstrap/bootstrap_navbar.asp">https://www.w3schools.com/bootstrap/bootstrap_navbar.asp</a></p>
</body></html>