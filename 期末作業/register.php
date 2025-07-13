<?php
include 'includes/db.php';
include 'includes/menu.php';

$notification = '';
$notificationType = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // 檢查用戶名是否已存在
    $sql = "SELECT id FROM users WHERE username = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $notification = '用戶名已經存在。';
        $notificationType = 'danger'; // 用於顯示錯誤
    } else {
        // 用戶名不存在，插入新用戶
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $username, $password);
        if ($stmt->execute()) {
            $notification = '註冊成功!';
            $notificationType = 'success'; // 用於顯示成功
        } else {
            $notification = '註冊失敗: ' . $stmt->error;
            $notificationType = 'danger'; // 用於顯示錯誤
        }
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>會員註冊 - Bread</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container mt-4">
        <main>
            <h1>會員註冊</h1>
            <form action="" method="post">
                <div class="form-group">
                    <label for="username">使用者名稱:</label>
                    <input type="text" id="username" name="username" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">密碼:</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">註冊</button>
            </form>
        </main>
    </div>

    <!-- 模態框 -->
    <?php if ($notification): ?>
    <div class="modal fade" id="notificationModal" tabindex="-1" role="dialog" aria-labelledby="notificationModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="notificationModalLabel"><?php echo $notificationType === 'success' ? '成功' : '錯誤'; ?></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <?php echo $notification; ?>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="window.location.href='login.php';">關閉</button>
                </div>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- 引入 Bootstrap JS 和依賴的 Popper.js -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

    <script>
        // 顯示模態框
        <?php if ($notification): ?>
        $(document).ready(function() {
            $('#notificationModal').modal('show');
        });
        <?php endif; ?>
    </script>

    <?php include 'includes/footer.php'; ?>
</body>
</html>
