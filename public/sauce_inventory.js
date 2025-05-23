const selectElement = document.getElementById("marketSP");

selectElement.addEventListener("change", function() {
    if (selectElement.value !== "") {
        selectElement.style.color = "black";
    } else {
        selectElement.style.color = "grey";
    }
});

selectElement.addEventListener("focus", function() {
    if (selectElement.value === "") {
        selectElement.style.color = "grey";
    }
});

if (selectElement.value === "") {
    selectElement.style.color = "grey";
}

let inventory = {
  "Mellow Jalapeño": { stock: 24, price: 95 },
  "Original Peri Peri": { stock: 24, price: 95 },
  "Zesty Habanero": { stock: 24, price: 95 },
  "Extra Hot": { stock: 24, price: 95 },
  "Limited Gift Pack Edition": { stock: 10, price: 350 }
};

let salesLog = [];
let giftSetsSold = 0;
let twoBottlePromotionsSold = 0;
let cashSales = 0;
let periPicanteSold = 0;
let limitedGiftSetSold = 0;

window.addEventListener('load', () => {
  const savedInventory = localStorage.getItem('inventory');
  const savedSalesLog = localStorage.getItem('salesLog');
  const savedCashSales = localStorage.getItem('cashSales');
  const savedMarketName = localStorage.getItem('marketName');
  const savedMarketSP = localStorage.getItem('marketSP');
  const savedMarketDate = localStorage.getItem('marketDate');
  const savedGiftSets = localStorage.getItem('giftSetsSold');
  const savedPromotions = localStorage.getItem('twoBottlePromotionsSold');
  const savedPeriPicante = localStorage.getItem('periPicanteSold');
  const savedlimitedGiftSetSold = localStorage.getItem('limitedGiftSetSold');

  if (savedInventory) {
    inventory = JSON.parse(savedInventory);
  } else {
    Object.keys(inventory).forEach(flavor => {
      const savedValue = localStorage.getItem(`stockConfig_${flavor}`);
      if (savedValue !== null) {
        inventory[flavor].stock = parseInt(savedValue);
      }
    });
  }

  if (savedSalesLog) salesLog = JSON.parse(savedSalesLog);
  if (savedCashSales) cashSales = JSON.parse(savedCashSales);
  if (savedGiftSets) giftSetsSold = parseInt(savedGiftSets);
  if (savedPromotions) twoBottlePromotionsSold = parseInt(savedPromotions);
  if (savedPeriPicante) periPicanteSold = parseInt(savedPeriPicante);
  if (savedlimitedGiftSetSold) limitedGiftSetSold = parseInt(savedlimitedGiftSetSold);

  if (savedMarketName) document.getElementById('marketName').value = savedMarketName;
  if (savedMarketDate) document.getElementById('marketDate').value = savedMarketDate;
  if (savedMarketSP) document.getElementById('marketSP').value = savedMarketSP;

  updateDashboard();
});

function saveStateToLocalStorage() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  localStorage.setItem('salesLog', JSON.stringify(salesLog));
  localStorage.setItem('cashSales', JSON.stringify(cashSales));
  localStorage.setItem('giftSetsSold', giftSetsSold.toString());
  localStorage.setItem('twoBottlePromotionsSold', twoBottlePromotionsSold.toString());
  localStorage.setItem('periPicanteSold', periPicanteSold.toString());
  localStorage.setItem('limitedGiftSetSold', limitedGiftSetSold.toString());
  localStorage.setItem('marketName', document.getElementById('marketName').value);
  localStorage.setItem('marketDate', document.getElementById('marketDate').value);
  localStorage.setItem('marketSP', document.getElementById('marketSP').value);
}

function toggleCashSalesInput() {
  const inputDiv = document.getElementById('cashSalesInput');
  inputDiv.style.display = inputDiv.style.display === 'none' ? 'block' : 'none';
}

function logCashSales() {
  const amount = parseFloat(document.getElementById('cashAmount').value);
  const totalSales = salesLog.reduce((sum, sale) => sum + sale.total_price, 0);

  if (!isNaN(amount) && amount > 0) {
    if (amount > totalSales) {
      alert(`Error: Cash sales cannot exceed total sales of R${totalSales}`);
      return;
    }
    cashSales += amount;
    document.getElementById('cashAmount').value = '';
    toggleCashSalesInput();
    updateDashboard();
    saveStateToLocalStorage();
    alert(`Cash sales of R${amount} added.`);
  } else {
    alert('Please enter a valid cash amount.');
  }
}

