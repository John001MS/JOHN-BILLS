*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}

body{
    background:#f0f2f5;
    padding:20px;
}

.container{
    max-width:1000px;
    margin:auto;
    background:#fff;
    padding:20px;
    border-radius:10px;
    box-shadow:0 0 10px rgba(0,0,0,0.2);
}

header{
    text-align:center;
    margin-bottom:20px;
}

header h1{
    color:#0066cc;
}

header p{
    color:#555;
}

.customer,
.billing{
    background:#f8f8f8;
    padding:15px;
    border-radius:8px;
    margin-bottom:20px;
}

.customer h2,
.billing h2{
    margin-bottom:10px;
    color:#333;
}

input{
    width:100%;
    padding:10px;
    margin:8px 0;
    border:1px solid #ccc;
    border-radius:5px;
    font-size:16px;
}

.bill-info{
    display:flex;
    justify-content:space-between;
    margin-top:10px;
    font-weight:bold;
}

button{
    background:#007bff;
    color:white;
    border:none;
    padding:10px 20px;
    border-radius:5px;
    cursor:pointer;
    font-size:16px;
    margin-top:10px;
}

button:hover{
    background:#0056b3;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:20px;
}

table th,
table td{
    border:1px solid #ddd;
    padding:10px;
    text-align:center;
}

table th{
    background:#007bff;
    color:white;
}

h2{
    margin-top:20px;
    text-align:right;
}

.buttons{
    display:flex;
    gap:10px;
    justify-content:flex-end;
    margin-top:20px;
}

@media print{
    button{
        display:none;
    }

    body{
        background:white;
    }

    .container{
        box-shadow:none;
    }
}
