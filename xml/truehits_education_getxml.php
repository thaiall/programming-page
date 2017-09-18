<?php 
// เริ่มต้น curl
$ch = curl_init(); 

// set url สำหรับดึงข้อมูล  จาก http://truehits.net/xml/html/
curl_setopt($ch, CURLOPT_URL, "http://truehits.net/xml/education.xml"); 

//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

 // ตัวแปร $output เก็บข้อมูลทั้งหมดที่ดึงมา 
$output = curl_exec($ch); 

// ปิดการเชื่อต่อ
curl_close($ch);    

// output ออกไปครับ
//$output = iconv("TIS-620","UTF-8",$output);
//$output = preg_replace("/<!.*?]>/ms","",$output);
//$output = preg_replace("/\n/","",$output);
echo $output;
?>