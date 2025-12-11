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

    // Generate Master List
    window.generateMasterList = function() {
        const grade = document.getElementById('gradeSelect').value;
        const gender = document.getElementById('genderSelect').value;

        if (!grade) {
            alert('Please select a grade level');
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');

        // Filter students by grade and gender
        let filteredStudents = students.filter(s => s.grade === grade && s.status === 'Active');
        
        if (gender) {
            filteredStudents = filteredStudents.filter(s => s.sex === gender);
        }

        // Sort students alphabetically by last name, then first name
        filteredStudents.sort((a, b) => {
            const lastNameCompare = a.lastName.localeCompare(b.lastName);
            if (lastNameCompare !== 0) return lastNameCompare;
            return a.firstName.localeCompare(b.firstName);
        });

        if (filteredStudents.length === 0) {
            alert('No students found for the selected criteria');
            return;
        }

        // Find adviser for this grade
        const adviser = faculty.find(f => 
            f.adviserGrade === grade && 
            (f.isAdviser === 'Adviser' || f.isAdviser === 'Both')
        );

        // Update statistics
        const maleCount = filteredStudents.filter(s => s.sex === 'Male').length;
        const femaleCount = filteredStudents.filter(s => s.sex === 'Female').length;

        document.getElementById('totalCount').textContent = filteredStudents.length;
        document.getElementById('maleCount').textContent = maleCount;
        document.getElementById('femaleCount').textContent = femaleCount;
        document.getElementById('activeCount').textContent = filteredStudents.length;

        // Update list information
        const sectionName = SECTIONS[grade];
        const listTitleText = gender 
            ? `Grade ${grade} - ${sectionName} (${gender} Students)`
            : `Grade ${grade} - ${sectionName}`;

        document.getElementById('listTitle').innerHTML = `<i class="fas fa-list-alt"></i> ${listTitleText}`;
        document.getElementById('listTitlePrint').textContent = listTitleText;
        document.getElementById('gradeSectionInfo').textContent = `Grade ${grade} - ${sectionName}`;
        document.getElementById('adviserInfo').textContent = adviser 
            ? `${adviser.firstName} ${adviser.lastName}` 
            : 'Not Assigned';
        document.getElementById('totalStudentsInfo').textContent = filteredStudents.length;
        document.getElementById('genderFilterInfo').textContent = gender || 'All Students';
        
        const now = new Date();
        document.getElementById('dateGenerated').textContent = now.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });

        // Populate table
        const tbody = document.getElementById('masterListBody');
        tbody.innerHTML = filteredStudents.map((student, index) => `
            <tr>
                <td style="text-align: center;"><strong>${index + 1}</strong></td>
                <td>${student.lrn || 'N/A'}</td>
                <td><strong>${student.lastName}</strong></td>
                <td>${student.firstName}</td>
                <td style="text-align: center;">
                    <i class="fas fa-${student.sex === 'Male' ? 'male' : 'female'}"></i> 
                    ${student.sex}
                </td>
                <td style="text-align: center;">${student.age}</td>
                <td>${student.guardian}</td>
                <td>${student.guardianContact || student.phone || 'N/A'}</td>
            </tr>
        `).join('');

        // Show/hide sections
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('statsSection').style.display = 'grid';
        document.getElementById('masterListCard').style.display = 'block';

        // Scroll to list
        document.getElementById('masterListCard').scrollIntoView({ behavior: 'smooth' });
    };

    // Export to Excel
    window.exportMasterList = function() {
        const grade = document.getElementById('gradeSelect').value;
        const gender = document.getElementById('genderSelect').value;

        if (!grade) {
            alert('Please generate a master list first');
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const faculty = JSON.parse(localStorage.getItem('absas_faculty') || '[]');

        let filteredStudents = students.filter(s => s.grade === grade && s.status === 'Active');
        
        if (gender) {
            filteredStudents = filteredStudents.filter(s => s.sex === gender);
        }

        filteredStudents.sort((a, b) => {
            const lastNameCompare = a.lastName.localeCompare(b.lastName);
            if (lastNameCompare !== 0) return lastNameCompare;
            return a.firstName.localeCompare(b.firstName);
        });

        const adviser = faculty.find(f => 
            f.adviserGrade === grade && 
            (f.isAdviser === 'Adviser' || f.isAdviser === 'Both')
        );

        const sectionName = SECTIONS[grade];
        const adviserName = adviser ? `${adviser.firstName} ${adviser.lastName}` : 'Not Assigned';

        // Create CSV content
        let csv = 'A.B. Simpson Alliance School\n';
        csv += `Master List - Grade ${grade} - ${sectionName}\n`;
        csv += `School Year: 2024-2025\n`;
        csv += `Adviser: ${adviserName}\n`;
        csv += `Total Students: ${filteredStudents.length}\n`;
        csv += `Gender Filter: ${gender || 'All Students'}\n`;
        csv += `Date Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\n`;
        
        csv += 'No.,LRN,Last Name,First Name,Gender,Age,Parent/Guardian,Contact Number\n';
        
        filteredStudents.forEach((student, index) => {
            csv += `${index + 1},${student.lrn || 'N/A'},${student.lastName},${student.firstName},${student.sex},${student.age},${student.guardian},${student.guardianContact || student.phone || 'N/A'}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MasterList_Grade${grade}_${sectionName}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };
});