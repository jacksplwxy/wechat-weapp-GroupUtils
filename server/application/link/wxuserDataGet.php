<?php
header('Content-Type: application/json;charset=UTF-8');

$openid = $_GET['openid'];

$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql="select * from wxuser where openid='$openid'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist);

?>