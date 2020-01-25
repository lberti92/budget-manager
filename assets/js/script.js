// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem("budgetItems")) || [];
let lastID = parseInt(localStorage.getItem("lastID")) || 0;

// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID
const updateStorage = () => {
    localStorage.setItem("budgetItems", JSON.stringify(budgetItems));
    localStorage.setItem("lastID", lastID);
}


// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):
const renderItems = items => {
    if (!items) items = budgetItems;
    const tbody = $("#budgetItems tbody");
    tbody.empty();

    for (const {id, date, name, category, amount, notes} of items) {
        const row = `<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(amount).toFixed(2)}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`;
        tbody.append(row);
    }

    const total = items.reduce((accum, item) => accum + parseFloat(item.amount), 0);
    $("#total").text(`$${total.toFixed(2)}`)
}

// ======================
// MAIN PROCESS
// ======================
renderItems();

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form
$("#toggleFormButton, #hideForm").on("click", function() {
    const addItemForm = $("#addItemForm");
    const toggleButton = $("#toggleFormButton");

    addItemForm.toggle("slow", () => {
        toggleButton.text(addItemForm.is(":visible") ? "Hide Form" : "Enter New Budget Item");
    });
});

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add item to budgetItems array
// (each item's object should include: id / date / name / category / amount / notes)... then clear the form
// fields and trigger localStorage update/budgetItems rerender functions, once created
$("#addItem").on("click", function (event) {
    event.preventDefault();

    const newItem = {
        id:  ++lastID, //  increment and store the upload value in one step
        date: moment().format("lll"),
        name: $("#name").val().trim(),
        category: $("#category").val(),
        amount: $("#amount").val().trim(),
        notes: $("#notes").val().trim()
    }

    if (!newItem.name || !newItem.category || !newItem.amount) {
        // if we fail validation
        return alert("You must specify name, category, and amount for each budget item!"); //equilvalent to return false
    }
    budgetItems.push(newItem);
    updateStorage(); // update localStorage
    renderItems();// rerender our budget items
    $("#addItemForm form")[0].reset();
})

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$("#categoryFilter").on("change", function () {
    const category = $(this).val();
    if(category) {
    const filterItems = budgetItems.filter(item => category === item.category);
    renderItems(filterItems);
    } else { 
        renderItems();
    }

});

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem

$("#budgetItems").on("click", ".delete span", function() {
    // const id = $(this).parents("tr").attr("data.id");
    const id = parseInt($(this).parents("tr").data("id"));
    const remainingItems = budgetItems.filter(item => item.id !== id);
    budgetItems = remainingItems;
    updateStorage();
    renderItems();
    $("#categoryFilter").val("");
})




