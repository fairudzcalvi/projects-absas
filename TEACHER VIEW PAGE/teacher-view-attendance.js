const SECTIONS = {
    "1": "MATTHEW",
    "2": "MARK",
    "3": "LUKE",
    "4": "JOHN",
    "5": "ACTS",
    "6": "ROMANS",
    "7": "GENESIS",
    "8": "EXODUS",
    "9": "LEVITICUS",
    "10": "NUMBERS"
};

const currentTeacher = JSON.parse(localStorage.getItem("absas_current_user") || "null");

function loadStudents() {
    return JSON.parse(localStorage.getItem("absas_students") || "[]");
}

function getAssignedGrade() {
    if (!currentTeacher) return null;

    return (
        currentTeacher.assignedGrade ||
        currentTeacher.gradeAssigned ||
        currentTeacher.assigned_class ||
        currentTeacher.classAssigned ||
        null
    );
}

function getTeacherStudents() {
    const all = loadStudents();
    const selectedGrade = document.getElementById("attendanceClass")
    .addEventListener("change", displayAttendanceStudents);
    
    if (!selectedGrade) return [];

    return all.filter(s => String(s.grade) === String(selectedGrade));
}

function displayAttendanceStudents() {
    const tbody = document.getElementById("attendanceBody");
    const students = getTeacherStudents();

    if (!students.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:15px;">No students found.</td></tr>`;
        return;
    }

    tbody.innerHTML = students.map(s => `
        <tr data-id="${s.id}">
            <td>
                <strong>${s.lastName}, ${s.firstName}</strong><br>
                <small>Grade ${s.grade} - ${SECTIONS[s.grade]}</small>
            </td>

            <td><input type="radio" name="att_${s.id}" value="Present"></td>
            <td><input type="radio" name="att_${s.id}" value="Absent"></td>
            <td><input type="radio" name="att_${s.id}" value="Late"></td>
            <td><input type="radio" name="att_${s.id}" value="Excused"></td>
        </tr>
    `).join("");
}

function saveAttendance() {
    const dateInput = document.getElementById("attendanceDate");
    const date = dateInput.value;

    if (!date) {
        alert("Please select a date.");
        return;
    }

    const students = getTeacherStudents();
    const results = [];

    for (let s of students) {
        const radios = document.querySelector(`input[name="att_${s.id}"]:checked`);
        const status = radios ? radios.value : "Not Marked";

        results.push({
            studentId: s.id,
            status: status
        });
    }

    const grade = getAssignedGrade() || "ALL";
    const section = SECTIONS[grade] || "UNASSIGNED";

    const key = `attendance_${date}_${grade}_${section}`;
    localStorage.setItem(key, JSON.stringify(results));

    alert("Attendance Recorded Successfully!");
}

function displayClassName() {
    const grade = getAssignedGrade() || "-";
    const section = SECTIONS[grade] || "UNASSIGNED";

    const classInput = document.querySelector(".attendance-top input.disabled");
    classInput.value = `Grade ${grade} - ${section}`;
}

document.addEventListener("DOMContentLoaded", () => {
    displayClassName();       // Set class name
    displayAttendanceStudents(); // Fill table

    document.getElementById("attendanceDate").value = new Date().toISOString().split("T")[0];

    document.getElementById("submitAttendance")
        .addEventListener("click", saveAttendance);
});
