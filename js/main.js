// selecting elements from Income dom
const incomeForm = document.querySelector('#incomeForm');
const incomeSource = document.querySelector('#source');
const incomeStatus = document.querySelector('#status');
const incomeAmount = document.querySelector('#amount');
const addIncomeBtn = document.querySelector('#add-income-btn');

// show Error function
function showError(input, message) {
  const inputMessage = input.parentElement;
  inputMessage.className = 'input-message error';
  const small = inputMessage.querySelector('small');
  small.style.visibility = 'visible';
  small.innerText = message;
}

// show Success function
function showSuccess(input) {
  const inputMessage = input.parentElement;
  inputMessage.className = 'input-message success';
  const small = inputMessage.querySelector('small');
  small.style.visibility = 'hidden';

}

// check Required function
function checkRequired(inputArr) {
inputArr.forEach((input) => {
  if(input.value.trim() === '') {
    showError(input, `${getFieldName(input)} is required`);
  } else {
    showSuccess(input);
  }
})
}

// get Field Name function
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// ADD income function
function addIncome () {
  // checking if inputs fields are empty
  checkRequired([incomeSource, incomeAmount]);
  // checking if error Messages are displayed
  const errorMessages = document.querySelectorAll('.error');
  if(errorMessages.length === 0) {
    const newIncomeRow = document.createElement('tr');
    newIncomeRow.innerHTML = `
    <td>${incomeSource.value}</td>
    <td>${incomeStatus.value}</td>
    <td>${incomeAmount.value}</td>
    <td><i class="fa fa-trash"</i></td>
    <td><i class="fa fa-edit income-editIcon"</i></td>
    `;
    // checking the status of income
    if(incomeStatus.value === 'Received') {
      newIncomeRow.style.background = '#333';
      newIncomeRow.style.color = '#fff';
    } else if(incomeStatus.value === 'Not Received') {
      newIncomeRow.style.background = '#fff';
      newIncomeRow.style.color = '#333';
    }  

    const tableBody = document.querySelector('.section-form-output table tbody');
    tableBody.appendChild(newIncomeRow);

    // clearing inputs after successfully added the form content to the ro
    incomeSource.value = '';
    incomeAmount.value = '';
  }
}
// get income from local storage
function getIncomesFromLocalStorage() {
  const incomeFromStorage = localStorage.getItem('incomeDetails');
  return incomeFromStorage ? JSON.parse(incomeFromStorage) : [];
}

// add income to local storage
function addIncomeToLocalStorage() {
  // checking whether inputs or fields are empty 
  checkRequired([incomeSource, incomeAmount]);
  // checking whether error messages are displayed
  const errorMessages = document.querySelectorAll('.error');
  if(errorMessages.length === 0) {
    const incomeToStorage = getIncomesFromLocalStorage();
    const incomeDetails = {
      incomeSource: incomeSource.value.trim(),
      incomeStatus: incomeStatus.value.trim(),
      incomeAmount: incomeAmount.value,
    }
    // pushing income Details object to local storage
    incomeToStorage.push(incomeDetails);
    localStorage.setItem('incomeDetails', JSON.stringify(incomeToStorage));
  }
}

// load local storage Income Details to display
function loadIncomesDetails() {
  const incomesDetails = getIncomesFromLocalStorage();
  incomesDetails.forEach((incomeDetails) => {
    incomeSource.value = incomeDetails.incomeSource;
    incomeStatus.value = incomeDetails.incomeStatus;
    incomeAmount.value = incomeDetails.incomeAmount;

    addIncome();
  })
}
loadIncomesDetails();

// delete income row function
function deleteIncomeRow(incomeRow) {
const tableBody = document.querySelector('.section-form-output table tbody');
const incomeFromStorage = getIncomesFromLocalStorage();
const incomeRowIndex = Array.from(tableBody.children).indexOf(incomeRow);
incomeFromStorage.splice(incomeRowIndex, 1);
localStorage.setItem('incomeDetails', JSON.stringify(incomeFromStorage));

incomeRow.remove();
}

