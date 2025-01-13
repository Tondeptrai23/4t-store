$(document).ready(function () {
    let selectedProductId = null;
    let selectedIds = [];

    const productTable = $("#productTable").DataTable({
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
            url: "/products",
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
                showNotification("Lỗi tải dữ liệu sản phẩm", "error");
            },
        },
        columns: [
            {
                data: null,
                defaultContent: "",
                orderable: false,
                render: function (data, type, row) {
                    return `
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="check${row.productId}" value="${row.productId}">
                        <label class="custom-control-label" for="check${row.productId}"></label>
                    </div>`;
                },
            },
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
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button
                            class="btn btn-sm dropdown-toggle more-horizontal"
                            type="button"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <span class="text-muted sr-only">Thao tác</span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a
                                class="dropdown-item"
                                href="/admin/products/detail/${row.productId}"
                            >
                                Xem chi tiết
                            </a>
                            <a
                                class="dropdown-item"
                                href="/admin/products/edit/${row.productId}"
                            >
                                Sửa
                            </a>
                            <a
                                class="dropdown-item text-danger delete-product"
                                href="#"
                                data-id="${row.productId}"
                            >
                                Xóa
                            </a>
                        </div>
                    `;
                },
            },
        ],
        order: [[6, "desc"]],
    });

    $("#selectAll").change(function () {
        $(".custom-control-input").prop("checked", $(this).prop("checked"));
    });

    $(document).on("click", ".text-danger", function (e) {
        e.preventDefault();
        selectedProductId = $(this)
            .closest("tr")
            .find('input[type="checkbox"]')
            .val();
        $("#deleteModal").modal("show");
    });

    $("#confirmDelete").on("click", function () {
        if (selectedProductId) {
            $.ajax({
                url: `/admin/products/${selectedProductId}`,
                method: "DELETE",
                success: function (response) {
                    $("#deleteModal").modal("hide");
                    if (response.success) {
                        $("#productTable").DataTable().ajax.reload();
                        showNotification("Xóa sản phẩm thành công", "success");
                    } else {
                        showNotification("Xóa sản phẩm thất bại", "error");
                    }
                },
                error: function () {
                    $("#deleteModal").modal("hide");
                    showNotification("Đã xảy ra lỗi khi xóa sản phẩm", "error");
                },
            });
        }
    });

    $("#bulkDelete").on("click", function () {
        selectedIds = [];
        $('input[type="checkbox"]:checked').each(function () {
            if (this.value) selectedIds.push(this.value);
        });

        if (selectedIds.length === 0) {
            showNotification("Vui lòng chọn sản phẩm để xóa", "warning");
            return;
        }

        $("#bulkDeleteModal").modal("show");
    });

    $("#confirmBulkDelete").on("click", function () {
        $.ajax({
            url: "/admin/products/bulk-delete",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ ids: selectedIds }),
            success: function (response) {
                $("#bulkDeleteModal").modal("hide");
                if (response.success) {
                    $("#productTable").DataTable().ajax.reload();
                    $("#selectAll").prop("checked", false);
                    showNotification("Xóa các sản phẩm thành công", "success");
                } else {
                    showNotification("Xóa các sản phẩm thất bại", "error");
                }
            },
            error: function () {
                $("#bulkDeleteModal").modal("hide");
                showNotification("Đã xảy ra lỗi khi xóa các sản phẩm", "error");
            },
        });
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

    $("#deleteModal").on("hidden.bs.modal", function () {
        selectedProductId = null;
    });

    $("#bulkDeleteModal").on("hidden.bs.modal", function () {
        selectedIds = [];
    });
});
