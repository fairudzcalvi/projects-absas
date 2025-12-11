<?php
require_once "connect.php";

$conn = getDBConnection();

$facultyID = $_POST["id"] ?? null;

if (!$facultyID) {
    header("Location: ../faculty.php?status=error&msg=" . urlencode("Faculty ID is required"));
    exit;
}

$data = [
    "Faculty_ID"              => $facultyID,
    "Employee_Number"         => $_POST["employeeId"] ?? '',
    "Faculty_First_Name"      => $_POST["firstName"],
    "Faculty_Last_Name"       => $_POST["lastName"],
    "Faculty_Middle_Name"     => $_POST["MiddleName"] ?? '',
    "Faculty_Department"      => $_POST["department"],
    "Faculty_Position"        => $_POST["position"],
    "Faculty_Hire_Date"       => $_POST["hireDate"],
    "Faculty_Employment_Status" => $_POST["status"],
    "Faculty_Role"            => $_POST["isAdviser"] ?? 'Teacher',
    "Faculty_Adviser_Grade"   => $_POST["adviserGrade"] ?? null,
    "Faculty_Subjects_Taught" => $_POST["subjects"] ?? '',
    "Faculty_Email_Address"   => $_POST["email"],
    "Faculty_Contact_Number"  => $_POST["phone"],
    "Faculty_BirthDate"       => $_POST["BirthDate"] ?? null,
    "Faculty_Address"         => $_POST["address"] ?? ''
];

// Update password only if provided
if (!empty($_POST["password"])) {
    $data["Faculty_Password"] = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $passwordField = ", Faculty_Password = :Faculty_Password";
} else {
    $passwordField = "";
}

$sql = "
    UPDATE faculty SET
        Employee_Number           = :Employee_Number,
        Faculty_First_Name        = :Faculty_First_Name,
        Faculty_Last_Name         = :Faculty_Last_Name,
        Faculty_Middle_Name       = :Faculty_Middle_Name,
        Faculty_Department        = :Faculty_Department,
        Faculty_Position          = :Faculty_Position,
        Faculty_Hire_Date         = :Faculty_Hire_Date,
        Faculty_Employment_Status = :Faculty_Employment_Status,
        Faculty_Role              = :Faculty_Role,
        Faculty_Adviser_Grade     = :Faculty_Adviser_Grade,
        Faculty_Subjects_Taught   = :Faculty_Subjects_Taught,
        Faculty_Email_Address     = :Faculty_Email_Address,
        Faculty_Contact_Number    = :Faculty_Contact_Number,
        Faculty_BirthDate         = :Faculty_BirthDate,
        Faculty_Address           = :Faculty_Address
        {$passwordField}
    WHERE Faculty_ID = :Faculty_ID
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);
    header("Location: ../faculty.php?status=success&msg=" . urlencode("Faculty updated successfully"));
    exit;
} catch (PDOException $e) {
    error_log("Faculty Update Error: " . $e->getMessage());
    header("Location: ../faculty.php?status=error&msg=" . urlencode("Error updating faculty"));
    exit;
}
?>