// edit income row function
function editIncomeRow(incomeRow) {
  // selecting element from income overlay sub section of income section
const incomeOverlay = document.querySelector('#income-overlay');
const editIncomeForm = document.querySelector('#edit-income-form');
// creating edit income form elements
const [editSource, editStatus, editAmount] = editIncomeForm.elements;
// mapping income row contents
const incomeRowData = Array.from(incomeRow.children).map((cell) => cell.textContent.trim());
const [source, status, amount] = incomeRowData;
// assigning income data value to edit elements
editSource.value = source;
editStatus.value = status;
editAmount.value = amount;
// displaying overlay form
incomeOverlay.style.display = 'block';

// Add event listener to edit income form 
editIncomeForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // updated the row with edited values
  incomeRow.children[0].textContent = editSource.value;
  incomeRow.children[1].textContent = editStatus.value;
  incomeRow.children[2].textContent = editAmount.value;
if(editStatus.value === 'Received') {
  incomeRow.style.background = '#333';
  incomeRow.style.color = '#fff';
} else if(editStatus.value === 'Not Received') {
  incomeRow.style.background = '#fff';
  incomeRow.style.color = '#333';
}
showIncomeUpdatingMessage('Income Updated Successfully');
  // update the row data in local storage 
  const tableBody = document.querySelector('.section-form-output table tbody');
  const incomeRowIndex = Array.from(tableBody.children).indexOf(incomeRow);
  const incomeFromStorage = getIncomesFromLocalStorage();
  incomeFromStorage[incomeRowIndex] = {
    incomeSource: editSource.value.trim(),
    incomeStatus: editStatus.value.trim(),
    incomeAmount: editAmount.value,
  };

  localStorage.setItem('incomeDetails', JSON.stringify(incomeFromStorage));
  incomeOverlay.style.display = 'none';
  // cancel without updating the edited contents
  const cancelBtn = document.querySelector('#edit-income-cancel');
  cancelBtn.addEventListener('click', function() {
    incomeOverlay.style.display = 'none';
  })
})
}

//  handle fa-edit click event
document.addEventListener('click', function(e) {
  if(e.target.classList.contains('income-editIcon')) {
    const incomeRow = e.target.closest('tr');
    editIncomeRow(incomeRow);
  }
})

// updated message display area
const incomeUpdatedMessage = document.querySelector('#income-updated-message'); 

const showIncomeUpdatingMessage = (message) => {
  const existingMessage = document.querySelector('.income-update-message');
  if (existingMessage) {
    incomeUpdatedMessage.removeChild(existingMessage);
  }

  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.className = 'income-update-message';
  messageElement.style.color = '#fff';
  messageElement.style.background = 'blue';
  messageElement.style.padding = '10px 15px';
  messageElement.style.width = '90%';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.display = 'block';
  incomeUpdatedMessage.appendChild(messageElement);

  // Automatically remove the message after 3 seconds
  setTimeout(() => {
    incomeUpdatedMessage.removeChild(messageElement);
  }, 3000);
};

// handle fa-trash click events for deleting income row

document.addEventListener('click', (e) => {
  if(e.target.classList.contains('fa-trash')) {
    deleteIncomeRow(e.target.closest('tr'));
    deleteExpenseRow(e.target.closest('tr'));
  }
})

// add event listener to income Form
incomeForm.addEventListener('submit', (e) => {
  e.preventDefault();
addIncome();
})

addIncomeBtn.addEventListener('click', addIncomeToLocalStorage);


// selecting elements from expense Dom
const expenseForm = document.querySelector('#expenseForm');
const category = document.querySelector('#category');
const expenseStatus = document.querySelector('#expenseStatus');
const description = document.querySelector('#description');
const expenseAmount = document.querySelector('#expenseAmount');
const addExpenseBtn = document.querySelector('#add-expense-btn');

