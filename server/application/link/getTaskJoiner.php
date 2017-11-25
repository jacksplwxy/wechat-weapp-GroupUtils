<?php
header('Content-Type: application/json');
$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$taskid=$_REQUEST['taskid'];
$sql="select * from user a left join wxuser b on a.userid=b.openid where a.taskid='$taskid' AND a.userid!=''";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 