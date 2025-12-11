<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student — Class Schedule</title>
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
          <a href="student-class-schedule.php" class="nav-item active">
            <span class="icon"><i class="fas fa-clipboard-check"></i> </span
            ><span class="text">My Schedules</span>
          </a>
          <a href="student-attendance.php" class="nav-item">
            <span class="icon"><i class="fas fa-calendar-check"></i> </span
            ><span class="text">Attendance</span>
          </a>
          <a href="student-transcript.php" class="nav-item">
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
          <h1><i class="fas fa-calendar-alt"></i> Class Schedules</h1>
          <div class="header-actions">
            <span class="date-time" id="dateTime"></span>
          </div>
        </header>

        <div class="card schedule-card">
          <h2 class="card-title">Weekly Timetable</h2>

          <div class="table-responsive">
            <table class="schedule-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                  <th>Saturday</th>
                  <th>Sunday</th>
                </tr>
              </thead>

              <tbody id="scheduleBody"></tbody>
            </table>
          </div>
        </div>
      </main>
    </div>

    <script src="student-js/student-class-schedules.js"></script>
  </body>
</html>
