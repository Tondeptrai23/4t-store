(function () {
    "use strict";

    var filterButtons = document.querySelectorAll('.filter-tope-group button');
    var colorLinks = document.querySelectorAll('.filter-col3 .filter-link');
    var priceLinks = document.querySelectorAll('.filter-col2 .filter-link');
    var sortLinks = document.querySelectorAll('.filter-col1 .filter-link');
    var productsContainer = document.querySelector('.isotope-grid');
    var loadingSpinner = document.getElementById('loading');


    var selectedCategory = ""; // Variable to store selected categoryId
    var selectedColor = "";
    var selectedPriceRange = "";
    var selectedSort = "default";

    // Function to fetch and render products with filters applied
    function fetchAndRenderProducts({ categoryId = "", color = "", minPrice = "", maxPrice = "", sort = "" }) {
        // Show loading spinner
        loadingSpinner.classList.remove('d-none');
    
        // Prepare URL parameters based on filter selections
        let url = '/products?size=8';

        if (categoryId) {
            url += `&categoryId=[startsWith]${categoryId}`;
        }
        if (color) {
            if(color != "default") {
                url += `&color=[like]${color}`;
            }
        }
        if (minPrice && maxPrice) {
            url += `&price=[gte]${minPrice}&price=[lt]${maxPrice}`;
        }
        if (sort) {
            if(sort != 'default'){
                url += `&sort=${sort}`;
            }
           
        }

        // Fetch filtered products
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (response) {
                // Fade out existing products
                const currentItems = productsContainer.querySelectorAll('.isotope-item');
                currentItems.forEach(item => {
                    item.classList.remove('show');
                });
    
                // Wait for fade-out effect
                setTimeout(() => {
                    productsContainer.innerHTML = ''; // Clear content
    
                    const products = response.data?.products || [];
                    let productsHTML = '';
    
                    if (products.length === 0) {
                        productsHTML = `<div class="no-products">Không có sản phẩm</div>`;
                    } else {
                        products.forEach(function (product) {
                            if (!product.images || !product.images[0]) return;
    
                            productsHTML += `
                                <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.categoryId || ''}">
                                    <div class="block2">
                                        <div class="block2-pic hov-img0">
                                            <img src="/images/${product.images[0].path}" alt="${product.name}">
                                            <a href="/products/${product.id || product.productId}" class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                                Quick View
                                            </a>
                                        </div>
                                        <div class="block2-txt flex-w flex-t p-t-14">
                                            <div class="block2-txt-child1 flex-col-l">
                                                <a href="/products/${product.id || product.productId}" class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                                    ${product.name}
                                                </a>
                                                <span class="stext-105 cl3">
                                                    $${product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                    }
    
                    // Add new products to container
                    productsContainer.innerHTML = productsHTML;
    
                    // Add fade-in effect to new items
                    const newItems = productsContainer.querySelectorAll('.isotope-item');
                    setTimeout(() => {
                        newItems.forEach(item => {
                            item.classList.add('show');
                        });
                    }, 100); // Delay for smoother transition
    
                    // Hide loading spinner
                    loadingSpinner.classList.add('d-none');
                }, 500); // Wait for fade-out effect to complete
            })
            .catch(function (error) {
                console.error('Error fetching products:', error);
                loadingSpinner.classList.add('d-none');
                alert('Error loading products. Please try again.');
            });
    }

    // Gọi hàm fetchAndRenderProducts khi trang được tải lần đầu tiên với các bộ lọc mặc định
    fetchAndRenderProducts({
        categoryId: "", // Không áp dụng lọc category
        color: "", // Không áp dụng lọc màu
        minPrice: "", // Không áp dụng lọc giá
        maxPrice: "", // Không áp dụng lọc giá
        sort: "" // Không áp dụng sắp xếp
    });

    // Attach click event listeners for filter buttons
    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            selectedCategory = button.getAttribute('data-filter');
            if (selectedCategory === "*") selectedCategory = "";

            // Reset all filter buttons' active class
            filterButtons.forEach(function (btn) {
                btn.classList.remove('how-active1');
            });

            // Add 'active' class to the clicked button
            button.classList.add('how-active1');

            // Apply filter and fetch products based on selected filters
            fetchAndRenderProducts({
                categoryId: selectedCategory,
                color: selectedColor,
                minPrice: selectedPriceRange.split('-')[0] || "",
                maxPrice: selectedPriceRange.split('-')[1] || "",
                sort: selectedSort
            });
        });
    });

    // Lấy giá trị màu khi nhấn vào một liên kết màu
    colorLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            selectedColor = link.getAttribute('data-color');
            colorLinks.forEach(function (btn) {
                btn.classList.remove('filter-link-active');
            });
            link.classList.add('filter-link-active');
        });
    });

    // Lấy giá trị giá khi nhấn vào một liên kết giá
    priceLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            selectedPriceRange = link.getAttribute('data-price-range');
            priceLinks.forEach(function (btn) {
                btn.classList.remove('filter-link-active');
            });
            link.classList.add('filter-link-active');
        });
    });

    // Lấy giá trị sắp xếp khi nhấn vào một liên kết sắp xếp
    sortLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            selectedSort = link.getAttribute('data-sort');
            sortLinks.forEach(function (btn) {
                btn.classList.remove('filter-link-active');
            });
            link.classList.add('filter-link-active');
        });
    });

    // Lắng nghe sự kiện click vào nút "Lọc"
    var filterButton = document.getElementById('filter-button');
    filterButton.addEventListener('click', function () {
        // Phân tách selectedPriceRange thành minPrice và maxPrice
        let minPrice = "";
        let maxPrice = "";

        if (selectedPriceRange) {
            let priceRangeArray = selectedPriceRange.split('-');
            minPrice = priceRangeArray[0];
            maxPrice = priceRangeArray[1] || "";
        }

        // Gọi hàm để áp dụng các bộ lọc và hiển thị sản phẩm
        fetchAndRenderProducts({
            categoryId: selectedCategory,
            color: selectedColor,
            minPrice: minPrice,
            maxPrice: maxPrice,
            sort: selectedSort
        });
    });

    var resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', function () {
        // Reset tất cả các bộ lọc
        selectedCategory = "";
        selectedColor = "";
        selectedPriceRange = "";
        selectedSort = "default";

        // Xóa các lớp active và đặt lại mặc định
        filterButtons.forEach(function (btn) {
            btn.classList.remove('how-active1');
        });
        document.querySelectorAll('.filter-tope-group button')[0].classList.add('how-active1'); // Đặt active lại cho nút mặc định

        colorLinks.forEach(function (btn) {
            btn.classList.remove('filter-link-active');
        });
        priceLinks.forEach(function (btn) {
            btn.classList.remove('filter-link-active');
        });
        sortLinks.forEach(function (btn) {
            btn.classList.remove('filter-link-active');
        });
        document.querySelector('.filter-col1 .filter-link[data-sort="default"]').classList.add('filter-link-active'); 
        document.querySelector('.filter-col2 .filter-link[data-price-range="default"]').classList.add('filter-link-active'); 
        document.querySelector('.filter-col3 .filter-link[data-color="default"]').classList.add('filter-link-active');

        // Gọi lại hàm để hiển thị tất cả sản phẩm
        fetchAndRenderProducts({
            categoryId: "",
            color: "",
            priceRange: "",
            sort: "default"
        });
    });

})();
