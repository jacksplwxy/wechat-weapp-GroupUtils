<?php
header('Content-Type: application/json;charset=UTF-8');

$openid = $_GET['openid'];
$avatarUrl = $_GET['avatarUrl'];
$city = $_GET['city'];
$language = $_GET['language'];
$nickName = $_GET['nickName'];
$province = $_GET['province'];
$time = date("Y-m-d H:i:s");

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$sql = "UPDATE wxuser SET avatarUrl='$avatarUrl',city='$city',language='$language',nickName='$nickName',province='$province',time='$time' WHERE openid='$openid'";
$result = mysqli_query($conn,$sql);

if($result){    //执行成功
    echo "用户信息更新成功";
}else {         //执行失败
    echo "用户信息更新失败";
}
?>