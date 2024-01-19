document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('passwordForm');
    const nameInput = document.getElementById('passName');
    const passwordInput = document.getElementById('mainPass');
    const editIndexInput = document.getElementById('editIndex');
    const passList = document.getElementById('passList');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    let passwords = [];

    // Function to render passwords
   // Function to render passwords
// Function to render passwords
function renderPasswords(searchTerm = '') {
    axios.get('https://crudcrud.com/api/7ff5d12fac8e439196cc606d256eb1df/AppData')
        .then(response => {
            passwords = response.data;

            // Filter passwords based on the search term
            const filteredPasswords = passwords.filter(pass =>
                pass.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            passList.innerHTML = '';

            const totalCount = filteredPasswords.length;

            // Display total count
            const totalCountElement = document.createElement('p');
            totalCountElement.textContent = `Total Passwords: ${totalCount}`;
            passList.appendChild(totalCountElement);

            filteredPasswords.forEach(function (pass, index) {
                const listItem = document.createElement('li');
                listItem.textContent = `${pass.name} - ${pass.password} `;

                const editButton = createButton('Edit', index, editPassword);
                const deleteButton = createButton('Delete', index, deletePassword);

                listItem.appendChild(editButton);
                listItem.appendChild(deleteButton);

                passList.appendChild(listItem);
            });
        })
        .catch(err => {
            console.error('Error fetching data from the server:', err);
        });
}



    // Function to create action buttons (Edit, Delete)
    function createButton(label, index, clickHandler) {
        const button = document.createElement('button');
        button.textContent = label;
        button.classList.add('action-buttons');
        button.addEventListener('click', function () {
            clickHandler(index);
        });
        return button;
    }

    // Event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = nameInput.value;
        const password = passwordInput.value;

        const editIndex = parseInt(editIndexInput.value);

        if (editIndex !== -1) {
            // Editing an existing password
            axios.put(`https://crudcrud.com/api/7ff5d12fac8e439196cc606d256eb1df/AppData/${passwords[editIndex]._id}`, {
                name,
                password
            })
                .then(res => {
                    console.log('Password updated on the server:', res.data);
                    renderPasswords();
                })
                .catch(err => {
                    console.error('Error updating password on the server:', err);
                });

            editIndexInput.value = -1;
        } else {
            // Add new password
            axios.post('https://crudcrud.com/api/7ff5d12fac8e439196cc606d256eb1df/AppData', {
                name,
                password
            })
                .then(res => {
                    console.log('Password added to the server:', res.data);
                    renderPasswords();
                })
                .catch(err => {
                    console.error('Error adding password to the server:', err);
                });
        }

        // Clear form inputs
        nameInput.value = '';
        passwordInput.value = '';
    });

    // Function to handle editing a password
    function editPassword(index) {
        // Set the index for editing
        editIndexInput.value = index;

        // Populate the form with the password details for editing
        nameInput.value = passwords[index].name;
        passwordInput.value = passwords[index].password;
    }

    // Function to handle deleting a password
    function deletePassword(index) {
        const confirmDelete = confirm('Are you sure you want to delete this password?');

        if (confirmDelete) {
            // Get the _id of the password to be deleted
            const passwordId = passwords[index]._id;

            // Perform DELETE operation on the server
            axios.delete(`https://crudcrud.com/api/7ff5d12fac8e439196cc606d256eb1df/AppData/${passwordId}`)
                .then(res => {
                    console.log('Password deleted from the server:', res.data);

                    // Remove the password from the local array
                    passwords.splice(index, 1);

                    // Render passwords
                    renderPasswords();
                })
                .catch(err => {
                    console.error('Error deleting password from the server:', err);
                });
        }
    }

    // Event listener for search button click
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        renderPasswords(searchTerm);
    });

    // Initial render
    renderPasswords();
});
