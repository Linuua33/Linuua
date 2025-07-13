<?php if (session_status() == PHP_SESSION_NONE) { session_start(); } ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TOMORROW X TOGETHER</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            height: 100vh;
            background:#000;
            background-size:cover;
            overflow-x: hidden;
        }
        .menu-icon {
            cursor: pointer;
            width: 35px;
            height: 30px;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 2;
        }
        .menu-icon div {
            width: 100%;
            height: 5px;
            background-color: #333;
            position: absolute;
            transition: all 0.4s;
        }
        .menu-icon div:nth-child(1) {
            top: 0;
        }
        .menu-icon div:nth-child(2) {
            top: 50%;
            transform: translateY(-50%);
        }
        .menu-icon div:nth-child(3) {
            bottom: 0;
        }
        .menu-icon.active div:nth-child(1) {
            transform: rotate(45deg);
            top: 50%;
            transform-origin: center;
        }
        .menu-icon.active div:nth-child(2) {
            opacity: 0;
        }
        .menu-icon.active div:nth-child(3) {
            transform: rotate(-45deg);
            top: 50%;
            transform-origin: center;
        }
        .side-menu {
            position: fixed;
            left: -250px;
            top: 0;
            width: 250px;
            height: 100%;
            background-color:rgb(135, 144, 150);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            z-index: 1;
            transition: left 0.4s;
        }
        .side-menu.show {
            left: 0;
        }
        .menu-items {
            padding-top: 60px;
            text-align: left;
        }
        .menu-items a {
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            color: #000000;
            border-bottom: 1px solid #ffffff;
            transition: background-color 0.3s;
        }
        .menu-items a:hover {
            background-color: #bad1da;
        }
    </style>
</head>
<body>
    <div class="menu-icon" onclick="toggleMenu()">
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="side-menu" id="side-menu">
        <div class="menu-items">
            <a href="index.php">首頁</a>
            <a href="products.php">產品</a>
            <a href="cart.php">購物車</a>
            <?php if (isset($_SESSION['user_id'])): ?>
                <!-- <li><a href="checkout.php">結帳</a></li> -->
                <a href="profile.php">會員資料</a>
                <a href="logout.php">登出</a>
            <?php else: ?>
                <a href="register.php">註冊</a>
                <a href="login.php">登入</a>
            <?php endif; ?>
            <a href="contact.php">聯絡我們</a>
        </div>
    </div>

    <script>
        function toggleMenu() {
            var menuIcon = document.querySelector('.menu-icon');
            var sideMenu = document.getElementById('side-menu');
            menuIcon.classList.toggle('active');
            sideMenu.classList.toggle('show');
        }
    </script>
</body>
</html>
