document.addEventListener("DOMContentLoaded", function () {
    // Get required elements
    const tokenForm = document.getElementById('token-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    const resetTokenInput = document.getElementById('reset-token');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const resetBtn = document.getElementById('reset-btn');

    const lengthReq = document.getElementById('length-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');

    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');

    // Password validation regex
    const passwordRegex = {
        length: /.{7,}/,
        uppercase: /[A-Z]/,
        number: /\d/,
        special: /[!@#$%^&*]/,
    };

    function validatePassword() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check each condition and update UI
        lengthReq.innerHTML = passwordRegex.length.test(password) ? "✔️ At least 7 characters" : "❌ At least 7 characters";
        uppercaseReq.innerHTML = passwordRegex.uppercase.test(password) ? "✔️ One uppercase letter (A-Z)" : "❌ One uppercase letter (A-Z)";
        numberReq.innerHTML = passwordRegex.number.test(password) ? "✔️ One number (0-9)" : "❌ One number (0-9)";
        specialReq.innerHTML = passwordRegex.special.test(password) ? "✔️ One special character (!@#$%^&*)" : "❌ One special character (!@#$%^&*)";

        // Enable button only if all conditions are met and passwords match
        const allValid = Object.values(passwordRegex).every(regex => regex.test(password));
        resetBtn.disabled = !(allValid && password === confirmPassword);
    }

    // Toggle password visibility
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

    // Event listener for password validation
    newPasswordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);
});