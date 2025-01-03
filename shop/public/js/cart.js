import { convertVietnameseCurrency } from '../../utils/utils.js';

document.addEventListener('DOMContentLoaded', async function () {
    const addToCartButtons = document.querySelectorAll('.js-add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.getAttribute('data-product-id');
            const isLoggedIn = this.getAttribute('data-is-logged-in') === 'true';
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productImage = this.getAttribute('data-product-image'); 
            const quantity = document.querySelector('input[name="num-product"]').value;
            const productData = {
                productId: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage, 
                quantity: parseInt(quantity, 10)
            };
            if (!isLoggedIn) {
                let cart = localStorage.getItem('cart');
                cart = cart ? JSON.parse(cart) : [];
                let index = cart.findIndex(item => item.productId === productId);
                if (index !== -1) {
                    cart[index].quantity += productData.quantity;
                } else {
                    cart.push(productData);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI(cart, isLoggedIn);
            } else {
                try {
                    const response = await fetch('/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productData)
                    });
                    if (response.status === 201) {
                        const updatedCart = await response.json();
                        console.log('Server Response:', updatedCart);
                        updateCartUI(updatedCart, isLoggedIn);
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                }
            }

            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        });
    });

    if (isLoggedIn) {
        try {
            const response = await fetch('/api/cart/getall');
            if (response.ok) {
                const cartItems = await response.json();
                updateCartUI(cartItems, isLoggedIn);
            }
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    } else {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            updateCartUI(JSON.parse(savedCart), isLoggedIn);
        }
    }

    document.addEventListener('click', async function (event) {
        if (event.target.classList.contains('header-cart-item-img')) {
            const productId = event.target.getAttribute('data-product-id');
            const isLoggedIn = event.target.getAttribute('data-is-logged-in') === 'true';
            const productData = {
                productId: productId
            };
            console.log('Product Data:', productData);

            if (!isLoggedIn) {
                let cart = localStorage.getItem('cart');
                cart = cart ? JSON.parse(cart) : [];
                let index = cart.findIndex(item => item.productId === productId);
                if (index !== -1) {
                    cart.splice(index, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI(cart, isLoggedIn);
            } else {
                try {
                    const response = await fetch('/api/cart/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productData)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Server Response:', data);
                        updateCartUI(data, isLoggedIn);
                    }
                } catch (error) {
                    console.error('Error deleting item:', error);
                }
            }
        }
    });
});

function updateCartUI(cartItems, isLoggedIn) {
    const cartWrap = document.querySelector('.header-cart-wrapitem');
    cartWrap.innerHTML = ''; 

    cartItems.forEach(item => {
        console.log('Cart Item:', item); 
        const listItem = `
            <li class="header-cart-item flex-w flex-t m-b-12">
                <div class="header-cart-item-img" data-product-id="${item.productId}" data-is-logged-in="${isLoggedIn}">
                    <img src="/images/${item.image}" alt="${item.name}">
                </div>
                <div class="header-cart-item-txt p-t-8">
                    <a href="/products/${item.productId}" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                        ${item.name}
                    </a>
                    <span class="header-cart-item-info">
                        ${item.quantity} x ${convertVietnameseCurrency(item.price)}
                    </span>
                </div>
            </li>
        `;
        cartWrap.insertAdjacentHTML('beforeend', listItem);
    });

    updateCartNotify(cartItems);
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    document.querySelector('.header-cart-total').textContent = `Tổng: ${convertVietnameseCurrency(total)}`;
}

function updateCartNotify(cartItems) {
    const cartNotify = document.querySelector('.icon-header-noti');
    cartNotify.setAttribute('data-notify', cartItems.length);
}