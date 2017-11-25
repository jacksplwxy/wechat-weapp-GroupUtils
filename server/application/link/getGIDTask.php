<?php
header('Content-Type: application/json');
$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$groupid=$_REQUEST['gid'];
$sql="select * from chatgroup a left join task b on a.taskid=b.taskid where a.groupid='$groupid'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 