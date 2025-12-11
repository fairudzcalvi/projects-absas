<?php
require_once "connect2.php"; 
$conn = getDBConnection();
session_start();
$ssau = $_SESSION['student_id'];

$sql = "SELECT * FROM grade WHERE Student_Record_ID = :sa";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':sa', $ssau, PDO::PARAM_STR);
$stmt->execute();


// Fetch result
$row = $stmt->fetch(PDO::FETCH_ASSOC);
?>

<!doctype html><html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student — Grades</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="student-css/style.css">
  <link rel="stylesheet" href="student-css/dashboard.css">
  <link rel="stylesheet" href="student-css/student.css">
</head>
<body class="dashboard-page">
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header"><h2>ABSAS-SIMS</h2></div>
      <nav class="sidebar-nav">
        <a href="student-personal-profile.php" class="nav-item">
          <span class="icon"><i class="fas fa-user-circle"></i>
          </span><span class="text">Personal Information</span>
        </a>
        <a href="student-grades.php" class="nav-item active">
          <span class="icon"><i class="fas fa-file-alt"></i>
          </span><span class="text">My Grades</span>
        </a>
        <a href="student-class-schedule.php" class="nav-item">
        <span class="icon"><i class="fas fa-clipboard-check"></i>
        </span><span class="text">My Schedules</span>
      </a>
        <a href="student-attendance.php" class="nav-item">
          <span class="icon"><i class="fas fa-calendar-check"></i>
          </span><span class="text">Attendance</span>
        </a>
      <a href="student-transcript.php" class="nav-item">
          <span class="icon"><i class="fas fa-scroll"></i></span>
          <span class="text">Transcript</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="user-info" id="userInfoSidebar"><p class="user-name">My Portal</p><p class="user-role">ABSAS-SIMS Student</p></div>
        <button class="logout-btn-sidebar" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </aside>

   <div class="main-content">
         <header class="top-header">
        <h1><i class="fas fa-file-alt"></i> My Grades</h1>
          <p>SY:2025-2026</p>
        <div class="header-actions">
          <span class="date-time" id="dateTime"></span>
        </div>
      </header>
      <div class="card schedule-card">
             <div class="table-responsive">
            <table class="grades-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>1st Quarter</th>
                        <th>2nd Quarter</th>
                        <th>3rd Quarter</th>
                        <th>4th Quarter</th>
                        <th>Finals</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>Mathematics</td>
                        <td><?php echo $row['q1_sub1']; ?></td>
                        <td><?php echo $row['q2_sub1']; ?></td>
                        <td><?php echo $row['q3_sub1']; ?></td>
                        <td><?php echo $row['q4_sub1']; ?></td>
                        <td></td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>Science</td>
                        <td><?php echo $row['q1_sub2']; ?></td>
                        <td><?php echo $row['q2_sub2']; ?></td>
                        <td><?php echo $row['q3_sub2']; ?></td>
                        <td><?php echo $row['q4_sub2']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>Physical Education</td>
                        <td><?php echo $row['q1_sub3']; ?></td>
                        <td><?php echo $row['q2_sub3']; ?></td>
                        <td><?php echo $row['q3_sub3']; ?></td>
                        <td><?php echo $row['q4_sub3']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>English</td>
                        <td><?php echo $row['q1_sub4']; ?></td>
                        <td><?php echo $row['q2_sub4']; ?></td>
                        <td><?php echo $row['q3_sub4']; ?></td>
                        <td><?php echo $row['q4_sub4']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>Filipino</td>
                        <td><?php echo $row['q1_sub5']; ?></td>
                        <td><?php echo $row['q2_sub5']; ?></td>
                        <td><?php echo $row['q3_sub5']; ?></td>
                        <td><?php echo $row['q4_sub5']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>MAPEH</td>
                        <td><?php echo $row['q1_sub6']; ?></td>
                        <td><?php echo $row['q2_sub6']; ?></td>
                        <td><?php echo $row['q3_sub6']; ?></td>
                        <td><?php echo $row['q4_sub6']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>

                    <tr>
                        <td>Araling Panlipunan</td>
                        <td><?php echo $row['q1_sub7']; ?></td>
                        <td><?php echo $row['q2_sub7']; ?></td>
                        <td><?php echo $row['q3_sub7']; ?></td>
                        <td><?php echo $row['q4_sub7']; ?></td>
                        <td>—</td>
                        <td>—</td>
                    </tr>
                    <tr>
                        <td>General Average</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>%</td>
                        <td>Passed/Failed</td>
                    </tr>
                </tbody>
              </div>
            </table>
        </div>
    </div>

  <script src="student-js/student.js"></script>
</body>
</html>
