
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Teacher - Page</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="dashboard.css">
</head>
<body class="dashboard-page">
<div class="dashboard-container">

    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>ABSAS-SIMS</h2>
        </div>

        <nav class="sidebar-nav">
            <a href="teacher-view-students.php" class="nav-item">
                <span class="icon"><i class="fas fa-user-graduate"></i></span>
                <span class="text">Class List</span>
            </a>
            <a href="teacher-view-attendance.php" class="nav-item active">
                <span class="icon"><i class="fas fa-clipboard-check"></i>
                </span><span class="text">Students Attendance</span>
            </a>
            <a href="teacher-view-grades.php" class="nav-item">
                <span class="icon"><i class="fas fa-file-alt"></i>
                </span><span class="text">Students Grades</span>
            </a>
        </nav>
        <nav>
        
        <div class="sidebar-footer">
                <div class="user-info" id="userInfoSidebar">
                    <p class="user-name">Teacher Account</p>
                    <p class="user-role">User</p>
                </div>
                <button class="logout-btn-sidebar" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Log out
                </button>
            </div>
        </aside>
 
      

    <main class="main-content">
            <header class="top-header">
                <h1><i class="fas fa-clipboard-check"></i> Attendance Reports</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <div class="alert alert-info" style="display: flex; align-items: center; gap: 10px; padding: 15px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 8px; color: #0c5460; margin-bottom: 20px;">
                    <i class="fas fa-info-circle" style="font-size: 20px;"></i>
                    <div>
                        <strong>Teacher View:</strong> This module is for viewing attendance reports only. Teachers/Advisers record daily attendance for their assigned classes.
                    </div>
                </div>

                <div class="card" style="margin-bottom: 20px;">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Filter Reports</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" id="attendanceDate" class="search-input">
                            </div>
                            <div class="form-group">
                                <label>Grade Level</label>
                                <select class="filter-select" id="attendanceGrade">
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
                            <div class="form-group" style="display: flex; align-items: flex-end;">
                                <button class="btn btn-primary" onclick="loadAttendanceReport()" style="width: 100%;">
                                    <i class="fas fa-search"></i> View Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card" id="attendanceReportCard" style="display: none;">
                    <div class="card-header">
                        <h2 class="card-title" id="reportTitle">Attendance Report</h2>
                        <button class="btn btn-secondary" onclick="printAttendanceReport()">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                    <div style="padding: 20px;">
                        <div style="display: flex; gap: 15px; margin-bottom: 20px; padding: 15px; background: var(--light-gray); border-radius: 8px;">
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 24px; font-weight: 700; color: #28a745;"><i class="fas fa-check-circle"></i> <span id="presentCount">0</span></div>
                                <div style="color: #666; font-size: 14px;">Present</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 24px; font-weight: 700; color: #dc3545;"><i class="fas fa-times-circle"></i> <span id="absentCount">0</span></div>
                                <div style="color: #666; font-size: 14px;">Absent</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 24px; font-weight: 700; color: #ffc107;"><i class="fas fa-clock"></i> <span id="lateCount">0</span></div>
                                <div style="color: #666; font-size: 14px;">Late</div>
                            </div>
                            <div style="flex: 1; text-align: center;">
                                <div style="font-size: 24px; font-weight: 700; color: #17a2b8;"><i class="fas fa-percentage"></i> <span id="attendanceRate">0%</span></div>
                                <div style="color: #666; font-size: 14px;">Attendance Rate</div>
                            </div>
                        </div>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Grade</th>
                                        <th>Section</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="attendanceReportBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-chart-bar"></i> Monthly Summary</h2>
                    </div>
                    <div style="padding: 20px;">
                        <p style="text-align: center; color: #666; padding: 40px;">
                            <i class="fas fa-calendar-alt" style="font-size: 48px; opacity: 0.3; display: block; margin-bottom: 15px;"></i>
                            Monthly attendance summary will be displayed here once attendance data is recorded by teachers.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <!-- Edit Attendance Modal -->
<div id="editAttendanceModal" class="modal-overlay" style="display:none;">
  <div class="modal">
    <div class="modal-header">
      <h3><i class="fas fa-edit"></i> Edit Attendance</h3>
      <button class="close-btn" onclick="closeEditModal()">&times;</button>
    </div>

    <div class="modal-body">
      <div class="form-group">
        <label>Student Name</label>
        <input type="text" id="editStudentName" class="search-input" disabled>
      </div>

      <div class="form-group">
        <label>Status</label>
        <select id="editAttendanceStatus" class="filter-select">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="excused">Excused</option>
        </select>
      </div>
    </div>

    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeEditModal()">Cancel</button>
      <button class="btn btn-primary" onclick="saveAttendanceEdit()">Save</button>
    </div>
  </div>
</div>

    <script src="teacher-view-attendance.js"></script>
</body>
</html>

    