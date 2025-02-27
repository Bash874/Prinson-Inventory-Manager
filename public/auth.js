// Toggle between login and registration forms
function toggleForms() {
  document.getElementById("loginForm").style.display =
    document.getElementById("loginForm").style.display === "none" ? "block" : "none";
  document.getElementById("registerForm").style.display =
    document.getElementById("registerForm").style.display === "none" ? "block" : "none";
}

// Register User
async function registerUser() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const role = document.getElementById("userRole").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });

  const data = await response.json();
  alert(data.message || data.error);

  if (response.ok) {
    window.location.href = "sauce-inventory-tracker.html"; // Redirect after successful registration
  }
}

// Login User
async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  alert(data.message || data.error);

  if (response.ok) {
    window.location.href = "sauce-inventory-tracker.html"; // Redirect after successful login
  }
}
