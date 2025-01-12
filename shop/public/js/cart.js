import { convertVietnameseCurrency } from "./utils.js";

document.addEventListener("DOMContentLoaded", async function () {
    const addToCartButtons = document.querySelectorAll(".js-add-to-cart");
    const isLoggedIn =
        document.body.getAttribute("data-is-logged-in") === "true";

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", async function () {
            const productId = this.getAttribute("data-product-id");
            const productName = this.getAttribute("data-product-name");
            const productPrice = this.getAttribute("data-product-price");
            const productImage = this.getAttribute("data-product-image");
            const quantity = document.querySelector(
                'input[name="num-product"]'
            ).value;
            const productData = {
                productId: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage,
                quantity: parseInt(quantity, 10),
            };
            if (!isLoggedIn) {
                let cart = localStorage.getItem("cart");
                cart = cart ? JSON.parse(cart) : [];
                let index = cart.findIndex(
                    (item) => item.productId === productId
                );
                if (index !== -1) {
                    cart[index].quantity += productData.quantity;
                } else {
                    cart.push(productData);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI(cart, isLoggedIn);
            } else {
                try {
                    const response = await fetch("/api/cart/add", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(productData),
                    });
                    if (response.status === 201) {
                        const updatedCart = await response.json();
                        updateCartUI(updatedCart, isLoggedIn);
                    }
                } catch (error) {
                    console.error("Error adding to cart:", error);
                }
            }

            const modal = new bootstrap.Modal(document.getElementById('addedProductModal'));
            modal.show();            
        });
    });
    let cartItems = [];
    if (isLoggedIn) {
        try {
            const response = await fetch("/api/cart");
            if (response.ok) {
                cartItems = await response.json();
                updateCartUI(cartItems, isLoggedIn);
                updateCartTable(cartItems);
            }
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    } else {
        const savedCart = localStorage.getItem("cart");
        const Cart = savedCart ? JSON.parse(savedCart) : [];
        if (savedCart) {
            updateCartUI(JSON.parse(savedCart), isLoggedIn);
            updateCartTable(Cart);
        }
    }

    //delete item in cart
    document.addEventListener("click", async function (event) {
        if (event.target.classList.contains("header-cart-item-img")) {
            const productId = event.target.getAttribute("data-product-id");
            const productData = {
                productId: productId,
            };

            if (!isLoggedIn) {
                let cart = localStorage.getItem("cart");
                cart = cart ? JSON.parse(cart) : [];
                let index = cart.findIndex(
                    (item) => item.productId === productId
                );
                if (index !== -1) {
                    cart.splice(index, 1);
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartUI(cart, isLoggedIn);
                updateCartTable(cart);
            } else {
                try {
                    const response = await fetch("/api/cart/delete", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(productData),
                    });
                    if (response.ok) {
                        const updatedCart = await response.json();
                        updateCartUI(updatedCart, isLoggedIn);
                        updateCartTable(updatedCart);
                    }
                } catch (error) {
                    console.error("Error deleting item:", error);
                }
            }
        }
    });

    //update cart
    const updateCartButtons = document.getElementById("js-update-cart");
    if (updateCartButtons) {
        document
            .getElementById("js-update-cart")
            .addEventListener("click", async function () {
                const cartItems = [];
                let productData;

                document
                    .querySelectorAll(".table-shopping-cart .table_row")
                    .forEach((row) => {
                        const productId = row
                            .querySelector(".column-1 .how-itemcart1")
                            .getAttribute("data-product-id");
                        const quantity = parseInt(
                            row.querySelector(".num-product").value,
                            10
                        );
                        const name = row
                            .querySelector(".column-2")
                            .textContent.trim();
                        const price = parseFloat(
                            row
                                .querySelector(".column-3")
                                .getAttribute("data-price")
                        );
                        const image = row
                            .querySelector(".column-1 .how-itemcart1 img")
                            .getAttribute("src")
                            .replace("/images/", "");

                        cartItems.push({
                            productId,
                            name,
                            price,
                            image,
                            quantity,
                        });
                        productData = { productId, quantity };
                    });

                if (!isLoggedIn) {
                    localStorage.setItem("cart", JSON.stringify(cartItems));
                    updateCartUI(cartItems, isLoggedIn);
                    updateCartTable(cartItems);
                } else {
                    try {
                        const response = await fetch("/api/cart/update", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(productData),
                        });
                        if (response.ok) {
                            const updatedCart = await response.json();
                            updateCartUI(updatedCart, isLoggedIn);
                            updateCartTable(updatedCart);
                        }
                    } catch (error) {
                        console.error("Error updating cart:", error);
                    }
                }
            });
    }
});

