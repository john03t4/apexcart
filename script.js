// JavaScript to handle the Add to Cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');

addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        alert('Product added to cart!');
    });
});
// Get the loading overlay element
const loadingOverlay = document.getElementById('loading-overlay');

// Handle the login link click (if there's a login link to handle)
const loginLink = document.getElementById('login-link');

if (loginLink && loadingOverlay) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent the default link behavior
        loadingOverlay.classList.add('active'); // Show the loading overlay

        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'auth/Login/index.html'; // Change to your login page
        }, 2000);
    });
} else {
    console.error('Login link or loading overlay not found.');
}
// Handle the Signup Link Click
const signupLink = document.getElementById('signup-link');
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        setTimeout(() => {
            window.location.href = 'auth/Signup/index.html';
        }, 2000);
    });
}

// ✅ Password toggle functionality
const passwordToggle = document.getElementById('toggle-password');
if (passwordToggle) {
    passwordToggle.addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                passwordInput.type = 'password';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            }
        } else {
            console.error('❌ Password input field not found.');
        }
    });
} else {
    console.error('❌ Password toggle button not found.');
}