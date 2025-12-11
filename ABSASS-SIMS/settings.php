<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Settings - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
    <link rel="stylesheet" href="admin-css/settings.css">
</head>
<body class="dashboard-page">
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>ABSAS-SIMS</h2>
            </div>
            <nav class="sidebar-nav">
                <a href="dashboard.php" class="nav-item">
                    <span class="icon"><i class="fas fa-chart-line"></i></span>
                    <span class="text">Overview</span>
                </a>
                <a href="students.php" class="nav-item">
                    <span class="icon"><i class="fas fa-user-graduate"></i></span>
                    <span class="text">Student Records</span>
                </a>
                <a href="faculty.php" class="nav-item">
                    <span class="icon"><i class="fas fa-chalkboard-teacher"></i></span>
                    <span class="text">Faculty Records</span>
                </a>
                <a href="schedules.php" class="nav-item">
                    <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                    <span class="text">Class Schedules</span>
                </a>
                <a href="attendance.php" class="nav-item">
                    <span class="icon"><i class="fas fa-clipboard-check"></i></span>
                    <span class="text">Attendance</span>
                </a>
                <a href="transcripts.php" class="nav-item">
                    <span class="icon"><i class="fas fa-scroll"></i></span>
                    <span class="text">Transcripts</span>
                </a>
                <a href="finance.php" class="nav-item">
                    <span class="icon"><i class="fas fa-money-bill-wave"></i></span>
                    <span class="text">Finance</span>
                </a>
                </a>
                <a href="settings.php" class="nav-item active">
                <span class="icon"><i class="fas fa-cog"></i></span>
                <span class="text">Settings</span>
                </a>
            </nav>
            </nav>
            <div class="sidebar-footer">
                <div class="user-info" id="userInfoSidebar">
                    <p class="user-name">Loading...</p>
                    <p class="user-role">Administrator</p>
                </div>
                <button class="logout-btn-sidebar" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>
        
        <main class="main-content">
            <header class="top-header">
                <h1><i class="fas fa-cog"></i> System Settings</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Settings Navigation -->
                <div class="card">
                    <div class="settings-tabs">
                        <button class="settings-tab active" data-tab="school" onclick="switchTab('school')">
                            <i class="fas fa-school"></i>
                            <span>School Profile</span>
                        </button>
                        <button class="settings-tab" data-tab="fees" onclick="switchTab('fees')">
                            <i class="fas fa-money-bill-wave"></i>
                            <span>Fee Management</span>
                        </button>
                        <button class="settings-tab" data-tab="academic" onclick="switchTab('academic')">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Academic Config</span>
                        </button>
                        <button class="settings-tab" data-tab="account" onclick="switchTab('account')">
                            <i class="fas fa-user-shield"></i>
                            <span>Account Settings</span>
                        </button>
                        <button class="settings-tab" data-tab="data" onclick="switchTab('data')">
                            <i class="fas fa-database"></i>
                            <span>Data Management</span>
                        </button>
                    </div>
                </div>

                <!-- School Profile Settings -->
                <div class="settings-panel active" id="panel-school">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-school"></i> School Information</h2>
                            <button class="btn btn-primary" onclick="saveSchoolInfo()">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                        <div style="padding: 30px;">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="schoolName">School Name *</label>
                                    <input type="text" id="schoolName" placeholder="A.B. Simpson Alliance School Inc.">
                                </div>
                                <div class="form-group">
                                    <label for="schoolAbbr">Abbreviation *</label>
                                    <input type="text" id="schoolAbbr" placeholder="ABSAS">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="schoolAddress">Address *</label>
                                <input type="text" id="schoolAddress" placeholder="Complete school address">
                            </div>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="schoolPhone">Contact Number *</label>
                                    <input type="tel" id="schoolPhone" placeholder="(086) 826-XXXX">
                                </div>
                                <div class="form-group">
                                    <label for="schoolEmail">Email Address *</label>
                                    <input type="email" id="schoolEmail" placeholder="school@example.com">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="schoolYear">Current School Year *</label>
                                <input type="text" id="schoolYear" placeholder="2024-2025">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Fee Management Settings -->
                <div class="settings-panel" id="panel-fees">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-money-bill-wave"></i> Fee Structure Configuration</h2>
                            <button class="btn btn-primary" onclick="saveFeeStructure()">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                        <div style="padding: 30px;">
                            <h3 style="color: var(--maroon); margin-bottom: 20px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                <i class="fas fa-book"></i> Elementary (Grades 1-6)
                            </h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="elemTuition">Tuition Fee (per semester) *</label>
                                    <input type="number" id="elemTuition" placeholder="15000" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label for="elemMisc">Miscellaneous Fee *</label>
                                    <input type="number" id="elemMisc" placeholder="3500" step="0.01">
                                </div>
                            </div>
                            <div class="fee-total-display">
                                <span>Total Elementary Fee:</span>
                                <strong id="elemTotal">₱18,500.00</strong>
                            </div>

                            <h3 style="color: var(--maroon); margin: 30px 0 20px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                <i class="fas fa-graduation-cap"></i> Junior High School (Grades 7-10)
                            </h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="jhsTuition">Tuition Fee (per semester) *</label>
                                    <input type="number" id="jhsTuition" placeholder="18000" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label for="jhsMisc">Miscellaneous Fee *</label>
                                    <input type="number" id="jhsMisc" placeholder="4000" step="0.01">
                                </div>
                            </div>
                            <div class="fee-total-display">
                                <span>Total Junior High Fee:</span>
                                <strong id="jhsTotal">₱22,000.00</strong>
                            </div>

                            <div class="warning-box" style="margin-top: 30px;">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div>
                                    <strong>Important:</strong> Changing fee structure will affect all student financial records. Existing payments will be recalculated automatically.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Academic Configuration Settings -->
                <div class="settings-panel" id="panel-academic">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-graduation-cap"></i> Academic Year Configuration</h2>
                            <button class="btn btn-primary" onclick="saveAcademicConfig()">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </div>
                        <div style="padding: 30px;">
                            <h3 style="color: var(--maroon); margin-bottom: 20px;">Grading Periods</h3>
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="q1Start">1st Quarter Start</label>
                                    <input type="date" id="q1Start">
                                </div>
                                <div class="form-group">
                                    <label for="q1End">1st Quarter End</label>
                                    <input type="date" id="q1End">
                                </div>
                                <div class="form-group">
                                    <label for="q2Start">2nd Quarter Start</label>
                                    <input type="date" id="q2Start">
                                </div>
                                <div class="form-group">
                                    <label for="q2End">2nd Quarter End</label>
                                    <input type="date" id="q2End">
                                </div>
                                <div class="form-group">
                                    <label for="q3Start">3rd Quarter Start</label>
                                    <input type="date" id="q3Start">
                                </div>
                                <div class="form-group">
                                    <label for="q3End">3rd Quarter End</label>
                                    <input type="date" id="q3End">
                                </div>
                                <div class="form-group">
                                    <label for="q4Start">4th Quarter Start</label>
                                    <input type="date" id="q4Start">
                                </div>
                                <div class="form-group">
                                    <label for="q4End">4th Quarter End</label>
                                    <input type="date" id="q4End">
                                </div>
                            </div>

                            <h3 style="color: var(--maroon); margin: 30px 0 20px;">Section Names</h3>
                            <div class="info-box" style="margin-bottom: 20px;">
                                <i class="fas fa-info-circle"></i>
                                <span>Current section names are biblically themed. These are displayed throughout the system.</span>
                            </div>
                            <div class="sections-display">
                                <div class="section-item">Grade 1: <strong>MATTHEW</strong></div>
                                <div class="section-item">Grade 2: <strong>MARK</strong></div>
                                <div class="section-item">Grade 3: <strong>LUKE</strong></div>
                                <div class="section-item">Grade 4: <strong>JOHN</strong></div>
                                <div class="section-item">Grade 5: <strong>ACTS</strong></div>
                                <div class="section-item">Grade 6: <strong>ROMANS</strong></div>
                                <div class="section-item">Grade 7: <strong>GENESIS</strong></div>
                                <div class="section-item">Grade 8: <strong>EXODUS</strong></div>
                                <div class="section-item">Grade 9: <strong>LEVITICUS</strong></div>
                                <div class="section-item">Grade 10: <strong>NUMBERS</strong></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Account Settings -->
                <div class="settings-panel" id="panel-account">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-user-shield"></i> Account Security</h2>
                        </div>
                        <div style="padding: 30px;">
                            <h3 style="color: var(--maroon); margin-bottom: 20px;">Change Password</h3>
                            <form id="passwordForm">
                                <div class="form-group">
                                    <label for="currentPassword">Current Password *</label>
                                    <input type="password" id="currentPassword" required>
                                </div>
                                <div class="form-group">
                                    <label for="newPassword">New Password *</label>
                                    <input type="password" id="newPassword" required minlength="6">
                                </div>
                                <div class="form-group">
                                    <label for="confirmPassword">Confirm New Password *</label>
                                    <input type="password" id="confirmPassword" required minlength="6">
                                </div>
                                <button type="button" class="btn btn-primary" onclick="changePassword()">
                                    <i class="fas fa-key"></i> Update Password
                                </button>
                            </form>

                            <h3 style="color: var(--maroon); margin: 40px 0 20px;">Account Information</h3>
                            <div class="account-info-display">
                                <div class="info-row">
                                    <span>Username:</span>
                                    <strong id="displayUsername">admin</strong>
                                </div>
                                <div class="info-row">
                                    <span>Full Name:</span>
                                    <strong id="displayFullName">Administrator</strong>
                                </div>
                                <div class="info-row">
                                    <span>Account Type:</span>
                                    <strong id="displayAccountType">Administrator</strong>
                                </div>
                                <div class="info-row">
                                    <span>Email:</span>
                                    <strong id="displayEmail">admin@example.com</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Data Management Settings -->
                <div class="settings-panel" id="panel-data">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-database"></i> Data Management</h2>
                        </div>
                        <div style="padding: 30px;">
                            <div class="data-management-grid">
                                <div class="data-action-card">
                                    <i class="fas fa-download"></i>
                                    <h4>Export All Data</h4>
                                    <p>Download complete backup of all system data</p>
                                    <button class="btn btn-primary" onclick="exportAllData()">
                                        <i class="fas fa-download"></i> Export Backup
                                    </button>
                                </div>

                                <div class="data-action-card">
                                    <i class="fas fa-upload"></i>
                                    <h4>Import Data</h4>
                                    <p>Restore data from a previous backup file</p>
                                    <button class="btn btn-secondary" onclick="importData()">
                                        <i class="fas fa-upload"></i> Import Backup
                                    </button>
                                </div>

                                <div class="data-action-card">
                                    <i class="fas fa-chart-line"></i>
                                    <h4>System Statistics</h4>
                                    <p>View detailed system usage statistics</p>
                                    <button class="btn btn-secondary" onclick="viewStatistics()">
                                        <i class="fas fa-chart-bar"></i> View Stats
                                    </button>
                                </div>

                                <div class="data-action-card danger">
                                    <i class="fas fa-trash-alt"></i>
                                    <h4>Clear Old Data</h4>
                                    <p>Remove outdated records (use with caution)</p>
                                    <button class="btn btn-danger" onclick="clearOldData()">
                                        <i class="fas fa-trash"></i> Clear Data
                                    </button>
                                </div>
                            </div>

                            <div class="warning-box" style="margin-top: 30px;">
                                <i class="fas fa-exclamation-triangle"></i>
                                <div>
                                    <strong>Data Safety:</strong> Always create a backup before making major changes. Deleted data cannot be recovered unless you have a backup file.
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- System Info -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title"><i class="fas fa-info-circle"></i> System Information</h2>
                        </div>
                        <div style="padding: 30px;">
                            <div class="system-info-grid">
                                <div class="info-item">
                                    <i class="fas fa-code"></i>
                                    <div>
                                        <strong>System Version</strong>
                                        <p>ABSAS-SIMS v1.0.0</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-calendar"></i>
                                    <div>
                                        <strong>Last Updated</strong>
                                        <p id="lastUpdated">-</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-database"></i>
                                    <div>
                                        <strong>Total Records</strong>
                                        <p id="totalRecords">-</p>
                                    </div>
                                </div>
                                <div class="info-item">
                                    <i class="fas fa-hdd"></i>
                                    <div>
                                        <strong>Storage Used</strong>
                                        <p id="storageUsed">-</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/settings.js"></script>
</body>
</html>