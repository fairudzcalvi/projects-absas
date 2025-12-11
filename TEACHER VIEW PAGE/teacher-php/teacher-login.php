<?php
session_start();
require_once "connect.php";  // must return a PDO instance

$conn = getDBConnection();

// Input
$username = trim($_POST['username'] ?? "");
$password = trim($_POST['password'] ?? "");

// Validate
if ($username === "" || $password === "") {
    $_SESSION['error'] = "Please enter both email/ID and password.";
    header("Location: ../teacher-login.html");
    exit();
}

try {
    // Query using real table columns
    $sql = "SELECT *
            FROM faculty
            WHERE Faculty_Email_Address = :input 
               OR Faculty_ID = :input 
               OR Employee_Number = :input
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':input', $username, PDO::PARAM_STR);
    $stmt->execute();

    // Check if found
    $teacher = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($teacher) {

        // 🔐 PASSWORD CHECK (plain text or hashed)
        // Plain text:
        if ($password === $teacher['Faculty_Password']) {

        // If hashed (recommended):
        // if (password_verify($password, $teacher['Faculty_Password'])) {

            // Store session
            $_SESSION['teacher_logged_in'] = true;
            $_SESSION['teacher_id']        = $teacher['Faculty_ID'];
            $_SESSION['teacher_name']      = $teacher['Faculty_First_Name'] . " " . $teacher['Faculty_Last_Name'];

            header("Location: ../teacher-view-students.php");
            exit();

        } else {
            $_SESSION['error'] = "Incorrect password.";
            header("Location: ../teacher-view-students.php");
            exit();
        }

    } else {
        $_SESSION['error'] = "Teacher account not found.";
        header("Location: ../teacher-view-students.php");
        exit();
    }

} catch (PDOException $e) {

    // Log the error (optional)
    // error_log($e->getMessage());

    $_SESSION['error'] = "Database error occurred.";
    header("Location: ../teacher-login.html");
    exit();
}
?>
