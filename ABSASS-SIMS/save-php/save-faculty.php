<?php
require_once "connect.php";

$conn = getDBConnection();

// Auto-generate Faculty ID
function generateFacultyID($conn) {
    $stmt = $conn->prepare("SELECT Faculty_ID FROM faculty ORDER BY Faculty_Record_ID DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch();

    if ($row && isset($row['Faculty_ID'])) {
        $lastNum = intval(substr($row['Faculty_ID'], 1));
        $newNum = $lastNum + 1;
    } else {
        $newNum = 1;
    }

    return "F" . str_pad($newNum, 3, "0", STR_PAD_LEFT);
}

$facultyID = !empty($_POST["id"]) ? $_POST["id"] : generateFacultyID($conn);

// Validate required fields
$required = ['firstName', 'lastName', 'department', 'position', 'hireDate', 'email', 'phone'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        header("Location: ../faculty.php?status=error&msg=" . urlencode("Required field missing: " . $field));
        exit;
    }
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
    "Faculty_Employment_Status" => $_POST["status"] ?? 'Active',
    "Faculty_Role"            => $_POST["isAdviser"] ?? 'Teacher',
    "Faculty_Adviser_Grade"   => $_POST["adviserGrade"] ?? null,
    "Faculty_Subjects_Taught" => $_POST["subjects"] ?? '',
    "Faculty_Email_Address"   => $_POST["email"],
    "Faculty_Contact_Number"  => $_POST["phone"],
    "Faculty_BirthDate"       => $_POST["BirthDate"] ?? null,
    "Faculty_Password"        => password_hash($_POST["password"] ?? 'faculty123', PASSWORD_DEFAULT),
    "Faculty_Address"         => $_POST["address"] ?? ''
];

// Check for duplicates
$checkSQL = "SELECT * FROM faculty WHERE Faculty_Email_Address = :email";
$checkStmt = $conn->prepare($checkSQL);
$checkStmt->execute(["email" => $data["Faculty_Email_Address"]]);

if ($checkStmt->rowCount() > 0) {
    header("Location: ../faculty.php?status=error&msg=" . urlencode("Faculty with this email already exists"));
    exit;
}

// Insert
$sql = "
    INSERT INTO faculty (
        Faculty_ID, Employee_Number, Faculty_First_Name, Faculty_Last_Name, Faculty_Middle_Name,
        Faculty_Department, Faculty_Position, Faculty_Hire_Date,
        Faculty_Employment_Status, Faculty_Role, Faculty_Adviser_Grade, Faculty_Subjects_Taught,
        Faculty_Email_Address, Faculty_Contact_Number, Faculty_BirthDate,
        Faculty_Password, Faculty_Address
    ) VALUES (
        :Faculty_ID, :Employee_Number, :Faculty_First_Name, :Faculty_Last_Name, :Faculty_Middle_Name,
        :Faculty_Department, :Faculty_Position, :Faculty_Hire_Date,
        :Faculty_Employment_Status, :Faculty_Role, :Faculty_Adviser_Grade, :Faculty_Subjects_Taught,
        :Faculty_Email_Address, :Faculty_Contact_Number, :Faculty_BirthDate,
        :Faculty_Password, :Faculty_Address
    )
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);
    header("Location: ../faculty.php?status=success&msg=" . urlencode("Faculty added successfully"));
    exit;
} catch (PDOException $e) {
    error_log("Faculty Insert Error: " . $e->getMessage());
    header("Location: ../faculty.php?status=error&msg=" . urlencode("Error adding faculty"));
    exit;
}
?>