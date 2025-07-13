<?php
session_start();
include 'includes/db.php';
include 'includes/menu.php';

// 檢查用戶是否已登入
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// 檢查是否提交訂單
if (isset($_POST['order'])) {
    // 其他處理訂單的代碼...
}

// 顯示產品列表
$sql = "SELECT * FROM products";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>產品頁面 - Bread</title>
    <!-- 引入 Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<main class="container mt-4">
    <h1 class="mb-4">產品頁面</h1>
    <div class="row">
        <?php while($row = $result->fetch_assoc()): ?>
            <div class="col-md-3 mb-4">
                <div class="card">
                    <?php
                    // 設定圖片路徑
                    if (isset($row['image']) && !empty($row['image'])) {
                        $imagePath = 'images/' . htmlspecialchars($row['image']);
                    } else {
                        $imagePath = 'images/default.jpg'; // 預設圖片路徑
                    }
                    ?>
                    <img src="<?php echo $imagePath; ?>" class="card-img-top" alt="<?php echo htmlspecialchars($row['title']); ?>">
                    <div class="card-body">
                        <h5 class="card-title"><?php echo htmlspecialchars($row['title']); ?></h5>
                        <a href="<?php echo htmlspecialchars($row['url']); ?>" target="_blank">專輯詳情</a>
                        <p class="card-text">價格: <?php echo htmlspecialchars($row['price']); ?> 元</p>
                        <form action="cart.php" method="post">
                            <input type="hidden" name="product_id" value="<?php echo $row['id']; ?>">
                            <input type="number" name="quantity" value="1" min="1" class="form-control mb-2">
                            <button type="submit" name="add" class="btn btn-outline-primary">加入購物車</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    </div>
</main>

<!-- 引入 Bootstrap JS 和依賴的 Popper.js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<?php include 'includes/footer.php'; ?>
</body>
</html>
