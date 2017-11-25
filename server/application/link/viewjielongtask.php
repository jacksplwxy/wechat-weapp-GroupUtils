<?php
header('Content-Type: application/json;charset=UTF-8');
$taskid = $_REQUEST['taskid'];
$openid = $_REQUEST['openid'];
$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);
$sql0="select * from user where taskid='$taskid' AND viewerid='$openid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);
#判断是否存在viewid,不能重复插入浏览的openid
if(!$row0){
	$sql1 = "INSERT INTO user VALUES(NULL,'$taskid','','$openid')";
	$result1 = mysqli_query($conn,$sql1);
}
$sql2="select * from user where taskid='$taskid'";
$result2=mysqli_query($conn,$sql2);
if($result2){
	$tasklist=mysqli_fetch_all($result2,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 

