<?php
require_once "connect2.php"; 
$conn = getDBConnection();
session_start();
$ssau = $_SESSION['student_id'];

$sql = "SELECT * FROM students WHERE Student_Record_ID = :sa";
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
  <title>Student — Personal Profile</title>
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
        <a href="student-personal-profile.php" class="nav-item active">
          <span class="icon"><i class="fas fa-user-circle"></i>
          </span><span class="text">Personal Information</span>
        </a>
        <a href="student-grades.php" class="nav-item">
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
        <div class="user-info" id="userInfoSidebar"><p class="user-name">My Portal Portal</p><p class="user-role">ABSAS-SIMS Student</p></div>
        <button class="logout-btn-sidebar" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-header">
        <h1><i class="fas fa-user-circle"></i> Student Portal</h1>
        <div class="header-actions">
          <span class="date-time" id="dateTime"></span>
        </div>
      </header>
    <div class="student-two-col">

   <section class="left-col">
      <div class="card" style="width:100%; text-align: center;">

        <h3 class="card-title"><i class="fas fa-id-card"></i> Personal Information</h3>

       <div class="personal-info-form">

    <div class="info-row-2col">
        <div class="info-group">
            <label>First Name</label>
            <input type="text" value="<?php echo $row['Student_First_Name']; ?>" readonly>
        </div>

        <div class="info-group">
            <label>Last Name</label>
            <input type="text" value="<?php echo $row['Student_Last_Name']; ?>" readonly>
        </div>
    </div>

    <div class="info-group">
        <label>Address</label>
        <textarea rows="3" readonly><?php echo $row['Student_Home_Address']; ?></textarea>
    </div>

    <div class="info-row-2col">
        <div class="info-group">
            <label>Phone Number</label>
            <input type="text" value="<?php echo $row['Student_Guardian_Contact']; ?>" readonly>
        </div>

        <div class="info-group">
            <label>Date of Birth</label>
            <input type="text" value="<?php echo $row['Student_BirthDate']; ?>" readonly>
        </div>
    </div>

    <div class="info-group">
        <label>Email Address</label>
        <input type="email" value="<?php echo $row['Student_Email']; ?>" readonly>
    </div>

    <div class="info-row-2col">
        <div class="info-group">
            <label>Nationality</label>
            <input type="text" value="Filipino" readonly>
        </div>

        <div class="info-group">
            <label>Age</label>
            <input type="text" value="<?php echo $row['Student_Age']; ?>" readonly>
        </div>
    </div>

</div>

        </div>

      </div>
    </main>
  </div>

  <script src="student-js/student.js"></script>
</body>
</html>
