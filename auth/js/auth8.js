async function displayMainStoreProducts() {
    const mainStoreProductGrid = document.getElementById('mainStoreProductGrid');
    mainStoreProductGrid.innerHTML = ''; 

    try {
        const searchTerm = document.getElementById('searchBar').value.toLowerCase();
        const email = localStorage.getItem('userEmail');

        if (!email) {
            console.error("❌ No email found. User is not logged in.");
            mainStoreProductGrid.innerHTML = '<p>Please log in to view products.</p>';
            return;
        }

        // ✅ Fetch `inStore` products
        const response = await fetch(`http://localhost:5000/store-products`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-user-email': email }
        });

        if (!response.ok) {
            throw new Error(`Server error: ${await response.text()}`);
        }

        const storeProducts = await response.json();

        // ✅ Fetch `inShop` products from the global shop
        const shopResponse = await fetch(`http://localhost:5000/shop-products`);
        const shopProducts = await shopResponse.json();
        const shopProductIds = new Set(shopProducts.map(p => p.productId));

        const filteredProducts = storeProducts.filter(product => product.name.toLowerCase().includes(searchTerm));

        if (filteredProducts.length === 0) {
            mainStoreProductGrid.innerHTML = '<p>No available products</p>';
            return;
        }

        filteredProducts.forEach(product => {
            const isInShop = shopProductIds.has(product.productId);

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <p>${product.description}</p>
                ${!isInShop ? `<button1 id="toggle-btn-${product.productId}" class="toggle-shop-btn" onclick="toggleProductInShop('${product.productId}', '${email}', false)">Add to Shop</button1>` : `<button1 id="toggle-btn-${product.productId}" class="toggle-shop-btn remove" onclick="toggleProductInShop('${product.productId}', '${email}', true)">Remove from Shop</button1>`}
            `;
            mainStoreProductGrid.appendChild(productCard);
        });
    } catch (error) {
        console.error("❌ Error loading products:", error);
        mainStoreProductGrid.innerHTML = `<p>Error loading products: ${error.message}</p>`;
    }
}

// ✅ Toggle Product in Shop (Add or Remove)
async function toggleProductInShop(productId, email, inShop) {
    const endpoint = inShop ? '/remove-from-shop' : '/add-to-shop';
    const action = inShop ? "Removing from" : "Adding to";

    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-email': email },
            body: JSON.stringify({ productId })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }

        console.log(`✅ ${action} shop successful:`, result);

        // ✅ Update Button Text Dynamically
        const button = document.getElementById(`toggle-btn-${productId}`);
        if (button) {
            if (inShop) {
                button.textContent = "Add to Shop";
                button.classList.remove("remove");
                button.setAttribute("onclick", `toggleProductInShop('${productId}', '${email}', false)`);
            } else {
                button.textContent = "Remove from Shop";
                button.classList.add("remove");
                button.setAttribute("onclick", `toggleProductInShop('${productId}', '${email}', true)`);
            }
        }
    } catch (error) {
        console.error(`❌ Error ${action.toLowerCase()} shop:`, error);
        alert(`Error ${action.toLowerCase()} shop: ${error.message}`);
    }
}



// ✅ Open modal to show product details
function openProductInfoModal(product) {
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productImage').src = product.image;
    document.getElementById('productPrice').textContent = `$${product.price}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productInfoModal').style.display = 'block';
}

// ✅ Close modal when clicking outside or pressing a close button
function closeProductInfoModal() {
    document.getElementById('productInfoModal').style.display = 'none';
}

// Optionally: close modal if the user clicks outside of it (good UX)
window.onclick = function(event) {
    const modal = document.getElementById('productInfoModal');
    if (event.target === modal) {
        closeProductInfoModal();
    }
};

// ✅ Initialize product display and handle search input
document.addEventListener('DOMContentLoaded', displayMainStoreProducts);
document.getElementById('searchBar').addEventListener('input', displayMainStoreProducts);

// ✅ Close Store Page and Redirect
function closeStorePage() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex'; // Make it visible
        loadingOverlay.classList.add('active'); // Add active class for styling
    }
    setTimeout(() => {
        window.location.href = '../Products/index.html';
    }, 3000); // 3-second delay (adjustable)
}

document.addEventListener('DOMContentLoaded', function () {
    const closeBtn = document.getElementById('close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeStorePage);
    }
});
