<?php
session_start();
include 'includes/db.php';

// 檢查購物車是否存在且不為空
if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
    // 檢查用戶是否已登入
    if (!isset($_SESSION['user_id'])) {
        echo "<p>您需要登入才能下單。<a href='login.php'>點此登入</a></p>";
        exit();
    }

    // 確保用戶已登入
    $user_id = $_SESSION['user_id'];
    $cart = $_SESSION['cart'];
    $total = 0;

    // 開始資料庫交易
    $conn->begin_transaction();
    try {
        // 計算總計
        foreach ($cart as $product_id => $quantity) {
            $product_stmt = $conn->prepare("SELECT price FROM products WHERE id = ?");
            $product_stmt->bind_param("i", $product_id);
            $product_stmt->execute();
            $product_stmt->bind_result($price);
            $product_stmt->fetch();
            $product_stmt->close();

            $subtotal = $price * $quantity;
            $total += $subtotal;
        }

        // 插入訂單
        $stmt = $conn->prepare("INSERT INTO orders (user_id, total_amount) VALUES (?, ?)");
        $stmt->bind_param("id", $user_id, $total);
        $stmt->execute();
        $order_id = $stmt->insert_id;

        // 插入訂單詳細資料
        foreach ($cart as $product_id => $quantity) {
            $order_detail_stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
            $order_detail_stmt->bind_param("iiid", $order_id, $product_id, $quantity, $price);
            $order_detail_stmt->execute();
            $order_detail_stmt->close();
        }

        $stmt->close();
        $conn->commit();

        // 清空購物車
        unset($_SESSION['cart']);
        echo "<script>alert('訂單已成功下單！'); window.location.href='products.php';</script>";
    } catch (Exception $e) {
        $conn->rollback();
        echo "訂單處理失敗：" . $e->getMessage();
    }
} else {
    echo "<p>購物車是空的，無法下單。</p>";
}
?>
