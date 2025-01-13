console.log("product.js loaded");

(function () {
    "use strict";

    // Cache DOM elements and state
    const STATE = {
        selectedCategory: "",
        selectedColor: "default",
        selectedPriceRange: "",
        selectedSort: "default",
        searchQuery: "",
        totalPages: 0,
        currentPage: 1,
    };

    const DOM = {
        categoryButtons: document.querySelectorAll(".filter-tope-group button"),
        sortLinks: document.querySelectorAll(".filter-col1 .filter-link"),
        priceLinks: document.querySelectorAll(".filter-col2 .filter-link"),
        colorLinks: document.querySelectorAll(".filter-col3 .filter-link"),
        productsContainer: document.querySelector(".isotope-grid"),
        loadingSpinner: document.getElementById("loading"),
        paginationContainer: document.getElementById("pagination-container"),
        searchInput: document.getElementById("search-product"),
        filterButton: document.getElementById("filter-button"),
        resetButton: document.getElementById("reset-button"),
        dropdownItems: document.querySelectorAll(".dropdown-item"),
    };

    // Constants
    const CONSTANTS = {
        DEBOUNCE_DELAY: 400,
        PAGE_SIZE: 8,
        FADE_DURATION: 300,
        FADE_IN_DELAY: 100,
    };

    // Utility functions
    const utils = {
        formatPrice: (price) => {
            // Handle edge cases
            if (price === null || price === undefined || isNaN(price)) {
                return "0";
            }

            // Convert to string and split into integer and decimal parts
            const [integerPart, decimalPart] = price.toString().split(".");

            // Add thousands separators to integer part
            const formattedInteger = integerPart.replace(
                /\B(?=(\d{3})+(?!\d))/g,
                ","
            );

            // Return formatted price with decimal part if it exists
            return decimalPart
                ? `${formattedInteger}.${decimalPart}`
                : formattedInteger;
        },

        // Add currency formatting with symbol
        formatCurrency: (price, currency = "$", position = 1) => {
            if (position === 2) {
                return `${utils.formatPrice(price)}${currency}`;
            }
            return `${currency}${utils.formatPrice(price)}`;
        },

        debounce: (func, delay) => {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func.apply(null, args), delay);
            };
        },

        parsePrice: (priceRange) => {
            if (!priceRange) return { min: "", max: "" };
            const [min, max] = priceRange.split("-");
            return { min: min || "", max: max || "" };
        },

        buildUrl: ({
            categoryId,
            color,
            minPrice,
            maxPrice,
            sort,
            search,
            page,
            size,
        }) => {
            const params = new URLSearchParams();
            params.append("size", size || CONSTANTS.PAGE_SIZE);

            if (page) params.append("page", page);
            if (categoryId) {
                params.append(
                    "categoryId",
                    categoryId.length > 1
                        ? categoryId
                        : `[startsWith]${categoryId}`
                );
            }
            if (color && color !== "default")
                params.append("color", `[like]${color}`);

            if (minPrice && maxPrice) {
                params.append("price", `[gte]${minPrice}`);
                params.append("price", `[lt]${maxPrice}`);
            }

            if (!minPrice && maxPrice) {
                params.append("price", `[lt]${maxPrice}`);
            }

            if (minPrice && !maxPrice) {
                params.append("price", `[gte]${minPrice}`);
            }

            if (sort && sort !== "default") params.append("sort", sort);
            if (search) params.append("name", `[like]${search}`);

            return `/products?${params.toString()}`;
        },

        findCorrespondingFilterButton: (categoryId) => {
            return Array.from(DOM.categoryButtons).find((button) => {
                const buttonFilter = button.getAttribute("data-filter");
                // Check if the button's filter matches either directly or as a parent category
                return (
                    buttonFilter === categoryId ||
                    (buttonFilter === categoryId.charAt(0) &&
                        categoryId.length > 1)
                );
            });
        },
    };

    // Product rendering
    const renderer = {
        createProductHTML: (product) => {
            if (!product.images?.[0]) return "";

            return `
                <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item ${
                    product.categoryId || ""
                }">
                    <div class="block2">
                        <div class="block2-pic hov-img0">
                            <img src="/images/${product.images[0].path}" alt="${
                product.name
            }">
                            <a href="/products/${product.productId}" 
                               class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1">
                                Quick View
                            </a>
                        </div>
                        <div class="block2-txt flex-w flex-t p-t-14">
                            <div class="block2-txt-child1 flex-col-l">
                                <a href="/products/${product.productId}" 
                                   class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6">
                                    ${product.name}
                                </a>
                                <span class="stext-105 cl3">${utils.formatCurrency(
                                    product.price,
                                    " VND",
                                    2
                                )} </span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        renderPagination: (totalPages, currentPage) => {
            const createPageItem = (
                pageNum,
                isActive = false,
                isDisabled = false,
                text = pageNum
            ) => `
                <li class="page-item ${isActive ? "active" : ""} ${
                isDisabled ? "disabled" : ""
            }">
                    <a href="#" data-page="${pageNum}" class="page-link">${text}</a>
                </li>
            `;

            const items = [];
            items.push(
                createPageItem(
                    currentPage - 1,
                    false,
                    currentPage === 1,
                    "&#8592;"
                )
            );
            items.push(createPageItem(1, currentPage === 1));

            if (currentPage > 5)
                items.push(
                    '<li class="page-item disabled"><span class="page-link">...</span></li>'
                );

            for (
                let i = Math.max(2, currentPage - 3);
                i <= Math.min(totalPages - 1, currentPage + 2);
                i++
            ) {
                items.push(createPageItem(i, i === currentPage));
            }

            if (currentPage < totalPages - 3)
                items.push(
                    '<li class="page-item disabled"><span class="page-link">...</span></li>'
                );

            if (totalPages > 1)
                items.push(
                    createPageItem(totalPages, currentPage === totalPages)
                );
            items.push(
                createPageItem(
                    currentPage + 1,
                    false,
                    currentPage === totalPages,
                    "&#8594;"
                )
            );

            if (totalPages === 0) {
                DOM.paginationContainer.innerHTML = "";
            } else {
                DOM.paginationContainer.innerHTML = items.join("");
            }
        },
    };

    // API handling
    const api = {
        fetchProducts: async (params) => {
            try {
                const response = await fetch(utils.buildUrl(params));
                if (!response.ok) throw new Error("Failed to fetch data");
                return await response.json();
            } catch (error) {
                console.error("Error fetching products:", error);
                throw error;
            }
        },
    };

    // UI Management
    const ui = {
        showLoading: () => DOM.loadingSpinner.classList.remove("d-none"),
        hideLoading: () => DOM.loadingSpinner.classList.add("d-none"),

        updateActiveStates: (
            elements,
            activeElement,
            activeClass = "filter-link-active"
        ) => {
            elements.forEach((el) => el.classList.remove(activeClass));
            if (activeElement) activeElement.classList.add(activeClass);
        },

        resetAllFilters: () => {
            Object.assign(STATE, {
                selectedCategory: "",
                selectedColor: "default",
                selectedPriceRange: "",
                selectedSort: "default",
                currentPage: 1,
            });

            ui.updateActiveStates(
                DOM.categoryButtons,
                DOM.categoryButtons[0],
                "how-active1"
            );
            ui.updateActiveStates(
                DOM.colorLinks,
                document.querySelector(
                    '.filter-col3 .filter-link[data-color="default"]'
                )
            );
            ui.updateActiveStates(
                DOM.priceLinks,
                document.querySelector(
                    '.filter-col2 .filter-link[data-price-range="default"]'
                )
            );
            ui.updateActiveStates(
                DOM.sortLinks,
                document.querySelector(
                    '.filter-col1 .filter-link[data-sort="default"]'
                )
            );
        },

        syncFilterButtonWithCategory: (categoryId) => {
            // First remove active class from all filter buttons
            DOM.categoryButtons.forEach((btn) =>
                btn.classList.remove("how-active1")
            );

            // Find and activate the corresponding filter button
            const correspondingButton =
                utils.findCorrespondingFilterButton(categoryId);
            if (correspondingButton) {
                correspondingButton.classList.add("how-active1");
            }
        },

        resetAllFilters: () => {
            Object.assign(STATE, {
                selectedCategory: "",
                selectedColor: "default",
                selectedPriceRange: "",
                selectedSort: "default",
                currentPage: 1,
                searchQuery: "", // Reset search query
            });

            ui.updateActiveStates(
                DOM.categoryButtons,
                DOM.categoryButtons[0],
                "how-active1"
            );
            ui.updateActiveStates(
                DOM.colorLinks,
                document.querySelector(
                    '.filter-col3 .filter-link[data-color="default"]'
                )
            );
            ui.updateActiveStates(
                DOM.priceLinks,
                document.querySelector(
                    '.filter-col2 .filter-link[data-price-range="default"]'
                )
            );
            ui.updateActiveStates(
                DOM.sortLinks,
                document.querySelector(
                    '.filter-col1 .filter-link[data-sort="default"]'
                )
            );
        },
    };

    // Main product rendering function
    async function fetchAndRenderProducts(params = {}) {
        ui.showLoading();

        try {
            // Always include the current search query in params
            const searchParams = {
                ...params,
                search: STATE.searchQuery,
            };

            const response = await api.fetchProducts(searchParams);
            const products = response.data?.products || [];

            // Update STATE with current filter values
            STATE.currentPage = params.page || 1;
            if (params.categoryId !== undefined)
                STATE.selectedCategory = params.categoryId;
            if (params.color !== undefined) STATE.selectedColor = params.color;
            if (params.sort !== undefined) STATE.selectedSort = params.sort;
            if (
                params.minPrice !== undefined &&
                params.maxPrice !== undefined
            ) {
                STATE.selectedPriceRange = `${params.minPrice}-${params.maxPrice}`;
            }

            // Fade out current products
            const currentItems =
                DOM.productsContainer.querySelectorAll(".isotope-item");
            currentItems.forEach((item) => item.classList.remove("show"));

            // Render new products after fade out
            setTimeout(() => {
                DOM.productsContainer.innerHTML = products.length
                    ? products.map(renderer.createProductHTML).join("")
                    : '<div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">' +
                      '<div class="no-products display-4 text-center">Không có sản phẩm</div></div>';

                STATE.totalPages = response.data?.pagination.totalPages || 0;
                renderer.renderPagination(STATE.totalPages, STATE.currentPage);

                setTimeout(() => {
                    DOM.productsContainer
                        .querySelectorAll(".isotope-item")
                        .forEach((item) => item.classList.add("show"));
                }, CONSTANTS.FADE_IN_DELAY);
            }, CONSTANTS.FADE_DURATION);
        } catch (error) {
            console.error("Error loading products:", error);
            alert("Error loading products. Please try again.");
        } finally {
            ui.hideLoading();
        }
    }

    // Event Handlers
    function initializeEventListeners() {
        // Category button clicks
        DOM.categoryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const category = button.getAttribute("data-filter");
                STATE.selectedCategory = category === "*" ? "" : category;
                ui.updateActiveStates(
                    DOM.categoryButtons,
                    button,
                    "how-active1"
                );
                fetchAndRenderProducts({
                    categoryId: STATE.selectedCategory,
                    color: STATE.selectedColor,
                    ...utils.parsePrice(STATE.selectedPriceRange),
                    sort: STATE.selectedSort,
                });
            });
        });

        DOM.dropdownItems.forEach((item) => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const subcategoryId = item.getAttribute("data-filter");
                STATE.selectedCategory = subcategoryId;

                // Sync the filter button state
                ui.syncFilterButtonWithCategory(subcategoryId);

                // Apply filters and fetch products
                const { min: minPrice, max: maxPrice } = utils.parsePrice(
                    STATE.selectedPriceRange
                );
                fetchAndRenderProducts({
                    categoryId: STATE.selectedCategory,
                    color: STATE.selectedColor,
                    minPrice,
                    maxPrice,
                    sort: STATE.selectedSort,
                });
            });
        });

        // Color filter
        DOM.colorLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                STATE.selectedColor = link.getAttribute("data-color");
                ui.updateActiveStates(
                    DOM.colorLinks,
                    link,
                    "filter-link-active"
                );
            });
        });

        // Price filter
        DOM.priceLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                STATE.selectedPriceRange =
                    link.getAttribute("data-price-range");
                ui.updateActiveStates(DOM.priceLinks, link);
            });
        });

        // Sort filter
        DOM.sortLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                STATE.selectedSort = link.getAttribute("data-sort");
                ui.updateActiveStates(DOM.sortLinks, link);
            });
        });

        // Filter button
        DOM.filterButton.addEventListener("click", () => {
            const { min: minPrice, max: maxPrice } = utils.parsePrice(
                STATE.selectedPriceRange
            );
            fetchAndRenderProducts({
                categoryId: STATE.selectedCategory,
                color: STATE.selectedColor,
                minPrice,
                maxPrice,
                sort: STATE.selectedSort,
                page: STATE.currentPage,
            });
        });

        // Pagination
        DOM.paginationContainer.addEventListener("click", (e) => {
            const link = e.target.closest(".page-link");
            if (!link) return;

            e.preventDefault();
            const currentPage = STATE.currentPage;
            const page = parseInt(link.getAttribute("data-page"), 10);

            if (
                !isNaN(page) &&
                page > 0 &&
                page <= STATE.totalPages &&
                currentPage != page
            ) {
                STATE.currentPage = page;
                const { min: minPrice, max: maxPrice } = utils.parsePrice(
                    STATE.selectedPriceRange
                );
                fetchAndRenderProducts({
                    categoryId: STATE.selectedCategory,
                    color: STATE.selectedColor,
                    minPrice,
                    maxPrice,
                    sort: STATE.selectedSort,
                    page,
                });
            }
        });

        // Search input
        DOM.searchInput.addEventListener(
            "input",
            utils.debounce((e) => {
                STATE.searchQuery = e.target.value.trim();
                const { min: minPrice, max: maxPrice } = utils.parsePrice(
                    STATE.selectedPriceRange
                );

                fetchAndRenderProducts({
                    categoryId: STATE.selectedCategory,
                    color: STATE.selectedColor,
                    minPrice,
                    maxPrice,
                    sort: STATE.selectedSort,
                    page: 1, // Reset to first page when searching
                });
            }, CONSTANTS.DEBOUNCE_DELAY)
        );

        // Update reset button to clear search
        DOM.resetButton.addEventListener("click", () => {
            ui.resetAllFilters();
            STATE.searchQuery = ""; // Clear search query
            DOM.searchInput.value = ""; // Clear search input
            fetchAndRenderProducts({
                page: 1,
            });
        });
    }

    // Initialize
    function init() {
        initializeEventListeners();
        fetchAndRenderProducts();
    }

    init();
})();
