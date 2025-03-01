// Fetch and Display Products from Shop
async function displayShopProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear previous products

    try {
        const response = await fetch('http://localhost:5000/shop-products');
        if (!response.ok) throw new Error('Failed to fetch products');

        const products = await response.json();

        if (!products || products.length === 0) {
            productList.innerHTML = '<p>No products available in the shop.</p>';
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product');
            productCard.setAttribute('data-product-id', product.productId);

            productCard.innerHTML = `
                <div class="product-item">
                    <img class="product-image" src="${product.image}" alt="${product.name}">
                    <div class="product-details">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <p class="product-description">${product.description}</p>
                    </div>
                    <button class="buy-now" onclick="placeOrderFromShop('${product.productId}')">Buy Now</button>
                </div>
            `;

            // ✅ Add Click Event to Redirect to Product Page
            productCard.addEventListener('click', () => {
                window.location.href = `../Product/index.html?productId=${product.productId}`;
            });

            productList.appendChild(productCard);
        });

    } catch (error) {
        console.error('❌ Error loading products:', error);
        productList.innerHTML = '<p>Error loading products.</p>';
    }
}

// Run function when the page loads
document.addEventListener('DOMContentLoaded', displayShopProducts);
