document.addEventListener("DOMContentLoaded", async function () {
    const links = {
        'home': "../Dashboard/index.html",
        'products': "../Products/index.html",
        'orders': "../Orders/index.html",
        'customers': "../Customers/index.html",
        'analysis': "../Analysis/index.html",
        'settings': "../Settings/index.html",
        'subscription plan': "../Subscription Plan/index.html",
        'shop': "Shop/index.html",
        'contact': "Contact/index.html"
    };

    const loadingOverlay = document.getElementById('loading-overlay');
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
        alert("User is not logged in. Redirecting to login page.");
        window.location.href = "../Login/index.html";
        return;
    }

    // ✅ Always fetch email verification status from the database
    try {
        const response = await fetch(`http://localhost:5000/user/${userEmail}`);
        const data = await response.json();

        if (!data || !data.emailVerified) {
            alert("Please verify your email to access this page.");
            window.location.href = "../VerifyEmail/index.html";
            return;
        }

    } catch (error) {
        console.error("❌ Error fetching user verification status:", error);
        alert("An error occurred while verifying your email.");
        window.location.href = "../Login/index.html";
        return;
    }

    console.log("✅ Email is verified. Proceeding...");

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

    // **🔹 Fetch Trial Status from Server**
    async function fetchTrialStatus() {
        if (!userEmail) return;

        try {
            const response = await fetch(`http://localhost:5000/check-trial-status/${userEmail}`);
            const data = await response.json();

            if (data.trialExpired) {
                alert("🚫 Your trial period has expired. Please upgrade.");
                window.location.href = "../Trial Expired/index.html";
            } else {
                updateTrialCountdown(new Date(data.trialEndsAt));
            }
        } catch (error) {
            console.error("❌ Error checking trial status:", error);
        }
    }

    // **🔹 Update the Trial Countdown in Real-Time**
    function updateTrialCountdown(trialEndDate) {
        const trialStatusElement = document.getElementById('trial-status');
        if (!trialStatusElement) return;

        function updateCountdown() {
            const currentDate = new Date();
            const timeLeft = trialEndDate - currentDate;
            const daysRemaining = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

            if (daysRemaining <= 0) {
                trialStatusElement.innerHTML = `<p>🚫 Your free trial has expired!</p>`;
                window.location.href = "../Trial Expired/index.html";
            } else {
                trialStatusElement.innerHTML = `
                    <p>🚀 Your free trial ends in <strong>${daysRemaining} day(s)</strong>. Upgrade now to unlock all features!</p>
                    <button id="subscribeBtn" class="subscribe-btn">Subscribe</button>
                    <button id="close-trial-status" class="close-btn">✖</button>
                `;
                setupTrialCloseButton();
                document.getElementById('subscribeBtn').addEventListener('click', function () {
                    window.location.href = "../Subscription Plan/index.html";
                });
            }
        }

        updateCountdown();
        setInterval(updateCountdown, 1000 * 60 * 60);
    }

    // **🔹 Show Trial Ad (Appears Every 1 Hour)**
    function showTrialAd() {
        let trialAd = document.getElementById("trial-status");
        if (trialAd) {
            trialAd.classList.add("show");
            setTimeout(() => {
                trialAd.classList.remove("show");
            }, 10000);
        }
    }

    function scheduleAd() {
        showTrialAd();
        setInterval(showTrialAd, 60 * 60 * 1000);
    }

    // **🔹 Close Trial Status Message**
    function setupTrialCloseButton() {
        const closeBtn = document.getElementById("close-trial-status");
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                const trialStatus = document.getElementById("trial-status");
                if (trialStatus) {
                    trialStatus.classList.remove("show");
                }
            });
        }
    }

    // **🔹 Initialize Functions on Page Load**
    fetchTrialStatus().then(scheduleAd);
});
