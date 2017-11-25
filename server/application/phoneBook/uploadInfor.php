<?php
header('Content-Type: application/json;charset=UTF-8');
$openid = $_REQUEST['openid'];
$name = $_REQUEST['name'];
$tel = $_REQUEST['tel'];
$address = $_REQUEST['address'];
$remark = $_REQUEST['remark'];
$gId = $_REQUEST['gId'];


$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql0="select * from phoneBook_user where openid='$openid' AND gId='$gId'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);

if(!$row0){
	$sql = "INSERT INTO phoneBook_user VALUES(NULL,'$openid','$name','$tel','$address','$remark','$gId')";
	$result = mysqli_query($conn,$sql);
	echo '个人信息上传成功';
}else{
	$sql = "UPDATE phoneBook_user SET name='$name',tel='$tel',address='$address',remark='$remark' WHERE openid='$openid' AND gId='$gId'";
	$result = mysqli_query($conn,$sql);
	echo '个人信息更新成功';
}