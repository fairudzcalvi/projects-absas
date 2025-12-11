(function () {
    const SECTIONS = {
        '1': 'MATTHEW', '2': 'MARK', '3': 'LUKE', '4': 'JOHN', '5': 'ACTS',
        '6': 'ROMANS', '7': 'GENESIS', '8': 'EXODUS', '9': 'LEVITICUS', '10': 'NUMBERS'
    };

    // Utilities
    function nowLocaleString() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true };
        return now.toLocaleString('en-US', options);
    }

    const currentUser = JSON.parse(localStorage.getItem('absas_current_user') || 'null');

    const userInfoSidebar = document.getElementById('userInfoSidebar');
    if (userInfoSidebar) {
        userInfoSidebar.innerHTML = `
            <p class="user-name">${currentUser.fullName || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()}</p>
            <p class="user-role">${currentUser.accountType === 'admin' ? 'Administrator' : 'Teacher'}</p>
        `;
    }

    function updateDateTime() {
        const el = document.getElementById('dateTime');
        if (el) el.textContent = nowLocaleString();
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    function extractAssignedGrades(user) {
        if (!user) return null;

        if (Array.isArray(user.assignedGrades) && user.assignedGrades.length) {
            return user.assignedGrades.map(String);
        }

        if (user.assignedGrade) return [String(user.assignedGrade)];
        if (user.gradeAssigned) return [String(user.gradeAssigned)];

        const cand = user.assignedClass || user.classAssigned || user.assignedSection || user.sectionAssigned;
        if (cand) {
            const matches = String(cand).match(/\d+/g);
            if (matches && matches.length) return matches.map(String);
            return [String(cand)];
        }

        return null;
    }

    const teacherAssigned = extractAssignedGrades(currentUser);

    function isStudentAssignedToTeacher(student) {
        if (!teacherAssigned) return true;
        return teacherAssigned.includes(String(student.grade));
    }

    function getAllStudents() {
        try {
            return JSON.parse(localStorage.getItem('absas_students') || '[]');
        } catch (e) {
            console.error('Invalid students data in localStorage', e);
            return [];
        }
    }

    function updateTableTitle(grade, gender) {
        const titleEl = document.getElementById('tableTitle');
        if (!titleEl) return;
        let title = 'All Students';
        if (grade && gender) {
            title = `Grade ${grade} - ${SECTIONS[grade] || ''} (${gender})`;
        } else if (grade) {
            title = `Grade ${grade} - ${SECTIONS[grade] || ''}`;
        } else if (gender) {
            title = `${gender} Students`;
        }
        titleEl.innerHTML = `<i class="fas fa-users"></i> ${title}`;
    }

    function displayStudents(students) {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;
        if (!students.length) {
            tbody.innerHTML = `<tr><td colspan="9" class="empty-message"><i class="fas fa-inbox" style="font-size:48px; opacity:0.25; display:block; margin-bottom:10px;"></i>No students found</td></tr>`;
            return;
        }

        tbody.innerHTML = students.map(s => `
            <tr>
                <td><strong>${s.id}</strong></td>
                <td>${s.lrn || 'N/A'}</td>
                <td><strong>${s.firstName} ${s.lastName}</strong></td>
                <td><span class="badge badge-info">Grade ${s.grade} - ${SECTIONS[s.grade] || ''}</span></td>
                <td><i class="fas fa-${s.sex === 'Male' ? 'male' : 'female'}"></i> ${s.sex}</td>
                <td>${s.age}</td>
                <td>${s.guardian || 'N/A'}</td>
                <td>${s.phone || 'N/A'}</td>
                <td style="white-space: nowrap;">
                    <button class="btn btn-sm btn-secondary" onclick="viewStudent('${s.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="btn btn-sm btn-secondary" onclick="editStudent('${s.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent('${s.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `).join('');
    }

    window.filterStudents = function () {
        const searchTerm = (document.getElementById('studentSearch')?.value || '').toLowerCase();
        const gradeFilter = document.getElementById('gradeFilter')?.value || '';
        const genderFilter = document.getElementById('genderFilter')?.value || '';

        let students = getAllStudents();

        students = students.filter(isStudentAssignedToTeacher);

        const filtered = students.filter(s => {
            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
            const matchesSearch = !searchTerm ||
                fullName.includes(searchTerm) ||
                (s.id && s.id.toLowerCase().includes(searchTerm)) ||
                (s.lrn && s.lrn.includes(searchTerm));
            const matchesGrade = !gradeFilter || String(s.grade) === String(gradeFilter);
            const matchesGender = !genderFilter || s.sex === genderFilter;

            return matchesSearch && matchesGrade && matchesGender;
        });

        displayStudents(filtered);
        updateTableTitle(gradeFilter, genderFilter);
    };

    function loadStudents() {
        const students = getAllStudents().filter(isStudentAssignedToTeacher);
        displayStudents(students);
    }

    window.openStudentModal = function (studentData = null) {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');

        if (!modal || !form) return;

        if (studentData) {
            title.innerHTML = '<i class="fas fa-user-edit"></i> Edit Student';
            Object.keys(studentData).forEach(key => {
                if (form.elements[key]) form.elements[key].value = studentData[key] || '';
            });
            form.elements.id.readOnly = true;
        } else {
            title.innerHTML = '<i class="fas fa-user-plus"></i> Add Student';
            form.reset();
            form.elements.id.readOnly = true;
            const students = getAllStudents();
            const nextId = 'S' + String(students.length + 1).padStart(3, '0');
            form.elements.id.value = nextId;
            if (teacherAssigned && teacherAssigned.length === 1 && form.elements.grade) {
                form.elements.grade.value = teacherAssigned[0];
            }
        }

        modal.classList.add('active');
    };

    window.closeStudentModal = function () {
        document.getElementById('studentModal')?.classList.remove('active');
    };

    window.saveStudent = function () {
        const form = document.getElementById('studentForm');
        if (!form) return;
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const students = getAllStudents();

        const studentData = {
            id: form.elements.id.value,
            lrn: form.elements.lrn.value,
            firstName: form.elements.firstName.value,
            lastName: form.elements.lastName.value,
            grade: form.elements.grade.value,
            sex: form.elements.sex.value,
            age: parseInt(form.elements.age.value) || '',
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

    window.viewStudent = function (id) {
        const students = getAllStudents();
        const student = students.find(s => s.id === id);
        if (!student) return;
        const modal = document.getElementById('viewStudentModal');
        const body = document.getElementById('studentDetailsBody');
        if (!modal || !body) return;

        body.innerHTML = `
            <div style="display:grid; gap:20px;">
                <div style="background:var(--light-gray); padding:20px; border-radius:12px; border-left:4px solid var(--maroon);">
                    <h4 style="color:var(--maroon); margin-bottom:15px;"><i class="fas fa-id-card"></i> Basic Information</h4>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
                        <div><strong>Student ID:</strong> ${student.id}</div>
                        <div><strong>LRN:</strong> ${student.lrn || 'N/A'}</div>
                        <div><strong>Name:</strong> ${student.firstName} ${student.lastName}</div>
                        <div><strong>Grade & Section:</strong> Grade ${student.grade} - ${SECTIONS[student.grade] || ''}</div>
                        <div><strong>Gender:</strong> ${student.sex}</div>
                        <div><strong>Age:</strong> ${student.age}</div>
                    </div>
                </div>

                <div style="background:var(--light-gray); padding:20px; border-radius:12px; border-left:4px solid var(--gold);">
                    <h4 style="color:var(--maroon); margin-bottom:15px;"><i class="fas fa-address-card"></i> Contact</h4>
                    <div><strong>Email:</strong> ${student.email || 'N/A'}</div>
                    <div><strong>Phone:</strong> ${student.phone || 'N/A'}</div>
                    <div><strong>Address:</strong> ${student.address || 'N/A'}</div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    };

    window.closeViewModal = function () {
        document.getElementById('viewStudentModal')?.classList.remove('active');
    };

    window.editStudent = function (id) {
        const students = getAllStudents();
        const student = students.find(s => s.id === id);
        if (student) openStudentModal(student);
    };

    window.deleteStudent = function (id) {
        const students = getAllStudents();
        const student = students.find(s => s.id === id);
        if (!student) return;
        if (!confirm(`Delete ${student.firstName} ${student.lastName}? This will remove all their records.`)) return;
        const filtered = students.filter(s => s.id !== id);
        localStorage.setItem('absas_students', JSON.stringify(filtered));
        loadStudents();
        filterStudents();
    };

    window.exportToExcel = function () {
        const students = getAllStudents().filter(isStudentAssignedToTeacher);
        if (!students.length) {
            alert('No students to export');
            return;
        }

        let csv = 'Student ID,LRN,First Name,Last Name,Grade,Section,Gender,Age,Email,Phone,Address,Guardian,Guardian Contact,Enrollment Date,Status\n';
        students.forEach(s => {
            csv += `${s.id},${s.lrn || ''},${s.firstName},${s.lastName},${s.grade},${SECTIONS[s.grade] || ''},${s.sex},${s.age || ''},${s.email || ''},${s.phone || ''},"${(s.address || '').replace(/"/g, '""')}",${s.guardian || ''},${s.guardianContact || ''},${s.enrollDate || ''},${s.status || ''}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `teacher_students_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    function initializeSampleDataIfEmpty() {
        if (!localStorage.getItem('absas_students')) {
            const example = [
                { id: 'S001', lrn: '123456789001', firstName: 'Juan', lastName: 'Dela Cruz', grade: '10', sex: 'Male', age: 15, email: 'juan@example.com', phone: '09171234567', address: '123 Main St', guardian: 'Maria Dela Cruz', guardianContact: '09181234567', status: 'Active', enrollDate: '2024-06-01' },
                { id: 'S002', lrn: '123456789002', firstName: 'Maria', lastName: 'Santos', grade: '10', sex: 'Female', age: 16, email: 'maria@example.com', phone: '09171234568', address: '456 Oak Ave', guardian: 'Jose Santos', guardianContact: '09181234568', status: 'Active', enrollDate: '2024-06-01' },
                { id: 'S003', lrn: '123456789003', firstName: 'Pedro', lastName: 'Reyes', grade: '9', sex: 'Male', age: 14, email: 'pedro@example.com', phone: '09171234569', address: '789 Pine Rd', guardian: 'Ana Reyes', guardianContact: '09181234569', status: 'Active', enrollDate: '2024-06-01' }
            ];
            localStorage.setItem('absas_students', JSON.stringify(example));
        }
    }

    initializeSampleDataIfEmpty();
    loadStudents();
    filterStudents();

    window.teacherClasslistReload = function() {
        loadStudents();
        filterStudents();
    };

})();

