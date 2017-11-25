<?php
header('Content-Type: application/json');
$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$openid=$_REQUEST['openid'];

$sql = "select * from vote_user left join vote_task on vote_user.voteid=vote_task.voteid where userid='$openid'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 