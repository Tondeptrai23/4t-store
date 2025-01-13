$(document).ready(function () {
    const userTable = $("#userTable").DataTable({
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
            url: "/users/deleted",
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
                return response.data.users || [];
            },
            error: function (xhr, error, thrown) {
                console.error("Lỗi DataTables Ajax:", error, thrown);
                showNotification("Lỗi tải dữ liệu người dùng", "error");
            },
        },
        columns: [
           
            { data: "name", name: "name" },
            
            { data: "email", name: "email" },

            {data: "role", name: "role" },
           
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
            }
        ],
        order: [[1, "desc"]],
    });
});
