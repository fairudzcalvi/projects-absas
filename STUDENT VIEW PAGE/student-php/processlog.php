<?php
session_start();
require_once "connect.php";  // Must return a PDO object

// Connect (make sure your getDBConnection() returns a PDO instance)
$conn = getDBConnection();

// Get input
$username = trim($_POST['suser'] ?? "");
$password = trim($_POST['spass'] ?? "");

// Validate inputs
if ($username === "" || $password === "") {
    $_SESSION['error'] = "Please fill in all fields.";
    header("Location: ../student-login.hmtl");
    exit();
}

try {
    // Prepare SQL with PDO
    $sql = "SELECT * FROM students WHERE Student_Email = :email";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':email', $username, PDO::PARAM_STR);
    $stmt->execute();

    // If student exists
    if ($stmt->rowCount() === 1) {
        $student = $stmt->fetch(PDO::FETCH_ASSOC);


            $_SESSION['student_logged_in'] = true;
            $_SESSION['student_id']        = $student['Student_Record_ID'];
            $_SESSION['student_grade']     = $student['Student_Grade_Level'];

                            // --- CHECK IF GRADE RECORD ALREADY EXISTS ---
                // --- CHECK IF GRADE RECORD ALREADY EXISTS ---
                $checkSql = "SELECT 1 FROM grade WHERE student_Record_ID = :sid LIMIT 1";
                $checkStmt = $conn->prepare($checkSql);
                $checkStmt->bindParam(':sid', $student['Student_Record_ID'], PDO::PARAM_INT);
                $checkStmt->execute();

                // If NOT found, insert
                if ($checkStmt->rowCount() === 0) {

                    $insertSql = "INSERT INTO grade (student_Record_ID)
                                VALUES (:sid)";

                    $insertStmt = $conn->prepare($insertSql);
                    $insertStmt->bindParam(':sid', $student['Student_Record_ID'], PDO::PARAM_INT);

                    $insertStmt->execute();
                }

            header("Location: ../student-personal-profile.php");
            exit();

    } else {
        $_SESSION['error'] = "Account not found.";
        header("Location: ../student-login.html");
        exit();
    }

} catch (PDOException $e) {
    // Optional: log error somewhere
    $_SESSION['error'] = "Database error.";
    header("Location: ../student-login.html");
    exit();
}
?>
