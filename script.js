// Bill Number
const billNo = "MS" + Date.now();
document.getElementById("billNo").textContent = billNo;

// Date & Time
const now = new Date();
document.getElementById("billDate").textContent = now.toLocaleString();

// Grand Total
let grandTotal = 0;

// Table Body
const tableBody = document.querySelector("#billTable tbody");

// Add Item Button
document.getElementById("addItem").addEventListener("click", function () {

    const itemName = document.getElementById("itemName").value.trim();
    const qty = parseFloat(document.getElementById("itemQty").value);
    const price = parseFloat(document.getElementById("itemPrice").value);

    if (!itemName || isNaN(qty) || isNaN(price)) {
        alert("Please fill all product details.");
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

    document.getElementById("grandTotal").textContent =
        grandTotal.toFixed(2);

    // Clear product fields
    document.getElementById("barcode").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemQty").value = "";
    document.getElementById("itemPrice").value = "";
});

// PDF Button (Coming Soon)
document.getElementById("downloadPdf").addEventListener("click", function () {
    alert("PDF Download feature will be added in the next step.");
});
