document.addEventListener('DOMContentLoaded', () => {
    const bookingsList = document.getElementById('bookings-list');
    const noBookingsMessage = document.querySelector('.no-bookings');
    const totalBookingsDisplay = document.getElementById('total-bookings');
    const totalStudentsDisplay = document.getElementById('total-students');
    const timeSlotFilter = document.getElementById('time-slot-filter');
    const downloadBtn = document.getElementById('download-btn');

    // Function to load bookings from localStorage
    function loadBookings() {
        const bookings = JSON.parse(localStorage.getItem('allBookings')) || [];
        return bookings;
    }

    // Function to save bookings to localStorage
    function saveBookings(bookings) {
        localStorage.setItem('allBookings', JSON.stringify(bookings));
    }
    
    // Function to render all bookings and update stats
    function renderBookings() {
        let allBookings = loadBookings();
        const selectedTimeSlot = timeSlotFilter.value;

        // Filter bookings if a specific time slot is selected
        if (selectedTimeSlot !== 'all') {
            allBookings = allBookings.filter(booking => booking.preferredTime === selectedTimeSlot);
        }

        bookingsList.innerHTML = '';
        let totalStudents = 0;

        if (allBookings.length === 0) {
            noBookingsMessage.classList.remove('hidden');
        } else {
            noBookingsMessage.classList.add('hidden');
            allBookings.forEach((booking, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.schoolName}</td>
                    <td>${booking.contactPerson}</td>
                    <td>${booking.numStudents}</td>
                    <td>${booking.preferredTime}</td>
                    <td><button class="delete-btn" data-index="${index}">Delete</button></td>
                `;
                bookingsList.appendChild(row);
                totalStudents += parseInt(booking.numStudents);
            });
        }
        
        // Update statistics
        totalBookingsDisplay.textContent = allBookings.length;
        totalStudentsDisplay.textContent = totalStudents;
    }

    // Handle delete button clicks with confirmation
    bookingsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            if (window.confirm('Are you sure you want to delete this booking?')) {
                const index = e.target.getAttribute('data-index');
                let allBookings = loadBookings();
                allBookings.splice(index, 1);
                saveBookings(allBookings);
                renderBookings();
            }
        }
    });

    // Handle filter change
    timeSlotFilter.addEventListener('change', renderBookings);

    // Handle download button click
    downloadBtn.addEventListener('click', () => {
        const allBookings = loadBookings();
        if (allBookings.length === 0) {
            alert('No bookings to download.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "School Name,Contact Person,Number of Students,Time Slot\n";

        allBookings.forEach(booking => {
            const row = `${booking.schoolName},${booking.contactPerson},${booking.numStudents},"${booking.preferredTime}"\n`;
            csvContent += row;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bookings_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial render
    renderBookings();
});