window.openFacultyModal = function(facultyData = null) {
        const modal = document.getElementById('facultyModal');
        const form = document.getElementById('facultyForm');
        const title = document.getElementById('facultyModalTitle');
        
        modal.classList.add('active');
    };

    window.closeFacultyModal = function() {
        document.getElementById('facultyModal').classList.remove('active');
    };