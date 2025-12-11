<?php
require_once "connect.php";

$conn = getDBConnection();

if (!$conn) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// ------------------------------------------------------------
// AUTO-GENERATE FACULTY ID
// ------------------------------------------------------------
function generateFacultyID($conn) {
    $stmt = $conn->prepare("SELECT Faculty_ID FROM faculty ORDER BY Faculty_Record_ID DESC LIMIT 1");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $lastID = intval(substr($row['Faculty_ID'], 3)); // Remove "FAC"
        $newID  = $lastID + 1;
    } else {
        $newID = 1;
    }

    return "FAC" . str_pad($newID, 5, "0", STR_PAD_LEFT);
}

$facultyID = $_POST["id"] ?? generateFacultyID($conn);

// ------------------------------------------------------------
// CAPTURE FORM VALUES
// ------------------------------------------------------------
$data = [
    "Faculty_ID"              => $facultyID,
    "Employee_Number"         => $_POST["employeeId"],
    "Faculty_First_Name"      => $_POST["firstName"],
    "Faculty_Last_Name"       => $_POST["lastName"],
    "Faculty_Department"      => $_POST["department"],
    "Faculty_Position"        => $_POST["position"],
    "Faculty_Hire_Date"       => $_POST["hireDate"],
    "Faculty_Employment_Status" => $_POST["status"],
    "Faculty_Role"            => $_POST["isAdviser"],
    "Faculty_Subjects_Taught" => $_POST["subjects"],
    "Faculty_Email_Address"   => $_POST["email"],
    "Faculty_Contact_Number"  => $_POST["phone"],
    "Faculty_BirthDate"       => $_POST["BirthDate"],
    "Faculty_Password"        => $_POST["password"],
    "Faculty_Address"         => $_POST["address"]
];

// ------------------------------------------------------------
// CHECK FOR DUPLICATE RECORDS
// ------------------------------------------------------------

$checkSQL = "
    SELECT * FROM faculty
    WHERE Employee_Number = :Employee_Number
       OR Faculty_Email_Address = :Faculty_Email_Address
       OR Faculty_Contact_Number = :Faculty_Contact_Number
       OR (Faculty_First_Name = :Faculty_First_Name 
           AND Faculty_Last_Name = :Faculty_Last_Name
           AND Faculty_BirthDate = :Faculty_BirthDate)
";

$checkStmt = $conn->prepare($checkSQL);
$checkStmt->execute([
    "Employee_Number"        => $data["Employee_Number"],
    "Faculty_Email_Address"  => $data["Faculty_Email_Address"],
    "Faculty_Contact_Number" => $data["Faculty_Contact_Number"],
    "Faculty_First_Name"     => $data["Faculty_First_Name"],
    "Faculty_Last_Name"      => $data["Faculty_Last_Name"],
    "Faculty_BirthDate"      => $data["Faculty_BirthDate"]
]);

if ($checkStmt->rowCount() > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "A faculty record already exists with the same email, contact, employee number, or matching name + birthdate."
    ]);
    header("Location: ../faculty.php");
    exit;
}

// ------------------------------------------------------------
// INSERT NEW FACULTY RECORD
// ------------------------------------------------------------

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

    echo json_encode([
        "status" => "success",
        "message" => "Faculty added successfully!",
        "faculty_id" => $facultyID
    ]);

    header("Location: ../faculty.php");

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
    header("Location: ../faculty.php");
}

$conn = null;
?>
