<?php
include 'includes/db.php';
include 'includes/menu.php';
?>


<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>最新消息 - Bread</title>
    <!-- 引入 Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet">
    <style>
        h1{
            margin: 100px auto;
        }
    img { 
        width: 100px; 
        height: 100px; 
        border-radius: 50px; /* 圖 */ 
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 陰影效果 */ 
        cursor: pointer; /* 點擊手勢 */ 
        }
    a { 
        text-decoration: none; /* 移除連結的下劃線 */ 
        border: none; /* 移除連結的邊框 */ 
    }
    a:hover { 
        text-decoration: none; /* 確保鼠標懸停時也沒有下劃線 */ 
    }
    #container1{
        width: 600px;height: 100px;border: 3px ;
        display: flex;
        justify-content: space-around;

    }
    .flex1{
            justify-content: space-around;
        }
    </style>
</head>
<body>
    <h1 class="mb-4">關於TOMORROW X TOGETHER</h1>
        <p>weverse最新內容</p>
        <iframe width="745" height="419" src="https://www.youtube.com/embed/9R5ByxXs2t0" title="YEONJUN’s ‘GQ’ December Issue Photoshoot Sketch | EPISODE | TXT (투모로우바이투게더)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <br>
        <br>
    <P>團體、成員個人Instagram</p>
    <br>
    <div id="flex1">
        <a href="https://www.instagram.com/txt_bighit/?hl=zh-tw"> <img src="channels4_profile.jpg"> </a>
        <a href="https://www.instagram.com/yawnzzn/?hl=zh-tw"> <img src="161966e1b7a3067f0866.png"> </a>
        <a href="https://www.instagram.com/page.soobin/?hl=zh-tw"> <img src="Screenshot+2024-02-13+at+6.34.37 PM.png"> </a>
        <a href="https://www.instagram.com/bamgyuuuu/?hl=zh-tw"> <img src="20230614hUXJdFe.jpg"> </a>
    </div>
        <br>
        <br>
    <p>官方Youtuber</p>
        <br>
        <a href="https://www.youtube.com/@TXT_bighit"> <img src="channels4_profile.jpg"> </a>
        <br>
        <br>
    <p>官方weverse</p>
        <br>
        <a href="https://weverse.io/txt/feed"> <img src="unnamed.webp"> </a>
        <br>
        <br>
        <br>
        <br>
        <br>

<?php include 'includes/footer.php'; ?>
</body>
</html>
