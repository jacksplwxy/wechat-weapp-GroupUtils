<?php
header('Content-Type: application/json;charset=UTF-8');
$voteid = $_REQUEST['voteid'];
$openid = $_REQUEST['openid'];
$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);
$sql0="select * from vote_user where voteid='$voteid' AND userid='$openid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);
if(!$row0){
	echo '未投票'; 
}else{
	echo '已投票'; 
}


