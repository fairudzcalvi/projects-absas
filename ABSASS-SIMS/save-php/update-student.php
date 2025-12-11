<?php
require_once "connect.php";

$conn = getDBConnection();

// Get Student ID
$studentID = $_POST["id"] ?? null;

if (!$studentID) {
    header("Location: ../students.php?status=error&msg=" . urlencode("Student ID is required"));
    exit;
}

// Prepare update data
$data = [
    "Student_ID"              => $studentID,
    "LRN_ID"                  => $_POST["lrn"],
    "Student_First_Name"      => $_POST["firstName"],
    "Student_Middle_Name"     => $_POST["middleName"] ?? '',
    "Student_Last_Name"       => $_POST["lastName"],
    "Student_Grade_Level"     => $_POST["grade"],
    "Student_Enrollment_Date" => $_POST["enrollDate"],
    "Student_Gender"          => $_POST["sex"],
    "Student_Age"             => $_POST["age"],
    "Student_BirthDate"       => $_POST["birthday"] ?? null,
    "Student_Contact"         => $_POST["phone"] ?? '',
    "Student_Email"           => $_POST["email"] ?? '',
    "Student_Guardian_Name"   => $_POST["guardian"],
    "Student_Guardian_Contact"=> $_POST["guardianContact"] ?? '',
    "Student_Home_Address"    => $_POST["address"]
];

// Update password only if provided
if (!empty($_POST["Epass"])) {
    $data["Student_Password"] = password_hash($_POST["Epass"], PASSWORD_DEFAULT);
    $passwordField = ", Student_Password = :Student_Password";
} else {
    $passwordField = "";
}

// Update query
$sql = "
    UPDATE students SET
        LRN_ID                  = :LRN_ID,
        Student_First_Name      = :Student_First_Name,
        Student_Middle_Name     = :Student_Middle_Name,
        Student_Last_Name       = :Student_Last_Name,
        Student_Grade_Level     = :Student_Grade_Level,
        Student_Enrollment_Date = :Student_Enrollment_Date,
        Student_Gender          = :Student_Gender,
        Student_Age             = :Student_Age,
        Student_BirthDate       = :Student_BirthDate,
        Student_Contact         = :Student_Contact,
        Student_Email           = :Student_Email,
        Student_Guardian_Name   = :Student_Guardian_Name,
        Student_Guardian_Contact= :Student_Guardian_Contact,
        Student_Home_Address    = :Student_Home_Address
        {$passwordField}
    WHERE Student_ID = :Student_ID
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);
    header("Location: ../students.php?status=success&msg=" . urlencode("Student updated successfully"));
    exit;
} catch (PDOException $e) {
    error_log("Student Update Error: " . $e->getMessage());
    header("Location: ../students.php?status=error&msg=" . urlencode("Error updating student"));
    exit;
}
?>