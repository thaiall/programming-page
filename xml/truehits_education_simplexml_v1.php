<?php
/* 
http://php.net/manual/en/book.simplexml.php
https://www.w3schools.com/php/php_xml_simplexml_read.asp
https://www.w3schools.com/php/php_xml_simplexml_get.asp
*/
$xmlfile = "truehits_education_xml.php"; // static xml
$xml=simplexml_load_file($xmlfile);
echo $xml->member[0]->url . "<br/>";
echo $xml->member[0]->website . "<br/>";
echo $xml->member[1]->url . "<br/>";
echo $xml->member[1]->website . "<br/>";

$xmlfile = "http://truehits.net/xml/education.xml"; // online from url
$xml=simplexml_load_file($xmlfile);
echo $xml->member[0]->url . "<br/>";
echo $xml->member[0]->website . "<br/>";
echo $xml->member[1]->url . "<br/>";
echo $xml->member[1]->website . "<br/>";

// $xmlfile = "truehits_education_getxml.php"; // parser error : Start tag expected, '<' not found 
$xmlfile = "http://localhost/truehits_education_getxml.php"; // online
$xml=simplexml_load_file($xmlfile);
echo $xml->member[0]->url . "<br/>";
echo $xml->member[0]->website . "<br/>";
echo $xml->member[1]->url . "<br/>";
echo $xml->member[1]->website . "<br/>";
?>