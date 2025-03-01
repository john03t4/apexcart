document.addEventListener("DOMContentLoaded", function () {
    // Get required elements
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const togglePassword = document.getElementById('toggle-password');
    const toggleConfirmPassword = document.getElementById('toggle-confirm-password');
    const signupBtn = document.getElementById('signup-btn');

    const lengthReq = document.getElementById('length-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const numberReq = document.getElementById('number-req');
    const specialReq = document.getElementById('special-req');

    // Password validation regex
    const passwordRegex = {
        length: /.{7,}/,
        uppercase: /[A-Z]/,
        number: /\d/,
        special: /[!@#$%^&*]/
    };

    function validatePassword() {
        const password = passwordInput.value;

        // Check each condition and update UI
        lengthReq.innerHTML = passwordRegex.length.test(password) ? "✔️ At least 7 characters" : "❌ At least 7 characters";
        uppercaseReq.innerHTML = passwordRegex.uppercase.test(password) ? "✔️ One uppercase letter (A-Z)" : "❌ One uppercase letter (A-Z)";
        numberReq.innerHTML = passwordRegex.number.test(password) ? "✔️ One number (0-9)" : "❌ One number (0-9)";
        specialReq.innerHTML = passwordRegex.special.test(password) ? "✔️ One special character (!@#$%^&*)" : "❌ One special character (!@#$%^&*)";

        // Enable button only if all conditions are met
        const allValid = Object.values(passwordRegex).every(regex => regex.test(password));
        signupBtn.disabled = !allValid;
    }


    // Attach event listeners
    if (passwordInput) passwordInput.addEventListener("input", validatePassword);
    if (confirmPasswordInput) confirmPasswordInput.addEventListener("input", validatePassword);

    if (togglePassword) togglePasswordVisibility(passwordInput, togglePassword);
    if (toggleConfirmPassword) togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword);
});