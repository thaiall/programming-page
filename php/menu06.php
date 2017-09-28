<!DOCTYPE html>
<html><head>
<style>
.dropbtn {
    background-color: #4CAF50;
    color: white;
    padding: 6px;
    font-size: 16px;
    border: none;
    cursor: pointer;
	width: 200px;
}

.dropbtn:hover, .dropbtn:focus {
    background-color: #3e8e41;
}

.dropdown1 {
    position: relative;
    display: inline-block;
}

.dropdown2 {
    position: relative;
    display: inline-block;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    overflow: auto;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}

.dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}

.dropdown1 a:hover {background-color: #f1f1f1}

.dropdown2 a:hover {background-color: #dddddd}

.show {display:block;}
</style>
</head><body>

<div class="dropdown1">
<button onclick="myFunction1()" class="dropbtn">Search Engine</button>
  <div id="myDropdown1" class="dropdown-content">
    <a href="http://www.google.com">Google.com</a>
    <a href="http://www.yahoo.com">Yahoo.com</a>
    <a href="#contact">Contact</a>
  </div>
</div>  
<div class="dropdown2">
<button onclick="myFunction2()" class="dropbtn">Scripts</button>
  <div id="myDropdown2" class="dropdown-content">
    <a href="http://www.thaiall.com">Thaiall.com</a>
    <a href="http://www.thaiall.com/php">PHP</a>
    <a href="http://www.thaiall.com/PERL">PERL</a>
	<a href="http://www.thaiall.com/ASP">ASP</a>
  </div>  
</div>

<script>
/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction1() {
    document.getElementById("myDropdown1").classList.toggle("show");
}
function myFunction2() {
    document.getElementById("myDropdown2").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
</script>

<br/><img src="https://thaiall.github.io/programming-page/green_eye.jpg" />
<br/><img src="https://github.com/thaiall/programming-page/blob/master/green_eye.jpg?raw=true" />

<h2>Clickable Dropdown</h2>
<p>Click on the button to open the dropdown menu.</p>

<pre>
<h2>Code from</h2>
<a href="https://www.w3schools.com/howto/howto_js_dropdown.asp">https://www.w3schools.com/howto/howto_js_dropdown.asp</a>

<a name="contact"></a>
<h2>Contact</h2>
+ <a href="http://www.facebook.com/ajburin">My facebook</a>
+ <a href="https://github.com/thaiall/programming-page/tree/master/php">Github.com</a>
</pre>
</body>
</html>