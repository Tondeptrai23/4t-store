$(document).ready(function () {
    let selectedProductId = null;
    let selectedIds = [];

    const productTable = $("#productTable").DataTable({
        processing: true,
        serverSide: true,
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
                console.error("DataTables Ajax Error:", error, thrown);
                showNotification("Error loading product data", "error");
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
                    return '<img src="/admin/assets/placeholder.png" alt="No image" width="50">';
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
            { data: "color", name: "color" },
            {
                data: "createdAt",
                name: "createdAt",
                render: function (data) {
                    return new Date(data).toLocaleDateString();
                },
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                    <button class="btn btn-sm dropdown-toggle more-horizontal" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="text-muted sr-only">Action</span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-right">
                        <a class="dropdown-item" href="/admin/products/edit/${row.productId}">Edit</a>
                        <a class="dropdown-item text-danger delete-product" href="#" data-id="${row.productId}">Delete</a>
                    </div>`;
                },
            },
        ],
        order: [[6, "desc"]],
    });

    // Handle select all checkbox
    $("#selectAll").change(function () {
        $(".custom-control-input").prop("checked", $(this).prop("checked"));
    });

    // Handle single delete
    $(document).on("click", ".text-danger", function (e) {
        e.preventDefault();
        selectedProductId = $(this)
            .closest("tr")
            .find('input[type="checkbox"]')
            .val();
        $("#deleteModal").modal("show");
    });

    // Handle confirm single delete
    $("#confirmDelete").on("click", function () {
        if (selectedProductId) {
            $.ajax({
                url: `/admin/products/${selectedProductId}`,
                method: "DELETE",
                success: function (response) {
                    $("#deleteModal").modal("hide");
                    if (response.success) {
                        $("#productTable").DataTable().ajax.reload();
                        showNotification(
                            "Product deleted successfully",
                            "success"
                        );
                    } else {
                        showNotification("Failed to delete product", "error");
                    }
                },
                error: function () {
                    $("#deleteModal").modal("hide");
                    showNotification(
                        "An error occurred while deleting the product",
                        "error"
                    );
                },
            });
        }
    });

    // Handle bulk delete button click
    $("#bulkDelete").on("click", function () {
        selectedIds = [];
        $('input[type="checkbox"]:checked').each(function () {
            if (this.value) selectedIds.push(this.value);
        });

        if (selectedIds.length === 0) {
            showNotification("Please select products to delete", "warning");
            return;
        }

        $("#bulkDeleteModal").modal("show");
    });

    // Handle confirm bulk delete
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
                    showNotification(
                        "Products deleted successfully",
                        "success"
                    );
                } else {
                    showNotification("Failed to delete products", "error");
                }
            },
            error: function () {
                $("#bulkDeleteModal").modal("hide");
                showNotification(
                    "An error occurred while deleting products",
                    "error"
                );
            },
        });
    });

    // Helper function to show notifications
    function showNotification(message, type) {
        const $modal = $("#notificationModal");
        const $message = $("#notificationMessage");
        const $icon = $("#notificationIcon");
        const $header = $("#notificationModal .modal-header");

        $message.text(message);

        // Reset classes
        $header.removeClass("bg-success bg-danger bg-warning");
        $icon
            .removeClass("fe-check fe-alert-circle fe-alert-triangle")
            .removeClass("text-success text-danger text-warning");

        // Apply appropriate styling
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

        // Auto hide after 2 seconds
        setTimeout(() => {
            $modal.modal("hide");
        }, 2000);
    }

    // Clear selected product ID when modal is closed
    $("#deleteModal").on("hidden.bs.modal", function () {
        selectedProductId = null;
    });

    // Clear selected IDs when bulk delete modal is closed
    $("#bulkDeleteModal").on("hidden.bs.modal", function () {
        selectedIds = [];
    });
});
