<?php
header('Content-Type: application/json;charset=UTF-8');
$taskid = $_REQUEST['taskid'];
$openid = $_REQUEST['openid'];
$joinerName = $_REQUEST['joinerName'];
$joinerTel = $_REQUEST['joinerTel'];
$joinerRemark = $_REQUEST['joinerRemark'];

$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql = "UPDATE user SET userid='$openid' WHERE taskid='$taskid' AND viewerid='$openid'";
$result = mysqli_query($conn,$sql);

if($joinerName){
	$sql1 = "UPDATE wxuser SET joinerName='$joinerName' WHERE openid='$openid'";
	$result1 = mysqli_query($conn,$sql1);
}
if($joinerTel){
	$sql2 = "UPDATE wxuser SET joinerTel='$joinerTel' WHERE openid='$openid'";
	$result2 = mysqli_query($conn,$sql2);
}

$sql3 = "UPDATE wxuser SET joinerRemark='$joinerRemark' WHERE openid='$openid'";
$result3 = mysqli_query($conn,$sql3);



$output = [];
if($result){
    $output['msg'] = 'succ';
    $output['id'] = mysqli_insert_id($conn);
}else {         //执行失败
    $output['msg'] = 'err';
    $output['sql'] = $sql;
}
//把数据编码为JSON字符串
echo json_encode($output);