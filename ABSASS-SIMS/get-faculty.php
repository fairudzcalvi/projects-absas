<?php
require_once "connect2.php";

$conn = getDBConnection();

$id = $_GET['id'];

$stmt = $conn->prepare("SELECT * FROM faculty WHERE Faculty_Record_ID = ?");
$stmt->execute([$id]);

echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
?>
