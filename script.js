let grandTotal = 0;

const tableBody = document.querySelector("#billTable tbody");

document.getElementById("addItem").addEventListener("click", function () {

    const itemName = document.getElementById("itemName").value.trim();
    const qty = parseFloat(document.getElementById("itemQty").value);
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!itemName || isNaN(qty) || isNaN(price)) {
        alert("Please enter all product details.");
        return;
    }

    const total = qty * price;
    grandTotal += total;

    const row = `
        <tr>
            <td>${itemName}</td>
            <td>${qty}</td>
            <td>₹${price.toFixed(2)}</td>
            <td>₹${total.toFixed(2)}</td>
        </tr>
    `;

    tableBody.innerHTML += row;

    document.getElementById("grandTotal").textContent = grandTotal.toFixed(2);

    // Clear input fields
    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemPrice").value = "";

    // Focus back on the product name
    document.getElementById("itemName").focus();
});
