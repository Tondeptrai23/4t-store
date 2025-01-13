// In public/admin/js/dashboard-charts.js

let revenueChart;
let statusChart;

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

    // Initialize Status Chart
    const statusCtx = document
        .getElementById("orderStatusChart")
        .getContext("2d");
    statusChart = new Chart(statusCtx, {
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
}

function loadDashboardData() {
    const period = document.getElementById("period-select").value;

    // Show loading state
    document.querySelectorAll(".chart-container").forEach((container) => {
        container.style.opacity = "0.5";
    });

    fetch(`/admin/api/dashboard-data?period=${period}`)
        .then((response) => response.json())
        .then((data) => {
            updateCharts(data);
        })
        .catch((error) => {
            console.error("Error loading dashboard data:", error);
            // Show error message to user
            alert("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
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

    // Update status chart
    statusChart.data.datasets[0].data = data.orderStatusData;
    statusChart.update();

    // Update summary metrics if they exist
    updateMetrics(data.metrics);
}

function updateMetrics(metrics) {
    if (!metrics) return;

    // Update each metric if the element exists
    Object.keys(metrics).forEach((key) => {
        const element = document.getElementById(`metric-${key}`);
        if (element) {
            let value = metrics[key];
            if (typeof value === "number") {
                // Format currency values
                value = new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(value);
            }
            element.textContent = value;
        }
    });
}
