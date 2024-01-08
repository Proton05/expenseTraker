document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expenseForm');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseCatInput = document.getElementById('expenseCat')
    const editIndexInput = document.getElementById('editIndex');
    const expenseList = document.getElementById('expenseList');
    let expenses;

    // Function to render expenses
    function renderExpenses() {
        axios.get('https://crudcrud.com/api/53abb3d2022a403c91c298c8415f54da/AppData')
            .then(response => {
                 expenses = response.data;

                expenseList.innerHTML = '';
                expenses.forEach(function (expense, index) {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${expense.name} - $${expense.amount} - ${expense.cat} `;

                    const editButton = createButton('Edit', index, editExpense);
                    const deleteButton = createButton('Delete', index, deleteExpense);

                    listItem.appendChild(editButton);
                    listItem.appendChild(deleteButton);

                    expenseList.appendChild(listItem);
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

        const name = expenseNameInput.value;
        const amount = parseFloat(expenseAmountInput.value);
        const cat = expenseCatInput.value;

        if (!name || isNaN(amount)) {
            alert('Please enter valid expense details.');
            return;
        }

        const editIndex = parseInt(editIndexInput.value);

        if (editIndex !== -1) {
            // Editing an existing expense
            axios.put(`https://crudcrud.com/api/53abb3d2022a403c91c298c8415f54da/AppData/${editIndex}`, {
                name,
                amount,
                cat
            })
                .then(res => {
                    console.log('Expense updated on the server:', res.data);
                    renderExpenses();
                })
                .catch(err => {
                    console.error('Error updating expense on the server:', err);
                });

            editIndexInput.value = -1;
        } else {
            // Add new expense
            axios.post('https://crudcrud.com/api/53abb3d2022a403c91c298c8415f54da/AppData', {
                name,
                amount,
                cat
            })
                .then(res => {
                    console.log('Expense added to the server:', res.data);
                    renderExpenses();
                })
                .catch(err => {
                    console.error('Error adding expense to the server:', err);
                });
        }

        // Clear form inputs
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseCatInput.value = '';
    });

    // Function to handle editing an expense
    function editExpense(index) {
        // Set the index for editing
        editIndexInput.value = index;

        // Populate the form with the expense details for editing
        axios.get(`https://crudcrud.com/api/53abb3d2022a403c91c298c8415f54da/AppData/${index}`)
            .then(response => {
                const expenseToEdit = response.data;
                expenseNameInput.value = expenseToEdit.name;
                expenseAmountInput.value = expenseToEdit.amount;
                expenseCatInput.value = expenseToEdit.cat;
            })
            .catch(err => {
                console.error('Error fetching expense details for editing:', err);
            });
    }

    // Function to handle deleting an expense
    function deleteExpense(index) {
        const confirmDelete = confirm('Are you sure you want to delete this expense?');

        if (confirmDelete) {
            // Get the _id of the expense to be deleted
            const expenseId = expenses[index]._id;

            // Perform DELETE operation on the server
            axios.delete(`https://crudcrud.com/api/53abb3d2022a403c91c298c8415f54da/AppData/${expenseId}`)
                .then(res => {
                    console.log('Expense deleted from the server:', res.data);

                    // Remove the expense from the local array
                    expenses.splice(index, 1);

                    // Render expenses
                    renderExpenses();
                })
                .catch(err => {
                    console.error('Error deleting expense from the server:', err);
                });
        }
    }

    // Initial render
    renderExpenses();
});

