document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem('absas_current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize UI
    document.getElementById('userInfoSidebar').innerHTML = `
        <p class="user-name">${currentUser.fullName}</p>
        <p class="user-role">${currentUser.accountType === 'admin' ? 'Administrator' : 'User'}</p>
    `;

    function updateDateTime() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        document.getElementById('dateTime').textContent = now.toLocaleString('en-US', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('absas_current_user');
            window.location.href = 'login.html';
        }
    });

    // Section names mapping
    const SECTIONS = {
        '1': 'MATTHEW', '2': 'MARK', '3': 'LUKE', '4': 'JOHN', '5': 'ACTS',
        '7': 'GENESIS', '8': 'EXODUS', '9': 'LEVITICUS', '10': 'NUMBERS'
    };

    // Initialize sample data

    // Update statistics
    // Filter students
    window.filterStudents = function() {
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const gradeFilter = document.getElementById('gradeFilter').value;
        const genderFilter = document.getElementById('genderFilter').value;
        
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        
        const filtered = students.filter(s => {
            const matchesSearch = !searchTerm || 
                (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm) || 
                s.id.toLowerCase().includes(searchTerm) ||
                (s.lrn && s.lrn.includes(searchTerm));
            const matchesGrade = !gradeFilter || s.grade === gradeFilter;
            const matchesGender = !genderFilter || s.sex === genderFilter;
            
            return matchesSearch && matchesGrade && matchesGender;
        });

        displayStudents(filtered);
        updateTableTitle(gradeFilter, genderFilter);
    };

    // Update table title
    function updateTableTitle(grade, gender) {
        let title = 'All Students';
        if (grade && gender) {
            title = `Grade ${grade} - ${SECTIONS[grade]} (${gender})`;
        } else if (grade) {
            title = `Grade ${grade} - ${SECTIONS[grade]}`;
        } else if (gender) {
            title = `${gender} Students`;
        }
        document.getElementById('tableTitle').innerHTML = `<i class="fas fa-users"></i> ${title}`;
    }

    // Display students
    // Load all students

    // Open modal for add/edit
    window.openStudentModal = function(studentData = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');
        modal.classList.add('active');
    };


    window.closeStudentModal = function() {
        document.getElementById('studentModal').classList.remove('active');
    };

    window.EditModal = function(studentId) {

    fetch("get-student.php?id=" + studentId)
        .then(res => res.json())
        .then(data => {

            const modal = document.getElementById('EditModal');
            const form = document.getElementById('studentForm1');
            const title = document.getElementById('studentModalTitle1');

            title.innerHTML = '<i class="fas fa-edit"></i> Edit Student';

            // Fill form fields with data
            form.id.value = data.Student_ID;
            form.lrn.value = data.LRN_ID;
            form.firstName.value = data.Student_First_Name;
            form.lastName.value = data.Student_Last_Name;
            form.middleName.value = data.Student_Middle_Name;
            form.grade.value = data.Student_Grade_Level;
            form.enrollDate.value = data.Student_Enrollment_Date;
            form.sex.value = data.Student_Gender;
            form.age.value = data.Student_Age;
            form.birthday.value = data.Student_BirthDate;
            form.phone.value = data.Student_Contact;
            form.email.value = data.Student_Email;
            form.Epass.value = data.Student_Password;
            form.guardian.value = data.Student_Guardian_Name;
            form.guardianContact.value = data.Student_Guardian_Contact;
            form.address.value = data.Student_Home_Addredd;

            modal.classList.add('active');
        });
};


    window.closeStudentModal1 = function() {
        document.getElementById('EditModal').classList.remove('active');
    };

    // Save student

    
    // View student details

    window.closeViewModal = function() {
        document.getElementById('viewStudentModal').classList.remove('active');
    };

    // Edit student
    window.editStudent = function(id) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const student = students.find(s => s.id === id);
        if (student) {
            openStudentModal(student);
        }
    };

    // Delete student
    window.deleteStudent = function(id) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const student = students.find(s => s.id === id);
        
        if (!student) return;
        
        if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?\n\nThis will remove all associated records including attendance and grades.`)) {
            const filtered = students.filter(s => s.id !== id);
            localStorage.setItem('absas_students', JSON.stringify(filtered));
            loadStudents();
            filterStudents();
        }
    };

    // Export to Excel (simplified)
    window.exportToExcel = function() {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        
        if (students.length === 0) {
            alert('No students to export');
            return;
        }

        let csv = 'Student ID,LRN,First Name,Last Name,Grade,Section,Gender,Age,Email,Phone,Address,Guardian,Guardian Contact,Enrollment Date,Status\n';
        
        students.forEach(s => {
            csv += `${s.id},${s.lrn || ''},${s.firstName},${s.lastName},${s.grade},${SECTIONS[s.grade]},${s.sex},${s.age},${s.email || ''},${s.phone || ''},${s.address},${s.guardian},${s.guardianContact || ''},${s.enrollDate},${s.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Initialize
    initializeData();
    loadStudents();
});