<?php
require_once "connect.php";

$conn = getDBConnection();

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// ---- AUTO GENERATE FACULTY ID ----
function generateFacultyID($conn) {
    $stmt = $conn->prepare("SELECT Faculty_ID FROM faculty ORDER BY Faculty_Record_ID DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && isset($row['Faculty_ID'])) {
        $lastID = intval(substr($row['Faculty_ID'], 3)); // remove FAC
        $newID  = $lastID + 1;
    } else {
        $newID = 1;
    }

    return "FAC" . str_pad($newID, 5, "0", STR_PAD_LEFT);
}

// Get Faculty ID (new or existing for update)
$facultyID = $_POST["id"] ?? generateFacultyID($conn);

// ---- CAPTURE FORM VALUES ----
$data = [
    "Faculty_ID"                => $facultyID,
    "Employee_Number"           => $_POST["employeeId"] ?? null,
    "Faculty_First_Name"        => $_POST["firstName"] ?? null,
    "Faculty_Last_Name"         => $_POST["lastName"] ?? null,
    "Faculty_Department"        => $_POST["department"] ?? null,
    "Faculty_Position"          => $_POST["position"] ?? null,
    "Faculty_Hire_Date"         => $_POST["hireDate"] ?? null,
    "Faculty_Employment_Status" => $_POST["status"] ?? null,
    "Faculty_Role"              => $_POST["isAdviser"] ?? null,
    "Faculty_Subjects_Taught"   => $_POST["subjects"] ?? null,
    "Faculty_Email_Address"     => $_POST["email"] ?? null,
    "Faculty_Contact_Number"    => $_POST["phone"] ?? null,
    "Faculty_BirthDate"         => $_POST["BirthDate"] ?? null,
    "Faculty_Password"          => $_POST["password"] ?? null,
    "Faculty_Address"           => $_POST["address"] ?? null
];

// ---- INSERT NEW FACULTY RECORD ----
$sql = "
    INSERT INTO faculty (
        Faculty_ID, Employee_Number, Faculty_First_Name, Faculty_Last_Name,
        Faculty_Department, Faculty_Position, Faculty_Hire_Date,
        Faculty_Employment_Status, Faculty_Role, Faculty_Subjects_Taught,
        Faculty_Email_Address, Faculty_Contact_Number, Faculty_BirthDate,
        Faculty_Password, Faculty_Address
    ) VALUES (
        :Faculty_ID, :Employee_Number, :Faculty_First_Name, :Faculty_Last_Name,
        :Faculty_Department, :Faculty_Position, :Faculty_Hire_Date,
        :Faculty_Employment_Status, :Faculty_Role, :Faculty_Subjects_Taught,
        :Faculty_Email_Address, :Faculty_Contact_Number, :Faculty_BirthDate,
        :Faculty_Password, :Faculty_Address
    )
";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute($data);

    // redirect (no echo before header)
    header("Location: ../faculty.php?status=success&faculty_id=" . urlencode($facultyID));
    exit;

} catch (PDOException $e) {

    header("Location: ../faculty.php?status=error&msg=" . urlencode($e->getMessage()));
    exit;
}

?>
