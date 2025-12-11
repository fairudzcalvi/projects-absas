<?php
require_once "<save-php/connect.php";

$conn = getDBConnection();

$sql = "SELECT COUNT(Student_Record_ID) AS total FROM students";
$stmt = $conn->prepare($sql);
$stmt->execute();

// Fetch result
$row = $stmt->fetch(PDO::FETCH_ASSOC);

$sql = "SELECT COUNT(Faculty_Record_ID) AS total FROM faculty";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch result
    $rowss = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
</head>
<body class="dashboard-page">
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="sidebar-header">
                <h2>ABSAS-SIMS</h2>
            </div>
            <nav class="sidebar-nav">
                <a href="dashboard.php" class="nav-item active">
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
                <a href="settings.php" class="nav-item">
                    <span class="icon"><i class="fas fa-cog"></i></span>
                    <span class="text">Settings</span>
                </a>
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
                <h1><i class="fas fa-home"></i> Dashboard Overview</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>

            <div class="content-area">

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="totalStudents"><?php echo $row['total']; ?></div>
                            <div class="stat-label">Total Students</div>
                        </div>
                    </div>

                    <div class="stat-card gold">
                        <div class="stat-icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="totalFaculty"><?php echo $rowss['total']; ?></div>
                            <div class="stat-label">Total Faculty</div>
                        </div>
                    </div>

                    <div class="stat-card green">
                        <div class="stat-icon">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number">10</div>
                            <div class="stat-label">Grade Levels</div>
                        </div>
                    </div>

                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-clock"></i> Recent Enrollments</h2>
                        <a href="students.php" class="btn btn-secondary btn-sm">
                            <i class="fas fa-eye"></i> View All
                        </a>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Grade</th>
                                    <th>Section</th>
                                    <th>Enrolled</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="studentsOverviewBody">
                                <tr>
                                    <td colspan="6" class="empty-message">No recent enrollments</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-bolt"></i> Quick Actions</h2>
                    </div>

                    <div class="quick-actions-grid">
                        <a href="students.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-user-plus"></i></div>
                            <div class="action-label">Add Student</div>
                        </a>

                        <a href="attendance.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-clipboard-check"></i></div>
                            <div class="action-label">View Attendance</div>
                        </a>

                        <a href="grades.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-edit"></i></div>
                            <div class="action-label">Manage Grades</div>
                        </a>

                        <a href="finance.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-dollar-sign"></i></div>
                            <div class="action-label">Record Payment</div>
                        </a>

                        <a href="transcripts.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-file-pdf"></i></div>
                            <div class="action-label">Generate Transcript</div>
                        </a>

                        <a href="masterlist.php" class="quick-action-card">
                            <div class="action-icon"><i class="fas fa-clipboard-list"></i></div>
                            <div class="action-label">Master List</div>
                        </a>
                    </div>
                </div>

            </div> <!-- end content-area -->
        </main>
    </div>

    <script src="admin-js/dashboard-overview.js"></script>
</body>
</html>
