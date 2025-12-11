<?php
require_once "connect2.php";

header('Content-Type: application/json');

$conn = getDBConnection();

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["error" => "Student ID required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM students WHERE Student_Record_ID = ?");
    $stmt->execute([$id]);
    $student = $stmt->fetch();
    
    if ($student) {
        echo json_encode($student);
    } else {
        echo json_encode(["error" => "Student not found"]);
    }
} catch (PDOException $e) {
    error_log("Get Student Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error"]);
}
?>