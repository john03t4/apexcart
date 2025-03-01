// Admin Dashboard to show online users
const showOnlineUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/admin/dashboard', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            if (data.onlineUsers) {
                console.log('Online Users:', data.onlineUsers);
                displayOnlineUsers(data.onlineUsers);
            }
        } else {
            alert('Failed to fetch online users');
        }
    } catch (error) {
        console.error('Error fetching online users:', error);
    }
};

// Display online users in the UI
const displayOnlineUsers = (users) => {
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear the list before adding new users

    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.classList.add(user.status); // Add 'online' or 'offline' class

        userItem.textContent = `${user.fullName} (${user.email})`;
        userList.appendChild(userItem);
    });
};

// Call the function to show online users when the page loads
window.onload = showOnlineUsers;

// Admin login handler
const adminLogin = async () => {
    const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
    });

    if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('adminToken', data.token);
        console.log("Admin logged in!");
        window.location.href = '/admin/dashboard.html'; // Redirect to the dashboard
    } else {
        const result = await response.json();
        alert(result.message);
    }
};


// Logout function
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', async () => {
  const response = await fetch('http://localhost:5000/logout', {
    method: 'POST',
  });

  const result = await response.json();
  alert(result.message);
});
