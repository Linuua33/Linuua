
<?php
include 'includes/db.php';
include 'includes/menu.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TOMORROW X TOGETHER</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-U1DAWAznBHeqEIlVSCgzq+c9gqGAJn5c/t99JyeKa9xxaYpSvHU5awsuZVVFIhvj" crossorigin="anonymous"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            height: 100vh;
            background: url('TXT.png') no-repeat center center fixed;
            background-size:cover;
            overflow-x: hidden;
        }

        .center-buttons { 
            display: flex;
            justify-content: center; 
            align-items: center; 
            position:fixed;
            padding: 10px 20px; 
            font-size: 16px; 
            cursor: pointer;
            top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

    </style>
</head>
<body>

    <div class="center-buttons">
        <button onclick="location.href='news.php'" class="btn btn-secondary">進入</button>
    </div>
</body>
</html>
