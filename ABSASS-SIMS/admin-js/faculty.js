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

    // Toggle adviser fields based on role selection
    window.toggleAdviserFields = function() {
        const role = document.getElementById('isAdviser').value;
        const adviserGradeGroup = document.getElementById('adviserGradeGroup');
        
        if (role === 'Adviser' || role === 'Both') {
            adviserGradeGroup.style.display = 'block';
        } else {
            adviserGradeGroup.style.display = 'none';
            document.getElementById('adviserGrade').value = '0';
        }
    };

    // Filter faculty
    window.filterFaculty = function() {
        const searchTerm = document.getElementById('facultySearch').value.toLowerCase();
        const departmentFilter = document.getElementById('departmentFilter').value;
        const roleFilter = document.getElementById('roleFilter').value;
        
        const rows = document.querySelectorAll('#facultyTableBody tr');
        
        rows.forEach(row => {
            const facultyId = row.cells[0]?.textContent.toLowerCase() || '';
            const name = row.cells[1]?.textContent.toLowerCase() || '';
            const department = row.cells[2]?.textContent || '';
            const role = row.cells[3]?.textContent || '';
            
            const matchesSearch = !searchTerm || 
                facultyId.includes(searchTerm) || 
                name.includes(searchTerm);
            
            const matchesDepartment = !departmentFilter || department.includes(departmentFilter);
            const matchesRole = !roleFilter || role.includes(roleFilter);
            
            if (matchesSearch && matchesDepartment && matchesRole) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        updateTableTitle(departmentFilter, roleFilter);
    };

    // Update table title
    function updateTableTitle(department, role) {
        let title = 'All Faculty Members';
        if (department && role) {
            title = `${department} - ${role}`;
        } else if (department) {
            title = `${department} Faculty`;
        } else if (role) {
            title = `${role}s`;
        }
        document.getElementById('tableTitle').innerHTML = `<i class="fas fa-users"></i> ${title}`;
    }

    // Open modal for add faculty
    window.openFacultyModal = function() {
        const modal = document.getElementById('facultyModal');
        const form = document.getElementById('facultyForm');
        const title = document.getElementById('facultyModalTitle');
        
        form.reset();
        title.innerHTML = '<i class="fas fa-user-plus"></i> Add Faculty';
        document.getElementById('adviserGradeGroup').style.display = 'none';
        
        modal.classList.add('active');
    };

    window.closeFacultyModal = function() {
        document.getElementById('facultyModal').classList.remove('active');
    };

    // Edit Modal - Fetch faculty data and populate form
    window.EditModal = function(facultyId) {
        fetch("get-faculty.php?id=" + facultyId)
            .then(res => res.json())
            .then(data => {
                const modal = document.getElementById('EditModal');
                const form = document.getElementById('facultyForm1');
                const title = document.getElementById('facultyModalTitle1');

                title.innerHTML = '<i class="fas fa-edit"></i> Edit Faculty';

                // Populate form fields
                form.querySelector('#edit_facultyId').value = data.Faculty_ID || '';
                form.querySelector('#edit_employeeId').value = data.Employee_Number || '';
                form.querySelector('#edit_firstName').value = data.Faculty_First_Name || '';
                form.querySelector('#edit_lastName').value = data.Faculty_Last_Name || '';
                form.querySelector('#edit_middleName').value = data.Faculty_Middle_Name || '';
                form.querySelector('#edit_birthDate').value = data.Faculty_BirthDate || '';
                form.querySelector('#edit_department').value = data.Faculty_Department || '';
                form.querySelector('#edit_position').value = data.Faculty_Position || '';
                form.querySelector('#edit_hireDate').value = data.Faculty_Hire_Date || '';
                form.querySelector('#edit_status').value = data.Faculty_Employment_Status || '';
                form.querySelector('#edit_subjects').value = data.Faculty_Subjects_Taught || '';
                form.querySelector('#edit_email').value = data.Faculty_Email_Address || '';
                form.querySelector('#edit_phone').value = data.Faculty_Contact_Number || '';
                form.querySelector('#edit_password').value = data.Faculty_Password || '';
                form.querySelector('#edit_address').value = data.Faculty_Address || '';

                modal.classList.add('active');
            })
            .catch(error => {
                console.error('Error fetching faculty data:', error);
                alert('Error loading faculty data. Please try again.');
            });
    };

    window.closeFacultyModal1 = function() {
        document.getElementById('EditModal').classList.remove('active');
    };

    // View faculty details
    window.viewFaculty = function(id) {
        alert('View faculty details feature - ID: ' + id);
    };

    window.closeViewModal = function() {
        document.getElementById('viewFacultyModal').classList.remove('active');
    };

    // Delete faculty
    window.deleteFaculty = function(id) {
        if (confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
            alert('Delete functionality needs to be implemented with PHP backend');
        }
    };

    // Export to Excel
    window.exportToExcel = function() {
        const table = document.getElementById('facultyTableBody');
        const rows = Array.from(table.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
        
        if (rows.length === 0) {
            alert('No faculty to export');
            return;
        }

        let csv = 'Faculty ID,Name,Department,Role,Assigned Class,Subjects,Contact,Status\n';
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const rowData = [];
                for (let i = 0; i < Math.min(8, cells.length); i++) {
                    rowData.push(cells[i]?.textContent.trim() || '');
                }
                csv += rowData.map(field => `"${field}"`).join(',') + '\n';
            }
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faculty_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
});