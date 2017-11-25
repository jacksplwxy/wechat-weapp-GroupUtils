<?php
header('Content-Type: application/json;charset=UTF-8');
$voteid = $_REQUEST['voteid'];
$optionData = $_REQUEST['optionData'];
$openid = $_REQUEST['openid'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql = "UPDATE vote_task SET optionData='$optionData' WHERE voteid='$voteid'";
$result = mysqli_query($conn,$sql);

$sql1 = "INSERT INTO vote_user VALUES(NULL,'$voteid','$openid')";
$result1 = mysqli_query($conn,$sql1);

$output = [];
if($result && $result1){
    $output['msg'] = 'succ';
    $output['id'] = mysqli_insert_id($conn);
}else {         //执行失败
    $output['msg'] = 'err';
    $output['sql'] = $sql;
}
//把数据编码为JSON字符串
echo json_encode($output);