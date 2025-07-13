<?php
session_start();
include 'includes/db.php';
include 'includes/menu.php';

// 初始化購物車
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = array();
}

// 處理表單提交
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['update'])) {
        // 更新數量
        foreach ($_POST['quantity'] as $product_id => $quantity) {
            $product_id = intval($product_id);
            $quantity = intval($quantity);

            // 確保數量為正數
            if ($quantity > 0) {
                $_SESSION['cart'][$product_id] = $quantity;
            } else {
                unset($_SESSION['cart'][$product_id]);
            }
        }
    } elseif (isset($_POST['add'])) {
        // 添加到購物車
        $product_id = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']);

        // 確保數量為正數
        if ($quantity > 0) {
            if (isset($_SESSION['cart'][$product_id])) {
                $_SESSION['cart'][$product_id] += $quantity;
            } else {
                $_SESSION['cart'][$product_id] = $quantity;
            }
        }
    }

    // 跳轉到購物車頁面
    header("Location: cart.php");
    exit();
}

// 顯示購物車內容
$cart = $_SESSION['cart'];
?>

<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>購物車 - Bread</title>
    <!-- 引入 Bootstrap CSS -->
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<main class="container mt-4">
    <h1 class="mb-4">購物車</h1>
    <?php if (!isset($_SESSION['user_id'])): ?>
        <div class="alert alert-warning" role="alert">
            您需要登入才能下單。<a href="login.php" class="alert-link">點此登入</a>
        </div>
    <?php endif; ?>
    <?php if (empty($cart)): ?>
        <p>購物車中沒有商品。</p>
    <?php else: ?>
        <form action="cart.php" method="post">
            <table class="table">
                <thead>
                    <tr>
                        <th>產品名稱</th>
                        <th>數量</th>
                        <th>價格</th>
                        <th>小計</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $total = 0;
                    foreach ($cart as $product_id => $quantity) {
                        // 查詢產品資訊
                        $sql = "SELECT * FROM products WHERE id = ?";
                        $stmt = $conn->prepare($sql);
                        $stmt->bind_param("i", $product_id);
                        $stmt->execute();
                        $product = $stmt->get_result()->fetch_assoc();
                        $subtotal = $product['price'] * $quantity;
                        $total += $subtotal;
                        ?>
                        <tr>
                            <td><?php echo htmlspecialchars($product['title']); ?></td>
                            <td>
                                <input type="number" name="quantity[<?php echo htmlspecialchars($product_id); ?>]" value="<?php echo htmlspecialchars($quantity); ?>" min="1">
                            </td>
                            <td><?php echo htmlspecialchars($product['price']); ?> 元</td>
                            <td><?php echo htmlspecialchars($subtotal); ?> 元</td>
                        </tr>
                    <?php } ?>
                </tbody>
            </table>
            <p>總計: <?php echo htmlspecialchars($total); ?> 元</p>
            <button type="submit" name="update" class="btn btn-primary">更新數量</button>
        </form>
        <!-- 新增清空購物車按鈕 -->
        <form action="clear_cart.php" method="post">
            <button type="submit" class="btn btn-danger mt-2">清空購物車</button>
        </form>
        <!-- 新增返回購物頁面的按鈕 -->
        <a href="products.php" class="btn btn-secondary mt-2">返回購物頁面</a>
        <br>
        <br>
        <button id="checkoutButton">結帳</button>

        <!-- 彈窗顯示購物摘要 -->
        <div id="checkoutModal" style="display:none;" class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">購物摘要</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul id="itemList"></ul>
                        <p>總項目數：<span id="totalItems"></span></p>
                        <p>總價格：$<span id="totalPrice"></span></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
                        <!-- 修改這個按鈕來進行確定結帳 -->
                        <form action="checkout.php" method="post">
                            <button type="submit" class="btn btn-primary">確定結帳</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</main>

<!-- 引入 Bootstrap JS 和依賴的 Popper.js -->
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

<script>
// 顯示購物摘要的彈窗
document.getElementById("checkoutButton").addEventListener("click", function() {
    var items = getCartItems(); // 获取购物车中的项目
    var totalItems = items.length;
    var totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    var itemList = document.getElementById("itemList");
    itemList.innerHTML = "";
    items.forEach(item => {
        var li = document.createElement("li");
        li.textContent = item.name + " - $" + item.price + " x " + item.quantity;
        itemList.appendChild(li);
    });

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("totalPrice").textContent = totalPrice;

    $('#checkoutModal').modal('show');

    // 记录订单到历史订单
    var purchaseDate = new Date().toISOString();
    var order = {
        date: purchaseDate,
        items: items,
        total: totalPrice
    };

    var orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orderHistory.push(order);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
});

// Mock function to get cart items
function getCartItems() {
    var cart = <?php echo json_encode($cart); ?>;
    var items = [];
    <?php
    $sql = "SELECT id, title, price FROM products";
    $result = $conn->query($sql);
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[$row['id']] = $row;
    }
    ?>
    var products = <?php echo json_encode($products); ?>;
    for (var productId in cart) {
        var quantity = cart[productId];
        var product = products[productId];
        items.push({name: product.title, price: product.price, quantity: quantity});
    }
    return items;
}
</script>

<?php include 'includes/footer.php'; ?>
</body>
</html>
