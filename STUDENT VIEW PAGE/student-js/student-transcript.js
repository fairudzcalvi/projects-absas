// student.js — small shared logic for all student pages
document.addEventListener('DOMContentLoaded', function(){
  // show sample user info (replace with real auth data)
  const user = JSON.parse(localStorage.getItem('absas_current_user')) || {
    fullName: 'Juan Dela Cruz',
    email: 'juan.delacruz@absas.edu',
    grade: '10'
  };

  const userName = user.fullName || 'Student';
  document.querySelectorAll('.user-name').forEach(n => n.textContent = userName);
  document.getElementById('studentEmail')?.replaceWith(createTextSpan('studentEmail', user.email || 'student@absas.edu'));
  document.getElementById('studentPwd')?.textContent = '********';

  // date/time
  function updateDateTime(){
    const now = new Date();
    const opts = { month:'long', day:'numeric', year:'numeric', hour:'numeric', minute:'2-digit', hour12:true};
    document.getElementById('dateTime').textContent = now.toLocaleString('en-US', opts);
  }
  updateDateTime();
  setInterval(updateDateTime, 60000);

  // logout button (compatible with your localStorage usage)
  document.getElementById('logoutBtn')?.addEventListener('click', ()=> {
    if(confirm('Logout?')) {
      localStorage.removeItem('absas_current_user');
      window.location.href = 'login.html';
    }
  });

  // tabs (announcements)
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const t = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=> p.style.display = 'none');
      btn.classList.add('active');
      const panel = document.getElementById(t);
      if(panel) panel.style.display = 'block';
    });
  });

  // Grades page helpers
  window.loadStudentGrades = function(){
    // sample subjects + random grades — replace with real data fetch
    const subjects = ['English','Mathematics','Filipino','Science','Araling Panlipunan'];
    const tbody = document.getElementById('gradesBody');
    const subjectSelect = document.getElementById('subjectSelect');
    subjectSelect.innerHTML = '<option value="">All Subjects</option>';
    subjects.forEach(s => subjectSelect.appendChild(new Option(s,s)));

    const rows = subjects.map(s=>{
      const a = randGrade(); const b = randGrade(); const c = randGrade(); const d = randGrade();
      const final = Math.round((a+b+c+d)/4);
      const remarks = final >= 75 ? 'Passed' : 'Failed';
      return `<tr>
        <td class="student-info"><strong>${s}</strong></td>
        <td>${a}</td><td>${b}</td><td>${c}</td><td>${d}</td>
        <td><strong>${final}</strong></td>
        <td>${remarks}</td>
      </tr>`;
    }).join('');
    tbody.innerHTML = rows;

    // update simple stats
    document.getElementById('gpa').textContent = (Math.random()*1.5+2.5).toFixed(2);
    document.getElementById('passed').textContent = 5;
    document.getElementById('inc').textContent = 0;
    document.getElementById('failed').textContent = 0;
  };

  // Schedule page helpers
  window.renderSchedule = function(){
    const body = document.getElementById('scheduleBody');
    const scheduleRows = [
      {time:'7:30 - 8:15', mon:'Flag / Homeroom', tue:'Homeroom', wed:'Chapel', thu:'Homeroom', fri:'Homeroom'},
      {time:'8:15 - 9:00', mon:'Math', tue:'English', wed:'Science', thu:'Math', fri:'MAPEH'},
      {time:'9:00 - 9:40', mon:'Filipino', tue:'Filipino', wed:'Filipino', thu:'Filipino', fri:'Filipino'},
      {time:'9:40 - 10:00', mon:'Recess', tue:'Recess', wed:'Recess', thu:'Recess', fri:'Recess'},
      {time:'10:00 - 11:00', mon:'Computer', tue:'Araling Panlipunan', wed:'English', thu:'Science', fri:'Guidance'}
    ];
    body.innerHTML = scheduleRows.map(r => `<tr>
      <td class="time-col">${r.time}</td>
      <td class="subject-cell">${r.mon}</td>
      <td class="subject-cell">${r.tue}</td>
      <td class="subject-cell">${r.wed}</td>
      <td class="subject-cell">${r.thu}</td>
      <td class="subject-cell">${r.fri}</td>
    </tr>`).join('');
  };

  // utility
  function randGrade(){ return Math.floor(Math.random()*21)+80; }
  function createTextSpan(id, text){
    const el = document.createElement('span');
    el.id = id;
    el.textContent = text;
    return el;
  }

  // If page is grades, prefill selects if grade present
  const gradeSelect = document.getElementById('gradeSelect');
  if(gradeSelect){
    const g = user.grade || '10';
    gradeSelect.innerHTML = `<option value="${g}">Grade ${g} - NUMBERS</option>`;
  }

});
