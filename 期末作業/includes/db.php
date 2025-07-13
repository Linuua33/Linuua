<?php
// 連接資料庫的設定
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "1";

// 建立連接
$conn = new mysqli($servername, $username, $password, $dbname);

// 檢查連接
if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}
?>
