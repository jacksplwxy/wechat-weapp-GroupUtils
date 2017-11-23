<?php
header('Content-Type: application/json');
$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$groupid=$_REQUEST['gid'];
$sql="select * from chatgroup a left join task b on a.taskid=b.taskid where a.groupid='$groupid'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 