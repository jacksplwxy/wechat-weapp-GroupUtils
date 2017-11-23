<?php
header('Content-Type: application/json;charset=UTF-8');
$groupid = $_REQUEST['gid'];
$voteid = $_REQUEST['voteid'];

$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql0="select * from vote_chatgroup where voteid='$voteid' AND groupid='$groupid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);

if(!$row0){
	$sql = "INSERT INTO vote_chatgroup VALUES(NULL,'$groupid','$voteid')";
	$result = mysqli_query($conn,$sql);
	echo 'voteid加入群ID成功';
}else{
	echo 'voteid没加入群ID数据';
}
