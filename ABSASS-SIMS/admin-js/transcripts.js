document.addEventListener('DOMContentLoaded', function() {
    // Authentication check
    const currentUser = JSON.parse(localStorage.getItem('absas_current_user'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Only admin can access transcripts
    if (currentUser.accountType !== 'admin') {
        alert('Access Denied: Only administrators can access transcript management.');
        window.location.href = 'dashboard.html';
        return;
    }

    // Initialize UI
    document.getElementById('userInfoSidebar').innerHTML = `
        <p class="user-name">${currentUser.fullName}</p>
        <p class="user-role">Administrator</p>
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

    // Initialize transcript records
    function initializeTranscriptRecords() {
        if (!localStorage.getItem('absas_transcripts')) {
            localStorage.setItem('absas_transcripts', JSON.stringify([]));
        }
    }

    // Check if student has complete grades
    function hasCompleteGrades(studentId, grade) {
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        const subjects = SUBJECTS[grade] || [];
        const quarters = ['1Q', '2Q', '3Q', '4Q'];

        for (let quarter of quarters) {
            for (let subject of subjects) {
                const gradeRecord = grades.find(g => 
                    g.studentId === studentId && 
                    g.subject === subject && 
                    g.quarter === quarter
                );
                if (!gradeRecord || !gradeRecord.quarterGrade) {
                    return false;
                }
            }
        }
        return true;
    }

    // Calculate general average
    function calculateGeneralAverage(studentId) {
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        const studentGrades = grades.filter(g => g.studentId === studentId);
        
        if (studentGrades.length === 0) return 0;

        const quarterAverages = [];
        ['1Q', '2Q', '3Q', '4Q'].forEach(quarter => {
            const quarterGrades = studentGrades.filter(g => g.quarter === quarter);
            if (quarterGrades.length > 0) {
                const sum = quarterGrades.reduce((acc, g) => acc + (g.quarterGrade || 0), 0);
                quarterAverages.push(sum / quarterGrades.length);
            }
        });

        if (quarterAverages.length === 0) return 0;
        return Math.round(quarterAverages.reduce((a, b) => a + b, 0) / quarterAverages.length);
    }

    // Update statistics
    function updateStatistics() {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const transcripts = JSON.parse(localStorage.getItem('absas_transcripts') || '[]');
        
        let completeCount = 0;
        let incompleteCount = 0;

        students.forEach(student => {
            if (hasCompleteGrades(student.id, student.grade)) {
                completeCount++;
            } else {
                incompleteCount++;
            }
        });

        const today = new Date().toISOString().split('T')[0];
        const generatedToday = transcripts.filter(t => t.generatedDate === today).length;

        document.getElementById('totalTranscripts').textContent = transcripts.length;
        document.getElementById('generatedToday').textContent = generatedToday;
        document.getElementById('completedGrades').textContent = completeCount;
        document.getElementById('pendingRecords').textContent = incompleteCount;
    }

    // Search students
    window.searchStudents = function() {
        const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
        const gradeFilter = document.getElementById('gradeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const transcripts = JSON.parse(localStorage.getItem('absas_transcripts') || '[]');

        let filtered = students.filter(s => {
            const matchesSearch = !searchTerm || 
                (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchTerm) ||
                s.id.toLowerCase().includes(searchTerm) ||
                (s.lrn && s.lrn.includes(searchTerm));
            
            const matchesGrade = !gradeFilter || s.grade === gradeFilter;
            
            let matchesStatus = true;
            if (statusFilter === 'complete') {
                matchesStatus = hasCompleteGrades(s.id, s.grade);
            } else if (statusFilter === 'incomplete') {
                matchesStatus = !hasCompleteGrades(s.id, s.grade);
            }

            return matchesSearch && matchesGrade && matchesStatus;
        });

        displayStudents(filtered, transcripts);
    };

    // Display students
    // Generate transcript
    window.generateTranscript = function(studentId) {
        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        const grades = JSON.parse(localStorage.getItem('absas_grades') || '[]');
        
        const student = students.find(s => s.id === studentId);
        if (!student) {
            alert('Student not found.');
            return;
        }

        if (!hasCompleteGrades(studentId, student.grade)) {
            alert('Cannot generate transcript: Student has incomplete grade records.');
            return;
        }

        const studentGrades = grades.filter(g => g.studentId === studentId);
        const subjects = SUBJECTS[student.grade] || [];

        // Build transcript HTML
        let transcriptHTML = `
            <div class="transcript-header">
                <div class="school-header">
                    <h1>ATENEO DE BATAAN SACRED ACADEMY OF SURIGAO</h1>
                    <p class="school-address">Surigao City, Philippines</p>
                    <p class="school-contact">Tel: (086) 826-XXXX | Email: absas@school.edu.ph</p>
                </div>
                <div class="transcript-title">
                    <h2>OFFICIAL TRANSCRIPT OF RECORDS</h2>
                    <p class="academic-year">Academic Year 2024-2025</p>
                </div>
            </div>

            <div class="student-info-section">
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">Student ID:</span>
                        <span class="info-value">${student.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">LRN:</span>
                        <span class="info-value">${student.lrn || 'N/A'}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">Name:</span>
                        <span class="info-value">${student.lastName}, ${student.firstName}</span>
                    </div>
                </div>
                <div class="info-row">
                    <div class="info-item">
                        <span class="info-label">Grade Level:</span>
                        <span class="info-value">Grade ${student.grade} - ${SECTIONS[student.grade]}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">School Year:</span>
                        <span class="info-value">2024-2025</span>
                    </div>
                </div>
            </div>

            <table class="transcript-table">
                <thead>
                    <tr>
                        <th rowspan="2">SUBJECT</th>
                        <th colspan="4">QUARTERLY GRADES</th>
                        <th rowspan="2">FINAL GRADE</th>
                        <th rowspan="2">REMARKS</th>
                    </tr>
                    <tr>
                        <th>1Q</th>
                        <th>2Q</th>
                        <th>3Q</th>
                        <th>4Q</th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalFinalGrade = 0;
        let subjectCount = 0;

        subjects.forEach(subject => {
            const q1 = studentGrades.find(g => g.subject === subject && g.quarter === '1Q');
            const q2 = studentGrades.find(g => g.subject === subject && g.quarter === '2Q');
            const q3 = studentGrades.find(g => g.subject === subject && g.quarter === '3Q');
            const q4 = studentGrades.find(g => g.subject === subject && g.quarter === '4Q');

            const finalGrade = Math.round(
                ((q1?.quarterGrade || 0) + (q2?.quarterGrade || 0) + 
                 (q3?.quarterGrade || 0) + (q4?.quarterGrade || 0)) / 4
            );

            totalFinalGrade += finalGrade;
            subjectCount++;

            const remarks = finalGrade >= 75 ? 'PASSED' : 'FAILED';

            transcriptHTML += `
                <tr>
                    <td class="subject-name">${subject}</td>
                    <td class="grade-cell">${q1?.quarterGrade || '-'}</td>
                    <td class="grade-cell">${q2?.quarterGrade || '-'}</td>
                    <td class="grade-cell">${q3?.quarterGrade || '-'}</td>
                    <td class="grade-cell">${q4?.quarterGrade || '-'}</td>
                    <td class="final-grade-cell">${finalGrade}</td>
                    <td class="remarks-cell ${remarks === 'PASSED' ? 'passed' : 'failed'}">${remarks}</td>
                </tr>
            `;
        });

        const generalAverage = Math.round(totalFinalGrade / subjectCount);

        transcriptHTML += `
                    <tr class="average-row">
                        <td colspan="5"><strong>GENERAL AVERAGE</strong></td>
                        <td class="final-grade-cell"><strong>${generalAverage}</strong></td>
                        <td class="remarks-cell ${generalAverage >= 75 ? 'passed' : 'failed'}">
                            <strong>${generalAverage >= 75 ? 'PASSED' : 'FAILED'}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="transcript-footer">
                <div class="signature-section">
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p class="signature-name">Registrar</p>
                        <p class="signature-date">Date Issued: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line"></div>
                        <p class="signature-name">Principal</p>
                        <p class="signature-date">Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
                <div class="school-seal">
                    <div class="seal-placeholder">
                        <img src="ABSAS LOGO.jpg" alt="A.B. Simpson Alliance School Official Seal">
                    </div>
                </div>
                <div class="transcript-note">
                    <p><strong>Note:</strong> This is an official document. Any erasure or alteration makes this transcript invalid.</p>
                    <p class="document-id">Document ID: TR-${student.id}-${new Date().getFullYear()}</p>
                </div>
            </div>
        `;

        // Save transcript record
        const transcripts = JSON.parse(localStorage.getItem('absas_transcripts') || '[]');
        const existingIndex = transcripts.findIndex(t => t.studentId === studentId);
        
        const transcriptRecord = {
            studentId: studentId,
            studentName: `${student.firstName} ${student.lastName}`,
            grade: student.grade,
            generalAverage: generalAverage,
            generatedDate: new Date().toISOString().split('T')[0],
            generatedBy: currentUser.fullName
        };

        if (existingIndex !== -1) {
            transcripts[existingIndex] = transcriptRecord;
        } else {
            transcripts.push(transcriptRecord);
        }

        localStorage.setItem('absas_transcripts', JSON.stringify(transcripts));

        // Display transcript
        document.getElementById('transcriptPreview').innerHTML = transcriptHTML;
        document.getElementById('transcriptModal').classList.add('active');

        // Update statistics
        updateStatistics();
        searchStudents();
    };

    // Close transcript modal
    window.closeTranscriptModal = function() {
        document.getElementById('transcriptModal').classList.remove('active');
    };

    // Print transcript
    window.printTranscript = function() {
        const printContent = document.getElementById('transcriptPreview').innerHTML;
        const printWindow = window.open('', '', 'height=800,width=800');
        
        printWindow.document.write(`
            <html>
            <head>
                <title>Transcript of Records</title>
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <style>
                    body { font-family: 'Poppins', sans-serif; margin: 20px; }
                    .transcript-container { max-width: 900px; margin: 0 auto; }
                    .school-header { text-align: center; margin-bottom: 20px; }
                    .school-header h1 { color: #800000; margin: 0; font-size: 24px; }
                    .transcript-title h2 { color: #800000; margin: 10px 0; }
                    .student-info-section { margin: 20px 0; }
                    .info-row { display: flex; gap: 20px; margin-bottom: 10px; }
                    .info-item { flex: 1; }
                    .info-label { font-weight: 600; color: #800000; }
                    .transcript-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .transcript-table th, .transcript-table td { border: 1px solid #333; padding: 8px; text-align: center; }
                    .transcript-table th { background: #800000; color: white; }
                    .subject-name { text-align: left; font-weight: 500; }
                    .final-grade-cell { font-weight: 700; background: #f5f5f5; }
                    .signature-section { display: flex; justify-content: space-around; margin: 40px 0; }
                    .signature-line { border-bottom: 1px solid #333; margin-bottom: 5px; width: 200px; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    // Batch generate
    window.showBatchGenerate = function() {
        document.getElementById('batchModal').classList.add('active');
        document.getElementById('batchSummary').style.display = 'none';
    };

    window.closeBatchModal = function() {
        document.getElementById('batchModal').classList.remove('active');
    };

    window.generateBatch = function() {
        const grade = document.getElementById('batchGradeSelect').value;
        const completeOnly = document.getElementById('completeOnlyCheck').checked;

        if (!grade) {
            alert('Please select a grade level.');
            return;
        }

        const students = JSON.parse(localStorage.getItem('absas_students') || '[]');
        let eligibleStudents = students.filter(s => s.grade === grade);

        if (completeOnly) {
            eligibleStudents = eligibleStudents.filter(s => hasCompleteGrades(s.id, s.grade));
        }

        if (eligibleStudents.length === 0) {
            alert('No eligible students found for batch generation.');
            return;
        }

        if (!confirm(`Generate transcripts for ${eligibleStudents.length} student(s) in Grade ${grade} - ${SECTIONS[grade]}?`)) {
            return;
        }

        let successCount = 0;
        eligibleStudents.forEach(student => {
            if (hasCompleteGrades(student.id, student.grade)) {
                const transcripts = JSON.parse(localStorage.getItem('absas_transcripts') || '[]');
                const genAvg = calculateGeneralAverage(student.id);
                
                const transcriptRecord = {
                    studentId: student.id,
                    studentName: `${student.firstName} ${student.lastName}`,
                    grade: student.grade,
                    generalAverage: genAvg,
                    generatedDate: new Date().toISOString().split('T')[0],
                    generatedBy: currentUser.fullName
                };

                const existingIndex = transcripts.findIndex(t => t.studentId === student.id);
                if (existingIndex !== -1) {
                    transcripts[existingIndex] = transcriptRecord;
                } else {
                    transcripts.push(transcriptRecord);
                }

                localStorage.setItem('absas_transcripts', JSON.stringify(transcripts));
                successCount++;
            }
        });

        closeBatchModal();
        alert(`Successfully generated ${successCount} transcript(s) for Grade ${grade} - ${SECTIONS[grade]}.`);
        updateStatistics();
        searchStudents();
    };

    // Initialize
    initializeTranscriptRecords();
    updateStatistics();
    searchStudents();
});