<?php    
// เริ่มต้น curl
$ch = curl_init(); 

// set url สำหรับดึงข้อมูล 
curl_setopt($ch, CURLOPT_URL, "http://data.tmd.go.th/api/WeatherToday/V1/?type=json"); 

//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

 // ตัวแปร $output เก็บข้อมูลทั้งหมดที่ดึงมา 
$output = curl_exec($ch); 

// ปิดการเชื่อต่อ
curl_close($ch);    

// output ออกไปครับ
//echo $output;
?>{
"Header":{
"Title":"WeatherToday","Description":"Today's Weather Observation","Uri":"https://data.tmd.go.th/api/WeatherToday/V1",
"LastBuiltDate":"17/9/2017 5:37:38","CopyRight":"Thai Meteorology Department 2015","Generator":"TMDData_API services"
},
"Stations":[{
"WmoNumber":"48300","StationNameTh":"แม่ฮ่องสอน","StationNameEng":"MAE HONG SON","Province":"แม่ฮ่องสอน",
"Latitude":{"Value":"19.298972222222222222222222222","Unit":"decimal degree"},
"Longitude":{"Value":"97.97577777777777777777777778","Unit":"decimal degree"},
"Observe":{"Time":"17/9/2017","MeanSeaLevelPressure":{"Value":1008.03,"Unit":"mb"},
"Temperature":{"Value":24.9,"Unit":"celcius"},"MaxTemperature":{"Value":29.9,"Unit":"celcius"},
"DiffMaxTemperature":{"Value":-4.3,"Unit":"celcius"},"MinTemperature":{"Value":23.6,"Unit":"celcius"},
"DiffMinTemperature":{"Value":-0.9,"Unit":"mb"},"RelativeHumidity":{"Value":95.0,"Unit":"%"},
"WindDirection":{"Value":"000","Unit":"degree"},"WindSpeed":{"Value":0.0,"Unit":"km/h"},
"Rainfall":{"Value":52.90,"Unit":"mm"}}
},{
"WmoNumber":"48325","StationNameTh":"แม่สะเรียง","StationNameEng":"MAE SARIANG","Province":"แม่ฮ่องสอน",
"Latitude":{"Value":"18.166666666666666666666666667","Unit":"decimal degree"},
"Longitude":{"Value":"97.93333333333333333333333333","Unit":"decimal degree"},
"Observe":{"Time":"17/9/2017","MeanSeaLevelPressure":{"Value":1007.92,"Unit":"mb"},
"Temperature":{"Value":24.0,"Unit":"celcius"},"MaxTemperature":{"Value":26.6,"Unit":"celcius"},
"DiffMaxTemperature":{"Value":-6.1,"Unit":"celcius"},"MinTemperature":{"Value":23.0,"Unit":"celcius"},
"DiffMinTemperature":{"Value":-1.5,"Unit":"mb"},"RelativeHumidity":{"Value":96.0,"Unit":"%"},
"WindDirection":{"Value":"000","Unit":"degree"},"WindSpeed":{"Value":0.0,"Unit":"km/h"},
"Rainfall":{"Value":43.00,"Unit":"mm"}}
}]
}