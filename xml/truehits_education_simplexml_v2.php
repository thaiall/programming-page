<?php
$xmlfile = "http://truehits.net/xml/education.xml"; // online from url
$xml=simplexml_load_file($xmlfile);
foreach($xml->attributes() as $a => $b) {
    echo $a,'="',$b,"\"<br/>";
}
echo $xml->attributes()->date . "<br/>";
echo $xml->attributes()->category . "<br/>";
echo "<pre>";
print_r($xml);
echo "</pre>";
echo "<hr/>";
for($i=0;$i<count($xml);$i++) {
	echo count($xml->member[$i]) . "<br/>";	// 8
	foreach($xml->member[$i] as $v){
		echo $v->getname() . " : "; // url
		echo "$v <br/>"; // gotoknow.org
	}
}	
echo "<hr/>";
// foreach($xml->member as $m) { // ->member = ->children()
foreach($xml->children() as $m) {	
	echo $m->url."<br/>";
	echo $m->website."<br/>";
	echo $m->sort."<br/>";
	echo $m->sortallmember."<br/>";
	echo $m->uniqueip."<br/>";
	echo $m->uniquesession."<br/>";
	echo $m->pageviews."<br/>";
	echo $m->sortcategory."<br/>";	
}
?>