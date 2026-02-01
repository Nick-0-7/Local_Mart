// Shopping Cart Management using localStorage

const CART_KEY = 'localmart_cart';

// Get cart from localStorage
export function getCart() {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add item to cart
export function addToCart(product, quantity = 1) {
    const cart = getCart();

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            quantity: quantity
        });
    }

    saveCart(cart);
    updateCartBadge();
    return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartBadge();
    return cart;
}

// Update item quantity
export function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        item.quantity = quantity;
        saveCart(cart);
    }

    return cart;
}

// Get cart total
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
export function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
export function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartBadge();
}

// Update cart badge in navbar
export function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const count = getCartItemCount();
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline' : 'none';
    }
}
