document.addEventListener("DOMContentLoaded", function () {
    const paginationContainer = document.getElementById("pagination-container");

    // Helper function to generate pagination HTML
    function generatePagination(currentPage, totalPages) {
        return `
        <nav aria-label="Orders pagination">
            <ul class="pagination">
                <!-- Previous button -->
                <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" data-page="${
                        currentPage - 1
                    }" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>

                <!-- First page -->
                <li class="page-item ${currentPage === 1 ? "active" : ""}">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>

                ${
                    currentPage > 4
                        ? '<li class="page-item disabled"><span class="page-link">...</span></li>'
                        : ""
                }

                <!-- Pages around current page -->
                ${Array.from(
                    {
                        length:
                            Math.min(totalPages - 1, currentPage + 2) -
                            Math.max(2, currentPage - 2) +
                            1,
                    },
                    (_, i) => i + Math.max(2, currentPage - 2)
                )
                    .map(
                        (i) => `
                        <li class="page-item ${
                            i === currentPage ? "active" : ""
                        }">
                            <a class="page-link" href="#" data-page="${i}">${i}</a>
                        </li>
                    `
                    )
                    .join("")}

                ${
                    currentPage < totalPages - 3
                        ? '<li class="page-item disabled"><span class="page-link">...</span></li>'
                        : ""
                }

                <!-- Last page -->
                ${
                    totalPages > 1
                        ? `
                    <li class="page-item ${
                        currentPage === totalPages ? "active" : ""
                    }">
                        <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                    </li>
                `
                        : ""
                }

                <!-- Next button -->
                <li class="page-item ${
                    currentPage === totalPages ? "disabled" : ""
                }">
                    <a class="page-link" href="#" data-page="${
                        currentPage + 1
                    }" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>`;
    }

    // Helper function to generate order row HTML
    function generateOrderRow(order, index) {
        const statusMap = {
            pending: "Chờ xử lý",
            processing: "Đang xử lý",
            delivered: "Đã giao",
            cancelled: "Đã hủy",
        };

        return `
        <tr>
            <td scope="row">${index + 1}</td>
            <td>
                <button 
                    class="btn btn-link text-dark p-0 mb-2 w-100 text-left d-flex justify-content-between align-items-center"
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#orderDetails${index}" 
                    aria-expanded="false" 
                    aria-controls="orderDetails${index}"
                >
                    <span>Xem chi tiết đơn hàng</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="collapse" id="orderDetails${index}">
                    ${order.orderItems
                        .map(
                            (item) => `
                        <div class="d-flex align-items-center mb-2">
                            <img src="/images/${item.product.images[0].path}"
                                alt="${item.product.name}"
                                style="width: 50px; height: 70px" />
                            <p class="ml-2">
                                ${new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(item.product.price)}
                                - SL: ${item.quantity}
                                <br />
                                Size: ${item.product.size}
                            </p>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            </td>
            <td>
                <strong>
                    ${new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(order.total)}
                </strong>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td class="${order.status}">
                <strong>${statusMap[order.status]}</strong>
            </td>
        </tr>
    `;
    }

    paginationContainer.addEventListener("click", async function (e) {
        e.preventDefault();
        const target = e.target.closest("a.page-link");
        if (!target || target.parentElement.classList.contains("disabled"))
            return;

        const page = target.dataset.page;
        if (!page) return;

        try {
            const response = await fetch(`/orders?page=${page}&size=3`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            const { orders, currentPage, totalPages, totalOrders } = data;

            // Update the table content
            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = orders
                .map((order) => {
                    const index = (currentPage - 1) * 3 + orders.indexOf(order);

                    return generateOrderRow(order, index);
                })
                .join("");

            // Update pagination
            paginationContainer.innerHTML = generatePagination(
                parseInt(page),
                totalPages
            );

            // Update URL without page reload
            const url = new URL(window.location);
            url.searchParams.set("page", page);
            window.history.pushState({}, "", url);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to load orders. Please try again.");
        }
    });
});
