<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Schedules - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
    <style>
        @media print {
            .sidebar, .top-header, .no-print, .btn { display: none !important; }
            .main-content { margin-left: 0 !important; }
            .card { box-shadow: none !important; page-break-inside: avoid; }
            body { background: white !important; }
            .schedule-table { font-size: 11px; }
        }
        .schedule-header {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            border-bottom: 3px solid var(--maroon);
        }
        .schedule-header h2 {
            color: var(--maroon);
            font-size: 24px;
            margin-bottom: 5px;
        }
        .schedule-header h3 {
            color: var(--gold);
            font-size: 18px;
            margin-bottom: 5px;
        }
        .schedule-header p {
            color: #666;
            font-size: 14px;
            margin: 3px 0;
        }
        .schedule-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .schedule-table th,
        .schedule-table td {
            border: 1px solid #333;
            padding: 10px;
            text-align: center;
            vertical-align: middle;
        }
        .schedule-table th {
            background: var(--maroon);
            color: white;
            font-weight: 600;
        }
        .schedule-table .time-column {
            background: var(--light-gray);
            font-weight: 600;
            width: 130px;
        }
        .schedule-table .subject-cell {
            font-weight: 500;
            line-height: 1.4;
        }
        .schedule-table .teacher-name {
            display: block;
            font-size: 12px;
            color: #666;
            font-weight: 400;
        }
        .schedule-table .special-activity {
            background: #fff3cd;
            font-weight: 600;
            font-style: italic;
        }
        .schedule-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #ddd;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        .schedule-footer div {
            text-align: center;
        }
        .schedule-footer .signature-line {
            border-top: 2px solid #000;
            padding-top: 10px;
            margin-top: 40px;
            font-weight: 600;
        }
    </style>
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
                <a href="schedules.php" class="nav-item active">
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
                <h1><i class="fas fa-calendar-alt"></i> Class Schedules</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Schedule Selector -->
                <div class="card no-print">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Select Class Schedule</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Grade Level *</label>
                                <select class="filter-select" id="gradeSelect" onchange="loadSchedule()" required>
                                    <option value="">Select Grade Level</option>
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
                        </div>
                    </div>
                </div>

                <!-- Schedule Display -->
                <div class="card" id="scheduleCard" style="display: none;">
                    <div class="card-header no-print">
                        <h2 class="card-title" id="scheduleTitle">Class Schedule</h2>
                        <button class="btn btn-primary" onclick="window.print()">
                            <i class="fas fa-print"></i> Print Schedule
                        </button>
                    </div>
                    
                    <div style="padding: 30px;" id="printableSchedule">
                        <!-- Schedule content will be loaded here -->
                    </div>
                </div>

                <!-- Empty State -->
                <div class="card" id="emptyState">
                    <div style="padding: 60px; text-align: center; color: #666;">
                        <i class="fas fa-calendar-times" style="font-size: 64px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                        <h3 style="margin-bottom: 10px; color: var(--maroon);">No Schedule Selected</h3>
                        <p>Please select a grade level to view the class schedule.</p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/schedules.js"></script>
</body>
</html>