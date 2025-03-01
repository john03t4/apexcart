// Function to get query parameters from URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fetch and Display Product Details
async function displayProductDetails() {
    const productId = getQueryParam('productId');
    if (!productId) {
        document.getElementById('productDetails').innerHTML = '<p>❌ Product ID not found.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/get-product/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product details');

        const product = await response.json();

        if (!product || product.message) {
            document.getElementById('productDetails').innerHTML = '<p>❌ Product not found.</p>';
            return;
        }

        document.getElementById('productDetails').innerHTML = `
            <div class="product-item">
                <img class="product-image" src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h2 class="product-title">${product.name}</h2>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-description">${product.description}</p>
                </div>
                <button class="buy-now" onclick="placeOrderFromShop('${product.name}', ${product.price})">Buy Now</button>
            </div>
        `;
    } catch (error) {
        console.error('❌ Error loading product details:', error);
        document.getElementById('productDetails').innerHTML = '<p>❌ Error loading product details.</p>';
    }
}

// Run function when the page loads
document.addEventListener('DOMContentLoaded', displayProductDetails);

// Go back function
function goBack() {
    window.history.back();
}
