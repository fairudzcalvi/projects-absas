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
    function updateStatistics(students) {
        const total = students.length;
        const males = students.filter(s => s.sex === 'Male').length;
        const females = students.filter(s => s.sex === 'Female').length;
        const sections = new Set(students.map(s => s.grade)).size;

        document.getElementById('totalStudents').textContent = total;
        document.getElementById('maleCount').textContent = males;
        document.getElementById('femaleCount').textContent = females;
        document.getElementById('sectionCount').textContent = sections;
    }

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
    function loadStudents() {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        displayStudents(students);
        updateStatistics(students);
    }

    // Open modal for add/edit
    window.openStudentModal = function(studentData = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');
        
        if (studentData) {
            title.innerHTML = '<i class="fas fa-user-edit"></i> Edit Student';
            Object.keys(studentData).forEach(key => {
                if (form.elements[key]) {
                    form.elements[key].value = studentData[key] || '';
                }
            });
            form.elements.id.readOnly = true;
        } else {
            title.innerHTML = '<i class="fas fa-user-plus"></i> Add Student';
            form.reset();
            form.elements.id.readOnly = true;
            const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
            const nextId = 'S' + String(students.length + 1).padStart(3, '0');
            form.elements.id.value = nextId;
        }
        
        modal.classList.add('active');
    };

    window.closeStudentModal = function() {
        document.getElementById('studentModal').classList.remove('active');
    };

    // Save student
    window.saveStudent = function() {
        const form = document.getElementById('studentForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        
        const studentData = {
            id: form.elements.id.value,
            lrn: form.elements.lrn.value,
            firstName: form.elements.firstName.value,
            lastName: form.elements.lastName.value,
            grade: form.elements.grade.value,
            sex: form.elements.sex.value,
            age: parseInt(form.elements.age.value),
            email: form.elements.email.value,
            phone: form.elements.phone.value,
            address: form.elements.address.value,
            guardian: form.elements.guardian.value,
            guardianContact: form.elements.guardianContact.value,
            enrollDate: form.elements.enrollDate.value,
            status: 'Active'
        };

        const existingIndex = students.findIndex(s => s.id === studentData.id);
        if (existingIndex !== -1) {
            students[existingIndex] = studentData;
        } else {
            students.push(studentData);
        }

        localStorage.setItem('absas_students', JSON.stringify(students));
        closeStudentModal();
        loadStudents();
        filterStudents();
    };

    // View student details
    window.viewStudent = function(id) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const student = students.find(s => s.id === id);
        
        if (!student) return;

        const modal = document.getElementById('viewStudentModal');
        const body = document.getElementById('studentDetailsBody');
        
        body.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid var(--maroon);">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-id-card"></i> Basic Information</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div><strong>Student ID:</strong> ${student.id}</div>
                        <div><strong>LRN:</strong> ${student.lrn || 'N/A'}</div>
                        <div><strong>Name:</strong> ${student.firstName} ${student.lastName}</div>
                        <div><strong>Grade & Section:</strong> Grade ${student.grade} - ${SECTIONS[student.grade]}</div>
                        <div><strong>Gender:</strong> <i class="fas fa-${student.sex === 'Male' ? 'male' : 'female'}"></i> ${student.sex}</div>
                        <div><strong>Age:</strong> ${student.age} years old</div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid var(--gold);">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-address-card"></i> Contact Information</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Email:</strong> ${student.email || 'N/A'}</div>
                        <div><strong>Phone:</strong> ${student.phone || 'N/A'}</div>
                        <div><strong>Address:</strong> ${student.address}</div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-users"></i> Guardian Information</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Guardian Name:</strong> ${student.guardian}</div>
                        <div><strong>Guardian Contact:</strong> ${student.guardianContact || 'N/A'}</div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid #007bff;">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-calendar"></i> Enrollment Details</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Enrollment Date:</strong> ${new Date(student.enrollDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        <div><strong>Status:</strong> <span class="badge badge-success">${student.status}</span></div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    };

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