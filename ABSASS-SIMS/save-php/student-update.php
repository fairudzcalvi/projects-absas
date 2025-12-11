<?php
require_once "connect.php";

$conn = getDBConnection();

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// ---- AUTO GENERATE STUDENT ID ----
function generateStudentID($conn) {
    $stmt = $conn->prepare("SELECT Student_ID FROM students ORDER BY Student_Record_ID DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && isset($row['Student_ID'])) {
        $lastID = intval(substr($row['Student_ID'], 3));
        $newID  = $lastID + 1;
    } else {
        $newID = 1;
    }

    return "STD" . str_pad($newID, 5, "0", STR_PAD_LEFT);
}

// Get Student Record ID for update
$studentID = $_POST["id"] ?? generateStudentID($conn);

// ---- CAPTURE FORM VALUES ----
$data = [
    "Student_ID"              => $studentID,
    "LRN_ID"                  => $_POST["lrn"] ?? null,
    "Student_First_Name"      => $_POST["firstName"] ?? null,
    "Student_Middle_Name"     => $_POST["middleName"] ?? null,
    "Student_Last_Name"       => $_POST["lastName"] ?? null,
    "Student_Grade_Level"     => $_POST["grade"] ?? null,
    "Student_Enrollment_Date" => $_POST["enrollDate"] ?? null,
    "Student_Password"        => $_POST["Epass"] ?? null,
    "Student_Gender"          => $_POST["sex"] ?? null,
    "Student_Age"             => $_POST["age"] ?? null,
    "Student_BirthDate"       => $_POST["birthday"] ?? null,
    "Student_Contact"         => $_POST["phone"] ?? null,
    "Student_Email"           => $_POST["email"] ?? null,
    "Student_Guardian_Name"   => $_POST["guardian"] ?? null,
    "Student_Guardian_Contact"=> $_POST["guardianContact"] ?? null,
    "Student_Home_Address"    => $_POST["address"] ?? null,
];

$sql = "
    UPDATE students SET
        Student_ID              = :Student_ID,
        LRN_ID                  = :LRN_ID,
        Student_First_Name      = :Student_First_Name,
        Student_Middle_Name     = :Student_Middle_Name,
        Student_Last_Name       = :Student_Last_Name,
        Student_Grade_Level     = :Student_Grade_Level,
        Student_Enrollment_Date = :Student_Enrollment_Date,
        Student_Password        = :Student_Password,
        Student_Gender          = :Student_Gender,
        Student_Age             = :Student_Age,
        Student_BirthDate       = :Student_BirthDate,
        Student_Contact         = :Student_Contact,
        Student_Email           = :Student_Email,
        Student_Guardian_Name   = :Student_Guardian_Name,
        Student_Guardian_Contact= :Student_Guardian_Contact,
        Student_Home_Address    = :Student_Home_Address
    WHERE Student_Record_ID = 1
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);

    // redirect (no echo before header)
    header("Location: ../students.php?status=success");
    exit;

} catch (PDOException $e) {

    header("Location: ../students.php?status=error&msg=" . urlencode($e->getMessage()));
    exit;
}

?>
