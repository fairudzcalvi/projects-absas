<?php
require_once "connect2.php"; 
$conn = getDBConnection();

$conn = getDBConnection();

$sql = "SELECT * FROM grades";
$stmt = $conn->prepare($sql);
$stmt->execute();

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

$sql3 = "SELECT * FROM grades WHERE Student_Record_ID =1";
$stmt3= $conn->prepare($sql3);
$stmt3->execute();

$rows3 = $stmt3->fetch(PDO::FETCH_ASSOC);

$subjects = [
    "sub1" => "Mathematics",
    "sub2" => "Science",
    "sub3" => "English",
    "sub4" => "Filipino",
    "sub5" => "MAPEH",
    "sub6" => "Araling Panlipunan",
    "sub7" => "Physical Education"
];


?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Teacher - Page</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="dashboard.css">
  <link rel="stylesheet" href="teacher-view-grades.css">
</head>

<body class="dashboard-page">
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header"><h2>ABSAS-SIMS</h2></div>
      <nav class="sidebar-nav">
        <a href="teacher-view-students.php" class="nav-item">
            <span class="icon"><i class="fas fa-user-graduate"></i>
            </span><span class="text">Class List</span>
        </a>
        <a href="teacher-view-attendance.php" class="nav-item">
            <span class="icon"><i class="fas fa-clipboard-check"></i>
            </span><span class="text">Students Attendance</span>
        </a>
        <a href="teacher-view-grades.php" class="nav-item active">
            <span class="icon"><i class="fas fa-file-alt"></i>
            </span><span class="text">Students Grades</span>
        </a>
      </nav>
      <div class="sidebar-footer">
                <div class="user-info" id="userInfoSidebar">
                    <p class="user-name">Teacher Account</p>
                    <p class="user-role">user</p>
                </div>
                <button class="logout-btn-sidebar" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Log out
                </button>
            </div>
        </aside>

    <main class="main-content">
      <header class="top-header">
        <h1><i class="fas fa-file-alt"></i> Grading System</h1>
        <div class="header-actions">
          <span class="date-time" id="dateTime"></span>
        </div>
      </header>

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
                        <th>Student</th>
                        <th>Mathematics</th>
                        <th>Science</th>
                        <th>English</th>
                        <th>Filipino</th>
                        <th>Araling Panlipunan</th>
                        <th>Physical Education</th>
                        <th>Finals</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                  <?php    foreach ($rows as $row): 
                    $ket = $row['Student_Record_ID'];

                    $sql1 = "SELECT * FROM students WHERE Student_Record_ID = :ket";
                    $stmt1 = $conn->prepare($sql1);
                    $stmt1->bindParam(':ket', $ket, PDO::PARAM_INT);
                    $stmt1->execute();

                    $row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
                  // Final grade = average of 4 quarters

