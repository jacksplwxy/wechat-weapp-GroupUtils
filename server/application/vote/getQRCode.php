<?php
header('Content-Type: application/json;charset=UTF-8');
$appid = $_GET['appid'];
$secret = $_GET['secret'];
$js_code = $_GET['js_code'];
$grant_type = $_GET['grant_type'];

$conn=mysqli_connect('localhost','root','','tongxuequn');
mysqli_set_charset($conn,'utf8');
$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$url = "https://api.weixin.qq.com/sns/jscode2session?appid=".$appid."&secret=".$secret."&js_code=".$js_code."&grant_type=".$grant_type;
$html = file_get_contents($url);
$arr = json_decode($html);
$openid = $arr->openid;

$sql0="select * from wxuser where openid='$openid'";
$result0 = mysqli_query($conn,$sql0);
$row0=mysqli_fetch_all($result0,MYSQLI_ASSOC);
#判断是否存在openid,不能重复插入浏览的openid
if(!$row0){
	$sql = "INSERT INTO wxuser VALUES(NULL,'$openid','$appid','','','','','','','','','','','','')";
	$result = mysqli_query($conn,$sql);
}
echo $html;
