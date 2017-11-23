<?php
header('Content-Type: application/json');
$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$voteid=$_REQUEST['voteid'];
$sql="select * from vote_user a left join wxuser b on a.userid=b.openid where a.voteid='$voteid' AND a.userid!=''";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 