// update Cart side bar
function updateCartUI(cartItems, isLoggedIn) {
    const cartWrap = document.querySelector(".header-cart-wrapitem");
    cartWrap.innerHTML = "";
    if (cartItems.length === 0) {
        cartWrap.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
    } else {
        cartItems.forEach((item) => {
            const listItem = `
                <li class="header-cart-item flex-w flex-t m-b-12">
                    <div class="header-cart-item-img" data-is-logged-in="${isLoggedIn}" data-product-id="${
                item.productId
            }">
                        <img src="/images/${item.image}" alt="${item.name}">
                    </div>
                    <div class="header-cart-item-txt p-t-8">
                        <a href="/products/${
                            item.productId
                        }" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                            ${item.name}
                        </a>
                        <span class="header-cart-item-info">
                            ${item.quantity} x ${convertVietnameseCurrency(
                item.price
            )}
                        </span>
                    </div>
                </li>
            `;
            cartWrap.insertAdjacentHTML("beforeend", listItem);
        });
    }

    updateCartNotify(cartItems);
    const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );
    if (total !== 0) {
        document.querySelector(
            ".header-cart-total"
        ).textContent = `Tổng: ${convertVietnameseCurrency(total)}`;
    } else {
        document.querySelector(".header-cart-total").textContent = "";
    }
}

// update Cart notify
function updateCartNotify(cartItems) {
    const cartNotify = document.querySelector(".icon-header-noti");
    cartNotify.setAttribute("data-notify", cartItems.length);
}

// update Shopping Cart Table
function updateCartTable(cartItems) {
    const tableBody = document.querySelector(".table-shopping-cart tbody");
    if (!tableBody) return;
    tableBody.innerHTML = ``;

    if (cartItems.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>';
    } else {
        cartItems.forEach((item) => {
            const row = `
                <tr class="table_row">
                    <td class="column-1">
                        <div class="how-itemcart1 header-cart-item-img" data-product-id="${
                            item.productId
                        }">
                            <img src="/images/${item.image}" alt="${item.name}">
                        </div>
                    </td>
                    <td class="column-2">${item.name}</td>
                    <td class="column-3" data-price="${
                        item.price
                    }">${convertVietnameseCurrency(item.price)}</td>
                    <td class="column-4">
                        <div class="wrap-num-product flex-w m-l-auto m-r-0">
                            <div class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                                <i class="fs-16 fa fa-minus"></i>
                            </div>
    
                            <input class="mtext-104 cl3 txt-center num-product" type="number" name="num-product${
                                item.productId
                            }" value="${item.quantity}">
    
                            <div class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                                <i class="fs-16 fa fa-plus"></i>
                            </div>
                        </div>
                    </td>
                    <td class="column-5">${convertVietnameseCurrency(
                        item.price * item.quantity
                    )}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    }

    const total = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );
    document.getElementById("subtotal").textContent =
        convertVietnameseCurrency(total);
    document.getElementById("total").textContent =
        convertVietnameseCurrency(total);

    document.querySelectorAll(".num-product").forEach((input) => {
        input.addEventListener("change", updateQuantity);
    });
}

function updateQuantity(event) {
    const input = event.target;
    const productId = input.name.replace("num-product", "");
    const quantity = parseInt(input.value, 10);
    let cart = localStorage.getItem("cart");
    cart = cart ? JSON.parse(cart) : [];
    const index = cart.findIndex((item) => item.productId === productId);
    if (index !== -1) {
        cart[index].quantity = quantity;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartTable(cart);
    }
}

function redirectToLogin() {
    window.location.href = "/login";
}
