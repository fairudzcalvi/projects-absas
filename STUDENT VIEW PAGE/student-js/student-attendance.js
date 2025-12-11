(function () {
  // Helpers
  function dmy(date) {
    return date.toISOString().slice(0, 10);
  }
  function formatDateISO(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  function monthLabel(date) {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  function isWeekday(dt) {
    const d = dt.getDay();
    return d !== 0 && d !== 6; // Mon-Fri
  }

  // Generate last up to 9 months (including current). Returns array of Date objects set to first day.
  function getLastNMonths(n) {
    const months = [];
    const now = new Date();
    // start from current month
    for (let i = 0; i < n; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }
    return months;
  }

  function generateAttendance(monthDates) {
    const attendance = {}; // map dateISO -> {date, status, remarks}
    monthDates.forEach(firstOfMonth => {
      const year = firstOfMonth.getFullYear();
      const month = firstOfMonth.getMonth();
      // iterate all days of month
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(year, month, d);
        if (!isWeekday(dt)) continue; // only school days
        const iso = dmy(dt);

        // deterministic-ish pattern: base on day number + month index
        const seed = (d + month + year) % 13;
        let status = "Present";
        let remarks = "";
        if (seed === 0 || seed === 1) { status = "Absent"; remarks = "Unexcused"; }
        else if (seed === 2) { status = "Late"; remarks = "Late - traffic"; }
        else if (seed === 3) { status = "Late"; remarks = "Late - late log"; }
        else { status = "Present"; }

        // make absences rarer at the end of month (feel realistic)
        if (d > daysInMonth - 3 && status !== "Present" && (d + month) % 2 === 0) {
          status = "Present"; remarks = "";
        }

        attendance[iso] = { date: iso, status, remarks };
      }
    });
    return attendance;
  }

  // Render summary cards
  // Render month selector (most recent months first)
  function populateMonthSelect(months) {
    const sel = document.getElementById('monthSelect');
    sel.innerHTML = '';
    months.forEach((m, idx) => {
      const opt = document.createElement('option');
      opt.value = idx; // index into months array
      opt.textContent = monthLabel(m);
      sel.appendChild(opt);
    });
  }

  // Render calendar for selected month
  function renderCalendarForMonth(monthFirstDate, attMap) {
    const year = monthFirstDate.getFullYear();
    const month = monthFirstDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // build calendar header (day names)
    let html = '<div class="calendar-grid">';
    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dayNames.forEach(dn => { html += `<div class="day-name">${dn}</div>`; });
    // calculate starting blanks
    const startDow = new Date(year, month, 1).getDay();
    for (let i=0;i<startDow;i++) html += `<div class="day-cell" style="background:#fafafa;border:0"></div>`;

    // iterate days
    for (let d=1; d<=daysInMonth; d++) {
      const dt = new Date(year, month, d);
      const iso = dmy(dt);
      let cellCls = 'day-cell';
      let content = `<div class="day-number">${d}</div>`;
      let statusBadge = '';

      if (!isWeekday(dt)) {
        content += `<div style="margin-top:6px; font-size:12px; color:#999">Weekend</div>`;
      } else {
        const rec = attMap[iso];
        if (rec) {
          if (rec.status === 'Present') statusBadge = `<div class="status-badge present">P</div>`;
          else if (rec.status === 'Absent') statusBadge = `<div class="status-badge absent">A</div>`;
          else if (rec.status === 'Late') statusBadge = `<div class="status-badge late">L</div>`;
        } else {
          // default no-record (assume present)
          statusBadge = `<div class="status-badge present">P</div>`;
        }
      }

      html += `<div class="${cellCls}">${content}${statusBadge}</div>`;
    }

    html += '</div>';
    document.getElementById('calendarArea').innerHTML = html;
  }

  // Render month table (list each school day + status + remarks)
  function renderTableForMonth(monthFirstDate, attMap) {
    const year = monthFirstDate.getFullYear();
    const month = monthFirstDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const tbody = document.querySelector('#monthTable tbody');
    tbody.innerHTML = '';

    for (let d=1; d<=daysInMonth; d++) {
      const dt = new Date(year, month, d);
      if (!isWeekday(dt)) continue;
      const iso = dmy(dt);
      const rec = attMap[iso] || {status:'Present', remarks:''};
      const tr = document.createElement('tr');
      const dateCell = document.createElement('td');
      dateCell.textContent = formatDateISO(iso);
      const statusCell = document.createElement('td');
      statusCell.textContent = rec.status;
      const remarksCell = document.createElement('td');
      remarksCell.textContent = rec.remarks || '-';
      tr.appendChild(dateCell); tr.appendChild(statusCell); tr.appendChild(remarksCell);
      tbody.appendChild(tr);
    }
    // show simple monthly totals in selectedTotals
    const monthKey = `${monthFirstDate.getFullYear()}-${monthFirstDate.getMonth()}`;
    const arr = Object.values(attMap).filter(r => {
      const d = new Date(r.date);
      return d.getFullYear() === monthFirstDate.getFullYear() && d.getMonth() === monthFirstDate.getMonth();
    });
    const totals = {Present:0,Absent:0,Late:0};
    arr.forEach(r=> totals[r.status] = (totals[r.status]||0)+1);
    document.getElementById('selectedTotals').textContent = `P:${totals.Present} • A:${totals.Absent} • L:${totals.Late}`;
  }

  // initialize page
  function init() {
    // compute months (limit to 9)
    const months = getLastNMonths(9); // returns [current, -1, -2 ...]
    // reverse so newest first in UI? We'll keep newest first (index 0 is current)
    // but monthSelect will display in order with 0 -> current
    populateMonthSelect(months);

    // generate attendance for those months (read-only sample)
    const attMap = generateAttendance(months);

    // show summary totals across all months
    renderSummary(attMap);

    // set up month selector change
    const sel = document.getElementById('monthSelect');
    sel.addEventListener('change', () => {
      const idx = parseInt(sel.value, 10);
      const firstOfMonth = months[idx];
      renderCalendarForMonth(firstOfMonth, attMap);
      renderTableForMonth(firstOfMonth, attMap);
    });

    // set default selected month -> index 0 (current)
    sel.value = 0;
    const firstOfMonth = months[0];
    renderCalendarForMonth(firstOfMonth, attMap);
    renderTableForMonth(firstOfMonth, attMap);

    // populate student info from shared student.js current user if available
    try {
      const cur = JSON.parse(localStorage.getItem('absas_current_user') || 'null');
      if (cur && cur.fullName) {
        const sidebarName = document.querySelectorAll('.user-name');
        sidebarName.forEach(n => n.textContent = cur.fullName);
      }
    } catch (e) {}
  }

  // run
  document.addEventListener('DOMContentLoaded', init);
})();
