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
        '6': 'ROMANS', '7': 'GENESIS', '8': 'EXODUS', '9': 'LEVITICUS', '10': 'NUMBERS'
    };

    // Filter students
    window.filterStudents = function() {
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const gradeFilter = document.getElementById('gradeFilter').value;
        const genderFilter = document.getElementById('genderFilter').value;
        
        // Get all table rows
        const rows = document.querySelectorAll('#studentsTableBody tr');
        
        rows.forEach(row => {
            const studentId = row.cells[0]?.textContent.toLowerCase() || '';
            const lrn = row.cells[1]?.textContent.toLowerCase() || '';
            const name = row.cells[2]?.textContent.toLowerCase() || '';
            const grade = row.cells[3]?.textContent || '';
            const gender = row.cells[4]?.textContent || '';
            
            const matchesSearch = !searchTerm || 
                studentId.includes(searchTerm) || 
                lrn.includes(searchTerm) || 
                name.includes(searchTerm);
            
            const matchesGrade = !gradeFilter || grade.includes(gradeFilter);
            const matchesGender = !genderFilter || gender.includes(genderFilter);
            
            if (matchesSearch && matchesGrade && matchesGender) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

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

    // Open modal for add student
    window.openStudentModal = function() {
        const modal = document.getElementById('studentModal');
        const form = document.getElementById('studentForm');
        const title = document.getElementById('studentModalTitle');
        
        form.reset();
        title.innerHTML = '<i class="fas fa-user-plus"></i> Add Student';
        modal.classList.add('active');
    };

    window.closeStudentModal = function() {
        document.getElementById('studentModal').classList.remove('active');
    };

    // Edit Modal - Fetch student data and populate form
    window.EditModal = function(studentId) {
        fetch("get-student.php?id=" + studentId)
            .then(res => res.json())
            .then(data => {
                const modal = document.getElementById('EditModal');
                const form = document.getElementById('studentForm1');
                const title = document.getElementById('studentModalTitle1');

                title.innerHTML = '<i class="fas fa-edit"></i> Edit Student';

                // Populate form fields
                form.querySelector('#edit_studentId').value = data.Student_ID || '';
                form.querySelector('#edit_lrn').value = data.LRN_ID || '';
                form.querySelector('#edit_firstName').value = data.Student_First_Name || '';
                form.querySelector('#edit_lastName').value = data.Student_Last_Name || '';
                form.querySelector('#edit_middleName').value = data.Student_Middle_Name || '';
                form.querySelector('#edit_grade').value = data.Student_Grade_Level || '';
                form.querySelector('#edit_enrollDate').value = data.Student_Enrollment_Date || '';
                form.querySelector('#edit_sex').value = data.Student_Gender || '';
                form.querySelector('#edit_age').value = data.Student_Age || '';
                form.querySelector('#edit_birthday').value = data.Student_BirthDate || '';
                form.querySelector('#edit_phone').value = data.Student_Contact || '';
                form.querySelector('#edit_email').value = data.Student_Email || '';
                form.querySelector('#edit_Epass').value = data.Student_Password || '';
                form.querySelector('#edit_guardian').value = data.Student_Guardian_Name || '';
                form.querySelector('#edit_guardianContact').value = data.Student_Guardian_Contact || '';
                form.querySelector('#edit_address').value = data.Student_Home_Address || '';

                modal.classList.add('active');
            })
            .catch(error => {
                console.error('Error fetching student data:', error);
                alert('Error loading student data. Please try again.');
            });
    };

    window.closeStudentModal1 = function() {
        document.getElementById('EditModal').classList.remove('active');
    };

    // View student details
    window.viewStudent = function(id) {
        // Implementation for viewing student details
        alert('View student details feature - ID: ' + id);
    };

    window.closeViewModal = function() {
        document.getElementById('viewStudentModal').classList.remove('active');
    };

    // Delete student
    window.deleteStudent = function(id) {
        if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            // Implement delete functionality
            alert('Delete functionality needs to be implemented with PHP backend');
        }
    };

    // Export to Excel
    window.exportToExcel = function() {
        const table = document.getElementById('studentsTableBody');
        const rows = Array.from(table.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
        
        if (rows.length === 0) {
            alert('No students to export');
            return;
        }

        let csv = 'Student ID,LRN,First Name,Last Name,Grade,Section,Gender,Age,Guardian,Contact\n';
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const rowData = [
                    cells[0]?.textContent.trim() || '',
                    cells[1]?.textContent.trim() || '',
                    cells[2]?.textContent.trim() || '',
                    cells[2]?.textContent.trim() || '',
                    cells[3]?.textContent.trim() || '',
                    '',
                    cells[4]?.textContent.trim() || '',
                    cells[5]?.textContent.trim() || '',
                    cells[6]?.textContent.trim() || '',
                    cells[7]?.textContent.trim() || ''
                ];
                csv += rowData.map(field => `"${field}"`).join(',') + '\n';
            }
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Add CSS for section headers
    const style = document.createElement('style');
    style.textContent = `
        .section-title {
            color: var(--maroon);
            margin: 20px 0 15px;
            border-bottom: 2px solid var(--gold);
            padding-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
});