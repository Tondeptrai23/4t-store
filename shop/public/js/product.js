let currentPage = 1;
let selectedCategory = "";
let selectedColor = "";
let selectedSort = "default";
let selectedPriceRange = "";

// Hàm để cập nhật dữ liệu sản phẩm
function fetchAndRenderProducts({ categoryId = "", color = "", minPrice = "", maxPrice = "", sort = "", search = "", page = "" }) {
    return new Promise((resolve, reject) => {
        // Show loading spinner
        loadingSpinner.classList.remove('d-none');

        // Prepare URL parameters based on filter selections
        let url = `/products?size=8`;

        if (categoryId) {
            if (categoryId.length > 1) {
                url += `&categoryId=${categoryId}`;
            } else {
                url += `&categoryId=[startsWith]${categoryId}`;
            }
        }
        if (color) {
            if (color != "default") {
                url += `&color=[like]${color}`;
            }
        }
        if (minPrice && maxPrice) {
            url += `&price=[gte]${minPrice}&price=[lt]${maxPrice}`;
        }
        if (sort) {
            if (sort != 'default') {
                url += `&sort=${sort}`;
            }
        }
        if (search) {
            url += `&name=[like]${search}`;
        }
        if (page) {
            url += `&page=${page}`;
        }

        console.log(url);

        // Fetch filtered products using AJAX
        fetch(url)
            .then(function (response) {
                if (!response.ok) {
                    return reject('Failed to fetch data');
                }
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

                    resolve(); // Resolve the Promise after rendering is done
                }, 500); // Wait for fade-out effect to complete
            })
            .catch(function (error) {
                console.error('Error fetching products:', error);
                loadingSpinner.classList.add('d-none');
                alert('Error loading products. Please try again.');
                reject(error); // Reject the Promise if there's an error
            });
    });
}

// Hàm để xử lý sự kiện thay đổi trang
pagination.addEventListener('click', function (event) {
    event.preventDefault();
    const target = event.target;

    if (target.classList.contains('page-link')) {
        let page = target.getAttribute('data-page'); // Lấy số trang
        page = parseInt(page);

        // Kiểm tra nếu "Prev" hoặc "Next" được nhấn
        if (target.textContent === 'Prev' && currentPage > 1) {
            page = currentPage - 1;
        } else if (target.textContent === 'Next' && currentPage < totalPages) {
            page = currentPage + 1;
        }

        // Cập nhật trang hiện tại
        currentPage = page;

        // Gọi API để lấy dữ liệu mới
        fetchAndRenderProducts({
            categoryId: selectedCategory,
            color: selectedColor,
            minPrice: selectedPriceRange.split('-')[0] || "",
            maxPrice: selectedPriceRange.split('-')[1] || "",
            sort: selectedSort,
            page: currentPage
        }).then(() => {
            // Cập nhật trạng thái active cho phân trang
            document.querySelectorAll('.page-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector(`[data-page="${currentPage}"]`).classList.add('active');
        }).catch(error => {
            console.error('Error fetching products:', error);
            document.getElementById('loading').classList.add('d-none');
        });
    }
});

// Hàm xử lý sự kiện thay đổi bộ lọc (filter)
document.getElementById('filterForm').addEventListener('change', function () {
    selectedCategory = document.getElementById('categoryFilter').value;
    selectedColor = document.getElementById('colorFilter').value;
    selectedSort = document.getElementById('sortFilter').value;
    selectedPriceRange = document.getElementById('priceFilter').value;

    // Gọi lại API khi thay đổi filter
    fetchAndRenderProducts({
        categoryId: selectedCategory,
        color: selectedColor,
        minPrice: selectedPriceRange.split('-')[0] || "",
        maxPrice: selectedPriceRange.split('-')[1] || "",
        sort: selectedSort,
        page: currentPage
    }).then(() => {
        // Cập nhật trạng thái active cho phân trang
        document.querySelectorAll('.page-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${currentPage}"]`).classList.add('active');
    }).catch(error => {
        console.error('Error fetching products:', error);
        document.getElementById('loading').classList.add('d-none');
    });
});
