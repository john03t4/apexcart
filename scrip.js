document.addEventListener("DOMContentLoaded", async function () {
    const links = {
        'shop': "Shop/index.html",
        'contact': "Contact/index.html"
    };

    const loadingOverlay = document.getElementById('loading-overlay');

    // Handle Navigation Links with Loading Effect
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            if (target && links[target]) {
                if (loadingOverlay) loadingOverlay.classList.add('active');
                setTimeout(() => {
                    window.location.href = links[target];
                }, 2000);
            }
        });
    });
});