function updateDashboard() {
  const totalBottles = salesLog.reduce((sum, sale) => {
    // Exclude both Peri Picante and Limited Gift Pack Edition from bottle count
    if (sale.flavor !== "Peri Picante" && sale.flavor !== "Limited Gift Pack Edition") {
      return sum + sale.quantity;
    }
    return sum;
  }, 0);

  const totalSales = salesLog.reduce((sum, sale) => sum + sale.total_price, 0);

  document.getElementById("totalBottles").textContent = totalBottles;
  document.getElementById("totalSales").textContent = `R${totalSales}`;

  if (document.getElementById("totalPicante")) {
    document.getElementById("totalPicante").textContent = periPicanteSold;
  }

  const stockList = document.getElementById("stockList");
  stockList.innerHTML = Object.entries(inventory)
    // Filter out Limited Gift Pack from stock display
    .filter(([flavor]) => flavor !== "Limited Gift Pack Edition")
    .map(([flavor, data]) => {
      let stockText = "";
      let warningMsg = "";
      if (data.stock === 0) {
        stockText = "Out of Stock";
        warningMsg = `<div class="stock-warning">Out of Stock!</div>`;
      } else {
        stockText = `${data.stock} bottles`;
        if (data.stock <= 5) {
          warningMsg = `<div class="stock-warning">Low Stock!</div>`;
        }
      }
      return `<li class="${data.stock === 0 || data.stock <= 5 ? 'low-stock' : ''}">${flavor}: ${stockText}${warningMsg}</li>`;
    })
    .join("");
}

function resetInventory() {
  if (confirm("Are you sure you want to reset the inventory and sales log?")) {
    inventory = {
      "Mellow Jalapeño": { stock: 24, price: 95 },
      "Original Peri Peri": { stock: 24, price: 95 },
      "Zesty Habanero": { stock: 24, price: 95 },
      "Extra Hot": { stock: 24, price: 95 },
      "Limited Gift Pack Edition": { stock: 10, price: 350 }
    };
    salesLog = [];
    giftSetsSold = 0;
    twoBottlePromotionsSold = 0;
    cashSales = 0;
    periPicanteSold = 0;
    limitedGiftSetSold = 0;

    document.getElementById('marketName').value = '';
    document.getElementById('marketDate').value = '';
    document.getElementById('marketSP').value = '';

    localStorage.removeItem('salesLog');
    localStorage.removeItem('cashSales');
    localStorage.removeItem('giftSetsSold');
    localStorage.removeItem('twoBottlePromotionsSold');
    localStorage.removeItem('periPicanteSold');
    localStorage.removeItem('limitedGiftSetSold');
    localStorage.removeItem('marketName');
    localStorage.removeItem('marketDate');
    localStorage.removeItem('marketSP');

    updateDashboard();
    saveStateToLocalStorage();
    alert("Inventory and sales log have been reset.");
  }
}

// Wrap ALL event listeners in DOMContentLoaded to ensure DOM readiness
document.addEventListener('DOMContentLoaded', () => {
  // Market detail inputs
  document.getElementById('marketName').addEventListener('input', saveStateToLocalStorage);
  document.getElementById('marketDate').addEventListener('change', saveStateToLocalStorage);
  document.getElementById('marketSP').addEventListener('input', saveStateToLocalStorage);

  // Peri Picante button
  if (document.getElementById('peri-picante-btn')) {
    document.getElementById('peri-picante-btn').addEventListener('click', logPeriPicanteSale);
  }

  // Limited Gift Pack button
  if (document.getElementById('limited-gift-pack-btn')) {
    document.getElementById('limited-gift-pack-btn').addEventListener('click', logLimitedGiftPackEdition);
  }
});

function logSale(flavor) {
  if (inventory[flavor].stock < 1) {
    alert(`Error: Not enough stock for ${flavor}`);
    return;
  }

  const sale = {
    flavor: flavor,
    quantity: 1,
    total_price: inventory[flavor].price,
    salesperson: document.getElementById("marketSP").value || "Unknown",
    market_name: document.getElementById("marketName").value || "Unknown",
    market_date: document.getElementById("marketDate").value || new Date().toISOString().split('T')[0]
  };

  inventory[flavor].stock--;
  salesLog.push(sale);
  updateDashboard();
  saveStateToLocalStorage();
  alert(`Sale logged: ${flavor} - 1 bottle sold for R${sale.total_price}`);

  fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale)
  }).catch(error => console.error('Database error:', error));
}

