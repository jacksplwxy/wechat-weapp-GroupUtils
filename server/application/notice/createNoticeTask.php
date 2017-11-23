<?php
header('Content-Type: application/json;charset=UTF-8');
$openid = $_REQUEST['openid'];
$noticeid = $_REQUEST['noticeid'];
$title = $_REQUEST['title'];
$description = $_REQUEST['description'];
$date = $_REQUEST['date'];
$fileNumber = $_REQUEST['fileNumber'];
$name = $_REQUEST['name'];

$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
//提交SQL
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);
$sql = "INSERT INTO notice_task VALUES(NULL,'$openid','$noticeid','$date','$fileNumber','$title','$description','$name')";
$result = mysqli_query($conn,$sql);
//创建要输出给客户端的数据
$output = [];
if($result){    //执行成功
    $output['msg'] = 'succ';
    $output['id'] = mysqli_insert_id($conn);
}else {         //执行失败
    $output['msg'] = 'err';
    $output['sql'] = $sql;
}
//把数据编码为JSON字符串
echo json_encode($output);