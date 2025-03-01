document.addEventListener("DOMContentLoaded", async function () {
    const loadingOverlay = document.getElementById("loadingOverlay");
    const userEmail = localStorage.getItem("userEmail");

    // Show loading overlay until user data is fetched
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }

    if (!userEmail) {
        alert("User is not logged in. Redirecting to login page.");
        window.location.href = "../Login/index.html";
        return;
    }

    try {
        // Fetch user info from the server
        const response = await fetch(`http://localhost:5000/user/${userEmail}`);
        if (!response.ok) {
            throw new Error("User not found");
        }
        const data = await response.json();

        if (data && data.name && data.email) {
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);

            // Handle Profile Information
            const userNameElement = document.getElementById("user-name");
            const userEmailElement = document.getElementById("user-email");
            const profilePicElement = document.getElementById("profile-picture");

            if (userNameElement) {
                const span = userNameElement.querySelector("span");
                if (span) span.textContent = data.name;
            }

            if (userEmailElement) {
                const span = userEmailElement.querySelector("span");
                if (span) span.textContent = data.email;
            }

            // Handle Profile Picture
            let storedProfilePic = localStorage.getItem("profilePicture");
            if (profilePicElement) {
                if (storedProfilePic) {
                    profilePicElement.src = storedProfilePic;
                } else if (data.profilePicture) {
                    profilePicElement.src = data.profilePicture;
                    localStorage.setItem("profilePicture", data.profilePicture);
                } else {
                    profilePicElement.src = "../images/default-profile.png"; // Default profile picture
                }
            }

            // Hide the loading overlay after successful data fetch
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
        } else {
            alert("User data not found. Redirecting to login.");
            window.location.href = "../Login/index.html";
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
        alert("An error occurred while fetching user data.");
        window.location.href = "../Login/index.html";
    }

    // **🔹 Logout function**
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async function () {
            try {
                const logoutResponse = await fetch("http://localhost:5000/logout", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: userEmail })
                });

                if (!logoutResponse.ok) {
                    throw new Error("Logout failed");
                }

                const logoutData = await logoutResponse.json();
                alert(logoutData.message);

                // **✅ Remove user data from localStorage only after successful logout**
                localStorage.removeItem("userEmail");
                localStorage.removeItem("userName");
                localStorage.removeItem("profilePicture");

                // **✅ Redirect to login**
                window.location.href = "../Login/index.html";
            } catch (error) {
                console.error("❌ Error during logout:", error);
                alert("An error occurred during logout");
            }
        });
    }

    // **🔹 Fetch and Update the Welcome Message**
    const userName = localStorage.getItem("userName") || "Store Owner";
    const welcomeMessage = document.querySelector(".welcome-message h1");
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome, ${userName}!`;
    }
});
