<?php
header('Content-Type: application/json;charset=UTF-8');
$openid = $_REQUEST['openid'];
$noticeid = $_REQUEST['noticeid'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql0="select * from notice_user where userid='$openid' AND noticeid='$noticeid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);

if(!$row0){
	$sql = "INSERT INTO notice_user VALUES(NULL,'$noticeid','$openid')";
	$result = mysqli_query($conn,$sql);
	echo '增加一名浏览用户';
}else{
	echo '改用户已浏览过';
}
