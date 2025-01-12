$(document).ready(function () {
    const provinceApi = "https://provinces.open-api.vn/api/";
    const districtApi = "https://provinces.open-api.vn/api/d";
    const wardApi = "https://provinces.open-api.vn/api/w";

    let selectedProvinceName = "";
    let selectedDistrictName = "";
    let selectedWardName = "";

    // Fetch provinces
    $.getJSON(provinceApi, function (data) {
        data.forEach(province => {
            $('#province').append(`<option value="${province.code}">${province.name}</option>`);
        });
    });

    // On province change, fetch districts
    $('#province').change(function () {
        const provinceCode = $(this).val();
        selectedProvinceName = $(this).find('option:selected').text(); // Get selected province name
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
        selectedDistrictName = $(this).find('option:selected').text(); // Get selected district name
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

    // On ward change, capture selected ward name
    $('#ward').change(function () {
        selectedWardName = $(this).find('option:selected').text(); // Get selected ward name
    });
    const isLoggedIn = document.body.getAttribute('data-is-logged-in') === 'true';
  
    // Checkout logic
    const checkoutButton = document.querySelector('.js-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function (event) {
            if (!isLoggedIn) {
                event.preventDefault();
                redirectToLogin();
            } else {
                event.preventDefault();
                let flag = 0;
                let cartItems = [];
                try {
                    const response = await fetch('/api/cart');
                    if (response.ok) {
                        cartItems = await response.json();
                        if (cartItems.length !== 0) {
                            flag = 1;
                        }
                    }
                } catch (error) {
                    console.error('Error fetching cart items:', error);
                }
                const addressModal = new bootstrap.Modal(document.getElementById('addressModal'));
                const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));

                const address = $('#adress').val().trim();
                // Check if cart is empty
                if (flag === 0) {
                    const emptyCartModal = new bootstrap.Modal(document.getElementById('emptyCartModal'));
                    emptyCartModal.show();
                    return;
                }
                // Validate address
                if (!selectedProvinceName || !selectedDistrictName || !selectedWardName || !address) {
                    addressModal.show();
                } else {
                    try {
                        const addressData = `${address}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;
                        const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
                        const orderData = {
                            address: addressData,
                            total: total,
                            cart: cartItems
                        };

                        const response = await fetch('/api/order/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(orderData)
                        });
                        if (response.ok) {
                            const order = await response.json();
                        }
                    } catch (error) {
                        console.error('Error updating cart:', error);
                    }
                    orderModal.show();
                }
            }
        });
    }
});


