<?php
header('Content-Type: application/json;charset=UTF-8');

$openid = $_GET['openid'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
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