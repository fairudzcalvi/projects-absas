document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem('absas_current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Only admin can access settings
    if (currentUser.accountType !== 'admin') {
        alert('Access Denied: Only administrators can access system settings.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Initialize UI
    document.getElementById('userInfoSidebar').innerHTML = `
        <p class="user-name">${currentUser.fullName}</p>
        <p class="user-role">Administrator</p>
    `;

    function updateDateTime() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        document.getElementById('dateTime').textContent = now.toLocaleString('en-US', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('absas_current_user');
            window.location.href = 'login.html';
        }
    });

    // Initialize settings
    function initializeSettings() {
        if (!localStorage.getItem('absas_settings')) {
            const defaultSettings = {
                school: {
                    name: 'A.B. Simpson Alliance School Inc.',
                    abbreviation: 'ABSAS',
                    address: 'Zamboanga City, Philippines',
                    phone: '(086) 826-XXXX',
                    email: 'absas@school.edu.ph',
                    schoolYear: '2024-2025'
                },
                fees: {
                    elementary: {
                        tuition: 15000,
                        misc: 3500
                    },
                    juniorHigh: {
                        tuition: 18000,
                        misc: 4000
                    }
                },
                academic: {
                    quarters: {
                        q1: { start: '2024-08-26', end: '2024-11-08' },
                        q2: { start: '2024-11-11', end: '2025-01-31' },
                        q3: { start: '2025-02-03', end: '2025-04-11' },
                        q4: { start: '2025-04-14', end: '2025-06-27' }
                    }
                },
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('absas_settings', JSON.stringify(defaultSettings));
        }
    }

    // Switch tabs
    window.switchTab = function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update panels
        document.querySelectorAll('.settings-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`panel-${tabName}`).classList.add('active');

        // Load data for the active tab
        loadTabData(tabName);
    };

    // Load tab data
    function loadTabData(tabName) {
        const settings = JSON.parse(localStorage.getItem('absas_settings'));

        switch(tabName) {
            case 'school':
                document.getElementById('schoolName').value = settings.school.name;
                document.getElementById('schoolAbbr').value = settings.school.abbreviation;
                document.getElementById('schoolAddress').value = settings.school.address;
                document.getElementById('schoolPhone').value = settings.school.phone;
                document.getElementById('schoolEmail').value = settings.school.email;
                document.getElementById('schoolYear').value = settings.school.schoolYear;
                break;

            case 'fees':
                document.getElementById('elemTuition').value = settings.fees.elementary.tuition;
                document.getElementById('elemMisc').value = settings.fees.elementary.misc;
                document.getElementById('jhsTuition').value = settings.fees.juniorHigh.tuition;
                document.getElementById('jhsMisc').value = settings.fees.juniorHigh.misc;
                updateFeeTotals();
                
                // Add event listeners for real-time total calculation
                ['elemTuition', 'elemMisc', 'jhsTuition', 'jhsMisc'].forEach(id => {
                    document.getElementById(id).addEventListener('input', updateFeeTotals);
                });
                break;

            case 'academic':
                Object.keys(settings.academic.quarters).forEach(quarter => {
                    const qNum = quarter.charAt(1);
                    document.getElementById(`q${qNum}Start`).value = settings.academic.quarters[quarter].start;
                    document.getElementById(`q${qNum}End`).value = settings.academic.quarters[quarter].end;
                });
                break;

            case 'account':
                document.getElementById('displayUsername').textContent = currentUser.username;
                document.getElementById('displayFullName').textContent = currentUser.fullName;
                document.getElementById('displayAccountType').textContent = currentUser.accountType === 'admin' ? 'Administrator' : 'User';
                document.getElementById('displayEmail').textContent = currentUser.email || 'Not set';
                break;

            case 'data':
                updateSystemInfo();
                break;
        }
    }

    // Update fee totals
    function updateFeeTotals() {
        const elemTuition = parseFloat(document.getElementById('elemTuition').value) || 0;
        const elemMisc = parseFloat(document.getElementById('elemMisc').value) || 0;
        const jhsTuition = parseFloat(document.getElementById('jhsTuition').value) || 0;
        const jhsMisc = parseFloat(document.getElementById('jhsMisc').value) || 0;

        document.getElementById('elemTotal').textContent = '₱' + (elemTuition + elemMisc).toLocaleString('en-PH', { minimumFractionDigits: 2 });
        document.getElementById('jhsTotal').textContent = '₱' + (jhsTuition + jhsMisc).toLocaleString('en-PH', { minimumFractionDigits: 2 });
    }

    // Save school info
    window.saveSchoolInfo = function() {
        const settings = JSON.parse(localStorage.getItem('absas_settings'));
        
        settings.school = {
            name: document.getElementById('schoolName').value,
            abbreviation: document.getElementById('schoolAbbr').value,
            address: document.getElementById('schoolAddress').value,
            phone: document.getElementById('schoolPhone').value,
            email: document.getElementById('schoolEmail').value,
            schoolYear: document.getElementById('schoolYear').value
        };
        settings.lastUpdated = new Date().toISOString();

        localStorage.setItem('absas_settings', JSON.stringify(settings));
        alert('School information updated successfully!');
    };

    // Save fee structure
    window.saveFeeStructure = function() {
        if (!confirm('Changing fee structure will recalculate all student financial records. Continue?')) {
            return;
        }

        const settings = JSON.parse(localStorage.getItem('absas_settings'));
        
        settings.fees = {
            elementary: {
                tuition: parseFloat(document.getElementById('elemTuition').value),
                misc: parseFloat(document.getElementById('elemMisc').value)
            },
            juniorHigh: {
                tuition: parseFloat(document.getElementById('jhsTuition').value),
                misc: parseFloat(document.getElementById('jhsMisc').value)
            }
        };
        settings.lastUpdated = new Date().toISOString();

        localStorage.setItem('absas_settings', JSON.stringify(settings));

        // Recalculate all student finances
        recalculateFinances(settings.fees);

        alert('Fee structure updated successfully! All student financial records have been recalculated.');
    };

    // Recalculate finances
    function recalculateFinances(fees) {
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        
        finances.forEach(finance => {
            const grade = parseInt(finance.grade);
            let newTuition, newMisc;

            if (grade <= 6) {
                newTuition = fees.elementary.tuition;
                newMisc = fees.elementary.misc;
            } else {
                newTuition = fees.juniorHigh.tuition;
                newMisc = fees.juniorHigh.misc;
            }

            const newTotal = newTuition + newMisc;
            finance.tuitionFee = newTuition;
            finance.miscFee = newMisc;
            finance.totalFees = newTotal;
            finance.balance = newTotal - finance.amountPaid;

            // Update status
            if (finance.balance <= 0) {
                finance.status = 'paid';
            } else if (finance.amountPaid > 0) {
                finance.status = 'partial';
            } else {
                finance.status = 'unpaid';
            }
        });

        localStorage.setItem('absas_finances', JSON.stringify(finances));
    }

    // Save academic config
    window.saveAcademicConfig = function() {
        const settings = JSON.parse(localStorage.getItem('absas_settings'));
        
        settings.academic.quarters = {
            q1: { start: document.getElementById('q1Start').value, end: document.getElementById('q1End').value },
            q2: { start: document.getElementById('q2Start').value, end: document.getElementById('q2End').value },
            q3: { start: document.getElementById('q3Start').value, end: document.getElementById('q3End').value },
            q4: { start: document.getElementById('q4Start').value, end: document.getElementById('q4End').value }
        };
        settings.lastUpdated = new Date().toISOString();

        localStorage.setItem('absas_settings', JSON.stringify(settings));
        alert('Academic configuration updated successfully!');
    };

    // Change password
    window.changePassword = function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields.');
            return;
        }

        if (currentPassword !== currentUser.password) {
            alert('Current password is incorrect.');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New passwords do not match.');
            return;
        }

        // Update password
        const users = JSON.parse(localStorage.getItem('absas_users') || '[]');
        const userIndex = users.findIndex(u => u.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('absas_users', JSON.stringify(users));
            
            // Update current user session
            currentUser.password = newPassword;
            localStorage.setItem('absas_current_user', JSON.stringify(currentUser));

            // Clear form
            document.getElementById('passwordForm').reset();
            
            alert('Password changed successfully!');
        }
    };

    // Export all data
    window.exportAllData = function() {
        const allData = {
            students: JSON.parse(localStorage.getItem('absas_students') || '[]'),
            faculty: JSON.parse(localStorage.getItem('absas_faculty') || '[]'),
            grades: JSON.parse(localStorage.getItem('absas_grades') || '[]'),
            attendance: JSON.parse(localStorage.getItem('absas_attendance') || '[]'),
            finances: JSON.parse(localStorage.getItem('absas_finances') || '[]'),
            payments: JSON.parse(localStorage.getItem('absas_payments') || '[]'),
            transcripts: JSON.parse(localStorage.getItem('absas_transcripts') || '[]'),
            files: JSON.parse(localStorage.getItem('absas_files') || '[]'),
            settings: JSON.parse(localStorage.getItem('absas_settings') || '{}'),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ABSAS_Backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);

        alert('System backup exported successfully!');
    };

    // Import data
    window.importData = function() {
        alert('Import Data: This feature allows you to restore a previous backup. Create a file input to select the backup JSON file, then parse and restore all data to localStorage.');
    };

    // View statistics
    window.viewStatistics = function() {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');
        const files = JSON.parse(localStorage.getItem('absas_files') || '[]');

        const stats = `
System Statistics:
━━━━━━━━━━━━━━━━━━━━━━
Students: ${students.length}
Faculty: ${faculty.length}
Grade Records: ${grades.length}
Financial Records: ${finances.length}
Uploaded Files: ${files.length}
━━━━━━━━━━━━━━━━━━━━━━
Total Records: ${students.length + faculty.length + grades.length + finances.length + files.length}
        `;

        alert(stats);
    };

    // Clear old data
    window.clearOldData = function() {
        const warning = 'WARNING: This will permanently delete old records!\n\nThis action cannot be undone unless you have a backup.\n\nAre you absolutely sure you want to continue?';
        
        if (!confirm(warning)) {
            return;
        }

        if (!confirm('Final confirmation: Delete old data?')) {
            return;
        }

        alert('Clear Old Data: In a production system, this would allow you to select which records to delete (e.g., graduated students, old transcripts, archived files).');
    };

    // Update system info
    function updateSystemInfo() {
        const settings = JSON.parse(localStorage.getItem('absas_settings'));
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        const finances = JSON.parse(localStorage.getItem('absas_finances') || '[]');

        const totalRecords = students.length + faculty.length + grades.length + finances.length;
        
        // Calculate approximate storage
        const storageSize = new Blob([JSON.stringify(localStorage)]).size;
        const storageMB = (storageSize / (1024 * 1024)).toFixed(2);

        document.getElementById('lastUpdated').textContent = new Date(settings.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('totalRecords').textContent = totalRecords.toLocaleString();
        document.getElementById('storageUsed').textContent = `${storageMB} MB`;
    }

    // Initialize
    initializeSettings();
    loadTabData('school'); // Load default tab
});