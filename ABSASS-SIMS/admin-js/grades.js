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

    // Subject mappings by grade level
    const SUBJECTS = {
        '1': ['GMRC/VAL ED. 1', 'MAKABANSA 1', 'LANGUAGE 1', 'READING LITERACY 1', 'MATH 1', 'COMPUTER 1'],
        '2': ['GMRC/VAL ED. 2', 'ENGLISH 2', 'MATH 2', 'MAKABANSA 2', 'FILIPINO 2', 'COMPUTER 2'],
        '3': ['GMRC/VAL ED. 3', 'ENGLISH 3', 'FILIPINO 3', 'MAKABANSA 3', 'SCIENCE 3', 'MATH 3', 'COMPUTER 3'],
        '4': ['MATH 4', 'MAPEH 4', 'SCIENCE 4', 'FILIPINO 4', 'ENGLISH 4', 'ARPAN 4', 'COMPUTER 4', 'EPP/TLE 4', 'GMRC/ESP 4'],
        '5': ['ENGLISH 5', 'FILIPINO 5', 'ARPAN 5', 'GMRC/ESP 5', 'SCIENCE 5', 'EPP/TLE 5', 'MATH 5', 'MAPEH 5', 'COMPUTER 5'],
        '6': ['MAPEH 6', 'ARPAN 6', 'FILIPINO 6', 'GMRC/ESP 6', 'EPP/TLE 6', 'SCIENCE 6', 'ENGLISH 6', 'MATH 6', 'COMPUTER 6'],
        '7': ['Filipino 7', 'English 7', 'Mathematics 7', 'Science 7', 'Araling Panlipunan 7', 'MAPEH 7', 'EPP/TLE 7', 'Computer 7'],
        '8': ['Filipino 8', 'English 8', 'Mathematics 8', 'Science 8', 'Araling Panlipunan 8', 'MAPEH 8', 'EPP/TLE 8', 'Computer 8'],
        '9': ['Filipino 9', 'English 9', 'Mathematics 9', 'Science 9', 'Araling Panlipunan 9', 'MAPEH 9', 'EPP/TLE 9', 'Computer 9'],
        '10': ['Filipino 10', 'English 10', 'Mathematics 10', 'Science 10', 'Araling Panlipunan 10', 'MAPEH 10', 'EPP/TLE 10', 'Computer 10']
    };

    // Current selected period
    let currentPeriod = '1Q';

    // Initialize sample grade data
    function initializeGradeData() {
        if (!localStorage.getItem('absas_grades')) {
            const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
            const grades = [];

            students.forEach(student => {
                const subjects = SUBJECTS[student.grade] || [];
                subjects.forEach(subject => {
                    ['1Q', '2Q', '3Q', '4Q'].forEach(quarter => {
                        grades.push({
                            studentId: student.id,
                            grade: student.grade,
                            subject: subject,
                            quarter: quarter,
                            grade1: Math.floor(Math.random() * 16) + 85, // 85-100
                            grade2: Math.floor(Math.random() * 16) + 85,
                            grade3: Math.floor(Math.random() * 16) + 85,
                            grade4: Math.floor(Math.random() * 16) + 85,
                            quarterGrade: 0,
                            remarks: ''
                        });
                    });
                });
            });

            // Calculate quarter grades
            grades.forEach(g => {
                g.quarterGrade = Math.round((g.grade1 + g.grade2 + g.grade3 + g.grade4) / 4);
            });

            localStorage.setItem('absas_grades', JSON.stringify(grades));
        }
    }

    // Select grading period
    window.selectPeriod = function(period) {
        currentPeriod = period;
        
        // Update active tab
        document.querySelectorAll('.period-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.period === period) {
                tab.classList.add('active');
            }
        });

        loadGrades();
    };

    // Update subject filter based on grade
    document.getElementById('gradeFilter').addEventListener('change', function() {
        const grade = this.value;
        const subjectFilter = document.getElementById('subjectFilter');
        
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        
        if (grade && SUBJECTS[grade]) {
            SUBJECTS[grade].forEach(subject => {
                const option = document.createElement('option');
                option.value = subject;
                option.textContent = subject;
                subjectFilter.appendChild(option);
            });
        }
    });

    // Load grades
    window.loadGrades = function() {
        const grade = document.getElementById('gradeFilter').value;
        const subject = document.getElementById('subjectFilter').value;
        const search = document.getElementById('studentSearch').value.toLowerCase();

        if (!grade) {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('gradesCard').style.display = 'none';
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');

        // Filter students
        let filteredStudents = students.filter(s => s.grade === grade);
        
        if (search) {
            filteredStudents = filteredStudents.filter(s => 
                (s.firstName + ' ' + s.lastName).toLowerCase().includes(search) ||
                s.id.toLowerCase().includes(search)
            );
        }

        if (filteredStudents.length === 0) {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('gradesCard').style.display = 'none';
            return;
        }

        // Update title
        const periodName = currentPeriod === 'FINAL' ? 'Final Grades' : `${currentPeriod} Grades`;
        document.getElementById('gradesTitle').innerHTML = `
            <i class="fas fa-file-alt"></i> Grade ${grade} - ${SECTIONS[grade]} - ${periodName}
        `;

        // Get subjects for this grade
        let subjects = subject ? [subject] : (SUBJECTS[grade] || []);

        // Build table header
        let headerHTML = '<tr><th rowspan="2">Student</th>';
        
        if (currentPeriod === 'FINAL') {
            headerHTML += '<th>1Q</th><th>2Q</th><th>3Q</th><th>4Q</th><th>Final Grade</th><th>Remarks</th>';
        } else {
            subjects.forEach(subj => {
                headerHTML += `<th>${subj}</th>`;
            });
            headerHTML += '<th>Average</th><th>Action</th>';
        }
        
        headerHTML += '</tr>';
        document.getElementById('gradesTableHead').innerHTML = headerHTML;

        // Build table body
        let bodyHTML = '';
        
        filteredStudents.forEach(student => {
            if (currentPeriod === 'FINAL') {
                // Show final grades across all quarters
                bodyHTML += `<tr>`;
                bodyHTML += `<td class="student-info">
                    ${student.firstName} ${student.lastName}
                    <span class="student-id">${student.id}</span>
                </td>`;

                let finalAverage = 0;
                let quarterGrades = [];

                ['1Q', '2Q', '3Q', '4Q'].forEach(quarter => {
                    const studentGrades = grades.filter(g => 
                        g.studentId === student.id && 
                        g.quarter === quarter
                    );
                    
                    if (studentGrades.length > 0) {
                        const avg = calculateOverallAverage(studentGrades);
                        quarterGrades.push(avg);
                        bodyHTML += `<td>${getGradeCell(avg)}</td>`;
                    } else {
                        bodyHTML += `<td><span class="grade-cell no-grade">N/A</span></td>`;
                    }
                });

                if (quarterGrades.length > 0) {
                    finalAverage = Math.round(quarterGrades.reduce((a, b) => a + b, 0) / quarterGrades.length);
                }

                bodyHTML += `<td class="average-cell">${finalAverage || 'N/A'}</td>`;
                bodyHTML += `<td>${getRemarks(finalAverage)}</td>`;
                bodyHTML += `</tr>`;
            } else {
                // Show specific quarter grades
                bodyHTML += `<tr>`;
                bodyHTML += `<td class="student-info">
                    ${student.firstName} ${student.lastName}
                    <span class="student-id">${student.id}</span>
                </td>`;

                let total = 0;
                let count = 0;

                subjects.forEach(subj => {
                    const gradeRecord = grades.find(g => 
                        g.studentId === student.id && 
                        g.subject === subj && 
                        g.quarter === currentPeriod
                    );

                    if (gradeRecord) {
                        const grade = gradeRecord.quarterGrade;
                        total += grade;
                        count++;
                        bodyHTML += `<td onclick="viewGradeDetails('${student.id}', '${subj}', '${currentPeriod}')">${getGradeCell(grade)}</td>`;
                    } else {
                        bodyHTML += `<td><span class="grade-cell no-grade">N/A</span></td>`;
                    }
                });

                const average = count > 0 ? Math.round(total / count) : 0;
                bodyHTML += `<td class="average-cell">${average || 'N/A'}</td>`;
                bodyHTML += `<td>
                    <button class="btn btn-sm btn-secondary" onclick="viewStudentGrades('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>`;
                bodyHTML += `</tr>`;
            }
        });

        document.getElementById('gradesTableBody').innerHTML = bodyHTML;
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('gradesCard').style.display = 'block';
    };

    // Get grade cell with color coding
    function getGradeCell(grade) {
        if (!grade || grade === 0) {
            return '<span class="grade-cell no-grade">N/A</span>';
        }

        let className = '';
        if (grade >= 90) className = 'outstanding';
        else if (grade >= 85) className = 'very-satisfactory';
        else if (grade >= 80) className = 'satisfactory';
        else if (grade >= 75) className = 'fairly-satisfactory';
        else className = 'did-not-meet';

        return `<span class="grade-cell ${className}">${grade}</span>`;
    }

    // Get remarks based on grade
    function getRemarks(grade) {
        if (grade >= 90) return '<span class="status-badge complete">Outstanding</span>';
        if (grade >= 85) return '<span class="status-badge complete">Very Satisfactory</span>';
        if (grade >= 80) return '<span class="status-badge complete">Satisfactory</span>';
        if (grade >= 75) return '<span class="status-badge incomplete">Fairly Satisfactory</span>';
        return '<span class="status-badge pending">Did Not Meet Expectations</span>';
    }

    // Calculate overall average
    function calculateOverallAverage(gradeRecords) {
        if (gradeRecords.length === 0) return 0;
        const total = gradeRecords.reduce((sum, g) => sum + g.quarterGrade, 0);
        return Math.round(total / gradeRecords.length);
    }

    // View grade details
    window.viewGradeDetails = function(studentId, subject, quarter) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');

        const student = students.find(s => s.id === studentId);
        const gradeRecord = grades.find(g => 
            g.studentId === studentId && 
            g.subject === subject && 
            g.quarter === quarter
        );

        if (!student || !gradeRecord) return;

        const modalBody = document.getElementById('gradeModalBody');
        
        modalBody.innerHTML = `
            <div class="grade-details-grid">
                <div class="grade-section">
                    <h4><i class="fas fa-user"></i> Student Information</h4>
                    <div class="grade-row">
                        <div class="grade-label">Student ID:</div>
                        <div class="grade-value">${student.id}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Name:</div>
                        <div class="grade-value">${student.firstName} ${student.lastName}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Grade & Section:</div>
                        <div class="grade-value">Grade ${student.grade} - ${SECTIONS[student.grade]}</div>
                    </div>
                </div>

                <div class="grade-section" style="border-left-color: var(--gold);">
                    <h4><i class="fas fa-book"></i> Subject: ${subject}</h4>
                    <div class="grade-row">
                        <div class="grade-label">Grading Period:</div>
                        <div class="grade-value">${quarter}</div>
                    </div>
                </div>

                <div class="grade-section" style="border-left-color: #28a745;">
                    <h4><i class="fas fa-chart-line"></i> Component Grades</h4>
                    <div class="grade-row">
                        <div class="grade-label">Written Works (30%):</div>
                        <div class="grade-value">${gradeRecord.grade1}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Performance Tasks (40%):</div>
                        <div class="grade-value">${gradeRecord.grade2}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Quarterly Assessment (20%):</div>
                        <div class="grade-value">${gradeRecord.grade3}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Class Participation (10%):</div>
                        <div class="grade-value">${gradeRecord.grade4}</div>
                    </div>
                </div>

                <div class="grade-section" style="border-left-color: #007bff;">
                    <h4><i class="fas fa-star"></i> Quarter Grade</h4>
                    <div class="grade-row">
                        <div class="grade-label">Final Grade:</div>
                        <div class="grade-value large">${getGradeCell(gradeRecord.quarterGrade)}</div>
                    </div>
                    <div class="grade-row">
                        <div class="grade-label">Remarks:</div>
                        <div class="grade-value">${getRemarks(gradeRecord.quarterGrade)}</div>
                    </div>
                </div>

                ${gradeRecord.remarks ? `
                <div class="grade-section">
                    <h4><i class="fas fa-comment"></i> Teacher's Remarks</h4>
                    <p style="color: #666; font-style: italic;">${gradeRecord.remarks}</p>
                </div>
                ` : ''}
            </div>

            <p style="margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; font-size: 13px; color: #856404;">
                <i class="fas fa-info-circle"></i> 
                <strong>Note:</strong> Grades are managed by subject teachers. Contact the respective teacher for any grade inquiries or concerns.
            </p>
        `;

        document.getElementById('gradeModal').classList.add('active');
    };

    // View all grades for a student
    window.viewStudentGrades = function(studentId) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');

        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const studentGrades = grades.filter(g => g.studentId === studentId && g.quarter === currentPeriod);
        
        const modalBody = document.getElementById('gradeModalBody');
        
        let gradesHTML = `
            <div class="grade-section">
                <h4><i class="fas fa-user"></i> ${student.firstName} ${student.lastName}</h4>
                <div class="grade-row">
                    <div class="grade-label">Grade & Section:</div>
                    <div class="grade-value">Grade ${student.grade} - ${SECTIONS[student.grade]}</div>
                </div>
                <div class="grade-row">
                    <div class="grade-label">Period:</div>
                    <div class="grade-value">${currentPeriod}</div>
                </div>
            </div>
            
            <table class="data-table" style="margin-top: 20px;">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Grade</th>
                        <th>Remarks</th>
                    </tr>
                </thead>
                <tbody>
        `;

        studentGrades.forEach(g => {
            gradesHTML += `
                <tr>
                    <td><strong>${g.subject}</strong></td>
                    <td style="text-align: center;">${getGradeCell(g.quarterGrade)}</td>
                    <td style="text-align: center;">${getRemarks(g.quarterGrade)}</td>
                </tr>
            `;
        });

        const average = calculateOverallAverage(studentGrades);
        
        gradesHTML += `
                <tr style="background: var(--light-gray); font-weight: 700;">
                    <td>GENERAL AVERAGE</td>
                    <td style="text-align: center; font-size: 18px;">${average}</td>
                    <td style="text-align: center;">${getRemarks(average)}</td>
                </tr>
            </tbody>
        </table>
        `;

        modalBody.innerHTML = gradesHTML;
        document.getElementById('gradeModal').classList.add('active');
    };

    // Close modal
    window.closeGradeModal = function() {
        document.getElementById('gradeModal').classList.remove('active');
    };

    // Export grades
    window.exportGrades = function() {
        const grade = document.getElementById('gradeFilter').value;
        
        if (!grade) {
            alert('Please select a grade level first.');
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        
        const filteredStudents = students.filter(s => s.grade === grade);
        const subjects = SUBJECTS[grade] || [];

        let csv = `Grade ${grade} - ${SECTIONS[grade]} - ${currentPeriod}\n\n`;
        csv += 'Student ID,Name,' + subjects.join(',') + ',Average\n';

        filteredStudents.forEach(student => {
            let row = `${student.id},"${student.firstName} ${student.lastName}"`;
            let total = 0;
            let count = 0;

            subjects.forEach(subj => {
                const gradeRecord = grades.find(g => 
                    g.studentId === student.id && 
                    g.subject === subj && 
                    g.quarter === currentPeriod
                );

                if (gradeRecord) {
                    row += `,${gradeRecord.quarterGrade}`;
                    total += gradeRecord.quarterGrade;
                    count++;
                } else {
                    row += ',N/A';
                }
            });

            const average = count > 0 ? Math.round(total / count) : 0;
            row += `,${average}`;
            csv += row + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `grades_${grade}_${currentPeriod}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Print grades
    window.printGrades = function() {
        window.print();
    };

    // Initialize
    initializeGradeData();
});