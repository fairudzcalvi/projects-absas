/* teacher-grades.js
   Upgraded: seeds data if missing, shows many students, allows editing component grades per quarter,
   computes quarter grade and saves to localStorage (absas_grades).
*/

document.addEventListener('DOMContentLoaded', function () {
  const SECTIONS = {
    '1': 'MATTHEW','2': 'MARK','3': 'LUKE','4': 'JOHN','5': 'ACTS',
    '6': 'ROMANS','7': 'GENESIS','8': 'EXODUS','9': 'LEVITICUS','10': 'NUMBERS'
  };

  const SUBJECTS = {
    '1': ['GMRC/VAL ED. 1','MAKABANSA 1','LANGUAGE 1','READING LITERACY 1','MATH 1','COMPUTER 1'],
    '2': ['GMRC/VAL ED. 2','ENGLISH 2','MATH 2','MAKABANSA 2','FILIPINO 2','COMPUTER 2'],
    '3': ['GMRC/VAL ED. 3','ENGLISH 3','FILIPINO 3','MAKABANSA 3','SCIENCE 3','MATH 3','COMPUTER 3'],
    '4': ['MATH 4','MAPEH 4','SCIENCE 4','FILIPINO 4','ENGLISH 4','ARPAN 4','COMPUTER 4','EPP/TLE 4','GMRC/ESP 4'],
    '5': ['ENGLISH 5','FILIPINO 5','ARPAN 5','GMRC/ESP 5','SCIENCE 5','EPP/TLE 5','MATH 5','MAPEH 5','COMPUTER 5'],
    '6': ['MAPEH 6','ARPAN 6','FILIPINO 6','GMRC/ESP 6','EPP/TLE 6','SCIENCE 6','ENGLISH 6','MATH 6','COMPUTER 6'],
    '7': ['Filipino 7','English 7','Mathematics 7','Science 7','Araling Panlipunan 7','MAPEH 7','EPP/TLE 7','Computer 7'],
    '8': ['Filipino 8','English 8','Mathematics 8','Science 8','Araling Panlipunan 8','MAPEH 8','EPP/TLE 8','Computer 8'],
    '9': ['Filipino 9','English 9','Mathematics 9','Science 9','Araling Panlipunan 9','MAPEH 9','EPP/TLE 9','Computer 9'],
    '10':['Filipino 10','English 10','Mathematics 10','Science 10','Araling Panlipunan 10','MAPEH 10','EPP/TLE 10','Computer 10']
  };

  const currentUser = JSON.parse(localStorage.getItem('absas_current_user') || 'null');

  // Storage helpers
  function getStudents(){ try { return JSON.parse(localStorage.getItem('absas_students') || '[]'); } catch(e){ return []; } }
  function saveStudents(arr){ localStorage.setItem('absas_students', JSON.stringify(arr)); }
  function getGrades(){ try { return JSON.parse(localStorage.getItem('absas_grades') || '[]'); } catch(e){ return []; } }
  function saveGrades(arr){ localStorage.setItem('absas_grades', JSON.stringify(arr)); }

  // Quick helper to escape
  function escapeHtml(s){ if (s === null || s === undefined) return ''; return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }
  function escapeJs(s){ return (s||'').replace(/'/g,"\\'"); }

  // Seed sample data if missing (many students)
  function seedSampleData(){
    const students = getStudents();
    const grades = getGrades();
    if (students.length && grades.length) return;

    const firstNames = ['Juan','Maria','Jose','Ana','Luis','Carmen','Miguel','Sofia','Carlos','Elena','Mark','Paul','Rico','Liza','Ramon','Maya','Pedro','Ruth','Tomas','Angela'];
    const lastNames = ['Dela Cruz','Santos','Reyes','Garcia','Cruz','Lopez','Ramos','Torres','Villanueva','Bautista','Morales','Diaz','Ortiz','Cabrera'];

    const newStudents = [];
    const newGrades = [];

    for (let g=1; g<=10; g++){
      for (let s=1; s<=18; s++){ // 18 students per grade for more rows
        const fn = firstNames[Math.floor(Math.random()*firstNames.length)];
        const ln = lastNames[Math.floor(Math.random()*lastNames.length)];
        const sid = `G${String(g).padStart(2,'0')}S${String(s).padStart(3,'0')}`;
        newStudents.push({ id: sid, firstName: fn, lastName: ln, grade: String(g), section: SECTIONS[g] || '' });

        const subjects = SUBJECTS[String(g)] || [];
        subjects.forEach(subj => {
          ['1Q','2Q','3Q','4Q'].forEach(q => {
            // create a record with component grades possibly null
            const present = Math.random() > 0.05;
            const comp1 = present ? Math.round(70 + Math.random()*30) : null;
            const comp2 = present ? Math.round(70 + Math.random()*30) : null;
            const comp3 = present ? Math.round(70 + Math.random()*30) : null;
            const comp4 = present ? Math.round(70 + Math.random()*30) : null;
            // quarterGrade as average of comps when present
            const comps = [comp1,comp2,comp3,comp4].filter(x => typeof x === 'number');
            const quarterGrade = comps.length ? Math.round(comps.reduce((a,b)=>a+b,0)/comps.length) : null;
            newGrades.push({
              studentId: sid,
              grade: String(g),
              subject: subj,
              quarter: q,
              grade1: comp1,
              grade2: comp2,
              grade3: comp3,
              grade4: comp4,
              quarterGrade: quarterGrade,
              gradeCreatedAt: new Date().toISOString()
            });
          });
        });
      }
    }

    if (!students.length) saveStudents(newStudents);
    if (!grades.length) saveGrades(newGrades);
  }

  // UI init
  function initFilters(){
    const gradeSel = document.getElementById('gradeFilter');
    const subjSel = document.getElementById('subjectFilter');
    gradeSel.innerHTML = '<option value="">Select Grade Level</option>';
    for (let g=1; g<=10; g++){
      const opt = document.createElement('option'); opt.value = String(g); opt.textContent = `Grade ${g} - ${SECTIONS[g]||''}`; gradeSel.appendChild(opt);
    }
    gradeSel.addEventListener('change', ()=>{ populateSubjects(); loadGrades(); });
    subjSel.addEventListener('change', ()=>loadGrades());
    document.getElementById('studentSearch').addEventListener('input', debounce(loadGrades, 250));
  }

  function populateSubjects(){
    const grade = document.getElementById('gradeFilter').value;
    const subjSel = document.getElementById('subjectFilter');
    subjSel.innerHTML = '<option value="">All Subjects</option>';
    if (grade && SUBJECTS[grade]) SUBJECTS[grade].forEach(s => { const o=document.createElement('option'); o.value=s; o.textContent=s; subjSel.appendChild(o); });
  }

  // Period control (1Q/2Q/3Q/4Q/FINAL)
  let currentPeriod = '1Q';
  window.selectPeriod = function(period){
    currentPeriod = period;
    document.querySelectorAll('.period-tab').forEach(t=> t.classList.toggle('active', t.dataset.period===period));
    loadGrades();
  };

  // Main loader: draws table
  window.loadGrades = function(){
    const selectedGrade = document.getElementById('gradeFilter').value;
    const selectedSubject = document.getElementById('subjectFilter').value;
    const search = (document.getElementById('studentSearch').value||'').toLowerCase();

    const gradesAll = getGrades();
    const studentsAll = getStudents();

    if (!selectedGrade){
      document.getElementById('emptyState').style.display = 'block';
      document.getElementById('gradesCard').style.display = 'none';
      return;
    }

    let students = studentsAll.filter(s => String(s.grade) === String(selectedGrade));
    if (search) students = students.filter(s => ((s.firstName+' '+s.lastName).toLowerCase().includes(search)) || (String(s.id||'').toLowerCase().includes(search)));
    if (!students.length){
      document.getElementById('emptyState').style.display = 'block';
      document.getElementById('gradesCard').style.display = 'none';
      return;
    }

    const title = currentPeriod === 'FINAL' ? 'Final Grades' : `${currentPeriod} Grades`;
    document.getElementById('gradesTitle').innerHTML = `<i class="fas fa-file-alt"></i> Grade ${selectedGrade} - ${SECTIONS[selectedGrade]||''} - ${title}`;

    const headEl = document.getElementById('gradesTableHead');
    const bodyEl = document.getElementById('gradesTableBody');

    // Header
    let headerHTML = '<tr><th>Student</th>';
    if (currentPeriod === 'FINAL'){
      headerHTML += '<th>1Q</th><th>2Q</th><th>3Q</th><th>4Q</th><th>Final Grade</th><th>Remarks</th>';
    } else {
      const subjectsList = selectedSubject ? [selectedSubject] : (SUBJECTS[selectedGrade] || []);
      subjectsList.forEach(s => headerHTML += `<th>${escapeHtml(s)}</th>`);
      headerHTML += '<th>Average</th><th>Action</th>';
    }
    headerHTML += '</tr>';
    headEl.innerHTML = headerHTML;

    // Rows
    let rows = '';
    students.forEach(student => {
      rows += `<tr>`;
      rows += `<td class="student-info">${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}<div class="student-id">${escapeHtml(student.id)}</div></td>`;

      if (currentPeriod === 'FINAL'){
        const quarters = ['1Q','2Q','3Q','4Q'];
        const quarterAverages = quarters.map(q => {
          const recs = gradesAll.filter(g => g.studentId === student.id && g.quarter === q && String(g.grade) === String(selectedGrade));
          const numbers = recs.map(r => (typeof r.quarterGrade === 'number' ? r.quarterGrade : null)).filter(x=>x!==null);
          if (!numbers.length) return null;
          const sum = numbers.reduce((a,b)=>a+b,0);
          return Math.round(sum / numbers.length);
        });
        quarterAverages.forEach(avg => rows += `<td>${avg===null?'<span class="grade-cell no-grade">N/A</span>':`<span class="grade-cell">${avg}</span>`}</td>`);
        const valid = quarterAverages.filter(v=>v!==null);
        const finalAvg = valid.length ? Math.round(valid.reduce((a,b)=>a+b,0)/valid.length) : 'N/A';
        rows += `<td class="average-cell">${finalAvg}</td>`;
        rows += `<td>${finalAvg==='N/A' ? '-' : getRemarks(finalAvg)}</td>`;
      } else {
        const subjectsList = selectedSubject ? [selectedSubject] : (SUBJECTS[selectedGrade] || []);
        let total = 0, cnt = 0;
        subjectsList.forEach(subj => {
          const rec = gradesAll.find(g => g.studentId === student.id && g.grade === String(selectedGrade) && g.subject === subj && g.quarter === currentPeriod);
          if (rec && typeof rec.quarterGrade === 'number'){
            total += rec.quarterGrade; cnt++;
            rows += `<td onclick="viewGradeDetails('${student.id}','${escapeJs(subj)}','${currentPeriod}')">${formatGradeCell(rec.quarterGrade)}</td>`;
          } else {
            rows += `<td><span class="grade-cell no-grade">N/A</span></td>`;
          }
        });
        const avg = cnt ? Math.round(total/cnt) : 'N/A';
        rows += `<td class="average-cell">${avg}</td>`;
        rows += `<td><button class="btn btn-sm btn-secondary" onclick="viewStudentGrades('${student.id}')"><i class="fas fa-eye"></i></button></td>`;
      }

      rows += `</tr>`;
    });

    bodyEl.innerHTML = rows;
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('gradesCard').style.display = 'block';
  };

  // Utilities
  function formatGradeCell(g){
    if (g === null || g === undefined) return `<span class="grade-cell no-grade">N/A</span>`;
    return `<span class="grade-cell">${g}</span>`;
  }
  function getRemarks(grade){
    if (typeof grade !== 'number') return '';
    if (grade >= 90) return '<span class="status-badge complete">Outstanding</span>';
    if (grade >= 85) return '<span class="status-badge complete">Very Satisfactory</span>';
    if (grade >= 80) return '<span class="status-badge complete">Satisfactory</span>';
    if (grade >= 75) return '<span class="status-badge incomplete">Fairly Satisfactory</span>';
    return '<span class="status-badge pending">Did Not Meet Expectations</span>';
  }

  // Modal: view/edit details for a particular student-subject-quarter
  window.viewGradeDetails = function(studentId, subject, quarter){
    const students = getStudents();
    const grades = getGrades();
    const student = students.find(s => s.id === studentId);
    if (!student) return alert('Student not found');
    const rec = grades.find(g => g.studentId===studentId && g.subject===subject && g.quarter===quarter && g.grade===String(student.grade));
    // If no existing record, create a blank one
    let record = rec;
    if (!record){
      record = { studentId, grade: String(student.grade), subject, quarter, grade1:null, grade2:null, grade3:null, grade4:null, quarterGrade:null, gradeCreatedAt: new Date().toISOString() };
      grades.push(record); saveGrades(grades);
    }

    const body = document.getElementById('gradeModalBody');
    // editable form
    body.innerHTML = `
      <div class="grade-details-grid">
        <div class="grade-section">
          <h4><i class="fas fa-user"></i> Student Info</h4>
          <div class="grade-row"><div class="grade-label">Student ID:</div><div class="grade-value">${escapeHtml(student.id)}</div></div>
          <div class="grade-row"><div class="grade-label">Name:</div><div class="grade-value">${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}</div></div>
          <div class="grade-row"><div class="grade-label">Grade & Section:</div><div class="grade-value">Grade ${escapeHtml(student.grade)} - ${escapeHtml(SECTIONS[student.grade])}</div></div>
        </div>

        <div class="grade-section" style="border-left-color:var(--gold);">
          <h4><i class="fas fa-book"></i> Subject: ${escapeHtml(subject)}</h4>
          <div class="grade-row"><div class="grade-label">Grading Period:</div><div class="grade-value">${escapeHtml(quarter)}</div></div>
        </div>

        <div class="grade-section" style="border-left-color:#28a745;">
          <h4><i class="fas fa-chart-line"></i> Component Grades</h4>
          <div class="grade-row"><div class="grade-label">Written Works:</div><div class="grade-value"><input id="g_grade1" type="number" min="0" max="100" value="${record.grade1 ?? ''}"></div></div>
          <div class="grade-row"><div class="grade-label">Performance Tasks:</div><div class="grade-value"><input id="g_grade2" type="number" min="0" max="100" value="${record.grade2 ?? ''}"></div></div>
          <div class="grade-row"><div class="grade-label">Quarterly Assessment:</div><div class="grade-value"><input id="g_grade3" type="number" min="0" max="100" value="${record.grade3 ?? ''}"></div></div>
          <div class="grade-row"><div class="grade-label">Class Participation:</div><div class="grade-value"><input id="g_grade4" type="number" min="0" max="100" value="${record.grade4 ?? ''}"></div></div>
        </div>

        <div class="grade-section" style="border-left-color:#007bff;">
          <h4><i class="fas fa-star"></i> Quarter Grade</h4>
          <div class="grade-row"><div class="grade-label">Computed Grade:</div><div class="grade-value large" id="computedGrade">${record.quarterGrade ?? 'N/A'}</div></div>
          <div class="grade-row"><div class="grade-label">Remarks:</div><div class="grade-value" id="computedRemarks">${typeof record.quarterGrade === 'number' ? getRemarks(record.quarterGrade) : ''}</div></div>
        </div>
      </div>

      <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:14px;">
        <button class="btn" id="saveGradeBtn">Save</button>
        <button class="btn btn-secondary" id="closeModalBtn">Close</button>
      </div>
    `;

    // live compute when changing inputs
    const inputs = ['g_grade1','g_grade2','g_grade3','g_grade4'].map(id=>document.getElementById(id));
    function computeAndShow(){
      const vals = inputs.map(inp => {
        const v = inp.value.trim();
        if (v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
      }).filter(x => x !== null);
      if (!vals.length){
        document.getElementById('computedGrade').textContent = 'N/A';
        document.getElementById('computedRemarks').innerHTML = '';
        return;
      }
      const sum = vals.reduce((a,b)=>a+b,0);
      const avg = Math.round(sum / vals.length);
      document.getElementById('computedGrade').textContent = avg;
      document.getElementById('computedRemarks').innerHTML = getRemarks(avg);
    }
    inputs.forEach(i => i.addEventListener('input', computeAndShow));
    computeAndShow();

    // Save handler
    document.getElementById('saveGradeBtn').addEventListener('click', function () {
      const g1 = parseNumber(inputs[0].value);
      const g2 = parseNumber(inputs[1].value);
      const g3 = parseNumber(inputs[2].value);
      const g4 = parseNumber(inputs[3].value);
      const comps = [g1,g2,g3,g4].filter(x=>typeof x==='number');
      const qGrade = comps.length ? Math.round(comps.reduce((a,b)=>a+b,0)/comps.length) : null;

      // find record again and update or create
      const all = getGrades();
      const recIndex = all.findIndex(g => g.studentId===studentId && g.subject===subject && g.quarter===quarter && g.grade===String(student.grade));
      const newRec = {
        studentId, grade: String(student.grade), subject, quarter,
        grade1: typeof g1==='number'?g1:null,
        grade2: typeof g2==='number'?g2:null,
        grade3: typeof g3==='number'?g3:null,
        grade4: typeof g4==='number'?g4:null,
        quarterGrade: qGrade,
        gradeCreatedAt: new Date().toISOString()
      };
      if (recIndex === -1) all.push(newRec); else all[recIndex] = Object.assign(all[recIndex], newRec);
      saveGrades(all);

      // close modal & reload table
      closeGradeModal();
      loadGrades();
      // small confirmation
      showToast('Grade saved');
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeGradeModal);

    document.getElementById('gradeModal').classList.add('active');
  };

  window.closeGradeModal = function(){
    const m = document.getElementById('gradeModal'); if (m) m.classList.remove('active');
  };

  // Student-modal to view all subjects for student in currentPeriod (keeps previous behavior)
  window.viewStudentGrades = function(studentId){
    const students = getStudents();
    const grades = getGrades();
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const body = document.getElementById('gradeModalBody');
    const studentGrades = grades.filter(g => g.studentId===studentId && g.quarter===currentPeriod);
    let html = `<div class="grade-section"><h4><i class="fas fa-user"></i> ${escapeHtml(student.firstName)} ${escapeHtml(student.lastName)}</h4>
      <div class="grade-row"><div class="grade-label">Grade & Section:</div><div class="grade-value">Grade ${escapeHtml(student.grade)} - ${escapeHtml(SECTIONS[student.grade])}</div></div>
      <div class="grade-row"><div class="grade-label">Period:</div><div class="grade-value">${escapeHtml(currentPeriod)}</div></div></div>`;

    html += `<table class="data-table" style="margin-top:20px;"><thead><tr><th>Subject</th><th>Grade</th><th>Remarks</th><th>Action</th></tr></thead><tbody>`;
    studentGrades.forEach(g => {
      html += `<tr><td><strong>${escapeHtml(g.subject)}</strong></td><td style="text-align:center">${g.quarterGrade ?? 'N/A'}</td><td style="text-align:center">${getRemarks(g.quarterGrade)}</td><td style="text-align:center"><button class="btn btn-sm" onclick="viewGradeDetails('${studentId}','${escapeJs(g.subject)}','${g.quarter}')"><i class="fas fa-edit"></i> Edit</button></td></tr>`;
    });
    const avg = studentGrades.length ? Math.round(studentGrades.reduce((a,b)=>a+(b.quarterGrade||0),0)/studentGrades.length) : 'N/A';
    html += `<tr style="background:var(--light-gray);font-weight:700;"><td>GENERAL AVERAGE</td><td style="text-align:center">${avg}</td><td style="text-align:center">${typeof avg==='number'?getRemarks(avg):''}</td><td></td></tr>`;
    html += `</tbody></table>`;
    body.innerHTML = html;
    document.getElementById('gradeModal').classList.add('active');
  };

  // small toast
  function showToast(msg){
    let t = document.getElementById('simpleToast');
    if (!t){
      t = document.createElement('div'); t.id='simpleToast';
      t.style.position='fixed'; t.style.bottom='20px'; t.style.right='20px'; t.style.background='rgba(0,0,0,0.75)';
      t.style.color='#fff'; t.style.padding='10px 14px'; t.style.borderRadius='8px'; t.style.zIndex=99999;
      document.body.appendChild(t);
    }
    t.textContent = msg; t.style.opacity = '1';
    setTimeout(()=>{ t.style.opacity='0'; }, 1800);
  }

  // helpers
  function parseNumber(v){
    if (v === null || v === undefined) return null;
    const t = String(v).trim();
    if (t === '') return null;
    const n = Number(t);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
  }
  function debounce(fn, delay){ let t; return function(){ clearTimeout(t); t=setTimeout(()=>fn.apply(this,arguments), delay); }; }

  // quick init
  function init(){
    seedSampleData();
    if (currentUser && document.getElementById('userInfoSidebar')) {
      document.getElementById('userInfoSidebar').innerHTML = `<p class="user-name">${escapeHtml(currentUser.fullName || (currentUser.firstName+' '+currentUser.lastName) || 'Teacher')}</p><p class="user-role">Teacher</p>`;
    }
    // date/time
    function updateDateTime(){ const now=new Date(); const opts={month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true}; document.getElementById('dateTime').textContent = now.toLocaleString('en-US', opts); }
    updateDateTime(); setInterval(updateDateTime,60000);

    initFilters();
    populateSubjects();
    // auto-select first grade for demo
    const gradeSel = document.getElementById('gradeFilter');
    if (gradeSel && gradeSel.options.length>1) { gradeSel.value = gradeSel.options[1].value; populateSubjects(); }
    // default period
    selectPeriod('1Q');
  }

  init();
});