function logPeriPicanteSale() {
  const flavor = "Peri Picante";

  const sale = {
    flavor: flavor,
    quantity: 1,
    total_price: 80,
    salesperson: document.getElementById("marketSP")?.value || "Unknown",
    market_name: document.getElementById("marketName")?.value || "Unknown",
    market_date: document.getElementById("marketDate")?.value || new Date().toISOString().split("T")[0]
  };

  salesLog.push(sale);
  periPicanteSold += sale.quantity;

  updateDashboard();
  saveStateToLocalStorage();
  alert(`Sale logged: Peri Picante - 1 sold for R80`);

  fetch("/api/sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sale)
  }).catch(error => console.error("Database error:", error));
}

function logLimitedGiftPackEdition(e) {
  e.preventDefault(); // Optional: Prevent form submission
  const giftPackName = "Limited Gift Pack Edition"; // Ensure this name matches

  if (inventory[giftPackName].stock < 1) {
    alert("Error: Not enough stock for Limited Gift Pack Edition");
    return;
  }

  // Update stock
  inventory[giftPackName].stock--;

  // Log sale
  const sale = {
    flavor: giftPackName, // Ensure this matches
    quantity: 1,
    total_price: 350,
    salesperson: document.getElementById("marketSP").value || "Unknown",
    market_name: document.getElementById("marketName").value || "Unknown",
    market_date: document.getElementById("marketDate").value || new Date().toISOString().split('T')[0]
  };

  salesLog.push(sale);
  limitedGiftSetSold++; // Increment counter

  // Update UI and save
  updateDashboard();
  saveStateToLocalStorage();
  alert(`Sale recorded: ${giftPackName} for R350`);

  // Send to backend (optional)
  fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale)
  }).catch(error => console.error('Database error:', error));
}


function logPromotion() {
  const flavor1 = document.getElementById("promoFlavor1").value;
  const flavor2 = document.getElementById("promoFlavor2").value;

  if (flavor1 === flavor2) {
    if (inventory[flavor1].stock < 2) {
      alert(`Error: Need at least 2 bottles of ${flavor1}`);
      return;
    }
    inventory[flavor1].stock -= 2;
  } else {
    if (inventory[flavor1].stock < 1 || inventory[flavor2].stock < 1) {
      alert("Error: Not enough stock for selected flavors");
      return;
    }
    inventory[flavor1].stock--;
    inventory[flavor2].stock--;
  }

  const sale = {
    flavor: `${flavor1} & ${flavor2}`,
    quantity: 2,
    total_price: 180,
    salesperson: document.getElementById("marketSP").value || "Unknown",
    market_name: document.getElementById("marketName").value || "Unknown",
    market_date: document.getElementById("marketDate").value || new Date().toISOString().split('T')[0]
  };

  salesLog.push(sale);
  twoBottlePromotionsSold++;
  updateDashboard();
  saveStateToLocalStorage();
  alert(`Promotion applied: ${flavor1} & ${flavor2} for R180`);

  fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale)
  }).catch(error => console.error('Database error:', error));
}

function createGiftSet() {
  const flavor1 = document.getElementById("giftFlavor1").value;
  const flavor2 = document.getElementById("giftFlavor2").value;

  if (flavor1 === flavor2) {
    if (inventory[flavor1].stock < 2) {
      alert(`Error: Need at least 2 bottles of ${flavor1}`);
      return;
    }
    inventory[flavor1].stock -= 2;
  } else {
    if (inventory[flavor1].stock < 1 || inventory[flavor2].stock < 1) {
      alert("Error: Not enough stock for selected flavors");
      return;
    }
    inventory[flavor1].stock--;
    inventory[flavor2].stock--;
  }

  const sale = {
    flavor: `${flavor1} & ${flavor2}`,
    quantity: 2,
    total_price: 190,
    salesperson: document.getElementById("marketSP").value || "Unknown",
    market_name: document.getElementById("marketName").value || "Unknown",
    market_date: document.getElementById("marketDate").value || new Date().toISOString().split('T')[0]
  };

  salesLog.push(sale);
  giftSetsSold++;
  updateDashboard();
  saveStateToLocalStorage();
  alert(`Gift set created: ${flavor1} & ${flavor2} for R190`);

  fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale)
  }).catch(error => console.error('Database error:', error));
}

