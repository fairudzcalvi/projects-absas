document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('absas_current_user'));
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

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

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('attendanceDate').value = today;

    // Get section name for grade level
    function getSectionName(grade) {
        const sections = {
            '1': 'MATTHEW', '2': 'MARK', '3': 'LUKE', '4': 'JOHN', '5': 'ACTS',
            '7': 'GENESIS', '8': 'EXODUS', '9': 'LEVITICUS', '10': 'NUMBERS'
        };
        return sections[grade] || 'N/A';
    }

    // Initialize sample attendance data for demonstration
    function initializeSampleAttendance() {
        const date = document.getElementById('attendanceDate').value;
        const key = `attendance_${date}_10_NUMBERS`;
        
        if (!localStorage.getItem(key)) {
            const students = JSON.parse(localStorage.getItem('absas_students') || '[]')
                .filter(s => s.grade === '10');
            
            const sampleAttendance = students.map(s => ({
                studentId: s.id,
                status: Math.random() > 0.2 ? 'present' : (Math.random() > 0.5 ? 'late' : 'absent')
            }));
            
            if (students.length > 0) {
                localStorage.setItem(key, JSON.stringify(sampleAttendance));
            }
        }
    }

    // Load attendance report
    window.loadAttendanceReport = function() {
        const date = document.getElementById('attendanceDate').value;
        const grade = document.getElementById('attendanceGrade').value;

        if (!date) {
            alert('Please select a date');
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        let filteredStudents = students;

        if (grade) {
            filteredStudents = students.filter(s => s.grade === grade);
        }

        if (filteredStudents.length === 0) {
            alert('No students found for the selected grade level');
            return;
        }

        // Get attendance data
        let attendanceData = [];
        
        if (grade) {
            const section = getSectionName(grade);
            const key = `attendance_${date}_${grade}_${section}`;
            attendanceData = JSON.parse(localStorage.getItem(key) || '[]');
        } else {
            // Load all grades
            filteredStudents.forEach(s => {
                const section = getSectionName(s.grade);
                const key = `attendance_${date}_${s.grade}_${section}`;
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                attendanceData = [...attendanceData, ...data];
            });
        }

        if (attendanceData.length === 0) {
            alert('No attendance records found for the selected date and grade level.\n\nNote: Attendance should be recorded by teachers/advisers.');
            return;
        }

        displayAttendanceReport(filteredStudents, attendanceData, date, grade);
    };

    function displayAttendanceReport(students, attendanceData, date, grade) {
        const reportCard = document.getElementById('attendanceReportCard');
        const tbody = document.getElementById('attendanceReportBody');
        const reportTitle = document.getElementById('reportTitle');

        // Update title
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        if (grade) {
            reportTitle.innerHTML = `<i class="fas fa-clipboard-check"></i> Attendance Report - Grade ${grade} (${getSectionName(grade)}) - ${formattedDate}`;
        } else {
            reportTitle.innerHTML = `<i class="fas fa-clipboard-check"></i> Attendance Report - All Grades - ${formattedDate}`;
        }

        // Calculate statistics
        let present = 0, absent = 0, late = 0;
        
        const reportData = students.map(s => {
            const attendance = attendanceData.find(a => a.studentId === s.id);
            const status = attendance ? attendance.status : 'absent';
            
            if (status === 'present') present++;
            else if (status === 'absent') absent++;
            else if (status === 'late') late++;

            return {
                student: s,
                status: status
            };
        });

        // Update statistics
        document.getElementById('presentCount').textContent = present;
        document.getElementById('absentCount').textContent = absent;
        document.getElementById('lateCount').textContent = late;
        
        const totalStudents = students.length;
        const attendanceRate = totalStudents > 0 ? ((present + late) / totalStudents * 100).toFixed(1) : 0;
        document.getElementById('attendanceRate').textContent = attendanceRate + '%';

        // Display table
        tbody.innerHTML = reportData.map(item => {
            let statusBadge = '';
            let statusIcon = '';
            
            switch(item.status) {
                case 'present':
                    statusBadge = 'badge-success';
                    statusIcon = '<i class="fas fa-check-circle"></i>';
                    break;
                case 'absent':
                    statusBadge = 'badge-danger';
                    statusIcon = '<i class="fas fa-times-circle"></i>';
                    break;
                case 'late':
                    statusBadge = 'badge-warning';
                    statusIcon = '<i class="fas fa-clock"></i>';
                    break;
            }

            return `
                <tr>
                    <td>${item.student.id}</td>
                    <td>${item.student.firstName} ${item.student.lastName}</td>
                    <td>Grade ${item.student.grade}</td>
                    <td>${getSectionName(item.student.grade)}</td>
                    <td><span class="badge ${statusBadge}">${statusIcon} ${item.status.toUpperCase()}</span></td>
                </tr>
            `;
        }).join('');

        reportCard.style.display = 'block';
    }

    window.printAttendanceReport = function() {
        window.print();
    };

    // Initialize sample data for demonstration
    initializeSampleAttendance();
});