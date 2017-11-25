<?php
header('Content-Type: application/json;charset=UTF-8');
$groupid = $_REQUEST['gid'];
$taskid = $_REQUEST['taskid'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql0="select * from chatgroup where taskid='$taskid' AND groupid='$groupid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);
#判断是否存在viewid,不能重复插入浏览的openid
if(!$row0){
	$sql = "INSERT INTO chatgroup VALUES(NULL,'$groupid','$taskid')";
	$result = mysqli_query($conn,$sql);
	echo 'taskid加入群ID成功';
}else{
	echo 'taskid没加入群ID数据';
}
