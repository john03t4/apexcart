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

document.addEventListener("DOMContentLoaded", function () {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

    function toggleVisibility(input, icon) {
        icon.addEventListener("click", function () {
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            }
        });
    }

    if (togglePassword && newPasswordInput) {
        toggleVisibility(newPasswordInput, togglePassword);
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleVisibility(confirmPasswordInput, toggleConfirmPassword);
    }
});