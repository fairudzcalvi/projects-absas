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

    // Section names and advisers mapping
    const GRADE_INFO = {
        '1': { section: 'MATTHEW', adviser: 'Jealy Jane Bernardo' },
        '2': { section: 'MARK', adviser: 'Valerie Jailani' },
        '3': { section: 'LUKE', adviser: 'Jayboy R. Biong' },
        '4': { section: 'JOHN', adviser: 'Marissa G. Tanbelda' },
        '5': { section: 'ACTS', adviser: 'Nikka Gene T. Viesca' },
        '6': { section: 'ROMANS', adviser: 'Mariele Deslate' },
        '7': { section: 'GENESIS', adviser: 'TBA' },
        '8': { section: 'EXODUS', adviser: 'TBA' },
        '9': { section: 'LEVITICUS', adviser: 'TBA' },
        '10': { section: 'NUMBERS', adviser: 'TBA' }
    };

    // Complete schedule data based on the PDF
    const SCHEDULES = {
        '1': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-8:55<br>(40 mins)', mon: 'GMRC/VAL ED. 1<br>Maam Jealy', tue: 'GMRC/VAL ED. 1<br>Maam Jealy', wed: 'GMRC/VAL ED. 1<br>Maam Jealy', thu: 'GMRC/VAL ED. 1<br>Maam Jealy', fri: 'GMRC/VAL ED. 1<br>Maam Jealy' },
                { time: '8:55-9:35<br>(40 mins)', mon: 'MAKABANSA 1<br>Maam Valerie', tue: 'MAKABANSA 1<br>Maam Valerie', wed: 'MAKABANSA 1<br>Maam Valerie', thu: 'MAKABANSA 1<br>Maam Valerie', fri: 'MAKABANSA 1<br>Maam Valerie' },
                { time: '9:35-9:55<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '9:55-10:35<br>(40 mins)', mon: 'LANGUAGE 1<br>Maam Jealy', tue: 'LANGUAGE 1<br>Maam Jealy', wed: 'LANGUAGE 1<br>Maam Jealy', thu: 'LANGUAGE 1<br>Maam Jealy', fri: 'LANGUAGE 1<br>Maam Jealy' },
                { time: '10:35-11:15<br>(40 mins)', mon: 'READING LITERACY 1<br>Maam Jealy', tue: 'READING LITERACY 1<br>Maam Jealy', wed: 'READING LITERACY 1<br>Maam Jealy', thu: 'READING LITERACY 1<br>Maam Jealy', fri: 'READING LITERACY 1<br>Maam Jealy' },
                { time: '11:15-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:40 PM<br>(40 mins)', mon: 'MATH 1<br>Sir Jayboy', tue: 'MATH 1<br>Sir Jayboy', wed: 'MATH 1<br>Sir Jayboy', thu: 'MATH 1<br>Sir Jayboy', fri: 'MATH 1<br>Sir Jayboy' },
                { time: '1:40-2:10<br>(30 mins)', mon: 'COMPUTER 1 (Lec)<br>Maam Jealy', tue: 'COMPUTER 1 (Lec)<br>Maam Jealy', wed: 'COMPUTER 1<br>Maam Jealy', thu: 'COMPUTER 1<br>Maam Jealy', fri: 'Homeroom Guidance Program (HGP)', special: true },
                { time: '2:10-2:40<br>(30 mins)', mon: 'National Reading Program (NRP)', tue: 'National Math Program (NMP)', wed: 'National Reading Program (NRP)', thu: 'National Math Program (NMP)', fri: '', special: true },
                { time: '2:40 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        },
        '2': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-8:55<br>(40 mins)', mon: 'GMRC/VAL ED. 2<br>Ms. Valerie', tue: 'GMRC/VAL ED. 2<br>Ms. Valerie', wed: 'GMRC/VAL ED. 2<br>Ms. Valerie', thu: 'GMRC/VAL ED. 2<br>Ms. Valerie', fri: 'GMRC/VAL ED. 2<br>Ms. Valerie' },
                { time: '8:55-9:35<br>(40 mins)', mon: 'ENGLISH 2<br>Maam Jealy', tue: 'ENGLISH 2<br>Maam Jealy', wed: 'ENGLISH 2<br>Maam Jealy', thu: 'ENGLISH 2<br>Maam Jealy', fri: 'ENGLISH 2<br>Maam Jealy' },
                { time: '9:35-9:55<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '9:55-10:35<br>(40 mins)', mon: 'MATH 2<br>Sir Jayboy', tue: 'MATH 2<br>Sir Jayboy', wed: 'MATH 2<br>Sir Jayboy', thu: 'MATH 2<br>Sir Jayboy', fri: 'MATH 2<br>Sir Jayboy' },
                { time: '10:35-11:15<br>(40 mins)', mon: 'MAKABANSA 2<br>Ms. Valerie', tue: 'MAKABANSA 2<br>Ms. Valerie', wed: 'MAKABANSA 2<br>Ms. Valerie', thu: 'MAKABANSA 2<br>Ms. Valerie', fri: 'MAKABANSA 2<br>Ms. Valerie' },
                { time: '11:15-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:40 PM<br>(40 mins)', mon: 'FILIPINO 2<br>Ms. Valerie', tue: 'FILIPINO 2<br>Ms. Valerie', wed: 'FILIPINO 2<br>Ms. Valerie', thu: 'FILIPINO 2<br>Ms. Valerie', fri: 'FILIPINO 2<br>Ms. Valerie' },
                { time: '1:40-2:10<br>(30 mins)', mon: 'COMPUTER 2<br>Ms. Valerie', tue: 'COMPUTER 2<br>Ms. Valerie', wed: 'COMPUTER 2<br>Ms. Valerie', thu: 'COMPUTER 2<br>Ms. Valerie', fri: 'Homeroom Guidance Program (HGP)', special: true },
                { time: '2:10-2:40<br>(30 mins)', mon: 'National Math Program (NMP)<br>Ms. Valerie', tue: 'National Reading Program (NRP)<br>Ms. Valerie', wed: 'National Math Program (NMP)<br>Ms. Valerie', thu: 'National Reading Program (NRP)<br>Ms. Valerie', fri: '', special: true },
                { time: '2:40 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        },
        '3': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-9:00<br>(45 mins)', mon: 'GMRC/VAL ED. 3<br>Sir Jayboy', tue: 'GMRC/VAL ED. 3<br>Sir Jayboy', wed: 'GMRC/VAL ED. 3<br>Sir Jayboy', thu: 'GMRC/VAL ED. 3<br>Sir Jayboy', fri: 'GMRC/VAL ED. 3<br>Sir Jayboy' },
                { time: '9:00-9:45<br>(45 mins)', mon: 'ENGLISH 3<br>Sir Jayboy', tue: 'ENGLISH 3<br>Sir Jayboy', wed: 'ENGLISH 3<br>Sir Jayboy', thu: 'ENGLISH 3<br>Sir Jayboy', fri: 'ENGLISH 3<br>Sir Jayboy' },
                { time: '9:45-10:05<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '10:05-10:50<br>(45 mins)', mon: 'FILIPINO 3<br>Maam Valerie', tue: 'FILIPINO 3<br>Maam Valerie', wed: 'FILIPINO 3<br>Maam Valerie', thu: 'FILIPINO 3<br>Maam Valerie', fri: 'FILIPINO 3<br>Maam Valerie' },
                { time: '10:50-11:35<br>(45 mins)', mon: 'MAKABANSA 3<br>Sir Jayboy', tue: 'MAKABANSA 3<br>Sir Jayboy', wed: 'MAKABANSA 3<br>Sir Jayboy', thu: 'MAKABANSA 3<br>Sir Jayboy', fri: 'MAKABANSA 3<br>Sir Jayboy' },
                { time: '11:35-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:45 PM<br>(45 mins)', mon: 'SCIENCE 3<br>Maam Jealy', tue: 'SCIENCE 3<br>Maam Jealy', wed: 'SCIENCE 3<br>Maam Jealy', thu: 'SCIENCE 3<br>Maam Jealy', fri: 'SCIENCE 3<br>Maam Jealy' },
                { time: '1:45-2:30<br>(45 mins)', mon: 'MATH 3<br>Sir Jayboy', tue: 'MATH 3<br>Sir Jayboy', wed: 'MATH 3<br>Sir Jayboy', thu: 'MATH 3<br>Sir Jayboy', fri: 'MATH 3<br>Sir Jayboy' },
                { time: '2:30-3:00<br>(30 mins)', mon: 'COMPUTER 3<br>Sir Jayboy', tue: 'COMPUTER 3<br>Sir Jayboy', wed: 'COMPUTER 3<br>Sir Jayboy', thu: 'COMPUTER 3<br>Sir Jayboy', fri: 'Homeroom Guidance Program (HGP)', special: true },
                { time: '3:00-3:30<br>(30 mins)', mon: 'National Reading Program (NRP)', tue: 'National Math Program (NMP)', wed: 'National Reading Program (NRP)', thu: 'National Math Program (NMP)', fri: '', special: true },
                { time: '3:30 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        },
        '4': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-9:00<br>(45 mins)', mon: 'MATH 4<br>Sir Adzman', tue: 'MATH 4<br>Sir Adzman', wed: 'MATH 4<br>Sir Adzman', thu: 'MATH 4<br>Sir Adzman', fri: 'MATH 4<br>Sir Adzman' },
                { time: '9:00-9:45<br>(45 mins)', mon: 'MAPEH 4<br>Ms. Nikka', tue: 'MAPEH 4<br>Ms. Nikka', wed: 'MAPEH 4<br>Ms. Nikka', thu: 'MAPEH 4<br>Ms. Nikka', fri: 'MAPEH 4<br>Ms. Nikka' },
                { time: '9:45-10:05<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '10:05-10:50<br>(45 mins)', mon: 'SCIENCE 4<br>Mrs. Marissa', tue: 'SCIENCE 4<br>Mrs. Marissa', wed: 'SCIENCE 4<br>Mrs. Marissa', thu: 'SCIENCE 4<br>Mrs. Marissa', fri: 'SCIENCE 4<br>Mrs. Marissa' },
                { time: '10:50-11:35<br>(45 mins)', mon: 'FILIPINO 4<br>Mrs. Marissa', tue: 'FILIPINO 4<br>Mrs. Marissa', wed: 'FILIPINO 4<br>Mrs. Marissa', thu: 'FILIPINO 4<br>Mrs. Marissa', fri: 'FILIPINO 4<br>Mrs. Marissa' },
                { time: '11:35-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:45 PM<br>(45 mins)', mon: 'ENGLISH 4<br>Sir Justine', tue: 'ENGLISH 4<br>Sir Justine', wed: 'ENGLISH 4<br>Sir Justine', thu: 'ENGLISH 4<br>Sir Justine', fri: 'ENGLISH 4<br>Sir Justine' },
                { time: '1:45-2:30<br>(45 mins)', mon: 'ARPAN 4<br>Ms. Mariele', tue: 'ARPAN 4<br>Ms. Mariele', wed: 'ARPAN 4<br>Ms. Mariele', thu: 'ARPAN 4<br>Ms. Mariele', fri: 'ARPAN 4<br>Ms. Mariele' },
                { time: '2:30-3:15<br>(45 mins)', mon: 'COMPUTER 4<br>Ms. Abigael', tue: 'COMPUTER 4<br>Ms. Abigael', wed: 'EPP/TLE 4<br>Mrs. Marissa', thu: 'EPP/TLE 4<br>Mrs. Marissa', fri: 'EPP/TLE 4<br>Mrs. Marissa' },
                { time: '3:15-4:00<br>(45 mins)', mon: 'GMRC/ESP 4<br>Mrs. Marissa', tue: 'National Math Program (NMP)', wed: 'GMRC/ESP 4<br>Mrs. Marissa', thu: 'National Math Program (NMP)', fri: 'GMRC/ESP 4<br>Mrs. Marissa', special: true },
                { time: '4:00 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        },
        '5': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-9:00<br>(45 mins)', mon: 'ENGLISH 5<br>Sir Justine', tue: 'ENGLISH 5<br>Sir Justine', wed: 'ENGLISH 5<br>Sir Justine', thu: 'ENGLISH 5<br>Sir Justine', fri: 'ENGLISH 5<br>Sir Justine' },
                { time: '9:00-9:45<br>(45 mins)', mon: 'FILIPINO 5<br>Ms. Melea', tue: 'FILIPINO 5<br>Ms. Melea', wed: 'FILIPINO 5<br>Ms. Melea', thu: 'FILIPINO 5<br>Ms. Melea', fri: 'FILIPINO 5<br>Ms. Melea' },
                { time: '9:45-10:05<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '10:05-10:50<br>(45 mins)', mon: 'ARPAN 5<br>Ms. Mariele', tue: 'ARPAN 5<br>Ms. Mariele', wed: 'ARPAN 5<br>Ms. Mariele', thu: 'ARPAN 5<br>Ms. Mariele', fri: 'ARPAN 5<br>Ms. Mariele' },
                { time: '10:50-11:35<br>(45 mins)', mon: 'GMRC/ESP 5<br>Ms. Nikka Gene', tue: 'GMRC/ESP 5<br>Ms. Nikka Gene', wed: 'GMRC/ESP 5<br>Ms. Nikka Gene', thu: 'GMRC/ESP 5<br>Ms. Nikka Gene', fri: 'GMRC/ESP 5<br>Ms. Nikka Gene' },
                { time: '11:35-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:45 PM<br>(45 mins)', mon: 'SCIENCE 5<br>Ms. Genevie', tue: 'SCIENCE 5<br>Ms. Genevie', wed: 'SCIENCE 5<br>Ms. Genevie', thu: 'SCIENCE 5<br>Ms. Genevie', fri: 'SCIENCE 5<br>Ms. Genevie' },
                { time: '1:45-2:30<br>(45 mins)', mon: 'EPP/TLE 5<br>Ms. Abigael', tue: 'COMPUTER<br>Ms. Abigael', wed: 'EPP/TLE 5<br>Ms. Abigael', thu: 'COMPUTER<br>Ms. Abigael', fri: 'EPP/TLE 5<br>Ms. Abigael' },
                { time: '2:30-3:15<br>(45 mins)', mon: 'MATH 5<br>Sir Adzman', tue: 'MATH 5<br>Sir Adzman', wed: 'MATH 5<br>Sir Adzman', thu: 'MATH 5<br>Sir Adzman', fri: 'MATH 5<br>Sir Adzman' },
                { time: '3:15-4:00<br>(45 mins)', mon: 'MAPEH 5<br>Ms. Nikka', tue: 'MAPEH 5<br>Ms. Nikka', wed: 'MAPEH 5<br>Ms. Nikka', thu: 'MAPEH 5<br>Ms. Nikka', fri: 'MAPEH 5<br>Ms. Nikka' },
                { time: '4:00 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        },
        '6': {
            schedule: [
                { time: '7:30-8:15 AM<br>(45 mins)', mon: 'Flag Ceremony', tue: 'Daily Routine<br>(Adviser)', wed: 'CHAPEL TIME', thu: 'Daily Routine<br>(Adviser)', fri: 'Daily Routine<br>(Adviser)', special: true },
                { time: '8:15-9:00<br>(45 mins)', mon: 'MAPEH 6<br>Ms. Nikka', tue: 'MAPEH 6<br>Ms. Nikka', wed: 'MAPEH 6<br>Ms. Nikka', thu: 'MAPEH 6<br>Ms. Nikka', fri: 'MAPEH 6<br>Ms. Nikka' },
                { time: '9:00-9:45<br>(45 mins)', mon: 'ARPAN 6<br>Ms. Mariele', tue: 'ARPAN 6<br>Ms. Mariele', wed: 'ARPAN 6<br>Ms. Mariele', thu: 'ARPAN 6<br>Ms. Mariele', fri: 'ARPAN 6<br>Ms. Mariele' },
                { time: '9:45-10:05<br>(20 mins)', mon: 'R E C E S S', tue: 'R E C E S S', wed: 'R E C E S S', thu: 'R E C E S S', fri: 'R E C E S S', special: true },
                { time: '10:05-10:50<br>(45 mins)', mon: 'FILIPINO 6<br>Ms. Melea', tue: 'FILIPINO 6<br>Ms. Melea', wed: 'FILIPINO 6<br>Ms. Melea', thu: 'FILIPINO 6<br>Ms. Melea', fri: 'FILIPINO 6<br>Ms. Melea' },
                { time: '10:50-11:35<br>(45 mins)', mon: 'GMRC/ESP 6<br>Ms. Mariele', tue: 'GMRC/ESP 6<br>Ms. Mariele', wed: 'GMRC/ESP 6<br>Ms. Mariele', thu: 'GMRC/ESP 6<br>Ms. Mariele', fri: 'GMRC/ESP 6<br>Ms. Mariele' },
                { time: '11:35-1:00 PM<br>HEALTH', mon: 'BREAK / LUNCH TIME', tue: 'BREAK / LUNCH TIME', wed: 'BREAK / LUNCH TIME', thu: 'BREAK / LUNCH TIME', fri: 'BREAK / LUNCH TIME', special: true },
                { time: '1:00-1:45 PM<br>(45 mins)', mon: 'EPP/TLE 6<br>Ms. Abigael', tue: 'COMPUTER 6<br>Ms. Abigael', wed: 'EPP/TLE 6<br>Ms. Abigael', thu: 'COMPUTER 6<br>Ms. Abigael', fri: 'EPP/TLE 6<br>Ms. Abigael' },
                { time: '1:45-2:30<br>(45 mins)', mon: 'SCIENCE 6<br>Ms. Genevie', tue: 'SCIENCE 6<br>Ms. Genevie', wed: 'SCIENCE 6<br>Ms. Genevie', thu: 'SCIENCE 6<br>Ms. Genevie', fri: 'SCIENCE 6<br>Ms. Genevie' },
                { time: '2:30-3:15<br>(45 mins)', mon: 'ENGLISH 6<br>Sir Justine', tue: 'ENGLISH 6<br>Sir Justine', wed: 'ENGLISH 6<br>Sir Justine', thu: 'ENGLISH 6<br>Sir Justine', fri: 'ENGLISH 6<br>Sir Justine' },
                { time: '3:15-4:00<br>(45 mins)', mon: 'MATH 6<br>Sir Adzman', tue: 'MATH 6<br>Sir Adzman', wed: 'MATH 6<br>Sir Adzman', thu: 'MATH 6<br>Sir Adzman', fri: 'MATH 6<br>Sir Adzman' },
                { time: '4:00 PM', mon: 'CLASS DISMISSAL', tue: 'CLASS DISMISSAL', wed: 'CLASS DISMISSAL', thu: 'CLASS DISMISSAL', fri: 'CLASS DISMISSAL', special: true }
            ]
        }
    };

    // Load schedule for selected grade
    window.loadSchedule = function() {
        const grade = document.getElementById('gradeSelect').value;
        
        if (!grade) {
            document.getElementById('emptyState').style.display = 'block';
            document.getElementById('scheduleCard').style.display = 'none';
            return;
        }

        const scheduleData = SCHEDULES[grade];
        const gradeInfo = GRADE_INFO[grade];

        if (!scheduleData) {
            alert('Schedule not available for this grade level yet.');
            return;
        }

        // Update title
        document.getElementById('scheduleTitle').innerHTML = `<i class="fas fa-calendar-alt"></i> Grade ${grade} - ${gradeInfo.section} Class Schedule`;

        // Build schedule HTML
        let scheduleHTML = `
            <div class="schedule-header">
                <h2>A.B. SIMPSON ALLIANCE SCHOOL INC.</h2>
                <p>C. Atilano Corner Don Alfaro St. Tetuan, Zamboanga City</p>
                <h3>GRADE ${grade} - ${gradeInfo.section} CLASS SCHEDULE</h3>
                <p><strong>S.Y. 2025-2026</strong></p>
            </div>

            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>TIME</th>
                        <th>MONDAY</th>
                        <th>TUESDAY</th>
                        <th>WEDNESDAY</th>
                        <th>THURSDAY</th>
                        <th>FRIDAY</th>
                    </tr>
                </thead>
                <tbody>
        `;

        scheduleData.schedule.forEach(slot => {
            const specialClass = slot.special ? ' class="special-activity"' : ' class="subject-cell"';
            scheduleHTML += `
                <tr>
                    <td class="time-column">${slot.time}</td>
                    <td${specialClass}>${slot.mon}</td>
                    <td${specialClass}>${slot.tue}</td>
                    <td${specialClass}>${slot.wed}</td>
                    <td${specialClass}>${slot.thu}</td>
                    <td${specialClass}>${slot.fri}</td>
                </tr>
            `;
        });

        scheduleHTML += `
                </tbody>
            </table>

            <div class="schedule-footer">
                <div>
                    <strong>ADVISER:</strong> ${gradeInfo.adviser}
                    <div class="signature-line">Class Adviser</div>
                </div>
                <div>
                    <strong>SCHOOL PRINCIPAL:</strong> Mrs. Eloisa Elaine N. Abian
                    <div class="signature-line">School Principal</div>
                </div>
            </div>
        `;

        document.getElementById('printableSchedule').innerHTML = scheduleHTML;
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('scheduleCard').style.display = 'block';

        // Scroll to schedule
        document.getElementById('scheduleCard').scrollIntoView({ behavior: 'smooth' });
    };
});