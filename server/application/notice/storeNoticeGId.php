<?php
header('Content-Type: application/json;charset=UTF-8');
$groupid = $_REQUEST['gid'];
$noticeid = $_REQUEST['noticeid'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql0="select * from notice_chatgroup where noticeid='$noticeid' AND groupid='$groupid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);

if(!$row0){
	$sql = "INSERT INTO notice_chatgroup VALUES(NULL,'$groupid','$noticeid')";
	$result = mysqli_query($conn,$sql);
	echo 'noticeid加入群ID成功';
}else{
	echo 'noticeid没加入群ID数据';
}
