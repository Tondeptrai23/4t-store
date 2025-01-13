$(document).ready(function () {
    const orderTable = $("#orderTable").DataTable({
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
            url: "/api/order",
            type: "GET",
            data: function (d) {
                return {
                    page: Math.floor(d.start / d.length) + 1,
                    size: d.length,
                    sort: d.order && d.order[0] ? d.columns[d.order[0].column].name : null,
                    order: d.order && d.order[0] ? d.order[0].dir.toUpperCase() : null,
                    search: d.search && d.search.value ? d.search.value : null,
                };
            },
            dataSrc: function (response) {
                response.recordsTotal = response.count;
                response.recordsFiltered = response.count;
                return response.orders || [];
            },
            error: function (xhr, error, thrown) {
                console.error("Lỗi DataTables Ajax:", error, thrown);
                showNotification("Lỗi tải dữ liệu đơn hàng", "error");
            },
        },
        columns: [
            { data: "orderId", name: "orderId" },
            {
                data: "createdAt",
                name: "createdAt",
                render: function (data) {
                    return new Date(data).toLocaleDateString("vi-VN");
                },
            },
            { data: "userId", name: "userId" },
            {
                data: "status",
                name: "status",
                render: function (data) {
                    const statusClass = {
                        'Đã giao': 'success',
                        'Đã hủy': 'danger',
                        'Đang xử lý': 'warning',
                        'Chờ xử lý': 'info'
                    };
                    return `<span class="badge badge-${statusClass[data] || 'secondary'}">${data}</span>`;
                },
            },
            {
                data: "total",
                name: "total",
                render: function (data) {
                    return new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(data);
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
                                href="/admin/orders/${row.orderId}"
                            >
                                Xem chi tiết
                            </a>
							${row.status === 'Đang xử lý' ? `
							<a class="dropdown-item order-deliver-button" href="#" data-order-id="${row.orderId}">
								Giao hàng
							</a>` : ''}
                        </div>
						
                    `;
                },
            },
        ],
        order: [[1, "desc"]],
    });

	$(document).on('click', '.order-deliver-button', function (e) {
		e.preventDefault();
		const orderId = $(this).data('order-id');
		confirmOrder(orderId);
	});

	function confirmOrder(orderId) {
		$.ajax({
			url: `/admin/orders/${orderId}/deliver`,
			type: 'POST',
			success: function (response) {
				if (response.success) {
					showNotification("Đã giao hàng thành công", "success");
					orderTable.ajax.reload();
				} else {
					showNotification("Giao hàng thất bại", "error");
				}
			},
			error: function () {
				showNotification("Đã xảy ra lỗi khi giao hàng", "error");
			}
		});
	}

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
