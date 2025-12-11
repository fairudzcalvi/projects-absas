async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function initializeDefaultAdmin() {
    const admins = JSON.parse(localStorage.getItem('absas_admins') || '[]');
    
    if (admins.length === 0) {
        const defaultPasswordHash = await hashPassword('admin123');
        
        const defaultAdmin = {
            id: 'admin_default',
            fullName: 'System Administrator',
            email: 'admin@absas.edu',
            username: 'admin',
            passwordHash: defaultPasswordHash,
            createdAt: new Date().toISOString(),
            accountType: 'admin'
        };
        
        admins.push(defaultAdmin);
        localStorage.setItem('absas_admins', JSON.stringify(admins));
        console.log('Default admin created - Username: admin, Password: admin123');
    }
}

initializeDefaultAdmin();
