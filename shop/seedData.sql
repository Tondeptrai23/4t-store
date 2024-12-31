INSERT INTO categories (categoryId, name, description, createdAt, updatedAt) VALUES
('1', N'Áo', N'Tất cả các loại áo thời trang nam nữ', NOW(), NOW()),
('2', N'Quần', N'Đa dạng các loại quần thời trang', NOW(), NOW()),
('3', N'Giày dép', N'Giày dép đa dạng phong cách', NOW(), NOW()),
('4', N'Túi xách', N'Túi xách thời trang nhiều kiểu dáng', NOW(), NOW()),
('5', N'Áo khoác', N'Các loại áo khoác thời thượng', NOW(), NOW());

INSERT INTO sub_categories (categoryId, name, description, createdAt, updatedAt, parentId) VALUES
('101', N'Áo thun', N'Áo thun basic và thời trang, phù hợp mặc hàng ngày', NOW(), NOW(), '1'),
('102', N'Áo sơ mi', N'Áo sơ mi công sở và casual cho nam nữ', NOW(), NOW(), '1'),
('103', N'Áo polo', N'Áo polo thanh lịch và năng động, phù hợp nhiều dịp', NOW(), NOW(), '1'),
('201', N'Quần jean', N'Quần jean thời trang nhiều kiểu dáng', NOW(), NOW(), '2'),
('202', N'Quần shorts', N'Quần shorts năng động cho mùa hè', NOW(), NOW(), '2'),
('203', N'Quần tây', N'Quần tây công sở thanh lịch', NOW(), NOW(), '2'),
('301', N'Giày thể thao', N'Giày thể thao năng động nhiều thương hiệu', NOW(), NOW(), '3'),
('302', N'Giày tây', N'Giày tây công sở sang trọng', NOW(), NOW(), '3'),
('303', N'Dép', N'Dép đi trong nhà và đi biển', NOW(), NOW(), '3'),
('401', N'Túi đeo chéo', N'Túi đeo chéo tiện lợi nhiều ngăn', NOW(), NOW(), '4'),
('402', N'Balo', N'Balo thời trang đa năng', NOW(), NOW(), '4'),
('403', N'Túi đeo vai', N'Túi đeo vai thời trang cho nữ', NOW(), NOW(), '4'),
('501', N'Áo blazer', N'Áo blazer công sở thanh lịch', NOW(), NOW(), '5'),
('502', N'Hoodie', N'Hoodie trẻ trung năng động', NOW(), NOW(), '5'),
('503', N'Áo khoác dù', N'Áo khoác dù chống nước tiện lợi', NOW(), NOW(), '5');

INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('1011', '101', N'Áo thun Sọc Ngang Navy', N'Áo thun unisex họa tiết sọc ngang xanh navy và trắng, phong cách hải quân', 399000, 'M', 'Blue', NOW(), NOW()),
('1012', '101', N'Áo thun Abstract Art', N'Áo thun oversize với họa tiết nghệ thuật trừu tượng đen trắng', 449000, 'L', 'White', NOW(), NOW()),
('1013', '101', N'Áo thun Basic Premium', N'Áo thun cotton cao cấp dáng suông màu đen', 299000, 'M', 'Black', NOW(), NOW()),
('1014', '101', N'Áo thun Lifestyle', N'Áo thun form rộng màu đỏ san hô', 349000, 'L', 'Red', NOW(), NOW()),
('1015', '101', N'Áo thun Dài Tay Basic', N'Áo thun dài tay chất liệu cotton màu xám đậm', 429000, 'M', 'Grey', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('1011', '1011', 'image/jpeg', 1, 'ao-thun-soc-ngang-navy.jpg', NOW(), NOW()),
('1012', '1012', 'image/jpeg', 1, 'ao-thun-abstract-art.jpg', NOW(), NOW()),
('1013', '1013', 'image/jpeg', 1, 'ao-thun-basic-premium-den.jpg', NOW(), NOW()),
('1014', '1014', 'image/jpeg', 1, 'ao-thun-lifestyle-do.jpg', NOW(), NOW()),
('1015', '1015', 'image/jpeg', 1, 'ao-thun-dai-tay-xam.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('1021', '102', N'Áo Sơ Mi Tay Lỡ Túi Hộp', N'Áo sơ mi nam form rộng tay lỡ với túi hộp đôi màu xanh nhạt', 549000, 'M', 'Blue', NOW(), NOW()),
('1022', '102', N'Áo Sơ Mi Resort Basic', N'Áo sơ mi kiểu dáng resort màu đen, cổ trụ cách điệu', 599000, 'L', 'Black', NOW(), NOW()),
('1023', '102', N'Áo Sơ Mi Công Sở Dài Tay', N'Áo sơ mi nam công sở dài tay chất liệu cao cấp màu trắng', 649000, 'M', 'White', NOW(), NOW()),
('1024', '102', N'Áo Sơ Mi Oxford Basic', N'Áo sơ mi nam chất liệu oxford màu xanh nhạt, form regular fit', 579000, 'L', 'Blue', NOW(), NOW()),
('1025', '102', N'Áo Sơ Mi Lụa Oversize', N'Áo sơ mi nam form rộng chất liệu lụa mềm mại màu xám', 629000, 'M', 'Grey', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('1021', '1021', 'image/jpeg', 1, 'ao-so-mi-tay-lo-xanh.jpg', NOW(), NOW()),
('1022', '1022', 'image/jpeg', 1, 'ao-so-mi-resort-den.jpg', NOW(), NOW()),
('1023', '1023', 'image/jpeg', 1, 'ao-so-mi-cong-so-trang.jpg', NOW(), NOW()),
('1024', '1024', 'image/jpeg', 1, 'ao-so-mi-oxford-xanh.jpg', NOW(), NOW()),
('1025', '1025', 'image/jpeg', 1, 'ao-so-mi-lua-xam.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('1031', '103', N'Áo Polo Sọc Rugby', N'Áo polo tay dài sọc ngang phong cách rugby màu đỏ phối trắng', 599000, 'M', 'Red', NOW(), NOW()),
('1032', '103', N'Áo Polo Pique Classic', N'Áo polo nam vải pique cotton màu đen cơ bản', 449000, 'L', 'Black', NOW(), NOW()),
('1033', '103', N'Áo Polo Premium Cotton', N'Áo polo nam chất liệu cotton cao cấp màu xanh nhạt', 479000, 'M', 'Blue', NOW(), NOW()),
('1034', '103', N'Áo Polo Resort', N'Áo polo cổ trụ phong cách resort màu trắng kem', 529000, 'L', 'White', NOW(), NOW()),
('1035', '103', N'Áo Polo Oversized', N'Áo polo nam form rộng phong cách casual màu xám', 489000, 'XL', 'Grey', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('1031', '1031', 'image/jpeg', 1, 'ao-polo-rugby-do-trang.jpg', NOW(), NOW()),
('1032', '1032', 'image/jpeg', 1, 'ao-polo-pique-den.jpg', NOW(), NOW()),
('1033', '1033', 'image/jpeg', 1, 'ao-polo-premium-xanh.jpg', NOW(), NOW()),
('1034', '1034', 'image/jpeg', 1, 'ao-polo-resort-trang.jpg', NOW(), NOW()),
('1035', '1035', 'image/jpeg', 1, 'ao-polo-oversized-xam.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('2011', '201', N'Quần Jean Nam Regular Fit', N'Quần jean nam form regular fit màu xanh đậm, phong cách cổ điển', 699000, 'M', 'Blue', NOW(), NOW()),
('2012', '201', N'Quần Jean Straight Classic', N'Quần jean dáng suông màu xanh nhạt, phong cách vintage', 649000, 'L', 'Blue', NOW(), NOW()),
('2013', '201', N'Quần Jean Carpenter', N'Quần jean phong cách thợ mộc màu đen với túi đặc trưng', 749000, 'M', 'Black', NOW(), NOW()),
('2014', '201', N'Quần Jean Baggy Basic', N'Quần jean form rộng màu xanh trung tính, phong cách thoải mái', 679000, 'XL', 'Blue', NOW(), NOW()),
('2015', '201', N'Quần Jean Thêu Họa Tiết', N'Quần jean thêu hoa văn độc đáo màu xanh nhạt', 799000, 'S', 'Blue', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('2011', '2011', 'image/jpeg', 1, 'quan-jean-regular-fit-xanh-dam.jpg', NOW(), NOW()),
('2012', '2012', 'image/jpeg', 1, 'quan-jean-straight-xanh-nhat.jpg', NOW(), NOW()),
('2013', '2013', 'image/jpeg', 1, 'quan-jean-carpenter-den.jpg', NOW(), NOW()),
('2014', '2014', 'image/jpeg', 1, 'quan-jean-baggy-xanh.jpg', NOW(), NOW()),
('2015', '2015', 'image/jpeg', 1, 'quan-jean-theu-xanh-nhat.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('2021', '202', N'Quần Short Thể Thao Basic', N'Quần short thể thao chất liệu nỉ cotton màu đen, có túi hai bên', 399000, 'M', 'Black', NOW(), NOW()),
('2022', '202', N'Quần Short Cotton Premium', N'Quần short cotton cao cấp màu trắng, phong cách tối giản', 429000, 'L', 'White', NOW(), NOW()),
('2023', '202', N'Quần Short Jean Cargo', N'Quần short jean phong cách cargo màu xanh đậm, nhiều túi hộp', 479000, 'M', 'Blue', NOW(), NOW()),
('2024', '202', N'Quần Short Nỉ Lifestyle', N'Quần short nỉ dáng rộng màu đỏ, thích hợp mặc hàng ngày', 389000, 'L', 'Red', NOW(), NOW()),
('2025', '202', N'Quần Short Cotton Casual', N'Quần short cotton form rộng màu xám nhạt, thiết kế basic', 359000, 'M', 'Grey', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('2021', '2021', 'image/jpeg', 1, 'quan-short-the-thao-den.jpg', NOW(), NOW()),
('2022', '2022', 'image/jpeg', 1, 'quan-short-cotton-trang.jpg', NOW(), NOW()),
('2023', '2023', 'image/jpeg', 1, 'quan-short-jean-cargo-xanh.jpg', NOW(), NOW()),
('2024', '2024', 'image/jpeg', 1, 'quan-short-ni-do.jpg', NOW(), NOW()),
('2025', '2025', 'image/jpeg', 1, 'quan-short-cotton-xam.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('2031', '203', N'Quần Tây Linen Blend', N'Quần tây nam chất liệu pha linen màu trắng kem, form regular fit', 699000, 'M', 'White', NOW(), NOW()),
('2032', '203', N'Quần Tây Slim Fit', N'Quần tây nam form ôm màu đen, chất liệu polyester cao cấp', 749000, 'L', 'Black', NOW(), NOW()),
('2033', '203', N'Quần Tây Công Sở', N'Quần tây nam dáng suông màu trắng, chất liệu thoáng mát', 679000, 'M', 'White', NOW(), NOW()),
('2034', '203', N'Quần Tây Wide Leg', N'Quần tây nam ống rộng màu đỏ đô, phong cách retro', 729000, 'L', 'Red', NOW(), NOW()),
('2035', '203', N'Quần Tây Classic Fit', N'Quần tây nam form cơ bản màu xám đậm, vải wool blend', 799000, 'XL', 'Grey', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('2031', '2031', 'image/jpeg', 1, 'quan-tay-linen-trang-kem.jpg', NOW(), NOW()),
('2032', '2032', 'image/jpeg', 1, 'quan-tay-slim-den.jpg', NOW(), NOW()),
('2033', '2033', 'image/jpeg', 1, 'quan-tay-cong-so-trang.jpg', NOW(), NOW()),
('2034', '2034', 'image/jpeg', 1, 'quan-tay-wide-do-do.jpg', NOW(), NOW()),
('2035', '2035', 'image/jpeg', 1, 'quan-tay-classic-xam.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('3011', '301', N'Giày Slip-on Canvas', N'Giày thể thao slip-on vải canvas màu xanh đậm, đế cao su trắng ngà', 799000, 'M', 'Blue', NOW(), NOW()),
('3012', '301', N'Giày Sneaker Basic', N'Giày thể thao da trắng kiểu dáng basic, gót màu be', 899000, 'L', 'White', NOW(), NOW()),
('3013', '301', N'Giày Sneaker Runner', N'Giày thể thao phong cách chạy bộ màu đen, đế cao su kép', 849000, 'M', 'Black', NOW(), NOW()),
('3014', '301', N'Giày Sneaker Modern', N'Giày thể thao da tổng hợp màu xám, đế platform thời trang', 929000, 'L', 'Grey', NOW(), NOW()),
('3015', '301', N'Giày Sneaker Premium', N'Giày thể thao da cao cấp màu đen, đế cao su đúc', 999000, 'M', 'Black', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('3011', '3011', 'image/jpeg', 1, 'giay-slip-on-xanh.jpg', NOW(), NOW()),
('3012', '3012', 'image/jpeg', 1, 'giay-sneaker-trang.jpg', NOW(), NOW()),
('3013', '3013', 'image/jpeg', 1, 'giay-sneaker-runner-den.jpg', NOW(), NOW()),
('3014', '3014', 'image/jpeg', 1, 'giay-sneaker-modern-xam.jpg', NOW(), NOW()),
('3015', '3015', 'image/jpeg', 1, 'giay-sneaker-premium-den.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('3021', '302', N'Giày Tây Derby Classic', N'Giày tây nam kiểu derby da bóng màu đen, đế cao su chắc chắn', 1299000, 'M', 'Black', NOW(), NOW()),
('3022', '302', N'Giày Tây Oxford Basic', N'Giày tây nam kiểu oxford da trơn màu đen, đế chống trượt', 1199000, 'L', 'Black', NOW(), NOW()),
('3023', '302', N'Giày Tây Boat Style', N'Giày tây nam kiểu boat shoes da màu đen, điểm nhấn khoen vàng', 1399000, 'M', 'Black', NOW(), NOW()),
('3024', '302', N'Giày Tây Vân Cá Sấu', N'Giày tây nam họa tiết vân cá sấu màu đen, phong cách sang trọng', 1599000, 'L', 'Black', NOW(), NOW()),
('3025', '302', N'Giày Tây Monk Strap', N'Giày tây nam kiểu monk strap màu đỏ đô, khóa đồng sang trọng', 1499000, 'M', 'Red', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('3021', '3021', 'image/jpeg', 1, 'giay-tay-derby-den.jpg', NOW(), NOW()),
('3022', '3022', 'image/jpeg', 1, 'giay-tay-oxford-den.jpg', NOW(), NOW()),
('3023', '3023', 'image/jpeg', 1, 'giay-tay-boat-den.jpg', NOW(), NOW()),
('3024', '3024', 'image/jpeg', 1, 'giay-tay-van-ca-sau-den.jpg', NOW(), NOW()),
('3025', '3025', 'image/jpeg', 1, 'giay-tay-monk-do-do.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('3031', '303', N'Dép Quai Ngang Buckle', N'Dép hai quai ngang có khóa điều chỉnh màu đen, đế cao su', 599000, 'L', 'Black', NOW(), NOW()),
('3032', '303', N'Dép Cross Strap', N'Dép quai chéo da màu đen, đế cao su chống trượt', 549000, 'M', 'Black', NOW(), NOW()),
('3033', '303', N'Dép Birk Style', N'Dép hai quai ngang phong cách đức màu xanh navy, đế cork', 649000, 'L', 'Blue', NOW(), NOW()),
('3034', '303', N'Dép Classic Buckle', N'Dép hai quai ngang khóa kim loại màu đen, đế anatomic', 579000, 'M', 'Black', NOW(), NOW()),
('3035', '303', N'Dép Double Strap', N'Dép hai quai ngang màu xanh navy, đế giải phẫu', 629000, 'L', 'Blue', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('3031', '3031', 'image/jpeg', 1, 'dep-quai-ngang-den.jpg', NOW(), NOW()),
('3032', '3032', 'image/jpeg', 1, 'dep-cross-strap-den.jpg', NOW(), NOW()),
('3033', '3033', 'image/jpeg', 1, 'dep-birk-xanh.jpg', NOW(), NOW()),
('3034', '3034', 'image/jpeg', 1, 'dep-classic-den.jpg', NOW(), NOW()),
('3035', '3035', 'image/jpeg', 1, 'dep-double-strap-xanh.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('4011', '401', N'Túi Moon Bag', N'Túi đeo chéo nữ dáng trăng lưỡi liềm màu đỏ đô, da cao cấp', 899000, 'M', 'Red', NOW(), NOW()),
('4012', '401', N'Túi Mini Box', N'Túi đeo chéo compact màu xám, nhiều ngăn tiện dụng', 799000, 'S', 'Grey', NOW(), NOW()),
('4013', '401', N'Túi Đeo Ngực', N'Túi đeo chéo nam phong cách sporty màu đen', 699000, 'M', 'Black', NOW(), NOW()),
('4014', '401', N'Túi Hobo Casual', N'Túi đeo vai dáng hobo màu xanh navy, chất liệu vải cao cấp', 849000, 'L', 'Blue', NOW(), NOW()),
('4015', '401', N'Túi Messenger Tech', N'Túi đeo chéo nam kèm phụ kiện màu đen, thiết kế hiện đại', 949000, 'M', 'Black', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('4011', '4011', 'image/jpeg', 1, 'tui-moon-bag-do.jpg', NOW(), NOW()),
('4012', '4012', 'image/jpeg', 1, 'tui-mini-box-xam.jpg', NOW(), NOW()),
('4013', '4013', 'image/jpeg', 1, 'tui-deo-nguc-den.jpg', NOW(), NOW()),
('4014', '4014', 'image/jpeg', 1, 'tui-hobo-xanh.jpg', NOW(), NOW()),
('4015', '4015', 'image/jpeg', 1, 'tui-messenger-den.jpg', NOW(), NOW());

INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('4021', '402', N'Balo Laptop Business', N'Balo đựng laptop màu đen, thiết kế đơn giản thanh lịch', 1299000, 'M', 'Black', NOW(), NOW()),
('4022', '402', N'Balo Mini Urban', N'Balo nhỏ gọn phong cách đô thị màu đen', 999000, 'S', 'Black', NOW(), NOW()),
('4023', '402', N'Balo Classic Premium', N'Balo thiết kế basic cao cấp màu đen', 1199000, 'L', 'Black', NOW(), NOW()),
('4024', '402', N'Balo Modern Roll-top', N'Balo nắp cuốn hiện đại màu xám', 1399000, 'L', 'Grey', NOW(), NOW()),
('4025', '402', N'Balo Daily Basic', N'Balo đi học đi làm màu đen, nhiều ngăn tiện lợi', 899000, 'M', 'Black', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('4021', '4021', 'image/jpeg', 1, 'balo-laptop-den.jpg', NOW(), NOW()),
('4022', '4022', 'image/jpeg', 1, 'balo-mini-den.jpg', NOW(), NOW()),
('4023', '4023', 'image/jpeg', 1, 'balo-classic-den.jpg', NOW(), NOW()),
('4024', '4024', 'image/jpeg', 1, 'balo-rolltop-xam.jpg', NOW(), NOW()),
('4025', '4025', 'image/jpeg', 1, 'balo-daily-den.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('4031', '403', N'Túi Hobo Mini', N'Túi xách nữ dáng hobo nhỏ gọn màu đỏ đô, chất liệu da bóng', 899000, 'S', 'Red', NOW(), NOW()),
('4032', '403', N'Túi Tote Office', N'Túi xách công sở nữ màu đen, kiểu dáng tote thanh lịch', 1199000, 'L', 'Black', NOW(), NOW()),
('4033', '403', N'Túi Clutch Evening', N'Túi cầm tay dự tiệc màu trắng, điểm đá pha lê sang trọng', 1299000, 'S', 'White', NOW(), NOW()),
('4034', '403', N'Túi Hobo Ring', N'Túi xách nữ kiểu hobo màu đỏ đô, điểm nhấn khoen tròn', 999000, 'M', 'Red', NOW(), NOW()),
('4035', '403', N'Túi Half Moon', N'Túi xách nữ dáng trăng khuyết màu đen, thiết kế hiện đại', 849000, 'M', 'Black', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('4031', '4031', 'image/jpeg', 1, 'tui-hobo-mini-do.jpg', NOW(), NOW()),
('4032', '4032', 'image/jpeg', 1, 'tui-tote-office-den.jpg', NOW(), NOW()),
('4033', '4033', 'image/jpeg', 1, 'tui-clutch-trang.jpg', NOW(), NOW()),
('4034', '4034', 'image/jpeg', 1, 'tui-hobo-ring-do.jpg', NOW(), NOW()),
('4035', '4035', 'image/jpeg', 1, 'tui-half-moon-den.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('5011', '501', N'Áo Blazer Classic Navy', N'Áo blazer nam màu xanh navy hai nút, phong cách basic', 1899000, 'M', 'Blue', NOW(), NOW()),
('5012', '501', N'Áo Blazer Premium', N'Áo blazer nam màu xám nhạt, chất liệu cao cấp', 1999000, 'L', 'Grey', NOW(), NOW()),
('5013', '501', N'Áo Blazer Caro', N'Áo blazer nữ họa tiết caro màu xám, form dáng trẻ trung', 1799000, 'S', 'Grey', NOW(), NOW()),
('5014', '501', N'Áo Blazer Double Breasted', N'Áo blazer nam 4 nút màu đen, kiểu dáng thanh lịch', 2099000, 'L', 'Black', NOW(), NOW()),
('5015', '501', N'Áo Blazer Business', N'Áo blazer nam màu đen, thiết kế công sở cơ bản', 1849000, 'M', 'Black', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('5011', '5011', 'image/jpeg', 1, 'ao-blazer-navy.jpg', NOW(), NOW()),
('5012', '5012', 'image/jpeg', 1, 'ao-blazer-premium-xam.jpg', NOW(), NOW()),
('5013', '5013', 'image/jpeg', 1, 'ao-blazer-caro-xam.jpg', NOW(), NOW()),
('5014', '5014', 'image/jpeg', 1, 'ao-blazer-double-den.jpg', NOW(), NOW()),
('5015', '5015', 'image/jpeg', 1, 'ao-blazer-business-den.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('5021', '502', N'Hoodie Basic Crop', N'Áo hoodie dáng crop đơn giản màu đen, chất liệu nỉ cotton', 599000, 'M', 'Black', NOW(), NOW()),
('5022', '502', N'Hoodie Zip Basic', N'Áo hoodie khoá kéo màu xám, chất liệu nỉ bông cao cấp', 649000, 'L', 'Grey', NOW(), NOW()),
('5023', '502', N'Hoodie Sport Nửa Khoá', N'Áo hoodie thể thao cổ cao nửa khoá kéo màu xanh navy', 629000, 'M', 'Blue', NOW(), NOW()),
('5024', '502', N'Hoodie Nữ Pastel', N'Áo hoodie form rộng màu hồng nhạt, chất nỉ mềm mịn', 579000, 'S', 'White', NOW(), NOW()),
('5025', '502', N'Hoodie Text Graphic', N'Áo hoodie in chữ phong cách đường phố màu trắng', 599000, 'L', 'White', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('5021', '5021', 'image/jpeg', 1, 'hoodie-basic-crop-den.jpg', NOW(), NOW()),
('5022', '5022', 'image/jpeg', 1, 'hoodie-zip-basic-xam.jpg', NOW(), NOW()),
('5023', '5023', 'image/jpeg', 1, 'hoodie-sport-xanh.jpg', NOW(), NOW()),
('5024', '5024', 'image/jpeg', 1, 'hoodie-nu-hong.jpg', NOW(), NOW()),
('5025', '5025', 'image/jpeg', 1, 'hoodie-text-trang.jpg', NOW(), NOW());


INSERT INTO products (productId, categoryId, name, description, price, size, color, createdAt, updatedAt) VALUES
('5031', '503', N'Áo Khoác Bomber Basic', N'Áo khoác bomber nam màu đen, chất liệu nỉ cao cấp', 899000, 'M', 'Black', NOW(), NOW()),
('5032', '503', N'Áo Khoác Jeans Crop', N'Áo khoác jeans dáng ngắn màu xanh nhạt, phong cách trẻ trung', 799000, 'L', 'Blue', NOW(), NOW()),
('5033', '503', N'Áo Khoác Track', N'Áo khoác thể thao nam cổ cao màu đen', 849000, 'M', 'Black', NOW(), NOW()),
('5034', '503', N'Áo Khoác Varsity', N'Áo khoác varsity màu trắng kết hợp họa tiết thêu', 999000, 'L', 'White', NOW(), NOW()),
('5035', '503', N'Áo Khoác Utility', N'Áo khoác kiểu workwear màu trắng, túi hộp phía trước', 949000, 'M', 'White', NOW(), NOW());

INSERT INTO product_images (imageId, productId, contentType, displayOrder, path, createdAt, updatedAt) VALUES
('5031', '5031', 'image/jpeg', 1, 'ao-khoac-bomber-den.jpg', NOW(), NOW()),
('5032', '5032', 'image/jpeg', 1, 'ao-khoac-jeans-xanh.jpg', NOW(), NOW()),
('5033', '5033', 'image/jpeg', 1, 'ao-khoac-track-den.jpg', NOW(), NOW()),
('5034', '5034', 'image/jpeg', 1, 'ao-khoac-varsity-trang.jpg', NOW(), NOW()),
('5035', '5035', 'image/jpeg', 1, 'ao-khoac-utility-trang.jpg', NOW(), NOW());