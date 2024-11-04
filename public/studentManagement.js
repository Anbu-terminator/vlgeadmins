// Student Form Submission
document.getElementById('studentForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Student added successfully');
        event.target.reset(); // Reset the form after successful submission
    } else {
        const errorData = await response.json(); // Get error message
        alert(`Failed to add student: ${errorData.error || 'Unknown error'}`);
    }
});

// Search student functionality
async function searchStudent() {
    const searchTerm = document.querySelector('#searchBar').value.trim();
    if (!searchTerm) {
        alert("Please enter a name or ID to search.");
        return;
    }

    const response = await fetch(`/api/students?search=${encodeURIComponent(searchTerm)}`);
    
    if (response.ok) {
        const students = await response.json();
        displayStudents(students);
    } else {
        alert('Failed to retrieve student data');
    }
}

// Display search results
function displayStudents(students) {
    const searchResults = document.querySelector('#searchResults');
    searchResults.innerHTML = ''; // Clear previous results

    if (students.length === 0) {
        searchResults.innerHTML = '<p>No students found.</p>';
        return;
    }

    students.forEach(student => {
        const studentCard = document.createElement('div');
        studentCard.classList.add('card', 'mb-3');

        studentCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${student.name}</h5>
                <p class="card-text"><strong>Father's Name:</strong> ${student.fatherName}</p>
                <p class="card-text"><strong>Mother's Name:</strong> ${student.motherName}</p>
                <p class="card-text"><strong>Aadhar Number:</strong> ${student.aadhar}</p>
                <p class="card-text"><strong>Email:</strong> ${student.email}</p>
                <p class="card-text"><strong>Phone Number:</strong> ${student.phone}</p>
                <p class="card-text"><strong>PIN Code:</strong> ${student.pin}</p>
                <p class="card-text"><strong>Course:</strong> ${student.course}</p>
                <p class="card-text"><strong>Special Offer/Discount:</strong> ${student.offer || 'None'}</p>
                <p class="card-text"><strong>Duration:</strong> ${student.duration}</p>
                <button class="btn btn-warning" onclick="populateUpdateForm('${student._id}')">Update</button>
            </div>
        `;
        
        searchResults.appendChild(studentCard);
    });
}

// Populate the update form with the selected student's data
function populateUpdateForm(studentId) {
    const studentDetails = document.querySelectorAll('.card-body');
    studentDetails.forEach(async (card) => {
        const name = card.querySelector('.card-title').textContent;
        const aadhar = card.querySelector('p:nth-child(4)').textContent.split(": ")[1];
        const email = card.querySelector('p:nth-child(5)').textContent.split(": ")[1];
        const phone = card.querySelector('p:nth-child(6)').textContent.split(": ")[1];
        const pin = card.querySelector('p:nth-child(7)').textContent.split(": ")[1];
        const course = card.querySelector('p:nth-child(8)').textContent.split(": ")[1];
        const offer = card.querySelector('p:nth-child(9)').textContent.split(": ")[1] || '';
        const duration = card.querySelector('p:nth-child(10)').textContent.split(": ")[1];

        // Populate the update form fields
        document.querySelector('#updateStudentForm input[name="studentId"]').value = studentId;
        document.querySelector('#updateStudentForm input[name="name"]').value = name;
        document.querySelector('#updateStudentForm input[name="aadhar"]').value = aadhar;
        document.querySelector('#updateStudentForm input[name="email"]').value = email;
        document.querySelector('#updateStudentForm input[name="phone"]').value = phone;
        document.querySelector('#updateStudentForm input[name="pin"]').value = pin;
        document.querySelector('#updateStudentForm input[name="course"]').value = course;
        document.querySelector('#updateStudentForm input[name="offer"]').value = offer;
        document.querySelector('#updateStudentForm input[name="duration"]').value = duration;
    });
}

// Update student functionality
document.getElementById('updateStudentForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/students/${data.studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Student updated successfully');
        // Clear the form after successful update
        event.target.reset();
    } else {
        alert('Failed to update student');
    }
});
