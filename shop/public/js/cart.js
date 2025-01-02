document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.js-add-to-cart');
    updateCartUI(cartItems);
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = '<%= product.id %>'; 
            const quantity = document.querySelector('input[name="num-product"]').value;

            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ productId, quantity }),
                });

                if (!response.ok) {
                    throw new Error('Failed to add to cart');
                }

                const data = await response.json();

                updateCartUI(data.cart);
            } catch (error) {
                console.error(error);
                alert('Something went wrong. Please try again.');
            }
        });
    });
});

// function updateCartUI(cart) {
//     const cartElement = document.querySelector('#cart'); 

//     cartElement.innerHTML = '';

//     cart.items.forEach(item => {
//         const cartItem = `
//             <div class="cart-item">
//                 <img src="/images/${item.image}" alt="${item.name}" class="cart-item-img">
//                 <span class="cart-item-name">${item.name}</span>
//                 <span class="cart-item-quantity">${item.quantity}</span>
//                 <span class="cart-item-price">${item.price}</span>
//             </div>
//         `;
//         cartElement.insertAdjacentHTML('beforeend', cartItem);
//     });

//     document.querySelector('#cart-total').textContent = `Total: ${cart.totalPrice}`;
// }

const cartItems = [
    { name: "White Shirt Pleat", quantity: 2, price: 19.00, image: "https://placehold.co/100" },
    { name: "Converse All Star", quantity: 1, price: 39.00, image: "https://placehold.co/100" },
    { name: "Nixon Porter Leather", quantity: 1, price: 17.00, image: "https://placehold.co/100" }
];

function updateCartUI(cartItems) {
    const cartWrap = document.querySelector('.header-cart-wrapitem');
    cartWrap.innerHTML = ''; 


    cartItems.forEach(item => {
        const listItem = `
            <li class="header-cart-item flex-w flex-t m-b-12">
                <div class="header-cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="header-cart-item-txt p-t-8">
                    <a href="#" class="header-cart-item-name m-b-18 hov-cl1 trans-04">
                        ${item.name}
                    </a>
                    <span class="header-cart-item-info">
                        ${item.quantity} x $${item.price.toFixed(2)}
                    </span>
                </div>
            </li>
        `;
        cartWrap.insertAdjacentHTML('beforeend', listItem);
    });

    // Update total
    updateCartNotify(cartItems);
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    document.querySelector('.header-cart-total').textContent = `Tổng: $${total.toFixed(2)}`;
}

function updateCartNotify(cartItems) {
    const cartNotify = document.querySelector('.icon-header-noti');
    cartNotify.setAttribute('data-notify', cartItems.length);
}

