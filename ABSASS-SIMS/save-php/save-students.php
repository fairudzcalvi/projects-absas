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

    if ($row) {
        $lastID = intval(substr($row['Student_ID'], 3));
        $newID  = $lastID + 1;
    } else {
        $newID = 1;
    }

    return "STD" . str_pad($newID, 5, "0", STR_PAD_LEFT);
}

$studentID = $_POST["id"] ?? generateStudentID($conn);

// ---- CAPTURE FORM VALUES ----
$data = [
    "Student_ID"              => $studentID,
    "LRN_ID"                  => $_POST["lrn"],
    "Student_First_Name"      => $_POST["firstName"],
    "Student_Middle_Name"     => $_POST["middleName"],
    "Student_Last_Name"       => $_POST["lastName"],
    "Student_Grade_Level"     => $_POST["grade"],
    "Student_Enrollment_Date" => $_POST["enrollDate"],
    "Student_Password"        => $_POST["Epass"],
    "Student_Gender"          => $_POST["sex"],
    "Student_Age"             => $_POST["age"],
    "Student_BirthDate"       => $_POST["birthday"],
    "Student_Contact"         => $_POST["phone"],
    "Student_Email"           => $_POST["email"],
    "Student_Guardian_Name"   => $_POST["guardian"],
    "Student_Guardian_Contact"=> $_POST["guardianContact"],
    "Student_Home_Address"    => $_POST["address"]
];

// ---------------------------------------------
// 🔍 CHECK IF STUDENT ALREADY EXISTS
// ---------------------------------------------

$checkSQL = "
    SELECT * FROM students 
    WHERE Student_Email = :Student_Email
";

$checkStmt = $conn->prepare($checkSQL);
$checkStmt->execute([
    "Student_Email"      => $data["Student_Email"]
]);

if ($checkStmt->rowCount() > 0) {
    echo ([
        "status" => "error",
        "message" => "A student with this LRN, email, or matching name + birthdate already exists."
    ]);
    header("Location: ../students.php");
    exit;
}

// ---------------------------------------------
// 🚀 INSERT NEW STUDENT
// ---------------------------------------------

$sql = "
    INSERT INTO students (
        Student_ID, LRN_ID, Student_First_Name, Student_Middle_Name, Student_Last_Name,
        Student_Grade_Level, Student_Enrollment_Date, Student_Password,
        Student_Gender, Student_Age, Student_BirthDate, Student_Contact,
        Student_Email, Student_Guardian_Name, Student_Guardian_Contact,
        Student_Home_Address
    ) VALUES (
        :Student_ID, :LRN_ID, :Student_First_Name, :Student_Middle_Name, :Student_Last_Name,
        :Student_Grade_Level, :Student_Enrollment_Date, :Student_Password,
        :Student_Gender, :Student_Age, :Student_BirthDate, :Student_Contact,
        :Student_Email, :Student_Guardian_Name, :Student_Guardian_Contact,
        :Student_Home_Address
    )
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);
    echo json_encode([
        "status" => "success",
        "message" => "Student added successfully!",
        "student_id" => $studentID
    ]);
    
    header("Location: ../students.php");
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    
    header("Location: ../students.php");
}

$conn = null;
?>
