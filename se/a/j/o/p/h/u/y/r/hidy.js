async function fetchUsers() {
    try {
        const response = await fetch('https://server-6chz.onrender.com/admin/dashboard');
        const data = await response.json();

        const userList = document.getElementById('user-list');
        userList.innerHTML = '';

        if (data.users && data.users.length > 0) {
            data.users.forEach(user => {
                const row = document.createElement('tr');

                // Mask password initially
                const hiddenPassword = '••••••••';

                row.innerHTML = `
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                    <td>
                        <div class="password-container">
                            <span class="password" data-password="${user.password}">${hiddenPassword}</span>
                            <button class="toggle-password">
                                <i class="fa-solid fa-eye-slash"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        <span class="status ${user.status === 'online' ? 'status-online' : 'status-offline'}">
                            ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                    </td>
                    <td>
                        <button class="delete-btn" onclick="deleteUser(${user.id})">
                            <i class="fa fa-trash"></i> Delete
                        </button>
                    </td>
                `;

                userList.appendChild(row);
            });

            // Add click event to toggle password visibility
            document.querySelectorAll('.toggle-password').forEach(button => {
                button.addEventListener('click', function () {
                    const passwordSpan = this.previousElementSibling;
                    const icon = this.querySelector('i');

                    if (!passwordSpan.classList.contains('visible-password')) {
                        passwordSpan.textContent = passwordSpan.getAttribute('data-password');
                        passwordSpan.classList.add('visible-password');
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    } else {
                        passwordSpan.classList.remove('visible-password');
                        setTimeout(() => {
                            passwordSpan.textContent = '••••••••';
                        }, 300); // Fade effect before hiding text
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    }
                });
            });

        } else {
            userList.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #777;">No users found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to delete user
async function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        try {
            const response = await fetch(`https://server-6chz.onrender.com/admin/users/${userId}`, {
                method: "DELETE"
            });
            const result = await response.json();
            alert(result.message);
            fetchUsers(); // Refresh the user list
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        }
    }
}

// Fetch users on page load
window.onload = fetchUsers;
