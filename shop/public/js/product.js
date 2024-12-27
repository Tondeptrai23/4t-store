(function ($) {
    "use strict";

    /*==================================================================
    [ Fetch and Render Products by Category ] */
    var $filterButtons = $('.filter-tope-group button'); // Các nút lọc

    async function fetchProductsByCategory(categoryId) {
        try {
            // Hiển thị spinner khi bắt đầu tải
            $('#loading').removeClass('d-none');

            const response = await fetch(`/product/category/${categoryId}`);
            if (!response.ok) {
                throw new Error(`Error fetching products: ${response.statusText}`);
            }
            const data = await response.json();
            renderProducts(data.products);
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            // Ẩn spinner khi dữ liệu đã được render xong
            $('#loading').addClass('d-none');
        }
    }

    function renderProducts(products) {
        var $productList = $('.isotope-grid'); // Container cho sản phẩm
        $productList.empty(); // Xóa nội dung cũ

        // Chờ 1 khoảng thời gian để giảm giật trước khi hiển thị sản phẩm
        setTimeout(() => {
            products.forEach((product, index) => {
                const productHTML = `
                    <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.categoryId}">
                        <div class="block2">
                            <div class="block2-pic hov-img0">
                                <img src="/images/${product.images[0]?.path || 'placeholder.jpg'}" alt="${product.name}">
                                <a href="/products/${product.id}" 
                                   class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                   Quick View
                                </a>
                            </div>
                            <div class="block2-txt flex-w flex-t p-t-14">
                                <div class="block2-txt-child1 flex-col-l">
                                    <a href="/products/${product.id}" 
                                       class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                       ${product.name}
                                    </a>
                                    <span class="stext-105 cl3">$${product.price}</span>
                                </div>
                            </div>
                        </div>
                    </div>`;

                // Thêm sản phẩm vào danh sách và áp dụng hiệu ứng fade-in
                var $productItem = $(productHTML).appendTo($productList);

                // Thêm lớp 'show' để hiển thị sản phẩm với hiệu ứng fade-in
                setTimeout(() => {
                    $productItem.addClass('show');
                }, 100 * index); // Delay nhỏ giữa các sản phẩm để tránh giật
            });
        }, 300); // Delay trước khi hiển thị sản phẩm, tùy chỉnh theo nhu cầu
    }

    fetchProductsByCategory('*')

    $filterButtons.on('click', function () {
        var categoryId = $(this).attr('data-filter'); // Lấy categoryId từ data-filter
        
        fetchProductsByCategory(categoryId);
        
        // Đánh dấu nút hiện tại là active
        $filterButtons.removeClass('how-active1');
        $(this).addClass('how-active1');
    });

})(jQuery);
