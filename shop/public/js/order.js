$(document).ready(function () {
    const provinceApi = "https://provinces.open-api.vn/api/";
    const districtApi = "https://provinces.open-api.vn/api/d";
    const wardApi = "https://provinces.open-api.vn/api/w";

    // Fetch provinces
    $.getJSON(provinceApi, function (data) {
        data.forEach(province => {
            $('#province').append(`<option value="${province.code}">${province.name}</option>`);
        });
    });

    // On province change, fetch districts
    $('#province').change(function () {
        const provinceCode = $(this).val();
        $('#district').html('<option>Huyện...</option>'); // Reset district dropdown
        $('#ward').html('<option>Xã...</option>'); // Reset ward dropdown
        if (provinceCode !== "Tỉnh...") {
            $.getJSON(districtApi, function (data) {
                const filteredDistricts = data.filter(district => district.province_code == provinceCode);
                filteredDistricts.forEach(district => {
                    $('#district').append(`<option value="${district.code}">${district.name}</option>`);
                });
            });
        }
    });

    // On district change, fetch wards
    $('#district').change(function () {
        const districtCode = $(this).val();
        $('#ward').html('<option>Xã...</option>'); // Reset ward dropdown
        if (districtCode !== "Huyện...") {
            $.getJSON(wardApi, function (data) {
                const filteredWards = data.filter(ward => ward.district_code == districtCode);
                filteredWards.forEach(ward => {
                    $('#ward').append(`<option value="${ward.code}">${ward.name}</option>`);
                });
            });
        }
    });
});