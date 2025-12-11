<?php
require_once "connect2.php";

$conn = getDBConnection();

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// ID of the student record (passed from form)
$studentRecordID = $_POST["Student_Record_ID"] ?? null;

if (!$studentRecordID) {
    die(json_encode(["status" => "error", "message" => "Missing Student Record ID."]));
}

// ---- CAPTURE FORM VALUES ----
// Map the posted grades to DB fields
$gradeData = [
    // Quarter 1
    "q1_sub1" => $_POST["Mathematics"] ?? null,
    "q1_sub2" => $_POST["Science"] ?? null,
    "q1_sub3" => $_POST["English"] ?? null,
    "q1_sub4" => $_POST["Filipino"] ?? null,
    "q1_sub5" => $_POST["Physical_Education"] ?? null,
    "q1_sub6" => $_POST["sub6"] ?? null,
    "q1_sub7" => $_POST["sub7"] ?? null,

    // Quarter 2
    "q2_sub1" => $_POST["Mathematics_Q2"] ?? null,
    "q2_sub2" => $_POST["Science_Q2"] ?? null,
    "q2_sub3" => $_POST["English_Q2"] ?? null,
    "q2_sub4" => $_POST["Filipino_Q2"] ?? null,
    "q2_sub5" => $_POST["PE_Q2"] ?? null,
    "q2_sub6" => $_POST["sub6_Q2"] ?? null,
    "q2_sub7" => $_POST["sub7_Q2"] ?? null,

    // Quarter 3
    "q3_sub1" => $_POST["Mathematics_Q3"] ?? null,
    "q3_sub2" => $_POST["Science_Q3"] ?? null,
    "q3_sub3" => $_POST["English_Q3"] ?? null,
    "q3_sub4" => $_POST["Filipino_Q3"] ?? null,
    "q3_sub5" => $_POST["PE_Q3"] ?? null,
    "q3_sub6" => $_POST["sub6_Q3"] ?? null,
    "q3_sub7" => $_POST["sub7_Q3"] ?? null,

    // Quarter 4
    "q4_sub1" => $_POST["Mathematics_Q4"] ?? null,
    "q4_sub2" => $_POST["Science_Q4"] ?? null,
    "q4_sub3" => $_POST["English_Q4"] ?? null,
    "q4_sub4" => $_POST["Filipino_Q4"] ?? null,
    "q4_sub5" => $_POST["PE_Q4"] ?? null,
    "q4_sub6" => $_POST["sub6_Q4"] ?? null,
    "q4_sub7" => $_POST["sub7_Q4"] ?? null,
];

// 🔎 Check if grade record already exists
$check = $conn->prepare("SELECT Grade_ID FROM grade WHERE Student_Record_ID = ?");
$check->execute([$studentRecordID]);

$existing = $check->fetch(PDO::FETCH_ASSOC);

if ($existing) {
    // ----------------------------------------------
    // UPDATE existing grades
    // ----------------------------------------------
    $sql = "
        UPDATE grade SET
            q1_sub1 = :q1_sub1, q1_sub2 = :q1_sub2, q1_sub3 = :q1_sub3, q1_sub4 = :q1_sub4,
            q1_sub5 = :q1_sub5, q1_sub6 = :q1_sub6, q1_sub7 = :q1_sub7,

            q2_sub1 = :q2_sub1, q2_sub2 = :q2_sub2, q2_sub3 = :q2_sub3, q2_sub4 = :q2_sub4,
            q2_sub5 = :q2_sub5, q2_sub6 = :q2_sub6, q2_sub7 = :q2_sub7,

            q3_sub1 = :q3_sub1, q3_sub2 = :q3_sub2, q3_sub3 = :q3_sub3, q3_sub4 = :q3_sub4,
            q3_sub5 = :q3_sub5, q3_sub6 = :q3_sub6, q3_sub7 = :q3_sub7,

            q4_sub1 = :q4_sub1, q4_sub2 = :q4_sub2, q4_sub3 = :q4_sub3, q4_sub4 = :q4_sub4,
            q4_sub5 = :q4_sub5, q4_sub6 = :q4_sub6, q4_sub7 = :q4_sub7

        WHERE Student_Record_ID = :Student_Record_ID
    ";

    $stmt = $conn->prepare($sql);
    $gradeData["Student_Record_ID"] = $studentRecordID;

}

try {
    $stmt->execute($gradeData);
    header("Location: ../teacher-view-students?status=success");
    exit;

} catch (PDOException $e) {
    header("Location: ../teacher-view-students?status=error&msg=" . urlencode($e->getMessage()));
    exit;
}

?>
