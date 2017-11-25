<?php
header('Content-Type: application/json;charset=UTF-8');
$appid = $_GET['appid'];
$secret = $_GET['secret'];
$js_code = $_GET['js_code'];
$grant_type = $_GET['grant_type'];

$config=include '../config/dbconfig.php';
$conn=mysqli_connect($config[HOST],$config[USERNAME],$config[PASSWORD],$config[DBNAME]);
mysqli_set_charset($conn,$config[CHARSET]);

$sql = "SET NAMES UTF8";
mysqli_query($conn,$sql);

$url = "https://api.weixin.qq.com/sns/jscode2session?appid=".$appid."&secret=".$secret."&js_code=".$js_code."&grant_type=".$grant_type;
$html = file_get_contents($url);

echo $html;
