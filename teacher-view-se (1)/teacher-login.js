// Default Teacher Account
const defaultTeacher = {
    id: "teacher01",
    username: "admin",
    password: "admin123",
    fullName: "Teacher Account",
    accountType: "teacher",
    assignedGrade: "1"
};

// Save account if not exists
if (!localStorage.getItem("absas_teachers")) {
    localStorage.setItem("absas_teachers", JSON.stringify([defaultTeacher]));
}

function teacherLogin() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const error = document.getElementById("errorMsg");

    if (!user || !pass) {
        error.textContent = "Please enter username and password.";
        return;
    }

    const teachers = JSON.parse(localStorage.getItem("absas_teachers") || "[]");

    const match = teachers.find(t => t.username === user && t.password === pass);

    if (!match) {
        error.textContent = "Incorrect username or password.";
        return;
    }

    // Save logged in user
    localStorage.setItem("absas_current_user", JSON.stringify(match));

    // Redirect
    window.location.href = "teacher-view-students.html";
}
