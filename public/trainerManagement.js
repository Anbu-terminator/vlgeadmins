// Trainer Form Submission
document.getElementById('trainerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Trainer added successfully');
        event.target.reset(); // Reset the form after successful submission
    } else {
        const errorData = await response.json(); // Get error message
        alert(`Failed to add trainer: ${errorData.error || 'Unknown error'}`);
    }
});

// Search for trainers by name
async function searchTrainer() {
    const searchTerm = document.querySelector('#searchBar').value;
    const response = await fetch(`/api/trainers?search=${searchTerm}`);
    const trainers = await response.json();
    const searchResults = document.querySelector('#searchResults');

    searchResults.innerHTML = '';
    trainers.forEach(trainer => {
        const trainerInfo = document.createElement('div');
        trainerInfo.classList.add('trainer-info');
        trainerInfo.innerHTML = `
            <strong>Name:</strong> ${trainer.name}<br>
            <strong>Qualification:</strong> ${trainer.qualification}<br>
            <strong>Date of Birth:</strong> ${new Date(trainer.dob).toLocaleDateString()}<br>
            <strong>Date of Joining:</strong> ${new Date(trainer.doj).toLocaleDateString()}<br>
            <strong>Father's Name:</strong> ${trainer.fatherName}<br>
            <strong>Mother's Name:</strong> ${trainer.motherName}<br>
            <strong>Address:</strong> ${trainer.address}<br>
            <strong>Aadhar Number:</strong> ${trainer.aadhar}<br>
            <strong>PAN Number:</strong> ${trainer.pan}<br>
            <strong>Training Course:</strong> ${trainer.trainingCourse}<br>
            <hr>
        `;
        searchResults.appendChild(trainerInfo);
    });
}
