-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2025-01-09 15:59:37
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `bread`
--

-- --------------------------------------------------------

--
-- 資料表結構 `news`
--

CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` text NOT NULL,
  `date` date NOT NULL,
  `content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `order_date`, `total`) VALUES
(23, 6, 0.00, '2025-01-01 20:40:16', 599.00),
(24, 8, 0.00, '2025-01-05 18:20:02', 443.00),
(25, 8, 0.00, '2025-01-05 18:20:06', 440.00),
(26, 8, 0.00, '2025-01-05 18:26:01', 440.00),
(27, 8, 0.00, '2025-01-05 18:27:31', 440.00),
(28, 8, 0.00, '2025-01-05 18:27:41', 443.00),
(29, 8, 0.00, '2025-01-05 18:27:47', 443.00),
(30, 9, 0.00, '2025-01-05 19:29:15', 783.00),
(31, 9, 0.00, '2025-01-05 19:29:32', 783.00),
(32, 12, 0.00, '2025-01-05 19:35:25', 1339.00),
(33, 13, 0.00, '2025-01-05 23:33:57', 1785.00),
(34, 14, 0.00, '2025-01-05 23:42:06', 783.00),
(35, 14, 0.00, '2025-01-06 00:08:02', 440.00),
(36, 15, 0.00, '2025-01-06 00:10:30', 1120.00),
(37, 16, 0.00, '2025-01-06 00:22:02', 2212.00),
(38, 17, 0.00, '2025-01-06 00:26:22', 1323.00);

-- --------------------------------------------------------

--
-- 資料表結構 `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES
(31, 23, 1, 1, 599.00),
(32, 24, 3, 1, 443.00),
(33, 25, 2, 1, 440.00),
(34, 26, 2, 1, 440.00),
(35, 27, 2, 1, 440.00),
(36, 28, 3, 1, 443.00),
(37, 29, 3, 1, 443.00),
(38, 30, 4, 1, 443.00),
(39, 30, 6, 1, 340.00),
(40, 31, 6, 1, 340.00),
(41, 31, 4, 1, 443.00),
(42, 32, 7, 1, 459.00),
(43, 32, 2, 2, 440.00),
(44, 33, 2, 1, 440.00),
(45, 33, 7, 1, 459.00),
(46, 33, 4, 2, 443.00),
(47, 34, 6, 1, 340.00),
(48, 34, 3, 1, 443.00),
(49, 35, 2, 1, 440.00),
(50, 36, 2, 1, 440.00),
(51, 36, 6, 2, 340.00),
(52, 37, 2, 1, 440.00),
(53, 37, 3, 2, 443.00),
(54, 37, 4, 2, 443.00),
(55, 38, 4, 1, 443.00),
(56, 38, 1, 2, 440.00);

-- --------------------------------------------------------

--
-- 資料表結構 `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `products`
--

INSERT INTO `products` (`id`, `title`, `url`, `image`, `price`) VALUES
(1, '《The Dream Chapter: MAGIC》', 'https://zh.wikipedia.org/wiki/The_Dream_Chapter:_MAGIC', '220px-TXT_The_Dream_Chapter_MAGIC.jpeg', 440.00),
(2, '《The Dream Chapter: ETERNITY》', 'https://zh.wikipedia.org/wiki/The_Dream_Chapter:_ETERNITY', 'The_Dream_Chapter_ETERNITY.jpg', 440.00),
(3, '《minisode 1: Blue Hour》', 'https://zh.wikipedia.org/wiki/Minisode_1:_Blue_Hour', '220px-Minisode1_Blue_Hour.jpg', 443.00),
(4, '《The Chaos Chapter: FREEZE》', 'https://zh.wikipedia.org/wiki/The_Chaos_Chapter:_FREEZE', 'TXT_Freeze.jpg', 443.00),
(5, '《minisode 2: Thursday\'s Child》', 'https://zh.wikipedia.org/wiki/Minisode_2:_Thursday%27s_Child', 'TXT-minisode_2_Thursday\'s_Child.JPG', 478.00),
(6, '《The Name Chapter: FREEFALL》', 'https://zh.wikipedia.org/wiki/The_Name_Chapter:_FREEFALL', 'TXT_-_The_name_chapter_freefall.JPG', 340.00),
(7, '《The Name Chapter: TEMPTATION》', 'https://zh.wikipedia.org/wiki/The_Name_Chapter:_TEMPTATION', 'TXT-The_Name_Chapter_TEMPTATION.JPG', 459.00),
(8, '《minisode 3: TOMORROW》', 'https://zh.wikipedia.org/wiki/Minisode_3:_TOMORROW', 'TXT_-_minisode3_tomorrow.PNG', 521.00),
(9, '《The Star Chapter: SANCTUARY》', 'https://zh.wikipedia.org/wiki/The_Star_Chapter:_SANCTUARY', 'ab67616d0000b273b612b8d797e8e3ec375ca60d.jpg', 520.00);

-- --------------------------------------------------------

--
-- 資料表結構 `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(6, 'C113156206', '$2y$10$cebq0nYtUYVZQwTAwrExUerkkJmwkgjXKCkT1uYrDCfVlS/37rAe6'),
(8, 'C113156206222', '$2y$10$G0xrdfSxJSmgV8IV8CWym.Yuhj1pO0SqMUAmJwkMHe7iGeZUI/l82'),
(9, 'yuna', '$2y$10$oTPrkTlDKKqCXgjJ2ydlSOWtkY2JHpNj7r3bWCHAtKbsLhmN/EjFe'),
(12, '123', '$2y$10$Ao4VEgiGSyxU2ysN/TSuEefUsS1av3KZG4FaEPmwLf9hMDGzw4BkK'),
(13, '12333', '$2y$10$jta/jgXfWccMMQ272TBr5.vayynDM7a/AsMfTjqfFaX2qyFKPaBmW'),
(14, '123333', '$2y$10$7kATK9BB9azBOROYwdzoGevZTUVH/N6xGP/4FqLIx9kOx6DqVFYEq'),
(15, '1233333', '$2y$10$tkpTxFDDYWpyirI3iIL91.MggMknRObbZBj1sTYKmop2aEMRAWsqe'),
(16, '1233334', '$2y$10$PvnDs8YeOycXF2G/kT3AXe7E7O1th9C0md58qTaBtyE7BFQqm31RC'),
(17, '123456', '$2y$10$eMI7neYv4hA6Cz.1/YR1f.ejh7reC03z164uP3LVWZDP3.RaeHpSy');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- 資料表索引 `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- 資料表索引 `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- 資料表的限制式 `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
