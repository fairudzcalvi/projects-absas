<?php
require_once "connect.php";

$conn = getDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentID = $_POST['id'] ?? null;
    
    if (!$studentID) {
        echo json_encode(["status" => "error", "message" => "Student ID required"]);
        exit;
    }
    
    try {
        // Delete student (CASCADE will handle related records)
        $stmt = $conn->prepare("DELETE FROM students WHERE Student_ID = :id");
        $stmt->execute(['id' => $studentID]);
        
        echo json_encode(["status" => "success", "message" => "Student deleted successfully"]);
    } catch (PDOException $e) {
        error_log("Delete Error: " . $e->getMessage());
        echo json_encode(["status" => "error", "message" => "Error deleting student"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
?>