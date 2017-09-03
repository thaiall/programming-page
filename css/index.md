<script src="../menu.js"></script>

Highlight from <a href="https://cdnjs.com/libraries/SyntaxHighlighter">https://cdnjs.com/libraries/SyntaxHighlighter</a>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shCore.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shBrushJScript.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shBrushXml.js"></script>
<link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/styles/shCoreDefault.css"/>
<script type="text/javascript">SyntaxHighlighter.all();</script>
<style type="text/css"> .syntaxhighlighter { overflow-y: auto !important; overflow-x: auto !important;</style>

<pre class="brush: js">
/* ปรับปรุง : 2560-08-19 
เริ่มใช้กับ http://www.thaiall.com/web2
แชร์เป็น homepage : https://thaiall.github.io/programming-page/css/
*/
@font-face{font-family:'THChakraPetch'; src: url('rsp_thchakrapetch.ttf');}
@font-face{font-family:'AlexBrush'; src: url('rsp_alexbrush.ttf');}
@font-face{font-family:'TLWGTypewriter'; src: url('rsp_tlwgtypewriter.ttf');}
@font-face{font-family:'Sawasdee'; src: url('rsp_sawasdee.ttf');}
#main{
background-color:#000099;
font-family:microsoft sans serif;
font-size:12px;
margin:0px 0px 0px 0px
}
pre{
font-family:TLWGTypewriter;
float:left
}  
textarea{
font-family:microsoft sans serif;
color:#000088;
background-color:#ddffdd
} 
fieldset{
margin:10px 0px 0px 0px;
padding:0px
} 
legend{
background-color:#444444;
color:#ffffdd;
font-size:14px;
display:block;
padding-left:5px;
padding-right:10px;
border:2px solid #f9f9f9
}
.odd{background-color:#ddffdd;}
.even{background-color:#ffffdd;}
.mytable {
margin-left:auto;
margin-right:auto;
}
.mytable td {
padding:3px; 
border-bottom: 1px solid #dddddd;
}
.mytable tr:nth-child(even) {background-color: #ddffdd}
.mytable tr:nth-child(odd) {background-color: #ffffdd}
.mytable tr:hover {background-color: #ddddff}

.topbar{
width:100%;
background-color:black;
color:white;
text-align:center;
height:90px;
padding:0px;
border-spacing:0px;
border-style:none
} 
.topbar a:link, .topbar a:visited{
color:#aaffaa;
text-decoration:none
} 
.topbar td {
text-align:center
} 
.foot_text{
color:white;
text-decoration:none
}
table, .table_zero{
padding:0px;
border:0px;
border-spacing:0px
}
.unline{
text-decoration:none
}
#m_town{
text-align:center
}

/* ipad ขนาดไม่เกิน 768 ทำส่วนนี้ */
.m_still{
width:728px;
background-color:white;
margin-left:auto;
margin-right:auto;
padding:0px;
border-spacing:0px
}
.m_still_footer{
width:728px;
padding:0px;
border-spacing:0px
}
.m_banner_320{
visibility:hidden;
display:none
}
.m_hidden{
width:728px;
margin:0px 0px 0px 0px;
padding:0px;
border-spacing:0px;
float:left
} 
.m_hidden_footer{
width:728px;
font-size:8px;
margin:0px 0px 0px 0px;
padding:0px;
border-spacing:0px
} 
.m_hidden_search{
width:732px;
margin:0px 0px 0px 0px;
background-color:white;
margin-left:auto;
margin-right:auto;
padding:0px;
border-spacing:0px
} 
.m_min120, .m_min120h, .m_min120_img{
margin:0px 0px 0px 0px;
width:119px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min160, .m_min160h, .m_min160_img{
margin:0px 0px 0px 0px;
width:159px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min180, .m_min180h, .m_min180_img{
margin:0px 0px 0px 0px;
width:179px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min240, .m_min240h, .m_min240_img{
margin:0px 0px 0px 0px;
width:239px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min280, .m_min280h, .m_min280_img{
margin:0px 0px 0px 0px;
width:279px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min300, .m_min300h, .m_min300_img{
margin:0px 0px 0px 0px;
width:299px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min320, .m_min320h,  .m_min320_img{
margin:0px 0px 0px 0px;
width:320px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min360, .m_min360h,  .m_min360_img{
margin:0px 0px 0px 0px;
width:359px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min400, .m_min400_img{
margin:0px 0px 0px 0px;
width:395px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min520, .m_min520_img{
margin:0px 0px 0px 0px;
width:519px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min540, .m_min540_img{
margin:0px 0px 0px 0px;
width:539px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min560, .m_min560_img{
margin:0px 0px 0px 0px;
width:559px;
padding:0px;
border-spacing:0px;
float:left
}
.m_min620{
margin:0px 0px 0px 0px;
width:619px;
padding:0px;
border-spacing:0px;
float:left
}

/* iphone5:320 ขนาดไม่เกิน 320 ทำส่วนนี้ */
@media only screen and (max-width:320px) {
.m_still, .m_still_footer{visibility:visible;width:315px} 
.m_min120, .m_min160, .m_min180, .m_min240, .m_min280, .m_min300, .m_min320, .m_min360, .m_min400, .m_min520, .m_min540, .m_min560, .m_min620{width:315px;} 
.m_min120_img, .m_min160_img, .m_min180_img, .m_min240_img, .m_min280_img, .m_min300_img, .m_min320_img, .m_min360_img, .m_min400_img, .m_min520_img, .m_min540_img, .m_min560_img{width:305px;} 
.m_min120h, .m_min160h, .m_min180h, .m_min240h, .m_min280h, .m_min300h, .m_min320h, .m_min360h, .m_hidden, .m_hidden_search, .m_hidden_footer{visibility:hidden;display:none} 
#m_town{visibility:hidden;display:none} 
.m_banner_320{width:315px;height:110px;margin-left:auto;margin-right:auto;visibility:visible;display:block}  
} 

/* iphone6:375 galaxy s5:360 ขนาด 321 - 375 ทำส่วนนี้ */
@media only screen and (min-width:321px) and (max-width:375px) { 
.m_still, .m_still_footer{visibility:visible;width:355px} 
.m_min120, .m_min160, .m_min180, .m_min240, .m_min280, .m_min300, .m_min320, .m_min360, .m_min400, .m_min520, .m_min540, .m_min560, .m_min620{width:355px;} 
.m_min120_img, .m_min160_img, .m_min180_img, .m_min240_img, .m_min280_img, .m_min300_img, .m_min320_img, .m_min360_img, .m_min400_img, .m_min520_img, .m_min540_img, .m_min560_img{width:345px;} 
.m_min120h, .m_min160h, .m_min180h, .m_min240h, .m_min280h, .m_min300h, .m_min320h, .m_min360h, .m_hidden, .m_hidden_search, .m_hidden_footer{visibility:hidden;display:none} 
#m_town{visibility:hidden;display:none} 
.m_banner_320{width:355px;height:110px;margin-left:auto;margin-right:auto;visibility:visible;display:block} 
} 

/*  nexus 5x:411 ขนาด 376 - 414 ทำส่วนนี้ */
@media only screen and (min-width:376px) and (max-width:414px) { 
.m_still, .m_still_footer{visibility:visible;width:406px} 
.m_min120, .m_min160, .m_min180, .m_min240, .m_min280, .m_min300, .m_min320, .m_min360, .m_min400, .m_min520, .m_min540, .m_min560, .m_min620{width:406px;} 
.m_min120_img, .m_min160_img, .m_min180_img, .m_min240_img, .m_min280_img, .m_min300_img, .m_min320_img, .m_min360_img, .m_min400_img, .m_min520_img, .m_min540_img, .m_min560_img{width:396px;} 
.m_min120h, .m_min160h, .m_min180h, .m_min240h, .m_min280h, .m_min300h, .m_min320h, .m_min360h, .m_hidden, .m_hidden_search, .m_hidden_footer{visibility:hidden;display:none} 
#m_town{visibility:hidden;display:none} 
.m_banner_320{width:406px;height:110px;margin-left:auto;margin-right:auto;visibility:visible;display:block} 
}

/* nexus 6p:435 ขนาด 414 - 728 ทำส่วนนี้ */
@media only screen and (min-width:414px) and (max-width:728px) { 
.m_still, .m_still_footer{visibility:visible;width:430px} 
.m_min120, .m_min160, .m_min180, .m_min240, .m_min280, .m_min300, .m_min320, .m_min360, .m_min400, .m_min520, .m_min540, .m_min560, .m_min620{width:430px;} 
.m_min120_img, .m_min160_img, .m_min180_img, .m_min240_img, .m_min280_img, .m_min300_img, .m_min320_img, .m_min360_img, .m_min400_img, .m_min520_img, .m_min540_img, .m_min560_img{width:420px;} 
.m_min120h, .m_min160h, .m_min180h, .m_min240h, .m_min280h, .m_min300h, .m_min320h, .m_min360h, .m_hidden, .m_hidden_search, .m_hidden_footer{visibility:hidden;display:none} 
#m_town{visibility:hidden;display:none} 
.m_banner_320{width:430px;height:110px;margin-left:auto;margin-right:auto;visibility:visible;display:block} 
}

/* top navigator */
#bar_topnav{
width:100%;height:30px;background-color:#000044;margin:0px 0px 0px 0px;padding:0px;border-spacing:0px;border-style:none
}

ul.topnav{list-style-type: none;margin:0px;padding:0px;overflow:hidden;background-image:url(rspbar.png)}
ul.topnav li{float:left}
ul.topnav li a {display:inline-block;margin:0px;color:white;text-align:center;padding:5px 5px;text-decoration:none;font-size:10px;height:20px}
ul.topnav li a:hover {color:yellow;}
ul.topnav li.icon {display:none}

/* iphone6 plus ขนาดไม่เกิน 414 ทำส่วนนี้ */
@media screen and (max-width:414px){ 
ul.topnav li:not(:first-child) {display: none} 
ul.topnav li.icon{float:right;display:inline-block} 
ul.topnav.responsive {position: relative} 
ul.topnav.responsive li.icon{position: absolute;right:0px;top:0px} 
ul.topnav.responsive li{float:none;display:inline }
ul.topnav.responsive li a {display: block;text-align: left}
}
</pre>