// Add Expense fuction
function addExpense() {
  // checking if inputs fields are empty 
  checkRequired([category, description, expenseAmount]);
  // checking if error Messages are displayed 
  const errorMessages = document.querySelectorAll('.error');
  if(errorMessages.length === 0) {
    const newExpenseRow = document.createElement('tr');
    newExpenseRow.innerHTML = `
  
    <td>${category.value}</td>
    <td>${expenseStatus.value}</td>
    <td>${description.value}</td>
    <td>${expenseAmount.value}</td>
    <td><i class="fa fa-trash"</i></td>
    <td><i class="fa fa-edit expense-editIcon"</i></td>
  `;
  // checking expense status
  if(expenseStatus.value === 'Paid') {
    newExpenseRow.style.background = 'red';
    newExpenseRow.style.color = '#fff';
  } else if(expenseStatus.value === 'Not Paid') {
    newExpenseRow.style.background = '#333';
    newExpenseRow.style.color = '#fff';
  }
  const tableBody = document.querySelector('.expense-section-form-output table tbody');
  tableBody.appendChild(newExpenseRow);
  category.value = '';
  description.value = '';
  expenseAmount.value = '';
  }
}

// get Expense Details from storage function
function getExpensesFromLocalStorage() {
  const expenseFromStorage = localStorage.getItem('expenseDetails');
  return expenseFromStorage ? JSON.parse(expenseFromStorage) : [];
}

// add expense to storage function
function addExpensesToLocalStorage() {
  // checking whether inputs or fileds are empty
  checkRequired([category, description, expenseAmount]);
  // checking whether error messages are displayed
  const errorMessages = document.querySelectorAll('.error');
  if(errorMessages.length === 0) {
    const addExpenseToStorage = getExpensesFromLocalStorage();
    const expenseDetails = {
      category: category.value.trim(),
      expenseStatus: expenseStatus.value.trim(),
      description: description.value.trim(),
      expenseAmount: expenseAmount.value,
    }
    // push expense to local storage
    addExpenseToStorage.push(expenseDetails);
    localStorage.setItem('expenseDetails', JSON.stringify(addExpenseToStorage));
  }
}

// load expenses details from local storage
function loadExpensesDetails() {
  const expensesDetails = getExpensesFromLocalStorage();
  expensesDetails.forEach((expenseDetails) => {
    category.value = expenseDetails.category;
    expenseStatus.value = expenseDetails.expenseStatus;
    description.value = expenseDetails.description;
    expenseAmount.value = expenseDetails.expenseAmount;
  
    addExpense();
  })
}
loadExpensesDetails();
// delete expense row function
function deleteExpenseRow(expenseRow) {
  const tableBody = document.querySelector('.expense-section-form-output table tbody');
  const expenseFromStorage = getExpensesFromLocalStorage();
  const expenseRowIndex = Array.from(tableBody.children).indexOf(expenseRow);
  expenseFromStorage.splice(expenseRowIndex, 1);
  localStorage.setItem('expenseDetails', JSON.stringify(expenseFromStorage));
  expenseRow.remove();
}


// edit expense row function
function editExpenseRow(expenseRow) {
  // selecting element from expense overlay sub section of expense section
  const expenseOverlay = document.querySelector('#expense-overlay');
  const editExpenseForm = document.querySelector('#edit-expense-form');
  // creating edit expense form elements
  const [editCategory, editExpenseStatus, editDescription, editExpenseAmount] = editExpenseForm.elements;
  // mapping expense row contents
  const expenseRowData = Array.from(expenseRow.children).map((cell) => cell.textContent.trim());
  const [category, expenseStatus, description, expenseAmount] = expenseRowData;
  // assigning expense data value to edit elements
  editCategory.value = category;
  editExpenseStatus.value = expenseStatus;
  editDescription.value = description;
  editExpenseAmount.value = expenseAmount;
  // displaying overlay form
  expenseOverlay.style.display = 'block';

  // Add event listener to edit expense form 
  editExpenseForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // update the row with edited values
    expenseRow.children[0].textContent = editCategory.value;
    expenseRow.children[1].textContent = editExpenseStatus.value;
    expenseRow.children[2].textContent = editDescription.value;
    expenseRow.children[3].textContent = editExpenseAmount.value;
    if (editExpenseStatus.value === 'Paid') {
      expenseRow.style.background = 'red';
      expenseRow.style.color = '#fff';
    } else if (editExpenseStatus.value === 'Not Paid') {
      expenseRow.style.background = '#333';
      expenseRow.style.color = '#fff';
    }
    showExpenseUpdatingMessage('Expense Details Updated Successfully');
    
    // update the row data in local storage 
    const tableBody = document.querySelector('.expense-section-form-output table tbody');
    const expenseRowIndex = Array.from(tableBody.children).indexOf(expenseRow);
    const expenseFromStorage = getExpensesFromLocalStorage();
    expenseFromStorage[expenseRowIndex] = {
      category: editCategory.value.trim(),
      expenseStatus: editExpenseStatus.value.trim(),
      description: editDescription.value.trim(),
      expenseAmount: editExpenseAmount.value.trim(),
    };

    localStorage.setItem('expenseDetails', JSON.stringify(expenseFromStorage));
    expenseOverlay.style.display = 'none';
  });

  // cancel without updating the edited contents
  const cancelBtn = document.querySelector('#edit-expense-cancel');
  cancelBtn.addEventListener('click', function() {
    expenseOverlay.style.display = 'none';
  });
}

