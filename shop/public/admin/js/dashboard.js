// Admin Dashboard UI Interactions
document.addEventListener("DOMContentLoaded", function () {
    // Theme Switcher
    const themeSwitcher = document.getElementById("modeSwitcher");
    if (themeSwitcher) {
        themeSwitcher.addEventListener("click", function (e) {
            e.preventDefault();
            document.body.classList.toggle("dark-theme");

            // Save preference
            const isDarkMode = document.body.classList.contains("dark-theme");
            localStorage.setItem("darkMode", isDarkMode);

            // Update icon
            const icon = this.querySelector("i");
            icon.classList.toggle("fe-sun");
            icon.classList.toggle("fe-moon");
        });

        // Load saved preference
        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-theme");
            const icon = themeSwitcher.querySelector("i");
            icon.classList.remove("fe-sun");
            icon.classList.add("fe-moon");
        }
    }

    // Date Range Selector
    const dateRangeSelect = document.getElementById("period-select");
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener("change", function () {
            updateDashboardData(this.value);
        });
    }

    // Initialize loading states
    const loadingStates = {
        show: function (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const loader = document.createElement("div");
                loader.className = "loading-overlay";
                loader.innerHTML = '<div class="loading-spinner"></div>';
                element.appendChild(loader);
            }
        },
        hide: function (elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                const loader = element.querySelector(".loading-overlay");
                if (loader) {
                    loader.remove();
                }
            }
        },
    };

    // Function to update dashboard data
    function updateDashboardData(period) {
        // Show loading states
        loadingStates.show("revenueChart");
        loadingStates.show("orderStatusChart");

        // Fetch new data based on period
        fetch(`/admin/api/dashboard-data?period=${period}`)
            .then((response) => response.json())
            .then((data) => {
                // Update metrics
                updateMetrics(data.metrics);

                // Update charts
                updateCharts(data.charts);

                // Update recent orders
                updateRecentOrders(data.recentOrders);
            })
            .catch((error) => {
                console.error("Error updating dashboard:", error);
                // Show error notification
            })
            .finally(() => {
                // Hide loading states
                loadingStates.hide("revenueChart");
                loadingStates.hide("orderStatusChart");
            });
    }

    // Function to update metrics
    function updateMetrics(metrics) {
        Object.keys(metrics).forEach((key) => {
            const element = document.getElementById(`metric-${key}`);
            if (element) {
                // Format numbers if needed
                const value =
                    typeof metrics[key] === "number"
                        ? new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                          }).format(metrics[key])
                        : metrics[key];

                element.textContent = value;
            }
        });
    }

    // Function to show notifications
    function showNotification(type, message) {
        const alertElement = document.createElement("div");
        alertElement.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertElement.style.top = "20px";
        alertElement.style.right = "20px";
        alertElement.style.zIndex = "9999";

        alertElement.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        `;

        document.body.appendChild(alertElement);

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }

    // Function to update recent orders table
    function updateRecentOrders(orders) {
        const tableBody = document.querySelector(".orders-table tbody");
        if (tableBody && orders.length) {
            tableBody.innerHTML = orders
                .map(
                    (order) => `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${new Date(order.createdAt).toLocaleDateString(
                        "vi-VN"
                    )}</td>
                    <td>${order.userId}</td>
                    <td>
                        <span class="status-badge ${order.status.toLowerCase()}">
                            ${order.status}
                        </span>
                    </td>
                    <td>${new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(order.total)}</td>
                    <td>
                        <a href="/admin/orders/${
                            order.orderId
                        }" class="btn btn-sm btn-primary">
                            View
                        </a>
                    </td>
                </tr>
            `
                )
                .join("");
        }
    }

    const paymentCards = document.querySelectorAll(".payment-stat-card");
    paymentCards.forEach((card) => {
        if (card.querySelector(".h3").textContent === "0") {
            card.querySelector(".small").textContent = "Unable to load data";
            card.querySelector(".small").classList.add("text-danger");
        }
    });

    // Initialize dashboard with default period
    updateDashboardData(document.getElementById("period-select").value);
});
