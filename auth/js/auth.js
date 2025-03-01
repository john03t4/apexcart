// Declare elements once to avoid duplication
const forgotPasswordForm = document.getElementById('forgot-password-form');
const loadingOverlay = document.getElementById('loading-overlay');
const tokenForm = document.getElementById('token-form');
const newPasswordForm = document.getElementById('reset-password-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const loginForm = document.getElementById('login-form');

// Handle the Signup Link Click
const signupLink = document.getElementById('signup-link');
if (signupLink) {
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        setTimeout(() => {
            window.location.href = '../Signup/index.html';
        }, 2000);
    });
}

// Handle the Forgot Password Link Click
const forgotPasswordLink = document.getElementById('forgot-password-link');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        setTimeout(() => {
            window.location.href = '../Forgot Password/index.html';
        }, 2000);
    });
}

// Handle Back to Login Click
const backToLoginLink = document.getElementById('back-to-login');
if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
        setTimeout(() => {
            window.location.href = '../Login/index.html';
        }, 2000);
    });
}

// Handle Login Form Submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(loginForm);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            loadingOverlay.classList.remove('active');

            if (response.ok) {
                alert(result.message);
                loginForm.reset();
                setTimeout(() => {
                    window.location.href = '../Dashboard/index.html';
                },2000);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred while logging in. Please try again.');
            loadingOverlay.classList.remove('active');
        }
    });
} else {
    console.error('Login form not found.');
}

// Handle the Forgotten Password Form Submit
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-password-email').value;

        if (!email) {
            alert("Please enter your email address.");
            return;
        }

        localStorage.setItem('resetEmail', email);
        loadingOverlay.style.display = 'block';

        try {
            const response = await fetch('http://localhost:5000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            loadingOverlay.style.display = 'none';

            if (response.ok) {
                alert(result.message);
                alert("Check your email for the token.");
                window.location.href = '../Reset Password/index.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            loadingOverlay.style.display = 'none';
        }
    });
}

// Handle Token Verification
if (tokenForm) {
    tokenForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const token = document.getElementById('reset-token').value.trim();
        const email = localStorage.getItem('resetEmail');

        if (!token) {
            alert("Please enter a valid token.");
            return;
        }

        loadingOverlay.style.display = 'block';

        try {
            const response = await fetch('http://localhost:5000/verify-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token }),
            });

            const result = await response.json();
            loadingOverlay.style.display = 'none';

            if (response.ok) {
                alert(result.message);
                tokenForm.style.display = 'none';
                newPasswordForm.style.display = 'block';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            loadingOverlay.style.display = 'none';
        }
    });
}

// Handle Password Reset Submission
if (resetPasswordForm) {
    resetPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        const token = document.getElementById('reset-token').value.trim();
        const email = localStorage.getItem('resetEmail');

        if (!newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        loadingOverlay.style.display = 'block';

        try {
            const response = await fetch('http://localhost:5000/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, token, newPassword }),
            });

            const result = await response.json();
            loadingOverlay.style.display = 'none';

            if (response.ok) {
                alert(result.message);
                window.location.href = '../Login/index.html';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            loadingOverlay.style.display = 'none';
        }
    });
}

