<?php
include 'includes/db.php';
include 'includes/menu.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];

// 顯示會員資料
$sql = "SELECT * FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>會員資料 - Bread</title>
    <!-- 引入 Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<main class="container mt-4">
    <h1>會員資料</h1>
    <p>使用者名稱: <?php echo htmlspecialchars($user['username']); ?></p>

    <h2>歷史訂單</h2>
    <div id="orderHistory"></div>
    <button id="clearHistoryButton" class="btn btn-danger mt-3">清除歷史訂單</button>
</main>

<?php include 'includes/footer.php'; ?>

<!-- 引入 Bootstrap JS 和依賴的 Popper.js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://stackpath.amazonaws.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script>
// 顯示歷史訂單
function displayOrderHistory() {
    var orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    var orderHistoryContainer = document.getElementById("orderHistory");
    orderHistoryContainer.innerHTML = "";

    orderHistory.forEach(order => {
        var orderBlock = document.createElement("div");
        orderBlock.className = "order-block";
        
        // 將 UTC 時間轉換為本地時間
        var localDate = new Date(order.date).toLocaleString();
        
        orderBlock.innerHTML = `<h3>${localDate}</h3>`;
        order.items.forEach(item => {
            var p = document.createElement("p");
            p.textContent = item.name + " - $" + item.price;
            orderBlock.appendChild(p);
        });
        orderBlock.innerHTML += `<p>總價格：$${order.total}</p>`;
        orderHistoryContainer.appendChild(orderBlock);
    });
}

// 清除歷史訂單
function clearOrderHistory() {
    localStorage.removeItem("orderHistory");
    displayOrderHistory();
}

// 監聽清除歷史訂單按鈕的點擊事件
document.getElementById("clearHistoryButton").addEventListener("click", clearOrderHistory);

// 調用顯示歷史訂單函數
displayOrderHistory();
</script>

</body>
</html>
