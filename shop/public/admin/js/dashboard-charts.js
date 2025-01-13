let revenueChart;
let orderStatusChart;
let transactionStatusChart;

document.addEventListener("DOMContentLoaded", function () {
    initializeCharts();
    loadDashboardData();

    // Update charts when period changes
    document
        .getElementById("period-select")
        .addEventListener("change", function () {
            loadDashboardData();
        });
});

function initializeCharts() {
    // Initialize Revenue Chart
    const revenueCtx = document.getElementById("revenueChart").getContext("2d");
    revenueChart = new Chart(revenueCtx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Doanh thu",
                    data: [],
                    borderColor: "#4A90E2",
                    backgroundColor: "rgba(74, 144, 226, 0.1)",
                    fill: true,
                    tension: 0.4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(value);
                        },
                    },
                },
            },
        },
    });

    // Initialize Order Status Chart
    const orderStatusCtx = document
        .getElementById("orderStatusChart")
        .getContext("2d");
    orderStatusChart = new Chart(orderStatusCtx, {
        type: "doughnut",
        data: {
            labels: ["Đã giao", "Đang xử lý", "Chờ xử lý", "Đã hủy"],
            datasets: [
                {
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        "#28A745",
                        "#FFC107",
                        "#17A2B8",
                        "#DC3545",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });

    // Initialize Transaction Status Chart
    const transactionStatusCtx = document
        .getElementById("transactionStatusChart")
        .getContext("2d");
    transactionStatusChart = new Chart(transactionStatusCtx, {
        type: "doughnut",
        data: {
            labels: ["Hoàn thành", "Đang chờ", "Thất bại"],
            datasets: [
                {
                    data: [0, 0, 0],
                    backgroundColor: [
                        "#28A745", // Success - Green
                        "#FFC107", // Pending - Yellow
                        "#DC3545", // Failed - Red
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });
}

function loadDashboardData() {
    const period = document.getElementById("period-select").value;

    // Show loading state
    document.querySelectorAll(".chart-container").forEach((container) => {
        container.style.opacity = "0.5";
    });

    // Get main dashboard data
    fetch(`/admin/api/dashboard-data?period=${period}`)
        .then((response) => response.json())
        .then((data) => {
            updateCharts(data);
        })
        .catch((error) => {
            console.error("Error loading dashboard data:", error);
            alert("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        });

    // Get transaction statistics
    fetch(`/admin/api/payment/transactions?period=${period}`)
        .then((response) => response.json())
        .then((data) => {
            updateTransactionChart(data);
        })
        .catch((error) => {
            console.error("Error loading transaction data:", error);
        })
        .finally(() => {
            // Hide loading state
            document
                .querySelectorAll(".chart-container")
                .forEach((container) => {
                    container.style.opacity = "1";
                });
        });
}

function updateCharts(data) {
    // Update revenue chart
    revenueChart.data.labels = data.revenueData.labels;
    revenueChart.data.datasets[0].data = data.revenueData.values;
    revenueChart.update();

    // Update order status chart
    orderStatusChart.data.datasets[0].data = data.orderStatusData;
    orderStatusChart.update();
}

function updateTransactionChart(data) {
    // Update transaction status chart with completed, pending, and failed counts
    transactionStatusChart.data.datasets[0].data = [
        data.completedTransactions,
        data.pendingTransactions,
        data.totalTransactions -
            (data.completedTransactions + data.pendingTransactions),
    ];
    transactionStatusChart.update();
}
