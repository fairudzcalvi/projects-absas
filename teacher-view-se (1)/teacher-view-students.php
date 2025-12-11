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

    $sql3 = "SELECT * FROM students WHERE Student_Record_ID = 1";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->execute();

    // Fetch result
    $row3 = $stmt3->fetchAll(PDO::FETCH_ASSOC);
    
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Teacher - Page</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="dashboard.css" />
  </head>

  <script src="teacher-classlist.js"></script>

  <body class="dashboard-page">
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>ABSAS-SIMS</h2>
        </div>

        <nav class="sidebar-nav">
          <a href="teacher-view-students.php" class="nav-item active">
            <span class="icon"><i class="fas fa-user-graduate"></i></span>
            <span class="text">Class List</span>
          </a>
          <a href="teacher-view-attendance.php" class="nav-item">
            <span class="icon"><i class="fas fa-clipboard-check"></i></span>
            <span class="text">Students Attendance</span>
          </a>
          <a href="teacher-view-grades.php" class="nav-item">
            <span class="icon"><i class="fas fa-file-alt"></i></span>
            <span class="text">Students Grades</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info" id="userInfoSidebar">
            <p class="user-name">User</p>
            <p class="user-role">Teacher</p>
          </div>
          <button class="logout-btn-sidebar" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Log out
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
                <div class="stat-number" id="totalStudents">0</div>
                <div class="stat-label">Total Students</div>
              </div>
            </div>
            <div class="stat-card blue">
              <div class="stat-icon">
                <i class="fas fa-male"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number" id="maleCount">0</div>
                <div class="stat-label">Male Students</div>
              </div>
            </div>
            <div class="stat-card gold">
              <div class="stat-icon">
                <i class="fas fa-female"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number" id="femaleCount">0</div>
                <div class="stat-label">Female Students</div>
              </div>
            </div>
            <div class="stat-card green">
              <div class="stat-icon">
                <i class="fas fa-school"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number" id="sectionCount">0</div>
                <div class="stat-label">Active Sections</div>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">
                <i class="fas fa-filter"></i> Filter Students
              </h2>
            </div>
            <div style="padding: 20px">
              <div class="form-grid">
                <div class="form-group" style="margin-bottom: 0">
                  <label>Grade Level</label>
                  <select
                    class="filter-select"
                    id="gradeFilter"
                    onchange="filterStudents()"
                  >
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
                <div class="form-group" style="margin-bottom: 0">
                  <label>Gender</label>
                  <select
                    class="filter-select"
                    id="genderFilter"
                    onchange="filterStudents()"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div class="form-group" style="margin-bottom: 0">
                  <label>Search</label>
                  <input
                    type="text"
                    class="search-input"
                    id="studentSearch"
                    placeholder="Name, LRN, or ID..."
                    oninput="filterStudents()"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Students Table -->
          <div class="card">
            <div class="card-header">
              <h2 class="card-title" id="tableTitle">All Students</h2>
              <div style="display: flex; gap: 10px">
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
                                </tr>
                                <?php endforeach; ?>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add/Edit Student Modal -->

    <script src="teacher-view-students.js"></script>
  </body>
</html>
