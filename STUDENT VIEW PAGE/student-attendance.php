<?php
// DATABASE CONNECTION (PDO)
require_once "connect2.php"; 
$pdo = getDBConnection();
session_start();

// TEMPORARY STUDENT ID — Replace with actual login session
$studentID = $_SESSION["student_id"] ?? 1;

$sql1 = "SELECT COUNT(Student_Record_ID) AS total 
         FROM attendance 
         WHERE Status = 'present' 
           AND Student_Record_ID = :studentID";

$stmt1 = $pdo->prepare($sql1);
$stmt1->bindParam(':studentID', $studentID, PDO::PARAM_INT);
$stmt1->execute();

$rowss = $stmt1->fetch(PDO::FETCH_ASSOC);

$sql2 = "SELECT COUNT(Student_Record_ID) AS total 
         FROM attendance 
         WHERE Status = 'absent' 
           AND Student_Record_ID = :studentID";

$stmt2 = $pdo->prepare($sql2);
$stmt2->bindParam(':studentID', $studentID, PDO::PARAM_INT);
$stmt2->execute();

$rows2 = $stmt2->fetch(PDO::FETCH_ASSOC);

$sql3 = "SELECT COUNT(Student_Record_ID) AS total 
         FROM attendance 
         WHERE Status = 'late' 
           AND Student_Record_ID = :studentID";

$stmt3 = $pdo->prepare($sql3);
$stmt3->bindParam(':studentID', $studentID, PDO::PARAM_INT);
$stmt3->execute();

$rows3 = $stmt3->fetch(PDO::FETCH_ASSOC);

$sql4 = "SELECT * FROM attendance 
         WHERE Student_Record_ID = :studentID";
$stmt4 = $pdo->prepare($sql4);
$stmt4->bindParam(':studentID', $studentID, PDO::PARAM_INT);
$stmt4->execute();

$rows4 = $stmt4->fetchAll(PDO::FETCH_ASSOC);



?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Student — Attendance</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
    />
    <link rel="stylesheet" href="student-css/style.css" />
    <link rel="stylesheet" href="student-css/dashboard.css" />
    <link rel="stylesheet" href="student-css/student.css" />
    <link rel="stylesheet" href="student-css/student-attendance.css" />

    <style>
    </style>
  </head>
  <body class="dashboard-page">
    <div class="dashboard-container">
      <aside class="sidebar">
        <div class="sidebar-header"><h2>ABSAS-SIMS</h2></div>
        <nav class="sidebar-nav">
          <a href="student-personal-profile.php" class="nav-item">
            <span class="icon"><i class="fas fa-user-circle"></i> </span
            ><span class="text">Personal Information</span>
          </a>
          <a href="student-grades.php" class="nav-item">
            <span class="icon"><i class="fas fa-file-alt"></i> </span
            ><span class="text">My Grades</span>
          </a>
          <a href="student-class-schedule.php" class="nav-item">
            <span class="icon"><i class="fas fa-clipboard-check"></i> </span
            ><span class="text">My Schedules</span>
          </a>
          <a href="student-attendance.php" class="nav-item active">
            <span class="icon"><i class="fas fa-calendar-check"></i> </span
            ><span class="text">Attendance</span>
          </a>
          <a href="student-transcript.php" class="nav-item">
            <span class="icon"><i class="fas fa-scroll"></i> </span
            ><span class="text">Transcript</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info" id="userInfoSidebar">
            <p class="user-name">My Portal</p>
            <p class="user-role">ABSAS-SIMS Student</p>
          </div>
          <button class="logout-btn-sidebar" id="logoutBtn">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </aside>

      <main class="main-content">
        <header class="top-header">
          <h1><i class="fas fa-calendar-check"></i> Attendance</h1>
          <div class="header-actions">
            <span class="date-time" id="dateTime"></span>
          </div>
        </header>

        <div class="content-area">
          <div class="attendance-top">
            <div style="flex: 1">
              <div class="small-muted">Attendance Summary</div>
              
              <div class="summary-grid" id="summaryGrid">
                <div class="att-card">

                  <div>
                    <div class="label">Days Present</div>
                    <div class="value"><?php echo $rowss['total']; ?></div>
                  </div>
                </div>
                <div class="att-card" style="border-left-color:#dc3545">
                  <div>
                    <div class="label">Days Absent</div>
                    <div class="value"><?php echo $rows2['total']; ?></div>
                  </div>
                </div>
                <div class="att-card" style="border-left-color:#ff8c00">
                  <div>
                    <div class="label">Days Late</div>
                    <div class="value"><?php echo $rows3['total']; ?></div>
                  </div>
                </div>
                <div class="att-card" style="border-left-color:var(--gold)">
                  <div>
                    <div class="label">Attendance Rate</div>
                    <div class="value">${percent}%</div>
                  </div>
                </div>

              </div>
            </div>

            <div style="width: 420px"> 
              <div class="small-muted">Select Month (last 9 months)</div>
              <div class="month-controls">
                <select id="monthSelect" class="month-select"></select>
                <div class="small-muted" id="selectedTotals"></div>
              </div>
              <div class="legend">
                <div class="item">
                  <span class="swatch" style="background: #28a745"></span>
                  Present
                </div>
                <div class="item">
                  <span class="swatch" style="background: #dc3545"></span>
                  Absent
                </div>
                <div class="item">
                  <span class="swatch" style="background: #ff8c00"></span> Late
                </div>
              </div>
            </div>
          </div>

          <div class="calendar-wrap">
            <div id="calendarArea"></div>
          </div>

          <div class="table-card">
            <h3 style="margin: 0 0 6px 0; color: var(--maroon)">
              Monthly Attendance Details
            </h3>
            <div class="small-muted">
              Dates listed here are school days (Mon–Fri)
            </div>
            <table class="month-table" id="monthTable">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <?php    foreach ($rows4 as $row):   ?>
                <tr>
                  <th>
                    <?= htmlspecialchars($row['Date'] ?? '-') ?>
                  </th>
                  <th>
                    <?= htmlspecialchars($row['Status'] ?? '-') ?>
                  </th>
                  <th>
                    <?= htmlspecialchars($row['Remarks'] ?? '-') ?>
                  </th>
                </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
    <script src="student-js/student.js"></script>
    <script src="student-js/student-attendance.js"></script>
  </body>
</html>
