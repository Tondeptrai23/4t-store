(function () {
    "use strict";

    /*==================================================================
    [ Fetch and Render Products by Category ]
    */
    var filterButtons = document.querySelectorAll('.filter-tope-group button');
    var productsContainer = document.querySelector('.isotope-grid');
    var loadingSpinner = document.getElementById('loading');

    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var categoryId = button.getAttribute('data-filter');

            // Show "All Products" if categoryId is "*"
            if (categoryId === "*") {
                categoryId = "";
            }

            // Update active button state
            filterButtons.forEach(function(btn) {
                btn.classList.remove('how-active1');
            });
            button.classList.add('how-active1');

            // Show loading spinner
            loadingSpinner.classList.remove('d-none');

            // Fetch products by category
            fetch('/products?categoryId=' + (categoryId ? '[startsWith]' + categoryId : ''))
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    // Clear existing products
                    productsContainer.innerHTML = '';

                    // Check if response.data.products exists and is an array
                    const products = response.data?.products || [];

                    // Build HTML for all products
                    let productsHTML = '';
                    
                    products.forEach(function(product) {
                        // Ensure product has all required properties
                        if (!product.images || !product.images[0]) return;

                        productsHTML += `
                            <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${product.categoryId || ''}">
                                <div class="block2">
                                    <div class="block2-pic hov-img0">
                                        <img src="/images/${product.images[0].path}" alt="${product.name}">
                                        <a href="/products/${product.id || product.productId}" 
                                           class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                            Quick View
                                        </a>
                                    </div>
                                    <div class="block2-txt flex-w flex-t p-t-14">
                                        <div class="block2-txt-child1 flex-col-l">
                                            <a href="/products/${product.id || product.productId}" 
                                               class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
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

                    // Add all products to container at once (more efficient)
                    productsContainer.innerHTML = productsHTML;

                    // Hide loading spinner
                    loadingSpinner.classList.add('d-none');
                })
                .catch(function(error) {
                    console.error('Error fetching products:', error);
                    // Hide loading spinner
                    loadingSpinner.classList.add('d-none');
                    // Optionally show error message to user
                    alert('Error loading products. Please try again.');
                });
        });
    });
})();
