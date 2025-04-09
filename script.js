// Price configuration
const prices = {
    sizes: { S: 30, M: 75, L: 150 },
    toppings: {
        P: 2, M: 5.5, O: 7, B: 10.5, PA: 3.75, H: 15, S: 10
    }
};

// Cart state
let cart = [];

// Wait for DOM to load before accessing elements
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const placeOrderBtn = document.getElementById('placeOrder');
    const viewCartBtn = document.getElementById('viewCart');
    const clearCartBtn = document.getElementById('clearCart');
    const orderSummaryText = document.getElementById('orderSummaryText');
    const cartContents = document.getElementById('cartContents');
    const currentPriceDisplay = document.getElementById('currentPrice');
    const sizeInputs = document.querySelectorAll('input[name="size"]');
    const toppingInputs = document.querySelectorAll('input[name="topping"]');

    // Verify elements exist before adding event listeners
    if (placeOrderBtn && viewCartBtn && clearCartBtn) {
        // Button events
        placeOrderBtn.addEventListener('click', addToCart);
        viewCartBtn.addEventListener('click', showCart);
        clearCartBtn.addEventListener('click', clearCart);
    } else {
        console.error("One or more buttons not found!");
    }

    // Input events
    sizeInputs.forEach(input => input.addEventListener('change', updateCurrentPrice));
    toppingInputs.forEach(input => input.addEventListener('change', updateCurrentPrice));

    // Initialize price display
    updateCurrentPrice();

    function updateCurrentPrice() {
        const sizeInput = document.querySelector('input[name="size"]:checked');
        if (!sizeInput) {
            currentPriceDisplay.textContent = `Current Price: R0.00`;
            return; // Exit if no size is selected
        }
    
        const size = sizeInput.value;
        let total = prices.sizes[size];
    
        document.querySelectorAll('input[name="topping"]:checked').forEach(input => {
            total += prices.toppings[input.value];
        });
    
        currentPriceDisplay.textContent = `Current Price: R${total.toFixed(2)}`;
    }
    

    function addToCart() {
        const size = document.querySelector('input[name="size"]:checked').value;
        const toppings = [];
        
        document.querySelectorAll('input[name="topping"]:checked').forEach(input => {
            toppings.push({
                code: input.value,
                name: getToppingName(input.value),
                price: prices.toppings[input.value]
            });
        });
        
        const pizza = {
            size: size,
            sizeName: getSizeName(size),
            sizePrice: prices.sizes[size],
            toppings: toppings,
            totalPrice: prices.sizes[size] + toppings.reduce((sum, t) => sum + t.price, 0)
        };
        
        cart.push(pizza);
        updateOrderSummary();
        alert('Pizza added to cart!');
    }

    function showCart() {
        if (cart.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.totalPrice;
            const toppingsText = item.toppings.length > 0 
                ? `with ${item.toppings.map(t => t.name).join(', ')}` 
                : 'no toppings';
            
            html += `
                <div class="cart-item">
                    <strong>${item.sizeName} Pizza</strong> ${toppingsText} - R${item.totalPrice.toFixed(2)}
                </div>
            `;
        });
        
        html += `<div style="margin-top: 10px;"><strong>Total: R${total.toFixed(2)}</strong></div>`;
        cartContents.innerHTML = html;
    }

    function clearCart() {
        if (confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            updateOrderSummary();
            cartContents.innerHTML = '';
        }
    }

    function updateOrderSummary() {
        const itemCount = cart.length;
        const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
        
        orderSummaryText.textContent = itemCount === 0 
            ? 'Your cart is empty' 
            : `You have ${itemCount} item(s) in cart. Total: R${total.toFixed(2)}`;
    }

    function getSizeName(size) {
        const names = { S: 'Small', M: 'Medium', L: 'Large' };
        return names[size];
    }
    
    function getToppingName(code) {
        const names = {
            P: 'Pepperoni', M: 'Mushrooms', O: 'Olives',
            B: 'Bacon', PA: 'Pineapples', H: 'Ham', S: 'BBQ Sauce'
        };
        return names[code];
    }
});