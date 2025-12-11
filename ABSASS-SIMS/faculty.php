<?php
require_once "connect2.php";

$conn = getDBConnection();

$sql = "SELECT COUNT(Faculty_Record_ID) AS total FROM faculty";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Fetch result
    $rowss = $stmt->fetch(PDO::FETCH_ASSOC);

    $sqls = "SELECT * FROM faculty";
    $stmts = $conn->prepare($sqls);
    $stmts->execute();

    // Fetch result
    $rows = $stmts->fetchAll(PDO::FETCH_ASSOC);

    $sql3 = "SELECT * FROM faculty WHERE Faculty_Record_ID = 1";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->execute();

    // Fetch result
    $row3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty Records - ABSAS-SIMS</title>
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
                <a href="dashboard.php" class="nav-item">
                    <span class="icon"><i class="fas fa-chart-line"></i></span>
                    <span class="text">Overview</span>
                </a>
                <a href="students.php" class="nav-item">
                    <span class="icon"><i class="fas fa-user-graduate"></i></span>
                    <span class="text">Student Records</span>
                </a>
                <a href="faculty.php" class="nav-item active">
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
                <h1><i class="fas fa-chalkboard-teacher"></i> Faculty Records</h1>
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
                            <div class="stat-number" id="totalFaculty"><?php echo $rowss['total']; ?></div>
                            <div class="stat-label">Total Faculty</div>
                        </div>
                    </div>
                    <div class="stat-card gold">
                        <div class="stat-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="advisersCount">0</div>
                            <div class="stat-label">Class Advisers</div>
                        </div>
                    </div>
                    <div class="stat-card green">
                        <div class="stat-icon">
                            <i class="fas fa-book-reader"></i>
                        </div>
                        <div class="stat-info">
                            <div class="stat-number" id="teachersCount">0</div>
                            <div class="stat-label">Subject Teachers</div>
                        </div>
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-filter"></i> Filter Faculty</h2>
                        <button class="btn btn-primary" onclick="openFacultyModal()">
                            <i class="fas fa-user-plus"></i> Add Faculty
                        </button>
                    </div>
                    <div style="padding: 20px;">
                        <div class="form-grid">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Department</label>
                                <select class="filter-select" id="departmentFilter" onchange="filterFaculty()">
                                    <option value="">All Departments</option>
                                    <option value="Elementary">Elementary (Grades 1-6)</option>
                                    <option value="Junior High">Junior High (Grades 7-10)</option>
                                    <option value="Administration">Administration</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Role</label>
                                <select class="filter-select" id="roleFilter" onchange="filterFaculty()">
                                    <option value="">All Roles</option>
                                    <option value="Teacher">Subject Teacher</option>
                                    <option value="Adviser">Class Adviser</option>
                                    <option value="Both">Teacher & Adviser</option>
                                </select>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Search</label>
                                <input type="text" class="search-input" id="facultySearch" placeholder="Name, ID, or Email..." oninput="filterFaculty()">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Faculty Table -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title" id="tableTitle">All Faculty Members</h2>
                        <button class="btn btn-secondary" onclick="exportToExcel()">
                            <i class="fas fa-file-excel"></i> Export
                        </button>
                    </div>
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Faculty ID</th>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>Role</th>
                                    <th>Assigned Class</th>
                                    <th>Subjects</th>
                                    <th>Contact</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="facultyTableBody">
                                <?php    foreach ($rows as $row):   ?>
                                <tr>
                                <td><strong><?= htmlspecialchars($row['Faculty_ID'] ?? '-') ?></strong></td>
                                <td><strong><?= htmlspecialchars($row['Faculty_First_Name'] ?? '-') ?> <?= htmlspecialchars($row['Faculty_Last_Name'] ?? '-') ?></strong></td>
                                <td><?= htmlspecialchars($row['Faculty_Department'] ?? '-') ?></td>
                                <td><span class="badge ${roleBadge}"><?= htmlspecialchars($row['Faculty_Position'] ?? '-') ?></span></td>
                                <td>N/A</td>
                                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${subjects}"><?= htmlspecialchars($row['Faculty_Subjects_Taught'] ?? '-') ?></td>
                                <td><?= htmlspecialchars($row['Faculty_Email_Address'] ?? '-') ?><br><small><?= htmlspecialchars($row['Faculty_Contact_Number'] ?? '-') ?></small></td>
                                <td><span class="badge ${statusBadge}"><?= htmlspecialchars($row['Faculty_Employment_Status'] ?? '-') ?></span></td>
                                <td style="white-space: nowrap;">
                                    <button class="btn btn-sm btn-secondary" onclick="viewFaculty(<?= htmlspecialchars($row['Faculty_ID'] ?? '-') ?>)" title="View Details">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-secondary" onclick="EditModal(<?= htmlspecialchars($row['Faculty_Record_ID'] ?? '-') ?>)" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger" onclick="deleteFaculty()" title="Delete">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Add/Edit Faculty Modal -->
                <div class="modal" id="facultyModal">
                    <div class="modal-content" style="max-width: 700px;">
                        <div class="modal-header">
                            <h3 class="modal-title" id="facultyModalTitle">
                                <i class="fas fa-user-plus"></i> Add Faculty
                            </h3>
                            <button class="modal-close" onclick="closeFacultyModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form method="post" id="facultyForm" action="save-php/save-faculty.php">
                                <h4 style="color: var(--maroon); margin-bottom: 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-id-card"></i> Basic Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="facultyId">Faculty ID *</label>
                                        <input type="text" id="facultyId" name="id" required readonly>
                                    </div>
                                    <div class="form-group">
                                        <label for="employeeId">Employee Number</label>
                                        <input type="text" id="employeeId" name="employeeId" placeholder="EMP-001">
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyFirstName">First Name *</label>
                                        <input type="text" id="facultyFirstName" name="firstName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyLastName">Last Name *</label>
                                        <input type="text" id="facultyLastName" name="lastName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyLastName">Middle Name *</label>
                                        <input type="text" id="facultyMiddleName" name="MiddleName" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyLastName">BirthDate *</label>
                                        <input type="date" id="facultyBirthDate" name="BirthDate" required>
                                    </div>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-briefcase"></i> Employment Details
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="department">Department *</label>
                                        <select id="department" name="department" required>
                                            <option value="">Select department</option>
                                            <option value="Elementary">Elementary (Grades 1-6)</option>
                                            <option value="Junior High">Junior High (Grades 7-10)</option>
                                            <option value="Administration">Administration</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="position">Position *</label>
                                        <input type="text" id="position" name="position" placeholder="e.g., Teacher III, Master Teacher" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="hireDate">Hire Date *</label>
                                        <input type="date" id="hireDate" name="hireDate" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="status">Employment Status *</label>
                                        <select id="status" name="status" required>
                                            <option value="Active">Active</option>
                                            <option value="On Leave">On Leave</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-school"></i> Teaching Assignment
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="isAdviser">Role *</label>
                                        <select id="isAdviser" name="isAdviser" onchange="toggleAdviserFields()" required>
                                            <option value="Teacher">Subject Teacher Only</option>
                                            <option value="Adviser">Class Adviser Only</option>
                                            <option value="Both">Teacher & Adviser</option>
                                        </select>
                                    </div>
                                    <div class="form-group" id="adviserGradeGroup" style="display: none;">
                                        <label for="adviserGrade">Adviser for Grade Level</label>
                                        <select id="adviserGrade" name="adviserGrade">
                                            <option value="0">Not Assigned</option>
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
                                </div>
                                <div class="form-group">
                                    <label for="subjects">Subjects Taught (comma-separated)</label>
                                    <input type="text" id="subjects" name="subjects" placeholder="e.g., Mathematics, Science, English">
                                    <small style="color: #666; font-size: 12px;">Enter subjects separated by commas</small>
                                </div>

                                <h4 style="color: var(--maroon); margin: 20px 0 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-address-card"></i> Contact Information
                                </h4>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="facultyEmail">Email Address *</label>
                                        <input type="email" id="facultyEmail" name="email" placeholder="teacher@absas.edu" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyPhone">Contact Number *</label>
                                        <input type="tel" id="facultyPhone" name="phone" placeholder="09171234567" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyPhone">Password *</label>
                                        <input type="text" id="facultyPassword" name="password" placeholder="09171234567" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="facultyAddress">Address</label>
                                    <input type="text" id="facultyAddress" name="address" placeholder="Complete address">
                                </div>
                                
                        <div class="modal-footer">
                            <button class="btn btn-secondary" onclick="closeFacultyModal()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Faculty
                            </button>
                        </div>
                            </form>
                        </div>
                    </div>
                </div>



                
                <div class="modal" id="EditModal">
    <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
            <h3 class="modal-title" id="facultyModalTitle1">
                <i class="fas fa-edit"></i> Edit Faculty
            </h3>
            <button class="modal-close" onclick="closeFacultyModal1()">&times;</button>
        </div>

        <div class="modal-body">
            <form method="post" id="facultyForm1" action="save-php/update-faculty.php">

                <!-- BASIC INFO -->
                <div class="form-grid">
                    <div class="form-group">
                        <label>Faculty ID *</label>
                        <input type="text" id="edit_facultyId" name="id" required readonly>
                    </div>

                    <div class="form-group">
                        <label>Employee Number</label>
                        <input type="text" id="edit_employeeId" name="employeeId">
                    </div>

                    <div class="form-group">
                        <label>First Name *</label>
                        <input type="text" id="edit_firstName" name="firstName" required>
                    </div>

                    <div class="form-group">
                        <label>Last Name *</label>
                        <input type="text" id="edit_lastName" name="lastName" required>
                    </div>

                    <div class="form-group">
                        <label>Middle Name *</label>
                        <input type="text" id="edit_middleName" name="MiddleName" required>
                    </div>

                    <div class="form-group">
                        <label>Birthdate *</label>
                        <input type="date" id="edit_birthDate" name="BirthDate" required>
                    </div>
                </div>

                <!-- Employment Details -->
                <div class="form-grid">
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="edit_department" name="department" required>
                            <option value="">Select department</option>
                            <option value="Elementary">Elementary</option>
                            <option value="Junior High">Junior High</option>
                            <option value="Administration">Administration</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Position *</label>
                        <input type="text" id="edit_position" name="position" required>
                    </div>

                    <div class="form-group">
                        <label>Hire Date *</label>
                        <input type="date" id="edit_hireDate" name="hireDate" required>
                    </div>

                    <div class="form-group">
                        <label>Status *</label>
                        <select id="edit_status" name="status" required>
                            <option value="Active">Active</option>
                            <option value="On Leave">On Leave</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <!-- Teacher Info -->
                <div class="form-group">
                    <label>Subjects Taught</label>
                    <input type="text" id="edit_subjects" name="subjects">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>Email *</label>
                        <input type="email" id="edit_email" name="email" required>
                    </div>

                    <div class="form-group">
                        <label>Phone *</label>
                        <input type="tel" id="edit_phone" name="phone" required>
                    </div>

                    <div class="form-group">
                        <label>Password *</label>
                        <input type="text" id="edit_password" name="password" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Address</label>
                    <input type="text" id="edit_address" name="address">
                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeFacultyModal1()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Update Faculty</button>
                </div>

            </form>
        </div>
    </div>
</div>


                <!-- View Faculty Modal -->
                <div class="modal" id="viewFacultyModal">
                    <div class="modal-content" style="max-width: 600px;">
                        <div class="modal-header">
                            <h3 class="modal-title">
                                <i class="fas fa-user"></i> Faculty Details
                            </h3>
                            <button class="modal-close" onclick="closeViewModal()">&times;</button>
                        </div>
                        <div class="modal-body" id="facultyDetailsBody">
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
    
    <script src="admin-js/faculty.js"></script>
</body>
</html>