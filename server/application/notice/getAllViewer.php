<?php
header('Content-Type: application/json');
$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$noticeid=$_REQUEST['noticeid'];
$sql="select b.nickName,b.avatarUrl from notice_user a left join wxuser b on a.userid=b.openid where a.noticeid='$noticeid'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 