<?php
require_once "connect.php";

$conn = getDBConnection();

// Auto-generate Student ID
function generateStudentID($conn) {
    $stmt = $conn->prepare("SELECT Student_ID FROM students ORDER BY Student_Record_ID DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch();

    if ($row && isset($row['Student_ID'])) {
        // Extract number from STD00001 format
        $lastNum = intval(substr($row['Student_ID'], 3));
        $newNum = $lastNum + 1;
    } else {
        $newNum = 1;
    }

    return "STD" . str_pad($newNum, 5, "0", STR_PAD_LEFT);
}

// Get or generate Student ID
$studentID = !empty($_POST["id"]) ? $_POST["id"] : generateStudentID($conn);

// Validate required fields
$required = ['lrn', 'firstName', 'lastName', 'grade', 'enrollDate', 'sex', 'age', 'guardian', 'address'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        header("Location: ../students.php?status=error&msg=" . urlencode("Required field missing: " . $field));
        exit;
    }
}

// Prepare data
$data = [
    "Student_ID"              => $studentID,
    "LRN_ID"                  => $_POST["lrn"],
    "Student_First_Name"      => $_POST["firstName"],
    "Student_Middle_Name"     => $_POST["middleName"] ?? '',
    "Student_Last_Name"       => $_POST["lastName"],
    "Student_Grade_Level"     => $_POST["grade"],
    "Student_Enrollment_Date" => $_POST["enrollDate"],
    "Student_Password"        => password_hash($_POST["Epass"] ?? 'student123', PASSWORD_DEFAULT),
    "Student_Gender"          => $_POST["sex"],
    "Student_Age"             => $_POST["age"],
    "Student_BirthDate"       => $_POST["birthday"] ?? null,
    "Student_Contact"         => $_POST["phone"] ?? '',
    "Student_Email"           => $_POST["email"] ?? '',
    "Student_Guardian_Name"   => $_POST["guardian"],
    "Student_Guardian_Contact"=> $_POST["guardianContact"] ?? '',
    "Student_Home_Address"    => $_POST["address"]
];

// Check for duplicates
$checkSQL = "SELECT * FROM students WHERE LRN_ID = :lrn OR Student_Email = :email";
$checkStmt = $conn->prepare($checkSQL);
$checkStmt->execute([
    "lrn" => $data["LRN_ID"],
    "email" => $data["Student_Email"]
]);

if ($checkStmt->rowCount() > 0) {
    header("Location: ../students.php?status=error&msg=" . urlencode("Student with this LRN or email already exists"));
    exit;
}

// Insert new student
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
    header("Location: ../students.php?status=success&msg=" . urlencode("Student added successfully"));
    exit;
} catch (PDOException $e) {
    error_log("Student Insert Error: " . $e->getMessage());
    header("Location: ../students.php?status=error&msg=" . urlencode("Error adding student"));
    exit;
}
?>