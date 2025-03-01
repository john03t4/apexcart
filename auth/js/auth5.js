let selectedProducts = [];

// **🔹 Fetch user's email from localStorage**
function getUserEmail() {
    return localStorage.getItem('userEmail') || null;
}

// **🔹 Fetch products from the server**
async function fetchProducts() {
    const email = getUserEmail();
    if (!email) {
        console.error("❌ No email found in localStorage.");
        return [];
    }

    try {
        const response = await fetch(`http://localhost:5000/get-products/${email}`);
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

// **🔹 Display products on the page**
async function displayProducts() {
    const email = getUserEmail();
    if (!email) {
        alert('❌ No email found. Please log in.');
        setTimeout(() => {
            window.location.href = '../Login/index.html';
        }, 3000); 
        return;
    }

    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = 'Loading products...';

    const products = await fetchProducts();
    
    productGrid.innerHTML = '';

    // Loop through products and display them
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.addEventListener('click', () => toggleProductSelection(index));

        // Dynamically check if the product is in the store
        const inStore = product.inStore;  // Check 'inStore' directly from the product object
        if (inStore) {
            productCard.classList.add('in-store');
        }

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-details">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <p>Description: ${product.description}</p>
            </div>
            <div class="button-group">
                <button onclick="editProduct(${index})">Edit</button>
                <button onclick="deleteProduct(${index})">Delete</button>
                <button onclick="addToStore(${product.id})" ${inStore ? 'disabled' : ''}>Add to Store</button>
                <button onclick="removeFromStore(${product.id})" ${!inStore ? 'disabled' : ''}>Remove from Store</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    document.getElementById('deleteSelectedBtn').style.display = selectedProducts.length > 0 ? 'block' : 'none';
}


async function addToStore(productId) {
    const userEmail = getUserEmail();  // Get the user email from localStorage
    if (!userEmail) {
        alert('❌ User email not found. Please log in again.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/add-to-store', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, email: userEmail })  // Send the correct data
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);  // Success message
            displayProducts();  // Refresh the UI immediately
        } else {
            alert(data.message);  // Error message
        }
    } catch (error) {
        console.error('❌ Something went wrong:', error);
        alert('❌ Something went wrong. Please try again.');
    }
}


async function removeFromStore(productId) {
    const userEmail = getUserEmail();
    if (!userEmail) {
        alert('❌ User email not found. Please log in again.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/remove-from-store', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, email: userEmail })
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);  // Success message
            displayProducts();  // Refresh the UI immediately
        } else {
            alert(data.message);  // Error message
        }
    } catch (error) {
        alert('❌ Something went wrong. Please try again.');
    }
}





// **🔹 Edit product details**
async function editProduct(index) {
    const products = await fetchProducts();
    const product = products[index];
    const email = getUserEmail();

    const newName = prompt("Edit product name:", product.name);
    const newPrice = prompt("Edit product price:", product.price);
    const newImage = prompt("Edit product image URL:", product.image);
    const newDescription = prompt("Edit product description:", product.description);

    if (newName && newPrice && newImage && newDescription) {
        const updatedProduct = {
            email,
            productId: product.id,  // Send `id` instead of `name`
            name: newName,
            price: parseFloat(newPrice),
            image: newImage,
            description: newDescription
        };

        try {
            const response = await fetch('http://localhost:5000/edit-product', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            const data = await response.json();
            alert(`${updatedProduct.name} has been updated successfully!`);
            displayProducts();
        } catch (error) {
            console.error("❌ Error editing product:", error);
        }
    }
}

// **🔹 Delete product**
async function deleteProduct(index) {
    const products = await fetchProducts();
    const productToDelete = products[index];
    const email = getUserEmail();

    try {
        const response = await fetch('http://localhost:5000/delete-product', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, productId: productToDelete.id })
        });
        const data = await response.json();
        alert(`${productToDelete.name} has been deleted successfully!`);
        displayProducts();
    } catch (error) {
        console.error("❌ Error deleting product:", error);
    }
}

// **🔹 Toggle product selection**
function toggleProductSelection(index) {
    if (selectedProducts.includes(index)) {
        selectedProducts = selectedProducts.filter(i => i !== index);
    } else {
        selectedProducts.push(index);
    }
    displayProducts();
}

// **🔹 Delete selected products**
async function deleteSelectedProducts() {
    const products = await fetchProducts();
    const email = getUserEmail();

    try {
        for (let index of selectedProducts) {
            const productToDelete = products[index];

            await fetch('http://localhost:5000/delete-product', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, productId: productToDelete.id })
            });
        }

        alert("✅ Selected products have been deleted.");
        selectedProducts = [];
        displayProducts();
    } catch (error) {
        console.error("❌ Error deleting selected products:", error);
    }
}

// **🔹 Toggle Add Product Form**
function showAddProductForm() {
    const form = document.getElementById('addProductForm');
    const addButton = document.getElementById('toggleAddProductBtn'); // Target the button

    if (form.style.display === 'block') {
        form.style.display = 'none';  // Hide form
        addButton.innerText = 'Add Product';  // Change button text back
    } else {
        form.style.display = 'block'; // Show form
        addButton.innerText = 'Cancel';  // Change button text to Cancel
    }
}

// **🔹 Auto-load products when the page loads**
window.onload = () => {
    displayProducts();
    
    // Ensure Add Product button has event listener
    const addProductBtn = document.getElementById('toggleAddProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductForm);
    }
};


// Frontend code to submit product data
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value.trim());
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();

    if (!name || !price || !image || !description) {
        alert("❌ Please fill in all the fields.");
        return;
    }

    const email = localStorage.getItem("userEmail"); // Assuming email is stored in localStorage

    const newProduct = { name, price, image, description, email };

    try {
        const response = await fetch('http://localhost:5000/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`${data.product.name} has been added successfully!`);
            displayProducts();  // Refresh the product list after adding

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000); // Redirect after 2 seconds (adjustable)
        } else {
            alert(`❌ ${data.message}`);
        }
    } catch (error) {
        console.error("❌ Error adding product:", error);
    }
});


// **🔹 Auto-load products when the page loads**
window.onload = displayProducts;
