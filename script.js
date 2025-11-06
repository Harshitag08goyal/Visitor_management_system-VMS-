document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const confirmationSection = document.getElementById('confirmation-section');
    const confirmationMessage = document.getElementById('confirmation-message');
    const timeSlotsContainer = document.getElementById('time-slots');

    const CAPACITY_PER_SLOT = 50;

    // Function to load bookings from localStorage
    function loadBookings() {
        return JSON.parse(localStorage.getItem('allBookings')) || [];
    }

    // Function to save bookings to localStorage
    function saveBookings(bookings) {
        localStorage.setItem('allBookings', JSON.stringify(bookings));
    }

    // Function to update the time slot data from bookings
    function updateTimeSlotData() {
        const allBookings = loadBookings();
        const timeSlots = [
            { time: '9:00 AM - 10:00 AM', booked: 0 },
            { time: '10:30 AM - 11:30 AM', booked: 0 },
            { time: '12:00 PM - 1:00 PM', booked: 0 },
            { time: '2:00 PM - 3:00 PM', booked: 0 }
        ];

        allBookings.forEach(booking => {
            const slot = timeSlots.find(s => s.time === booking.preferredTime);
            if (slot) {
                slot.booked += booking.numStudents;
            }
        });
        return timeSlots;
    }

    // Function to render the availability of all time slots
    function renderAvailability() {
        const timeSlots = updateTimeSlotData();
        timeSlotsContainer.innerHTML = '';
        timeSlots.forEach(slot => {
            const availability = CAPACITY_PER_SLOT - slot.booked;
            const item = document.createElement('div');
            item.className = 'time-slot-item';
            item.innerHTML = `
                <strong>${slot.time}</strong>:
                ${availability} students available
                ${availability <= 0 ? '<span style="color: red;">(Fully Booked)</span>' : ''}
            `;
            timeSlotsContainer.appendChild(item);
        });
    }

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const schoolName = document.getElementById('school-name').value;
        const contactPerson = document.getElementById('contact-person').value;
        const numStudents = parseInt(document.getElementById('num-students').value);
        const preferredTime = document.getElementById('preferred-time').value;

        const timeSlots = updateTimeSlotData();
        const selectedSlot = timeSlots.find(slot => slot.time === preferredTime);

        if (selectedSlot) {
            // Check for capacity
            if (selectedSlot.booked + numStudents > CAPACITY_PER_SLOT) {
                alert('This time slot does not have enough capacity for your group.');
                return;
            }

            // Create a new booking object
            const newBooking = {
                schoolName,
                contactPerson,
                numStudents,
                preferredTime
            };

            // Add new booking to local storage
            const allBookings = loadBookings();
            allBookings.push(newBooking);
            saveBookings(allBookings);

            // Display confirmation message
            confirmationMessage.textContent =
                `Thank you, ${schoolName}! Your booking for ${numStudents} students on the ${preferredTime} slot has been confirmed.`;
            confirmationSection.classList.remove('hidden');
            form.reset(); // Clear the form

            // Hide confirmation message after a few seconds
            setTimeout(() => {
                confirmationSection.classList.add('hidden');
            }, 8000);

            // Re-render display
            renderAvailability();
        }
    });

    // Initial render of availability
    renderAvailability();
});