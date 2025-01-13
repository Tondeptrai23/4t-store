$(document).ready(function () {
    const deletedProductTable = $("#deletedProductTable").DataTable({
        processing: true,
        serverSide: true,
        language: {
            processing: "Đang xử lý...",
            search: "Tìm kiếm:",
            lengthMenu: "Hiển thị _MENU_ mục",
            info: "Hiển thị _START_ đến _END_ trong _TOTAL_ mục",
            infoEmpty: "Hiển thị 0 đến 0 trong 0 mục",
            infoFiltered: "(được lọc từ _MAX_ mục)",
            loadingRecords: "Đang tải...",
            zeroRecords: "Không tìm thấy kết quả",
            emptyTable: "Không có dữ liệu",
            paginate: {
                first: "Đầu",
                previous: "Trước",
                next: "Tiếp",
                last: "Cuối",
            },
        },
        ajax: {
            url: "/admin/products/deleted/data",
            type: "GET",
            data: function (d) {
                return {
                    page: Math.floor(d.start / d.length) + 1,
                    size: d.length,
                    sort:
                        d.order && d.order[0]
                            ? d.columns[d.order[0].column].name
                            : null,
                    order:
                        d.order && d.order[0]
                            ? d.order[0].dir.toUpperCase()
                            : null,
                    name:
                        d.search && d.search.value
                            ? `[like]${d.search.value}`
                            : null,
                };
            },
            dataSrc: function (response) {
                response.recordsTotal = response.data.count;
                response.recordsFiltered = response.data.count;
                return response.data.products || [];
            },
            error: function (xhr, error, thrown) {
                console.error("Lỗi DataTables Ajax:", error, thrown);
                showNotification("Lỗi tải dữ liệu sản phẩm đã xóa", "error");
            },
        },
        columns: [
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    if (row.images && row.images.length > 0) {
                        return `<img src="/images/${row.images[0].path}" alt="${row.name}" width="50">`;
                    }
                    return '<img src="/admin/assets/placeholder.png" alt="Không có ảnh" width="50">';
                },
            },
            { data: "name", name: "name" },
            {
                data: "price",
                name: "price",
                render: function (data) {
                    return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(data);
                },
            },
            { data: "size", name: "size" },
            {
                data: "color",
                name: "color",
                render: function (data) {
                    const colorMap = {
                        Red: "Đỏ",
                        Blue: "Xanh dương",
                        Black: "Đen",
                        White: "Trắng",
                        Gray: "Xám",
                    };
                    return colorMap[data] || data;
                },
            },
            {
                data: "createdAt",
                name: "createdAt",
                render: function (data) {
                    return new Date(data).toLocaleDateString("vi-VN");
                },
            },
            {
                data: "destroyTime",
                name: "destroyTime",
                render: function (data) {
                    return new Date(data).toLocaleDateString("vi-VN");
                },
            },
        ],
        order: [[5, "desc"]],
    });

    function showNotification(message, type) {
        const $modal = $("#notificationModal");
        const $message = $("#notificationMessage");
        const $icon = $("#notificationIcon");
        const $header = $("#notificationModal .modal-header");

        $message.text(message);

        $header.removeClass("bg-success bg-danger bg-warning");
        $icon
            .removeClass("fe-check fe-alert-circle fe-alert-triangle")
            .removeClass("text-success text-danger text-warning");

        switch (type) {
            case "success":
                $header.addClass("bg-success text-white");
                $icon.addClass("fe-check text-success");
                break;
            case "error":
                $header.addClass("bg-danger text-white");
                $icon.addClass("fe-alert-circle text-danger");
                break;
            case "warning":
                $header.addClass("bg-warning text-white");
                $icon.addClass("fe-alert-triangle text-warning");
                break;
        }

        $modal.modal("show");
        setTimeout(() => {
            $modal.modal("hide");
        }, 2000);
    }
});
