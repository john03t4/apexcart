// Get elements
const loadingOverlay = document.getElementById('loading-overlay');
const loginLink = document.getElementById('login-link');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const passwordToggle = document.getElementById('toggle-password');

// ✅ Handle the login link click
if (loginLink && loadingOverlay) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadingOverlay.classList.add('active'); // Show loading overlay

        setTimeout(() => {
            window.location.href = '../Login/index.html';
        }, 2000);
    });
} else {
    console.error('❌ Login link or loading overlay not found.');
}

 // ✅ Handle the signup form submission
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get form values
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');

        if (!fullNameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
            console.error("❌ One or more input fields not found.");
            return;
        }

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Password validation regex
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{7,}$/;

        // Check if all fields are filled
        if (!fullName || !email || !password || !confirmPassword) {
            alert("⚠️ All fields are required");
            return;
        }

        // Check if password meets criteria
        if (!passwordRegex.test(password)) {
            alert("⚠️ Password must be at least 7 characters long, include a capital letter, a number, and a special character (!@#$%^&*).");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("⚠️ Passwords do not match");
            return;
        }

        // Show loading overlay
        if (loadingOverlay) loadingOverlay.classList.add('active');

        try {
            const response = await fetch('https://server-6chz.onrender.com/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                registerForm.reset(); // Reset the form after successful registration

                // Keep loading overlay active before redirecting
                setTimeout(() => {
                    window.location.href = '../Login/index.html';
                }, 3000); // Delay redirection for 3 seconds (adjustable)
            } else {
                alert(result.message);
                if (loadingOverlay) loadingOverlay.classList.remove('active'); // Hide overlay if registration fails
            }
        } catch (error) {
            if (loadingOverlay) loadingOverlay.classList.remove('active');
            console.error("❌ Error during registration:", error);
            alert("❌ An error occurred, please try again later.");
        }
    });
} else {
    console.error('❌ Registration form not found.');
}

// ✅ Handle login form submission 
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value.trim();

        if (!email || !password) {
            alert("⚠️ Email and password are required");
            return;
        }

        if (loadingOverlay) loadingOverlay.classList.add('active');

        try {
            const response = await fetch('https://server-6chz.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);

                // Store the email in localStorage
                localStorage.setItem('userEmail', email);

                loginForm.reset();

                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = '../Dashboard/index.html';
                }, 2000);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            alert('❌ An error occurred while logging in. Please try again.');
        } finally {
            if (loadingOverlay) loadingOverlay.classList.remove('active'); // Correcting the overlay behavior
        }
    });
} else {
    console.error('❌ Login form not found.');
}






// ✅ Password toggle functionality
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

