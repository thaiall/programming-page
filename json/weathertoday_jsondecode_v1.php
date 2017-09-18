<?php
$contents = file_get_contents("http://localhost/weathertoday_getjson.php"); 
echo "<pre>";
// Type 1 : not pass true on decode
$obj = json_decode($contents); // reference by object name 
echo count($obj); // 2 objects = Header and Stations
echo $obj->Header->Title;
echo $obj->Header->Description;
echo $obj->Stations[0]->StationNameTh;
echo $obj->Stations[1]->StationNameTh;
foreach($obj->Header as $k=>$v){ 
	echo " $k = $v \n"; // Description = Today's Weather Observation ...
}	
foreach($obj->Stations as $v){ 
	echo " $v->StationNameTh \n";  // แม่ฮ่องสอน
	echo " $v->StationNameEng \n";  // MAE HONG SON
}		
echo var_dump($obj);

// Type 2 : pass true on decode
$obj = json_decode($contents, true); // pass true to convert objects to associative arrays
echo count($obj); // 2 = Header and Stations
echo $obj['Header']['Title']; 
echo $obj['Stations'][0]['StationNameTh']; 
foreach($obj['Header'] as $v) { echo " $v \n";}
echo var_dump($obj);
echo "</pre>";

/*
http://www.dyn-web.com/tutorials/php-js/json/decode.php
$json = '["apple","orange","banana","strawberry"]';
$ar = json_decode($json);
// access first element of $ar array
echo $ar[0]; // apple

$json = '{
    "title": "JavaScript: The Definitive Guide",
    "author": "David Flanagan",
    "edition": 6
}';
$book = json_decode($json);
// access title of $book object
echo $book->title; 


/ $json same as example object above
// pass true to convert objects to associative arrays
$book = json_decode($json, true);
// access title of $book array
echo $book['title']; 
*/
?>