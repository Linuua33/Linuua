<?php
include 'includes/db.php';
include 'includes/menu.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        header("Location: index.php");
        exit();
    } else {
        $loginError = "登入失敗，請檢查您的使用者名稱和密碼。";
    }
}
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>會員登入 - Bread</title>
    <!-- 引入 Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: auto;
            padding-top: 50px;
        }
        
    </style>
</head>
<body>
    <br>
    <br>
    <h1>登入以查看更多</h1>
    <div class="container login-container">
        <div class="card shadow-sm">
            <div class="card-body">
                <h2 class="card-title text-center mb-4">會員登入</h2>
                <?php if (isset($loginError)): ?>
                    <div class="alert alert-danger" role="alert">
                        <?php echo htmlspecialchars($loginError); ?>
                    </div>
                <?php endif; ?>
                <form action="" method="post">
                    <div class="form-group">
                        <label for="username">使用者名稱</label>
                        <input type="text" id="username" name="username" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="password">密碼</label>
                        <input type="password" id="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">登入</button>
                </form>
                <div class="text-center mt-3">
                    <a href="register.php">尚未註冊？點此註冊</a>
                </div>
            </div>
        </div>
    </div>

    <!-- 引入 Bootstrap JS 和依賴的 Popper.js -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
