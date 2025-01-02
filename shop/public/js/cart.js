document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.js-add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.getAttribute('data-product-id');
            const isLoggedIn = this.getAttribute('data-is-logged-in') === 'true';
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const productImage = this.getAttribute('data-product-image'); // Assuming you have an image attribute
            const quantity = document.querySelector('input[name="num-product"]').value;
            const productData = {
                productId: productId,
                name: productName,
                price: parseFloat(productPrice),
                image: productImage, // Assuming you have an image attribute
                quantity: parseInt(quantity, 10)
            };
            console.log('Product Data:', productData);

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
                updateCartUI(cart);
            } else {
                try {
                    const response = await fetch('/api/cart/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(productData)
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Server Response:', data);
                        updateCartUI(data);
                    }
                } catch (error) {
                    console.error('Error adding to cart:', error);
                }
            }

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        });
    });

    // Load cart from localStorage on page load
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        updateCartUI(JSON.parse(savedCart));
    }
});

function updateCartUI(cartItems) {
    const cartWrap = document.querySelector('.header-cart-wrapitem');
    cartWrap.innerHTML = ''; 

    cartItems.forEach(item => {
        console.log('Cart Item:', item); // Log each item to check its structure
        const listItem = `
            <li class="header-cart-item flex-w flex-t m-b-12">
                <div class="header-cart-item-img">
                    <img src="/images/${item.image}" alt="${item.name}">
                </div>
                <div class="header-cart-item-txt p-t-8">
                    <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                        ${item.name}
                    </a>
                    <span class="header-cart-item-info">
                        ${item.quantity} x ${item.price}
                    </span>
                </div>
            </li>
        `;
        cartWrap.insertAdjacentHTML('beforeend', listItem);
    });

    updateCartNotify(cartItems);
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    document.querySelector('.header-cart-total').textContent = `Tổng: $${total}`;
}

function updateCartNotify(cartItems) {
    const cartNotify = document.querySelector('.icon-header-noti');
    cartNotify.setAttribute('data-notify', cartItems.length);
}

const cartItems = [
    { name: "White Shirt Pleat", quantity: 2, price: 19.00, image: "https://placehold.co/100x140" },
    { name: "Converse All Star", quantity: 1, price: 39.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100x140" }
];

