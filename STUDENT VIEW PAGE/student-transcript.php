<?php
// DATABASE CONNECTION (PDO)
require_once "connect2.php"; 
$pdo = getDBConnection();

session_start();

// TEMPORARY STUDENT ID — Replace with actual login session
$studentID = $_SESSION["student_id"] ?? 1;

// FETCH STUDENT INFORMATION
$studentStmt = $pdo->prepare("SELECT * FROM students WHERE Student_Record_ID = ?");
$studentStmt->execute([$studentID]);
$student = $studentStmt->fetch(PDO::FETCH_ASSOC);

// FETCH GRADES
$gradeStmt = $pdo->prepare("SELECT * FROM grade WHERE Student_Record_ID = ?");
$gradeStmt->execute([$studentID]);
$grades = $gradeStmt->fetch(PDO::FETCH_ASSOC);

// SUBJECT LIST
$subjects = [
    "sub1" => "Mathematics",
    "sub2" => "Science",
    "sub3" => "English",
    "sub4" => "Filipino",
    "sub5" => "MAPEH",
    "sub6" => "Araling Panlipunan",
    "sub7" => "Physical Education"
];

// FUNCTION TO COMPUTE FINAL GRADE
function computeFinal($g, $sub) {
    $q1 = $g["q1_$sub"] ?? 0;
    $q2 = $g["q2_$sub"] ?? 0;
    $q3 = $g["q3_$sub"] ?? 0;
    $q4 = $g["q4_$sub"] ?? 0;

    return round(($q1 + $q2 + $q3 + $q4) / 4);
}

$sqls = "SELECT * FROM students WHERE Student_Record_ID = :sa";
$stmts = $pdo->prepare($sqls);
$stmts->bindParam(':sa', $studentID, PDO::PARAM_STR);
$stmts->execute();

    // Fetch result
    $rowss = $stmts->fetch(PDO::FETCH_ASSOC);

    $sql1 = "SELECT COUNT(Student_Record_ID) AS total FROM attendance WHERE Student_Record_ID = :sa AND Status ='present'";
$stmt1 = $pdo->prepare($sql1);
$stmt1->bindParam(':sa', $studentID, PDO::PARAM_STR);
$stmt1->execute();

    // Fetch result
    $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
    
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Student — Transcript of Records</title>

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
          <a href="student-attendance.php" class="nav-item">
            <span class="icon"><i class="fas fa-calendar-check"></i> </span
            ><span class="text">Attendance</span>
          </a>
          <a href="student-transcript.php" class="nav-item active">
            <span class="icon"><i class="fas fa-scroll"></i></span>
            <span class="text">Transcript</span>
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
          <h1><i class="fas fa-scroll"></i> Transcript of Records</h1>
          <div class="header-actions">
            <span class="date-time" id="dateTime"></span>
          </div>
        </header>

        <div class="transcript-card">
          <div class="transcript-header">
            <img src="ABSAS LOGO.jpg" alt="Logo" />
            <div class="school-info">
              <h2>A.B. Simpson Alliance School</h2>
              <p>Official Transcript of Records</p>
              <p>School Year: 2025–2026</p>
            </div>
          </div>

          <div class="student-info">
            <div class="info-row">
              <p><strong>Name:</strong> <span id="tName"><?php echo $rowss['Student_First_Name']; ?> <?php echo $rowss['Student_Last_Name']; ?></span></p>
              <p><strong>Grade:</strong> <span id="tGrade"><?php echo $rowss['Student_Grade_Level']; ?></span></p>
            </div>

            <div class="info-row">
              <p><strong>LRN:</strong> <?php echo $rowss['LRN_ID']; ?></p>
              <p><strong>Grade: </strong> A</p>
            </div>

            <div class="info-row">
              <p>
                <strong>Number of Absences:</strong>
                <span id="tAbsences">3</span>
              </p>
              <p>
                <strong>Days Present:</strong> <span id="tPresent"> <?php echo $row1['total']; ?></span>
              </p>
            </div>
          </div>

          <table class="transcript-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>1st  Grade</th>
                <th>2nd Grade</th>
                <th>3rd Grade</th>
                <th>4th Grade</th>
                <th>Final Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody id="transcriptBody">
              <?php foreach ($subjects as $key => $subjectName): 

                  // Quarter grades
                  $q1 = $grades["q1_$key"];
                  $q2 = $grades["q2_$key"];
                  $q3 = $grades["q3_$key"];
                  $q4 = $grades["q4_$key"];

                  // Final grade = average of 4 quarters
                  $final = round(($q1 + $q2 + $q3 + $q4) / 4);

                  // Passed / Failed
                  $remarks = $final >= 75 ? "Passed" : "Failed";

              ?>
              <tr>
                  <td><?= $subjectName ?></td>
                  <td><?= $q1 ?></td>
                  <td><?= $q2 ?></td>
                  <td><?= $q3 ?></td>
                  <td><?= $q4 ?></td>
                  <td><?= $final ?></td>
                  <td><?= $remarks ?></td>
              </tr>
              <?php endforeach; ?>

            </tbody>
          </table>

          <div class="signature-section">
            <div class="signature-block">
              <div class="signature-line"></div>
              <p>Class Adviser</p>
            </div>

            <div class="signature-block">
              <div class="signature-line"></div>
              <p>School Registrar</p>
            </div>
          </div>

          <button class="print-btn" onclick="window.print()">
            Print Transcript
          </button>
        </div>
      </main>
    </div>

    <script src="student-js/student.js"></script>

    <script>
    </script>
  </body>
</html>
