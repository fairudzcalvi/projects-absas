<?php
require_once "connect2.php";

$conn = getDBConnection();

$sql = "SELECT COUNT(Student_Record_ID) AS total FROM students";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch result
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grading System - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
    <link rel="stylesheet" href="admin-css/grades.css">
</head>
<body class="dashboard-page">
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>ABSAS-SIMS</h2>
            </div>
            <nav class="sidebar-nav">
                <a href="dashboard.html" class="nav-item">
                    <span class="icon"><i class="fas fa-chart-line"></i></span>
                    <span class="text">Overview</span>
                </a>
                <a href="students.html" class="nav-item">
                    <span class="icon"><i class="fas fa-user-graduate"></i></span>
                    <span class="text">Student Records</span>
                </a>
                <a href="faculty.html" class="nav-item">
                    <span class="icon"><i class="fas fa-chalkboard-teacher"></i></span>
                    <span class="text">Faculty Records</span>
                </a>
                <a href="masterlist.html" class="nav-item">
                    <span class="icon"><i class="fas fa-list-alt"></i></span>
                    <span class="text">Master List</span>
                </a>
                <a href="schedules.html" class="nav-item">
                    <span class="icon"><i class="fas fa-calendar-alt"></i></span>
                    <span class="text">Class Schedules</span>
                </a>
                <a href="attendance.html" class="nav-item">
                    <span class="icon"><i class="fas fa-clipboard-check"></i></span>
                    <span class="text">Attendance</span>
                </a>
                <a href="grades.html" class="nav-item active">
                    <span class="icon"><i class="fas fa-file-alt"></i></span>
                    <span class="text">Grading</span>
                </a>
                <a href="transcripts.html" class="nav-item">
                    <span class="icon"><i class="fas fa-scroll"></i></span>
                    <span class="text">Transcripts</span>
                </a>
                <a href="finance.html" class="nav-item">
                    <span class="icon"><i class="fas fa-money-bill-wave"></i></span>
                    <span class="text">Finance</span>
                </a>
                <a href="files.html" class="nav-item">
                    <span class="icon"><i class="fas fa-folder-open"></i></span>
                    <span class="text">File Management</span>
                </a>
                </a>
                <a href="settings.html" class="nav-item">
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
                <h1><i class="fas fa-file-alt"></i> Grading System</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Grading Period Selector -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-calendar-check"></i> Select Grading Period</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="grading-period-tabs">
                            <button class="period-tab active" data-period="1Q" onclick="selectPeriod('1Q')">
                                <i class="fas fa-calendar-day"></i> 1st Quarter
                            </button>
                            <button class="period-tab" data-period="2Q" onclick="selectPeriod('2Q')">
                                <i class="fas fa-calendar-day"></i> 2nd Quarter
                            </button>
                            <button class="period-tab" data-period="3Q" onclick="selectPeriod('3Q')">
                                <i class="fas fa-calendar-day"></i> 3rd Quarter
                            </button>
                            <button class="period-tab" data-period="4Q" onclick="selectPeriod('4Q')">
                                <i class="fas fa-calendar-day"></i> 4th Quarter
                            </button>
                            <button class="period-tab" data-period="FINAL" onclick="selectPeriod('FINAL')">
                                <i class="fas fa-star"></i> Final Grade
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Filter Grades</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Grade Level</label>
                                <select class="filter-select" id="gradeFilter" onchange="loadGrades()">
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
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Subject</label>
                                <select class="filter-select" id="subjectFilter" onchange="loadGrades()">
                                    <option value="">All Subjects</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Search Student</label>
                                <input type="text" class="search-input" id="studentSearch" placeholder="Search by name or ID..." oninput="loadGrades()">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div class="card" id="emptyState">
                    <div style="padding: 60px; text-align: center; color: #666;">
                        <i class="fas fa-clipboard-list" style="font-size: 64px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                        <h3 style="margin-bottom: 10px; color: var(--maroon);">No Selection Made</h3>
                        <p>Please select a grade level to view student grades.</p>
                    </div>
                </div>

                <!-- Grades Table -->
                <div class="card" id="gradesCard" style="display: none;">
                    <div class="card-header">
                        <h2 class="card-title" id="gradesTitle">Student Grades</h2>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-secondary" onclick="exportGrades()">
                                <i class="fas fa-file-excel"></i> Export
                            </button>
                            <button class="btn btn-primary" onclick="printGrades()">
                                <i class="fas fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="data-table grades-table">
                            <thead id="gradesTableHead">
                                <!-- Headers will be dynamically generated -->
                            </thead>
                            <tbody id="gradesTableBody">
                                <tr><td colspan="20" class="empty-message">Loading grades...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- View/Edit Grade Modal -->
                <div class="modal" id="gradeModal">
                    <div class="modal-content" style="max-width: 800px;">
                        <div class="modal-header">
                            <h3 class="modal-title" id="gradeModalTitle">
                                <i class="fas fa-edit"></i> Student Grade Details
                            </h3>
                            <button class="modal-close" onclick="closeGradeModal()">&times;</button>
                        </div>
                        <div class="modal-body" id="gradeModalBody">
                            <!-- Grade details will be populated here -->
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeGradeModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grade Legend -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-info-circle"></i> Grading System Legend</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="legend-grid">
                            <div class="legend-item">
                                <div class="legend-box outstanding">90-100</div>
                                <span>Outstanding</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box very-satisfactory">85-89</div>
                                <span>Very Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box satisfactory">80-84</div>
                                <span>Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box fairly-satisfactory">75-79</div>
                                <span>Fairly Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box did-not-meet">Below 75</div>
                                <span>Did Not Meet Expectations</span>
                            </div>
                        </div>
                        <p style="margin-top: 15px; font-size: 13px; color: #666; font-style: italic;">
                            <i class="fas fa-exclamation-circle"></i> 
                            Note: Grades are entered and managed by subject teachers. Administrators have view-only access to maintain grade integrity.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/grades.js"></script>
</body>
</html>