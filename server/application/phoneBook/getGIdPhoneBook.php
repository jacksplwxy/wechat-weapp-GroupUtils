<?php
header('Content-Type: application/json');
$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$gId=$_REQUEST['gId'];
$sql="select a.id,a.name,a.tel,a.address,a.remark,b.avatarUrl from phoneBook_user a left join wxuser b on a.openid=b.openid where a.gId='$gId'";
$result=mysqli_query($conn,$sql);
if($result){
	$tasklist=mysqli_fetch_all($result,MYSQLI_ASSOC);
}else{
	$tasklist=array();
}
echo json_encode($tasklist); 