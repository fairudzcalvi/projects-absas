<?php
require_once "connect2.php";

header('Content-Type: application/json');

$conn = getDBConnection();

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(["error" => "Faculty ID required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM faculty WHERE Faculty_Record_ID = ?");
    $stmt->execute([$id]);
    $faculty = $stmt->fetch();
    
    if ($faculty) {
        echo json_encode($faculty);
    } else {
        echo json_encode(["error" => "Faculty not found"]);
    }
} catch (PDOException $e) {
    error_log("Get Faculty Error: " . $e->getMessage());
    echo json_encode(["error" => "Database error"]);
}
?>