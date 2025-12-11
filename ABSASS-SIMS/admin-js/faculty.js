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
    function updateStatistics(faculty) {
        const total = faculty.length;
        const advisers = faculty.filter(f => f.isAdviser === 'Adviser' || f.isAdviser === 'Both').length;
        const teachers = faculty.filter(f => f.isAdviser === 'Teacher' || f.isAdviser === 'Both').length;
        const active = faculty.filter(f => f.status === 'Active').length;

        document.getElementById('totalFaculty').textContent = total;
        document.getElementById('advisersCount').textContent = advisers;
        document.getElementById('teachersCount').textContent = teachers;
        document.getElementById('activeCount').textContent = active;
    }

    // Toggle adviser fields based on role selection
    window.toggleAdviserFields = function() {
        const role = document.getElementById('isAdviser').value;
        const adviserGradeGroup = document.getElementById('adviserGradeGroup');
        
        if (role === 'Adviser' || role === 'Both') {
            adviserGradeGroup.style.display = 'block';
        } else {
            adviserGradeGroup.style.display = 'none';
            document.getElementById('adviserGrade').value = '';
        }
    };

    // Filter faculty
    window.filterFaculty = function() {
        const searchTerm = document.getElementById('facultySearch').value.toLowerCase();
        const departmentFilter = document.getElementById('departmentFilter').value;
        const roleFilter = document.getElementById('roleFilter').value;
        
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        
        const filtered = faculty.filter(f => {
            const matchesSearch = !searchTerm || 
                (f.firstName + ' ' + f.lastName).toLowerCase().includes(searchTerm) || 
                f.id.toLowerCase().includes(searchTerm) ||
                (f.email && f.email.toLowerCase().includes(searchTerm));
            const matchesDepartment = !departmentFilter || f.department === departmentFilter;
            const matchesRole = !roleFilter || f.isAdviser === roleFilter;
            
            return matchesSearch && matchesDepartment && matchesRole;
        });

        displayFaculty(filtered);
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

    // Display faculty

    // Load all faculty
    function loadFaculty() {
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        displayFaculty(faculty);
        updateStatistics(faculty);
    }

    // Open modal for add/edit
    window.openFacultyModal = function(facultyData = null) {
        const modal = document.getElementById('facultyModal');
        const form = document.getElementById('facultyForm');
        const title = document.getElementById('facultyModalTitle');
        
        modal.classList.add('active');
    };

    window.closeFacultyModal = function() {
        document.getElementById('facultyModal').classList.remove('active');
    };

    window.EditModal = function (facultyId) {

    fetch("get-faculty.php?id=" + facultyId)
        .then(res => res.json())
        .then(data => {

            const modal = document.getElementById('EditModal');
            const form = document.getElementById('facultyForm1');
            const title = document.getElementById('facultyModalTitle1');

            title.innerHTML = '<i class="fas fa-edit"></i> Edit Faculty';

            // Fill fields with data from database
            form.id.value = data.Faculty_ID;
            form.employeeId.value = data.Faculty_Employee_Number;
            form.firstName.value = data.Faculty_First_Name;
            form.lastName.value = data.Faculty_Last_Name;
            form.MiddleName.value = data.Faculty_Middle_Name;
            form.BirthDate.value = data.Faculty_BirthDate;

            form.department.value = data.Faculty_Department;
            form.position.value = data.Faculty_Position;
            form.hireDate.value = data.Faculty_Hire_Date;
            form.status.value = data.Faculty_Employment_Status;

            form.isAdviser.value = data.Faculty_Role;
            form.adviserGrade.value = data.Faculty_Adviser_Grade;

            form.subjects.value = data.Faculty_Subjects_Taught;

            form.email.value = data.Faculty_Email_Address;
            form.phone.value = data.Faculty_Contact_Number;
            form.password.value = data.Faculty_Password;
            form.address.value = data.Faculty_Address;

            modal.classList.add('active');
        });
};


    window.closeFacultyModal1 = function() {
        document.getElementById('facultyModal1').classList.remove('active');
    };

    // Save faculty
    // View faculty details
    window.viewFaculty = function(id) {
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        const member = faculty.find(f => f.id === id);
        
        if (!member) return;

        const modal = document.getElementById('viewFacultyModal');
        const body = document.getElementById('facultyDetailsBody');
        
        const assignedClass = member.adviserGrade ? `Grade ${member.adviserGrade} - ${SECTIONS[member.adviserGrade]}` : 'Not Assigned';
        const subjects = member.subjects || 'None';
        
        body.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid var(--maroon);">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-id-card"></i> Basic Information</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div><strong>Faculty ID:</strong> ${member.id}</div>
                        <div><strong>Employee ID:</strong> ${member.employeeId || 'N/A'}</div>
                        <div><strong>Name:</strong> ${member.firstName} ${member.lastName}</div>
                        <div><strong>Position:</strong> ${member.position}</div>
                        <div><strong>Department:</strong> ${member.department}</div>
                        <div><strong>Status:</strong> <span class="badge ${member.status === 'Active' ? 'badge-success' : 'badge-warning'}">${member.status}</span></div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid var(--gold);">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-school"></i> Teaching Assignment</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Role:</strong> <span class="badge ${member.isAdviser === 'Both' ? 'badge-success' : 'badge-info'}">${member.isAdviser}</span></div>
                        <div><strong>Assigned Class:</strong> ${assignedClass}</div>
                        <div><strong>Subjects:</strong> ${subjects}</div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid #28a745;">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-address-card"></i> Contact Information</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Email:</strong> ${member.email}</div>
                        <div><strong>Phone:</strong> ${member.phone}</div>
                        <div><strong>Address:</strong> ${member.address || 'N/A'}</div>
                    </div>
                </div>

                <div style="background: var(--light-gray); padding: 20px; border-radius: 12px; border-left: 4px solid #007bff;">
                    <h4 style="color: var(--maroon); margin-bottom: 15px;"><i class="fas fa-calendar"></i> Employment Details</h4>
                    <div style="display: grid; gap: 10px;">
                        <div><strong>Hire Date:</strong> ${new Date(member.hireDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        <div><strong>Years of Service:</strong> ${Math.floor((new Date() - new Date(member.hireDate)) / (365.25 * 24 * 60 * 60 * 1000))} years</div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    };

    window.closeViewModal = function() {
        document.getElementById('viewFacultyModal').classList.remove('active');
    };

    // Edit faculty
    window.editFaculty = function(id) {
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        const member = faculty.find(f => f.id === id);
        if (member) {
            openFacultyModal(member);
        }
    };

    // Delete faculty
    window.deleteFaculty = function(id) {
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        const member = faculty.find(f => f.id === id);
        
        if (!member) return;
        
        if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?\n\nThis will remove all associated records.`)) {
            const filtered = faculty.filter(f => f.id !== id);
            localStorage.setItem('absas_faculty', JSON.stringify(filtered));
            loadFaculty();
            filterFaculty();
        }
    };

    // Export to Excel
    window.exportToExcel = function() {
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');
        
        if (faculty.length === 0) {
            alert('No faculty to export');
            return;
        }

        let csv = 'Faculty ID,Employee ID,First Name,Last Name,Department,Position,Role,Assigned Class,Subjects,Email,Phone,Address,Hire Date,Status\n';
        
        faculty.forEach(f => {
            const assignedClass = f.adviserGrade ? `Grade ${f.adviserGrade} - ${SECTIONS[f.adviserGrade]}` : 'None';
            csv += `${f.id},${f.employeeId || ''},${f.firstName},${f.lastName},${f.department},${f.position},${f.isAdviser},${assignedClass},${f.subjects || 'None'},${f.email},${f.phone},${f.address || ''},${f.hireDate},${f.status}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `faculty_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Initialize
    initializeData();
    loadFaculty();
});