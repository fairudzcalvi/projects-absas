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
    <title>Student Records - ABSAS-SIMS</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wgsht@300;400;500;600;700&display=swap" rel="stylesheet">
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
                <a href="dashboard.php" class="nav-item">
                    <span class="icon"><i class="fas fa-chart-line"></i></span>
                    <span class="text">Overview</span>
                </a>
                <a href="students.php" class="nav-item active">
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
                <h1><i class="fas fa-user-graduate"></i> Student Records</h1>
                <div class="header-actions">
                    <span class="date-time" id="dateTime"></span>
                </div>
            </header>
            
            <div class="content-area">
                <!-- Statistics Cards -->
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="totalStudents"><?php echo $rowss['total']; ?></div>
                            <div class="stat-label">Total Students</div>
                        </div>
                    </div>
                    <div class="stat-card blue">
                        <div class="stat-icon">
                            <i class="fas fa-male"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="maleCount"><?php echo $rowss1['total']; ?></div>
                            <div class="stat-label">Male Students</div>
                        </div>
                    </div>
                    <div class="stat-card gold">
                        <div class="stat-icon">
                            <i class="fas fa-female"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="femaleCount"><?php echo $rowss2['total']; ?></div>
                            <div class="stat-label">Female Students</div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Filter Students</h2>
                        <button class="btn btn-primary" onclick="openStudentModal()">
                            <i class="fas fa-user-plus"></i> Add Student
                        </button>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Grade Level</label>
                                <select class="filter-select" id="gradeFilter" onchange="filterStudents()">
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
                                <label>Gender</label>
                                <select class="filter-select" id="genderFilter" onchange="filterStudents()">
                                    <option value="">All Genders</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Search</label>
                                <input type="text" class="search-input" id="studentSearch" placeholder="Name, LRN, or ID..." oninput="filterStudents()">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Students Table -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title" id="tableTitle">All Students</h2>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-secondary" onclick="exportToExcel()">
                                <i class="fas fa-file-excel"></i> Export
                            </button>
                        </div>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>LRN</th>
                                    <th>Name</th>
                                    <th>Grade & Section</th>
                                    <th>Gender</th>
                                    <th>Age</th>
                                    <th>Guardian</th>
                                    <th>Contact</th>
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
                                    <td><i class="fas fa-${s.sex === 'Male' ? 'male' : 'female'}"></i> <?= htmlspecialchars($row['Student_Gender'] ?? '-') ?></td>
                                    <td><?= htmlspecialchars($row['Student_Age'] ?? '-') ?></td>
                                    <td><?= htmlspecialchars($row['Student_Guardian_Name'] ?? '-') ?></td>
                                    <td><?= htmlspecialchars($row['Student_Guardian_Contact'] ?? '-') ?></td>
                                    <td style="white-space: nowrap;">
                                        <button class="btn btn-sm btn-secondary" onclick="" title="View Details">
                                    
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-secondary" onclick="EditModal(<?php echo $row['Student_Record_ID'] ?>)" title="Edit">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" onclick="deleteStudent()" title="Delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Add/Edit Student Modal -->
                <div class="modal" id="studentModal">
                    <div class="modal-content" style="max-width: 700px;">
                        <div class="modal-header">
                            <h3 class="modal-title" id="studentModalTitle">
                                <i class="fas fa-user-plus"></i> Add Student
                            </h3>
                            <button class="modal-close" onclick="closeStudentModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form method="POST" id="studentForm" action="save-php/save-students.php">
                                <h4 style="color: var(--maroon); margin-bottom: 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-id-card"></i> Basic Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="studentId">Student ID *</label>
                                        <input type="text" id="studentId" name="id" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lrn">LRN (Learner Reference Number) *</label>
                                        <input type="text" id="lrn" name="lrn" maxlength="12" placeholder="123456789012" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="firstName">First Name *</label>
                                        <input type="text" id="firstName" name="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Last Name *</label>
                                        <input type="text" id="lastName" name="lastName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="lastName">Middle Name *</label>
                                        <input type="text" id="middleName" name="middleName" required>
                                    </div>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-school"></i> Academic Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="grade">Grade Level *</label>
                                        <select id="grade" name="grade" required>
                                            <option value="">Select grade</option>
                                            <option value="1">Grade 1 - MATTHEW</option>
                                            <option value="2">Grade 2 - MARK</option>
                                            <option value="3">Grade 3 - LUKE</option>
                                            <option value="4">Grade 4 - JOHN</option>
                                            <option value="5">Grade 5 - ACTS</option>
                                            <option value="7">Grade 7 - GENESIS</option>
                                            <option value="8">Grade 8 - EXODUS</option>
                                            <option value="9">Grade 9 - LEVITICUS</option>
                                            <option value="10">Grade 10 - NUMBERS</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="enrollDate">Enrollment Date *</label>
                                        <input type="date" id="enrollDate" name="enrollDate" required>
                                    </div>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-user"></i> Personal Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="sex">Gender *</label>
                                        <select id="sex" name="sex" required>
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="age">Age *</label>
                                        <input type="number" id="age" name="age" min="5" max="20" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">BirthDay</label>
                                        <input type="date" id="birthday" name="birthday" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="phone">Contact Number</label>
                                        <input type="tel" id="phone" name="phone" placeholder="09171234567">
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email Address</label>
                                        <input type="email" id="email" name="email" placeholder="student@example.com">
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Password</label>
                                        <input type="text" id="Epass" name="Epass" placeholder="Passwrod123">
                                    </div>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-home"></i> Guardian Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="guardian">Parent/Guardian Name *</label>
                                        <input type="text" id="guardian" name="guardian" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="guardianContact">Guardian Contact</label>
                                        <input type="tel" id="guardianContact" name="guardianContact" placeholder="09171234567">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="address">Home Address *</label>
                                    <input type="text" id="address" name="address" placeholder="Complete address" required>
                                </div>

                                <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeStudentModal()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Student
                            </button>
                        </div>
                            </form>
                        </div>
                        
                    </div>
                </div>

                <!-- View Student Modal -->
                <div class="modal" id="viewStudentModal">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-user"></i> Student Details
                            </h3>
                            <button class="modal-close" onclick="closeViewModal()">&times;</button>
                        </div>
                        <div class="modal-body" id="studentDetailsBody">
                            <!-- Details will be populated here -->
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeViewModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>