?>
                    <tr>
                      <td>
                        <strong><?= htmlspecialchars($row1['Student_First_Name'] ?? '-') ?> <?= htmlspecialchars($row1['Student_Last_Name'] ?? '-') ?>
                      </td>

                      <td>
                      </td>
                      <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        
                      </td>
                        
                        <td>
                      </td>
                        <td>
                          <button onclick="openFacultyModal()">EDIT</button>
                      </td>
                    </tr>

                <?php endforeach; ?>
                    
                </tbody>
              </div>
            </table>
        </div>
    </div>

        <div class="modal" id="gradeModal">
          <div class="modal-content" style="max-width:800px;">
            <div class="modal-header">
              <h3 class="modal-title" id="gradeModalTitle"><i class="fas fa-edit"></i> Student Grade Details</h3>
              <button class="modal-close" onclick="closeGradeModal()">&times;</button>
            </div>
            <div class="modal-body" id="gradeModalBody"></div>
            <div class="modal-footer">
              <button class="btn btn-secondary" onclick="closeGradeModal()"><i class="fas fa-times"></i> Close</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
                <button class="btn btn-primary" onclick="saveStudent()">
                <i class="fas fa-save"></i> Save
            </button>
            </div>
            
             <!-- Grade Legend -->
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title"><i class="fas fa-info-circle"></i> Grading System Legend</h2>
                    </div>
                    <div style="padding: 20px;">
                        <div class="legend-grid">
                            <div class="legend-item">
                                <div class="legend-box outstanding">90-100</div>
                                <span>Outstanding</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box very-satisfactory">85-89</div>
                                <span>Very Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box satisfactory">80-84</div>
                                <span>Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box fairly-satisfactory">75-79</div>
                                <span>Fairly Satisfactory</span>
                            </div>
                            <div class="legend-item">
                                <div class="legend-box did-not-meet">Below 75</div>
                                <span>Did Not Meet Expectations</span>
                            </div>
                        </div>
                        <p style="margin-top: 15px; font-size: 13px; color: #666; font-style: italic;">
                            <i class="fas fa-exclamation-circle"></i> 
                            Note: Grades are entered and managed by subject teachers. Administrators have view-only access to maintain grade integrity.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <!-- Add/Edit Student Modal -->

    <div class="modal" id="facultyModal">
                    <div class="modal-content" style="max-width: 700px;">
                        <div class="modal-header">
                            <h3 class="modal-title" id="facultyModalTitle">
                                <i class="fas fa-user-plus"></i> Add Faculty
                            </h3>
                            <button class="modal-close" onclick="closeFacultyModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form method="post" id="facultyForm" action="saves.php">
                                <h4 style="color: var(--maroon); margin-bottom: 15px; border-bottom: 2px solid var(--gold); padding-bottom: 10px;">
                                    <i class="fas fa-id-card"></i> Grades
                                </h4>
                                <div class="form-grid">
                                  <div class="form-group">
                                        <label for="department">Quarter *</label>
                                        <select id="department" name="department" required>
                                            <option value="1">1st Quarter</option>
                                            <option value="2">2nd Quarter</option>s
                                            <option value="3">3rd Quarter</option>
                                            <option value="4">4th Quarter</option>
                                        </select>
                                    </div>
                                    <div class="form-group">

                                    <?php
                                    ?>
                                        <label for="facultyId">Mathematics *</label>
                                        <input type="text" id="Mathematics" name="Mathematics" value="" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="employeeId">Science</label>
                                        <input type="text" id="Science" name="Science" value="">
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyFirstName">English *</label>
                                        <input type="text" id="English" name="English"value="" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyLastName">Filipino *</label>
                                        <input type="text" id="Filipino" name="Filipino" value="" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="facultyLastName">Physical Education *</label>
                                        <input type="text" id="Physical Education" name="Physical Education" value="" required>
                                    </div>
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
  <!-- =======================
     EDIT GRADE MODAL
======================= -->
<div id="editGradeModal" class="modal-overlay" style="display:none;">
    <div class="modal">
        <div class="modal-header">
            <h3><i class="fas fa-edit"></i> Edit Grade</h3>
            <button class="close-btn" onclick="closeEditGradeModal()">&times;</button>
        </div>

        <div class="modal-body">
            <div class="form-group">
                <label>Student Name</label>
                <input type="text" id="editGradeStudentName" disabled class="search-input">
            </div>

            <div class="form-group">
                <label>Subject</label>
                <input type="text" id="editGradeSubject" disabled class="search-input">
            </div>

            <div class="form-group">
                <label>Quarter</label>
                <input type="text" id="editGradeQuarter" disabled class="search-input">
            </div>

            <div class="form-group">
                <label>Grade</label>
                <input type="number" id="editGradeValue" class="search-input" min="60" max="100">
            </div>
        </div>

        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeEditGradeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveGradeEdit()">Save</button>
        </div>
    </div>
</div>

<script src="teacher-view-grades.js"></script>
</body>
</html>