function createPrepackedGiftSet(flavor1, flavor2) {
  if (flavor1 === flavor2) {
    if (inventory[flavor1].stock < 2) {
      alert(`Error: Need at least 2 bottles of ${flavor1}`);
      return;
    }
    inventory[flavor1].stock -= 2;
  } else {
    if (inventory[flavor1].stock < 1 || inventory[flavor2].stock < 1) {
      alert("Error: Not enough stock for selected flavors");
      return;
    }
    inventory[flavor1].stock--;
    inventory[flavor2].stock--;
  }

  const sale = {
    flavor: `${flavor1} & ${flavor2}`,
    quantity: 2,
    total_price: 190,
    salesperson: document.getElementById("marketSP").value || "Unknown",
    market_name: document.getElementById("marketName").value || "Unknown",
    market_date: document.getElementById("marketDate").value || new Date().toISOString().split('T')[0]
  };

  salesLog.push(sale);
  giftSetsSold++;
  updateDashboard();
  saveStateToLocalStorage();
  alert(`Gift set created: ${flavor1} & ${flavor2} for R190`);

  fetch('/api/sales', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sale)
  }).catch(error => console.error('Database error:', error));
}
function generatePdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const marketName = document.getElementById("marketName").value;
  const marketDate = document.getElementById("marketDate").value;
  const marketSP = document.getElementById("marketSP").value;

  const totalSales = salesLog.reduce((sum, sale) => sum + sale.total_price, 0);
  const cardSales = totalSales - cashSales;

  // Updated to exclude both Peri Picante and Limited Gift Pack Edition
  const totalBottles = salesLog.reduce((sum, sale) => {
    if (sale.flavor !== "Peri Picante" && sale.flavor !== "Limited Gift Pack Edition") {
      return sum + sale.quantity;
    }
    return sum;
  }, 0);

  const marketHistory = JSON.parse(localStorage.getItem("marketHistory")) || [];
  if (marketHistory.length >= 10) {
    marketHistory.shift();
  }
  
  const currentReport = {
    marketName,
    marketSP,
    marketDate,
    totalSales,
    cardSales,
    totalBottles,
    periPicanteSold,
    giftSetsSold,
    limitedGiftSetSold,
  };
  
  marketHistory.push(currentReport);
  localStorage.setItem("marketHistory", JSON.stringify(marketHistory));

  doc.setFontSize(22);
  doc.text("Sauce Inventory Summary", 10, 20);

  doc.setFontSize(14);
  doc.text(`Market Name: ${marketName || "N/A"}`, 10, 30);
  doc.text(`Salesperson: ${marketSP || "N/A"}`, 10, 40);
  doc.text(`Date: ${marketDate || "N/A"}`, 10, 50);

  doc.setFontSize(16);
  doc.text("Sales Summary", 10, 60);

  doc.setFontSize(12);
  doc.text(`Total Bottles Sold: ${totalBottles}`, 10, 70);
  doc.text(`Total Picantes Sold: ${periPicanteSold}`, 10, 80);
  doc.text(`Limited Gift Pack Editions Sold: ${limitedGiftSetSold}`, 10, 90);
  doc.text(`Total Sales Amount: R${totalSales}`, 10, 100);
  doc.text(`Cash Sales: R${cashSales}`, 10, 110);
  doc.text(`Card Sales: R${cardSales}`, 10, 120);
  doc.text(`Two-Bottle Promotions Sold: ${twoBottlePromotionsSold}`, 10, 130);
  doc.text(`Gift Sets Sold: ${giftSetsSold}`, 10, 140);

  doc.setFontSize(16);
  doc.text("Current Inventory", 10, 160);

  doc.setFontSize(12);
  let yPosition = 170;
  Object.entries(inventory).forEach(([flavor, data]) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 10;
    }
    doc.text(`${flavor}: ${data.stock} bottles`, 10, yPosition);
    yPosition += 10;
  });

  doc.save("sauce_inventory_summary.pdf");
}

function voidLastTransaction() {
  if (salesLog.length === 0) {
    alert("No transactions to void.");
    return;
  }
  const lastTransaction = salesLog.pop();
  const flavor = lastTransaction.flavor;

  if (flavor === "Peri Picante") {
    periPicanteSold--;
  } else if (flavor === "Limited Gift Pack Edition") {
    limitedGiftSetSold--;
    inventory[flavor].stock += 1;
  } else if (lastTransaction.quantity === 1) {
    inventory[flavor].stock += 1;
  } else if (lastTransaction.quantity === 2) {
    const flavors = flavor.split(" & ");
    if (flavors.length === 2) {
      inventory[flavors[0]].stock += 1;
      inventory[flavors[1]].stock += 1;
    } else {
      inventory[flavor].stock += 2;
    }
  }

  updateDashboard();
  saveStateToLocalStorage();
  alert(`Voided last transaction: ${flavor} (${lastTransaction.quantity} ${lastTransaction.quantity === 1 ? 'bottle' : 'bottles'})`);
}

updateDashboard();