document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('expenseForm');
    const expenseNameInput = document.getElementById('expenseName');
    const expenseAmountInput = document.getElementById('expenseAmount');
    const expenseCatInput = document.getElementById('expenseCat')
    const editIndexInput = document.getElementById('editIndex');
    const expenseList = document.getElementById('expenseList');

    // Load expenses from local storage
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Function to render expenses
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(function (expense, index) {
            const listItem = document.createElement('li');
            listItem.textContent = `${expense.name}- $${expense.amount}-${expense.cat} `;

            const editButton = createButton('Edit', index, editExpense);
            const deleteButton = createButton('Delete', index, deleteExpense);

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);

            expenseList.appendChild(listItem);
        });
        updateLocalStorage();
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

    // Function to update local storage with current expenses
    function updateLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
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
            expenses[editIndex] = { name, amount, cat };
            editIndexInput.value = -1;
        } else {
            // Add expense to the array
            expenses.push({ name, amount ,cat });
        }

        // Render expenses
        renderExpenses();

        // Clear form inputs
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        expenseCatInput.value = '';
    });

    // Function to handle editing an expense
    function editExpense(index) {
        // Populate the form with the expense details for editing
        const expenseToEdit = expenses[index];
        expenseNameInput.value = expenseToEdit.name;
        expenseAmountInput.value = expenseToEdit.amount;
        expenseCatInput.value = expenseToEdit.cat;

        // Set the index for editing
        editIndexInput.value = index;
    }

    // Function to handle deleting an expense
    function deleteExpense(index) {
        const confirmDelete = confirm('Are you sure you want to delete this expense?');

        if (confirmDelete) {
            // Remove the expense
            expenses.splice(index, 1);

            // Render expenses
            renderExpenses();
        }
    }

    // Initial render of expenses
    renderExpenses();
});