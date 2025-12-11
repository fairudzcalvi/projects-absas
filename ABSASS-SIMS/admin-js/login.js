document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('loginBtn');

    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async function authenticateUser(usernameOrEmail, password) {
        const users = JSON.parse(localStorage.getItem('absas_users') || '[]');
        const admins = JSON.parse(localStorage.getItem('absas_admins') || '[]');
        
        const allUsers = [...users, ...admins];
        
        const hashedPassword = await hashPassword(password);
        
        const user = allUsers.find(u => 
            (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
             u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
            (u.passwordHash === hashedPassword || u.password === password)
        );
        
        return user;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let isValid = true;
        const usernameError = document.getElementById('usernameError');
        const passwordError = document.getElementById('passwordError');
        
        usernameError.textContent = '';
        passwordError.textContent = '';
        usernameInput.classList.remove('error');
        passwordInput.classList.remove('error');

        if (usernameInput.value.trim() === '') {
            usernameError.textContent = 'Username or email is required';
            usernameInput.classList.add('error');
            isValid = false;
        }

        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            passwordError.textContent = 'Password must be at least 6 characters';
            passwordInput.classList.add('error');
            isValid = false;
        }

        if (isValid) {
            authenticateUser(usernameInput.value.trim(), passwordInput.value).then(function(authenticatedUser) {
                if (authenticatedUser) {
                    loginBtn.classList.add('loading');
                    loginBtn.querySelector('.btn-text').style.display = 'none';
                    loginBtn.querySelector('.loader').style.display = 'inline-block';
                    
                    localStorage.setItem('absas_current_user', JSON.stringify({
                        id: authenticatedUser.id,
                        username: authenticatedUser.username,
                        fullName: authenticatedUser.fullName,
                        email: authenticatedUser.email,
                        accountType: authenticatedUser.accountType,
                        role: authenticatedUser.role || 'admin'
                    }));
                    
                    setTimeout(function() {
                        window.location.href = 'dashboard.php';
                    }, 1000);
                } else {
                    usernameError.textContent = 'Invalid username/email or password';
                    passwordError.textContent = 'Please check your credentials and try again';
                    usernameInput.classList.add('error');
                    passwordInput.classList.add('error');
                }
            });
        }
    });

    const inputs = [usernameInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    });
});
