<?php
require_once "connect2.php";

$conn = getDBConnection();

$sql = "SELECT COUNT(Student_Record_ID) AS total FROM students";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch result
    $rowss = $stmt->fetch(PDO::FETCH_ASSOC);

    $sql1 = "SELECT COUNT(Student_Record_ID) AS total FROM students WHERE Student_Gender = 'Male' ";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->execute();

    // Fetch result
    $rowss1 = $stmt1->fetch(PDO::FETCH_ASSOC);

    $sql2 = "SELECT COUNT(Student_Record_ID) AS total FROM students WHERE Student_Gender = 'Female' ";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();

    // Fetch result
    $rowss2 = $stmt2->fetch(PDO::FETCH_ASSOC);

    $sqls = "SELECT * FROM students";
    $stmts = $conn->prepare($sqls);
    $stmts->execute();

    // Fetch result
    $rows = $stmts->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academic Transcripts - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="admin-css/styles.css">
    <link rel="stylesheet" href="admin-css/dashboard.css">
    <link rel="stylesheet" href="admin-css/transcripts.css">
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
                <a href="transcripts.php" class="nav-item active">
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
                <h1><i class="fas fa-scroll"></i> Academic Transcripts</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Quick Stats -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="totalTranscripts">0</div>
                            <div class="stat-label">Generated Transcripts</div>
                        </div>
                    </div>
                    <div class="stat-card gold">
                        <div class="stat-icon">
                            <i class="fas fa-file-pdf"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="generatedToday">0</div>
                            <div class="stat-label">Generated Today</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="completedGrades">0</div>
                            <div class="stat-label">Complete Records</div>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="pendingRecords">0</div>
                            <div class="stat-label">Incomplete Records</div>
                        </div>
                    </div>
                </div>

                <!-- Search Section -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-search"></i> Search Student</h2>
                        <button class="btn btn-primary" onclick="showBatchGenerate()">
                            <i class="fas fa-layer-group"></i> Batch Generate
                        </button>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Search Student</label>
                                <input type="text" class="search-input" id="studentSearch" placeholder="Search by name, ID, or LRN..." oninput="searchStudents()">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Grade Level</label>
                                <select class="filter-select" id="gradeFilter" onchange="searchStudents()">
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
                                <label>Status</label>
                                <select class="filter-select" id="statusFilter" onchange="searchStudents()">
                                    <option value="">All Status</option>
                                    <option value="complete">Complete Records</option>
                                    <option value="incomplete">Incomplete Records</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Students List -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-list"></i> Student Records</h2>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>LRN</th>
                                    <th>Student Name</th>
                                    <th>Grade Level</th>
                                    <th>Status</th>
                                    <th>General Average</th>
                                    <th>Last Generated</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="studentsTableBody">
                                <?php    foreach ($rows as $row):   ?>
                                <tr>
                                    <td><strong><?= htmlspecialchars($row['Student_ID'] ?? '-') ?></strong></td>
                                    <td><?= htmlspecialchars($row['LRN_ID'] ?? '-') ?></td>
                                    <td><strong><?= htmlspecialchars($row['Student_First_Name'] ?? '-') ?> <?= htmlspecialchars($row['Student_Last_Name'] ?? '-') ?></strong></td>
                                    <td><span class="badge badge-info">Grade <?= htmlspecialchars($row['Student_Grade_Level'] ?? '-') ?></span></td>
                                    <td>${isComplete ? 
                                        '<span class="status-badge complete"><i class="fas fa-check-circle"></i> Complete</span>' : 
                                        '<span class="status-badge incomplete"><i class="fas fa-exclamation-circle"></i> Incomplete</span>'
                                    }</td>
                                    <td><strong style="color: var(--maroon); font-size: 16px;">${genAvg || 'N/A'}</strong></td>
                                    <td style="font-size: 13px; color: #666;">${lastGenerated}</td>
                                    <td style="white-space: nowrap;">
                                        <button class="btn btn-sm btn-primary" onclick="generateTranscript('${s.id}')" 
                                            ${!isComplete ? 'disabled title="Cannot generate - incomplete grades"' : 'title="Generate Transcript"'}>
                                            <i class="fas fa-file-pdf"></i>
                                        </button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Transcript Preview Modal -->
                <div class="modal" id="transcriptModal">
                    <div class="modal-content transcript-modal">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-scroll"></i> Transcript Preview
                            </h3>
                            <button class="modal-close" onclick="closeTranscriptModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div id="transcriptPreview" class="transcript-container">
                                <!-- Transcript content will be generated here -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeTranscriptModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                            <button class="btn btn-success" onclick="printTranscript()">
                                <i class="fas fa-print"></i> Print
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Batch Generate Modal -->
                <div class="modal" id="batchModal">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-layer-group"></i> Batch Generate Transcripts
                            </h3>
                            <button class="modal-close" onclick="closeBatchModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>Select Grade Level</label>
                                <select class="filter-select" id="batchGradeSelect">
                                    <option value="">-- Select Grade --</option>
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
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="completeOnlyCheck" checked>
                                    Generate only for students with complete grades
                                </label>
                            </div>
                            <div id="batchSummary" style="margin-top: 20px; padding: 15px; background: var(--light-gray); border-radius: 8px; display: none;">
                                <h4 style="color: var(--maroon); margin-bottom: 10px;">Summary</h4>
                                <p id="batchCount"></p>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeBatchModal()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button class="btn btn-primary" onclick="generateBatch()">
                                <i class="fas fa-cog"></i> Generate
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Information Card -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-info-circle"></i> Transcript Information</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div style="display: grid; gap: 15px;">
                            <div style="padding: 15px; background: #e7f3ff; border-left: 4px solid #007bff; border-radius: 8px;">
                                <h4 style="color: #007bff; margin-bottom: 8px;"><i class="fas fa-check-circle"></i> Official Transcript</h4>
                                <p style="color: #666; font-size: 14px; margin: 0;">The transcript contains complete academic records including all subjects, grades, and general average for each grading period.</p>
                            </div>
                            <div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px;">
                                <h4 style="color: #856404; margin-bottom: 8px;"><i class="fas fa-exclamation-triangle"></i> Requirements</h4>
                                <p style="color: #666; font-size: 14px; margin: 0;">Transcripts can only be generated for students with complete grade records across all quarters. Incomplete records will be flagged.</p>
                            </div>
                            <div style="padding: 15px; background: #d4edda; border-left: 4px solid #28a745; border-radius: 8px;">
                                <h4 style="color: #155724; margin-bottom: 8px;"><i class="fas fa-shield-alt"></i> Authenticity</h4>
                                <p style="color: #666; font-size: 14px; margin: 0;">All generated transcripts include the school seal, registrar's signature, and date of issuance for official use.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/transcripts.js"></script>
</body>
</html>