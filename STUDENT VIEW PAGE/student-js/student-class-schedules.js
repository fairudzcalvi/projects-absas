document.addEventListener("DOMContentLoaded", () => {
    loadStudentSchedule();
});

function loadStudentSchedule() {

    const schedule = [
        {
            time: "FLAG CEREMONY 7:30 AM – 8:15 AM",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "8:15 AM – 9:00 AM",
            monday: "Math |Rm 3",
            tuesday: "Physical Education|Rm 4",
            wednesday: "Science | Rm 5",
            thursday: "English | Rm 6",
            friday: "MAPEH | Rm 7",
            Saturday: "No Class",
            Sunday: "No Class"
        },
         {
            time: "9:00 AM – 10:00 AM",
            monday: "Filipino |Rm 3",
            tuesday: "Filipino|Rm 4",
            wednesday: "Filipino | Rm 5",
            thursday: "Filipino | Rm 6",
            friday: "Filipino| Rm 7",
            Saturday: "No Class",
            Sunday: "No Class"
        },
         {
            time: "RECESS 10:00 AM – 10:30 AM",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "10:30 AM – 12:00 PM",
            monday: "Computer|Rm 6",
            tuesday: "",
            wednesday: "Science|Rm 3",
            thursday: "",
            friday: "Computer|Rm 5",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "LUNCH BREAK 12:00 PM – 1:00 PM",
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "1:00 PM – 2:00 PM",
            monday: "English|Rm 5",
            tuesday: "English|Rm 5",
            wednesday: "",
            thursday: "English|Rm 10",
            friday: "",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "2:00 PM – 3:00 PM",
            monday: "",
            tuesday: "Filipino|Rm 4",
            wednesday: "Filipino|Rm 8",
            thursday: "Filipino|Rm 7",
            friday: "",
            Saturday: "No Class",
            Sunday: "No Class"
        },
        {
            time: "3:00 PM– 4:00 PM",
            monday: "MAPEH|Rm 3",
            tuesday: "",
            wednesday: "MAPEH|Rm 9",
            thursday: "",
            friday: "MAPEH|Rm 11",
            Saturday: "No Class",
            Sunday: "No Class"
        }
    ];

    const tbody = document.getElementById("scheduleBody");

    schedule.forEach(row => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.time}</td>
            <td>${formatSubject(row.monday)}</td>
            <td>${formatSubject(row.tuesday)}</td>
            <td>${formatSubject(row.wednesday)}</td>
            <td>${formatSubject(row.thursday)}</td>
            <td>${formatSubject(row.friday)}</td>
            <td>${formatSubject(row.Saturday)}</td>
            <td>${formatSubject(row.Sunday)}</td>
        `;

        tbody.appendChild(tr);
    });
}

function formatSubject(value) {
    if (!value) return "";
    const [subject, room] = value.split("|");

    return `
        <div class="subject-box">
            <div class="subject-title">${subject}</div>
            <div class="subject-room">Room: ${room}</div>
        </div>
    `;
}