// updated message display area
const expenseUpdatedMessage = document.querySelector('#expense-updated-message');

const showExpenseUpdatingMessage = (message) => {
  const existingMessage = document.querySelector('.expense-update-message');
  if (existingMessage) {
    expenseUpdatedMessage.removeChild(existingMessage);
  }
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.className = 'expense-update-message';
  messageElement.style.color = '#fff';
  messageElement.style.background = 'red';
  messageElement.style.padding = '10px 15px';
  messageElement.style.width = '90%';
  messageElement.style.fontWeight = 'bold';
  messageElement.style.display = 'block';
  expenseUpdatedMessage.appendChild(messageElement);

  setTimeout(() => {
    expenseUpdatedMessage.removeChild(messageElement);
  }, 3000);
};

// handle fa-edit click event
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('expense-editIcon')) {
    const expenseRow = e.target.closest('tr');
    editExpenseRow(expenseRow);
  }
});

// add event listener to expense form
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();
 addExpense();
})

addExpenseBtn.addEventListener('click', addExpensesToLocalStorage);

const generateSummaryBtn = document.querySelector('.generate-summary-btn');

// generate my income and expense summary function

// function incomeExpenseSummary() {
//   const incomes = getIncomesFromLocalStorage();
//   const expenses = getExpensesFromLocalStorage();

//   const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.incomeAmount), 0);
//   const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.expenseAmount), 0);
//   const netIncome = totalIncome - totalExpense;

//   const summaryArea = document.querySelector('.summary-area');
//   summaryArea.innerHTML = `
//     <div class="summaryContent">
//       <div class="income-summary">Income: Ksh ${totalIncome.toFixed(2)}</div>
//       <div class="expense-summary">Expense: Ksh ${totalExpense.toFixed(2)}</div>
//       <div class="netIncome-summary">Net Income: Ksh ${netIncome.toFixed(2)}</div>
//     </div>
//   `;
// }

// generateSummaryBtn.addEventListener('click', incomeExpenseSummary);
function incomeExpenseSummary() {
  const incomes = getIncomesFromLocalStorage();
  const expenses = getExpensesFromLocalStorage();

  const totalIncome = incomes.reduce((sum, income) => {
    if (income.incomeStatus === "Received") {
      return sum + parseFloat(income.incomeAmount);
    }
    return sum;
  }, 0);
  
  const totalExpense = expenses.reduce((sum, expense) => {
    if (expense.expenseStatus === "Paid") {
      return sum + parseFloat(expense.expenseAmount);
    }
    return sum;
  }, 0);
  

  const netIncome = totalIncome - totalExpense;

  const summaryArea = document.querySelector('.summary-area');
  summaryArea.innerHTML = `
    <div class="summaryContent">
      <div class="income-summary">Income: $${totalIncome.toFixed(2)}</div>
      <div class="expense-summary">Expense: $${totalExpense.toFixed(2)}</div>
      <div class="netIncome-summary">Net Income: $${netIncome.toFixed(2)}</div>
    </div>
  `;
}

generateSummaryBtn.addEventListener('click', incomeExpenseSummary);

