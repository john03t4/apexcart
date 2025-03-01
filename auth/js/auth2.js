document.addEventListener("DOMContentLoaded", function () {
    // Password toggle functionality

    const confirmPasswordToggle = document.getElementById("toggle-confirm-password");
    const confirmPasswordInput = document.getElementById("confirm-password");


    if (confirmPasswordToggle && confirmPasswordInput) {
        confirmPasswordToggle.addEventListener("click", function () {
            const isHidden = confirmPasswordInput.type === "password";
            confirmPasswordInput.type = isHidden ? "text" : "password";
            this.classList.toggle("fa-eye-slash", !isHidden);
            this.classList.toggle("fa-eye", isHidden);
        });
    }
});
