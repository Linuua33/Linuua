<?php
session_start();
include 'includes/db.php';
include 'includes/menu.php';

// 檢查用戶是否已登入，如果沒有則重定向到登入頁面
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// 確保購物車存在且不為空
$cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : array();
if (empty($cart)) {
    echo "<p>購物車是空的，請先添加產品。</p>";
    exit();
}

// 檢查是否有提交訂單
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 插入訂單到資料庫
    $user_id = intval($_SESSION['user_id']);
    $total = 0;

    // 插入訂單記錄
    $sql = "INSERT INTO orders (user_id) VALUES (?)";
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("i", $user_id);
        if ($stmt->execute()) {
            $order_id = $stmt->insert_id;

            // 插入訂單商品記錄
            foreach ($cart as $product_id => $quantity) {
                $sql = "SELECT price FROM products WHERE id = ?";
                if ($stmt = $conn->prepare($sql)) {
                    $stmt->bind_param("i", $product_id);
                    if ($stmt->execute()) {
                        $product = $stmt->get_result()->fetch_assoc();

                        $subtotal = $product['price'] * $quantity;
                        $total += $subtotal;

                        $sql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)";
                        if ($stmt = $conn->prepare($sql)) {
                            $stmt->bind_param("iiid", $order_id, $product_id, $quantity, $product['price']);
                            if (!$stmt->execute()) {
                                echo "錯誤: 插入訂單商品時出錯 - " . $stmt->error;
                                exit();
                            }
                        } else {
                            echo "錯誤: 準備插入訂單商品的SQL語句時出錯 - " . $conn->error;
                            exit();
                        }
                    } else {
                        echo "錯誤: 查詢產品時出錯 - " . $stmt->error;
                        exit();
                    }
                } else {
                    echo "錯誤: 準備查詢產品的SQL語句時出錯 - " . $conn->error;
                    exit();
                }
            }

            // 更新訂單總價
            $sql = "UPDATE orders SET total = ? WHERE id = ?";
            if ($stmt = $conn->prepare($sql)) {
                $stmt->bind_param("di", $total, $order_id);
                if (!$stmt->execute()) {
                    echo "錯誤: 更新訂單總價時出錯 - " . $stmt->error;
                    exit();
                }
            } else {
                echo "錯誤: 準備更新訂單總價的SQL語句時出錯 - " . $conn->error;
                exit();
            }

            // 清空購物車
            unset($_SESSION['cart']);

            // 顯示成功消息
            echo "<script>alert('訂單已成功下單！'); window.location.href='products.php';</script>";
        } else {
            echo "錯誤: 插入訂單時出錯 - " . $stmt->error;
            exit();
        }
    } else {
        echo "錯誤: 準備插入訂單的SQL語句時出錯 - " . $conn->error;
        exit();
    }
} else {
    echo "<p>請使用 POST 方法提交訂單。</p>";
}
?>

<?php include 'includes/footer.php'; ?>
