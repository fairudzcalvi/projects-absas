<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finance Management - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
    <link rel="stylesheet" href="admin-css/finance.css">
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
                <a href="finance.php" class="nav-item active">
                    <span class="icon"><i class="fas fa-money-bill-wave"></i></span>
                    <span class="text">Finance</span>
                </a>
                </a>
                <a href="settings.php" class="nav-item">
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
                <h1><i class="fas fa-money-bill-wave"></i> Finance Management</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Financial Statistics -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-wallet"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="totalRevenue">₱0</div>
                            <div class="stat-label">Total Revenue</div>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon">
                            <i class="fas fa-hand-holding-usd"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="collectedAmount">₱0</div>
                            <div class="stat-label">Collected Amount</div>
                        </div>
                    </div>
                    <div class="stat-card gold">
                        <div class="stat-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="outstandingBalance">₱0</div>
                            <div class="stat-label">Outstanding Balance</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="fullyPaidCount">0</div>
                            <div class="stat-label">Fully Paid Students</div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-bolt"></i> Quick Actions</h2>
                    </div>
                    <div class="quick-actions-finance">
                        <button class="action-card" onclick="openPaymentModal()">
                            <i class="fas fa-plus-circle"></i>
                            <span>Record Payment</span>
                        </button>
                        <button class="action-card" onclick="generateFinancialReport()">
                            <i class="fas fa-file-invoice-dollar"></i>
                            <span>Financial Report</span>
                        </button>
                        <button class="action-card" onclick="exportFinancialData()">
                            <i class="fas fa-download"></i>
                            <span>Export Data</span>
                        </button>
                        <button class="action-card" onclick="viewPaymentHistory()">
                            <i class="fas fa-history"></i>
                            <span>Payment History</span>
                        </button>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Filter Students</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Grade Level</label>
                                <select class="filter-select" id="gradeFilter" onchange="filterFinances()">
                                    <option value="">All Grades</option>
                                    <option value="1">Grade 1 - MATTHEW</option>
                                    <option value="2">Grade 2 - MARK</option>
                                    <option value="3">Grade 3 - LUKE</option>
                                    <option value="4">Grade 4 - JOHN</option>
                                    <option value="5">Grade 5 - ACTS</option>
                                    <option value="6">Grade 6 - ROMANS</option>
                                    <option value="7">Grade 7 - GENESIS</option>
                                    <option value="8">Grade 8 - EXODUS</option>
                                    <option value="9">Grade 9 - LEVITICUS</option>
                                    <option value="10">Grade 10 - NUMBERS</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Payment Status</label>
                                <select class="filter-select" id="statusFilter" onchange="filterFinances()">
                                    <option value="">All Status</option>
                                    <option value="paid">Fully Paid</option>
                                    <option value="partial">Partially Paid</option>
                                    <option value="unpaid">Unpaid</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Search Student</label>
                                <input type="text" class="search-input" id="studentSearch" placeholder="Search by name or ID..." oninput="filterFinances()">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Student Financial Records -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-list"></i> Student Financial Records</h2>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Student Name</th>
                                    <th>Grade</th>
                                    <th>Total Fees</th>
                                    <th>Amount Paid</th>
                                    <th>Balance</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="financeTableBody">
                                <tr><td colspan="8" class="empty-message">Loading financial records...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Record Payment Modal -->
                <div class="modal" id="paymentModal">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-money-bill-wave"></i> Record Payment
                            </h3>
                            <button class="modal-close" onclick="closePaymentModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="paymentForm">
                                <div class="form-group">
                                    <label for="paymentStudent">Select Student *</label>
                                    <select id="paymentStudent" name="studentId" required onchange="loadStudentBalance()">
                                        <option value="">-- Select Student --</option>
                                    </select>
                                </div>

                                <div id="studentBalanceInfo" style="display: none; margin: 20px 0; padding: 15px; background: var(--light-gray); border-radius: 8px; border-left: 4px solid var(--maroon);">
                                    <h4 style="color: var(--maroon); margin-bottom: 10px;">Student Information</h4>
                                    <div style="display: grid; gap: 10px;">
                                        <div><strong>Total Fees:</strong> <span id="displayTotalFees">₱0</span></div>
                                        <div><strong>Amount Paid:</strong> <span id="displayAmountPaid">₱0</span></div>
                                        <div><strong>Outstanding Balance:</strong> <span id="displayBalance" style="color: #dc3545; font-size: 18px; font-weight: 700;">₱0</span></div>
                                    </div>
                                </div>

                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="paymentAmount">Payment Amount *</label>
                                        <input type="number" id="paymentAmount" name="amount" min="0" step="0.01" required placeholder="0.00">
                                    </div>
                                    <div class="form-group">
                                        <label for="paymentDate">Payment Date *</label>
                                        <input type="date" id="paymentDate" name="paymentDate" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="paymentMethod">Payment Method *</label>
                                    <select id="paymentMethod" name="paymentMethod" required>
                                        <option value="">-- Select Method --</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Check">Check</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                        <option value="GCash">GCash</option>
                                        <option value="PayMaya">PayMaya</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="paymentFor">Payment For *</label>
                                    <select id="paymentFor" name="paymentFor" required>
                                        <option value="">-- Select --</option>
                                        <option value="Tuition Fee">Tuition Fee</option>
                                        <option value="Miscellaneous Fee">Miscellaneous Fee</option>
                                        <option value="Books">Books</option>
                                        <option value="Uniform">Uniform</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="paymentReference">Reference Number</label>
                                    <input type="text" id="paymentReference" name="reference" placeholder="Check/Transaction #">
                                </div>

                                <div class="form-group">
                                    <label for="paymentRemarks">Remarks</label>
                                    <textarea id="paymentRemarks" name="remarks" rows="3" placeholder="Additional notes..."></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closePaymentModal()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button class="btn btn-primary" onclick="savePayment()">
                                <i class="fas fa-save"></i> Record Payment
                            </button>
                        </div>
                    </div>
                </div>

                <!-- View Statement Modal -->
                <div class="modal" id="statementModal">
                    <div class="modal-content" style="max-width: 800px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-file-invoice-dollar"></i> Statement of Account
                            </h3>
                            <button class="modal-close" onclick="closeStatementModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="statementContent">
                                <!-- Statement will be generated here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeStatementModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                            <button class="btn btn-primary" onclick="printStatement()">
                                <i class="fas fa-print"></i> Print Statement
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Fee Structure Information -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-info-circle"></i> Fee Structure (SY 2024-2025)</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="fee-structure-grid">
                            <div class="fee-card">
                                <h4><i class="fas fa-book"></i> Elementary (Grades 1-6)</h4>
                                <div class="fee-item">
                                    <span>Tuition Fee:</span>
                                    <strong>₱15,000</strong>
                                </div>
                                <div class="fee-item">
                                    <span>Miscellaneous:</span>
                                    <strong>₱3,500</strong>
                                </div>
                                <div class="fee-total">
                                    <span>Total per Semester:</span>
                                    <strong>₱18,500</strong>
                                </div>
                            </div>
                            <div class="fee-card">
                                <h4><i class="fas fa-graduation-cap"></i> Junior High (Grades 7-10)</h4>
                                <div class="fee-item">
                                    <span>Tuition Fee:</span>
                                    <strong>₱18,000</strong>
                                </div>
                                <div class="fee-item">
                                    <span>Miscellaneous:</span>
                                    <strong>₱4,000</strong>
                                </div>
                                <div class="fee-total">
                                    <span>Total per Semester:</span>
                                    <strong>₱22,000</strong>
                                </div>
                            </div>
                        </div>
                        <p style="margin-top: 15px; font-size: 13px; color: #666; font-style: italic;">
                            <i class="fas fa-info-circle"></i> 
                            Note: Fees may be paid in installments. Additional fees for books, uniforms, and other materials are separate.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/finance.js"></script>
</body>
</html>