<!-- EDIT STUDENT MODAL -->
<div class="modal" id="EditModal">
    <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
            <h3 class="modal-title" id="studentModalTitle1">
                <i class="fas fa-edit"></i> Edit Student
            </h3>
            <button class="modal-close" onclick="closeStudentModal1()">&times;</button>
        </div>

        <div class="modal-body">
            <form method="POST" id="studentForm1" action="save-php/student-update.php">

                <!-- BASIC INFORMATION -->
                <h4 class="section-title">
                    <i class="fas fa-id-card"></i> Basic Information
                </h4>
                <div class="form-grid">

                    <div class="form-group">
                        <label for="edit_studentId">Student ID *</label>
                        <input type="text" id="edit_studentId" name="id" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_lrn">LRN *</label>
                        <input type="text" id="edit_lrn" name="lrn" maxlength="12" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_firstName">First Name *</label>
                        <input type="text" id="edit_firstName" name="firstName" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_lastName">Last Name *</label>
                        <input type="text" id="edit_lastName" name="lastName" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_middleName">Middle Name *</label>
                        <input type="text" id="edit_middleName" name="middleName" required>
                    </div>
                </div>

                <!-- ACADEMIC INFORMATION -->
                <h4 class="section-title">
                    <i class="fas fa-school"></i> Academic Information
                </h4>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit_grade">Grade Level *</label>
                        <select id="edit_grade" name="grade" required>
                            <option value="">Select grade</option>
                            <option value="1">Grade 1 - MATTHEW</option>
                            <option value="2">Grade 2 - MARK</option>
                            <option value="3">Grade 3 - LUKE</option>
                            <option value="4">Grade 4 - JOHN</option>
                            <option value="5">Grade 5 - ACTS</option>
                            <option value="7">Grade 7 - GENESIS</option>
                            <option value="8">Grade 8 - EXODUS</option>
                            <option value="9">Grade 9 - LEVITICUS</option>
                            <option value="10">Grade 10 - NUMBERS</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_enrollDate">Enrollment Date *</label>
                        <input type="date" id="edit_enrollDate" name="enrollDate" required>
                    </div>
                </div>

                <!-- PERSONAL INFORMATION -->
                <h4 class="section-title">
                    <i class="fas fa-user"></i> Personal Information
                </h4>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit_sex">Gender *</label>
                        <select id="edit_sex" name="sex" required>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="edit_age">Age *</label>
                        <input type="number" id="edit_age" name="age" min="5" max="20" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_birthday">Birthday *</label>
                        <input type="date" id="edit_birthday" name="birthday" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_phone">Contact Number</label>
                        <input type="tel" id="edit_phone" name="phone" placeholder="09171234567">
                    </div>

                    <div class="form-group">
                        <label for="edit_email">Email Address</label>
                        <input type="email" id="edit_email" name="email" placeholder="student@example.com">
                    </div>

                    <div class="form-group">
                        <label for="edit_Epass">Password</label>
                        <input type="text" id="edit_Epass" name="Epass" placeholder="Password123">
                    </div>
                </div>

                <!-- GUARDIAN INFO -->
                <h4 class="section-title">
                    <i class="fas fa-home"></i> Guardian Information
                </h4>

                <div class="form-grid">
                    <div class="form-group">
                        <label for="edit_guardian">Parent/Guardian Name *</label>
                        <input type="text" id="edit_guardian" name="guardian" required>
                    </div>

                    <div class="form-group">
                        <label for="edit_guardianContact">Guardian Contact</label>
                        <input type="tel" id="edit_guardianContact" name="guardianContact">
                    </div>
                </div>

                <div class="form-group">
                    <label for="edit_address">Home Address *</label>
                    <input type="text" id="edit_address" name="address" required>
                </div>

                <!-- FOOTER BUTTONS -->
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" onclick="closeStudentModal1()">
                        <i class="fas fa-times"></i> Cancel
                    </button>

                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Update Student
                    </button>
                </div>

            </form>
        </div>
    </div>
</div>


                <!-- View Student Modal -->
                <div class="modal" id="viewStudentModal">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-user"></i> Student Details
                            </h3>
                            <button class="modal-close" onclick="closeViewModal()">&times;</button>
                        </div>
                        <div class="modal-body" id="studentDetailsBody">
                            <!-- Details will be populated here -->
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeViewModal()">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    
    <script src="admin-js/students.js">
        
    </script>
</body>
</html>