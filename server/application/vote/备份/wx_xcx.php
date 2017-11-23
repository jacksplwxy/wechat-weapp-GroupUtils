<?php

include_once "wxBizDataCrypt.php";


$appid = $_GET['appid'];
$sessionKey = $_GET['sessionKey'];
$encryptedData=$_GET['encryptedData'];
$iv = $_GET['iv'];
$pc = new WXBizDataCrypt($appid, $sessionKey);
$errCode = $pc->decryptData($encryptedData, $iv, $data );

if ($errCode == 0) {
    print($data);
} else {
    print($errCode);
}
