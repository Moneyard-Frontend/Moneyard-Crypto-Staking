// ========== DEPOSIT MODAL HANDLING ==========
document.getElementById('depositButton')?.addEventListener('click', () => {
  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.style.display = 'block';
  }
});

// Close the Deposit modal when the close button is clicked
document.getElementById('closeDepositModal')?.addEventListener('click', () => {
  closeDepositModal();
});

// Close the Deposit Modal function
function closeDepositModal() {
  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Close the modal if user clicks outside of it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('depositModal');
  if (event.target === modal) {
    closeDepositModal();
  }
});

// ========== DEPOSIT FORM VALIDATION ==========
document.getElementById('depositForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('depositAmount').value);
  const network = document.getElementById('depositNetwork').value;
  const txId = document.getElementById('depositTxId').value;

  if (!amount || !network || !txId) {
    alert('Please fill all fields correctly.');
    return;
  }

  try {
    const token = localStorage.getItem('token'); // Assuming login stores token

    const response = await fetch('/api/deposit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        method: network,
        txId
      })
    });

    const data = await response.json();

    if (data.success) {
      alert('Deposit successful! Balance will be updated.');
      closeDepositModal();
      refreshBalance(); // Optional: add this function to refresh balance on dashboard
    } else {
      alert(data.message || 'Deposit failed.');
    }
  } catch (error) {
    console.error('Deposit error:', error);
    alert('An error occurred while processing your deposit.');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ... existing code ...
  refreshBalance(); // Load balance when dashboard loads
});

// ========== STAKE PLANS HANDLING ==========
const stakePlansContainer = document.getElementById("stake-plans");
if (stakePlansContainer) {
  // Sample static stake plans (you can later update this dynamically if needed)
  const stakePlans = [
    { name: "Flexible", apy: 10, durationDays: 30 },
    { name: "Locked", apy: 15, durationDays: 90 },
    { name: "High-Yield", apy: 20, durationDays: 180 }
  ];

  // Display stake plans in the frontend
  stakePlans.forEach(plan => {
    const card = document.createElement("div");
    card.className = "stake-plan-card";
    card.innerHTML = `
      <h3>${plan.name}</h3>
      <p>APY: ${plan.apy}%</p>
      <p>Duration: ${plan.durationDays} days</p>
      <button onclick="selectStakePlan('${plan.name}', ${plan.apy}, ${plan.durationDays})">Choose Plan</button>
    `;
    stakePlansContainer.appendChild(card);
  });
}

// Select a staking plan and display it in the form
function selectStakePlan(name, apy, duration) {
  document.getElementById("selectedPlanName").value = name;
  document.getElementById("selectedPlanApy").innerText = `APY: ${apy}%`;
  document.getElementById("selectedPlanDuration").innerText = `Duration: ${duration} days`;
}

// ========== STAKE FORM SUBMISSION (Frontend Validation Only) ==========
document.getElementById('stakeForm')?.addEventListener('submit', (e) => {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('stakeAmount').value);
  const selectedPlan = document.getElementById('selectedPlanName').value;

  if (!amount || amount < 10) {
    alert("Minimum stake is 10 USDT.");
    return;
  }

  // Simulating staking success
  alert(`You have successfully staked ${amount} USDT in the ${selectedPlan} plan.`);
  document.getElementById('stakeForm').reset();
});

// ========== DOMContentLoaded LOGIC (For UI Animations and Display) ==========
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.animated-section');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'growth-tracker') {
          animateCounters();
        }
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => sectionObserver.observe(section));

  // Adding an example of an animated counter (growth tracker)
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let current = 0;
      const increment = target / 100;

      const interval = setInterval(() => {
        current += increment;
        counter.textContent = Math.floor(current);
        if (current >= target) {
          clearInterval(interval);
        }
      }, 30);
    });
  }
});

// ========== LOAN CALCULATOR ==========
const ltvSlider = document.getElementById("ltvSlider");
const ltvValue = document.getElementById("ltvValue");
if (ltvSlider && ltvValue) {
  ltvSlider.addEventListener("input", function () {
    ltvValue.textContent = `${ltvSlider.value}%`;
  });
}

const calcLoanBtn = document.getElementById("calculateLoanBtn");
if (calcLoanBtn) {
  calcLoanBtn.addEventListener("click", function () {
    const btcAmount = parseFloat(document.getElementById("btcAmount").value);
    const ltv = parseInt(ltvSlider.value);
    const btcPrice = 20000; // Example BTC price

    if (isNaN(btcAmount) || btcAmount <= 0) {
      alert("Please enter valid BTC amount.");
      return;
    }

    const loanAmount = btcAmount * btcPrice * (ltv / 100);
    document.getElementById("loanResult").innerHTML = `
      <p>Loan Amount Available: <strong>${loanAmount.toFixed(2)} USDT</strong></p>
    `;
  });
}

// ========== NAVIGATION AND MODAL TOGGLES ==========
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.style.display = section.style.display === "block" ? "none" : "block";
}

// Example: Toggle Earnings Section when clicked
document.getElementById("earningsButton")?.addEventListener("click", function() {
  toggleSection('earningsSection');
});

// ========== USER EMAIL STORAGE AND LOGIN FLOW ==========
window.onload = function() {
  const savedEmail = localStorage.getItem("userEmail");
  if (savedEmail) {
    document.getElementById("loginEmail").value = savedEmail;
    document.getElementById("rememberMe").checked = true; // Pre-check the "Remember Me" checkbox
  }
};

// Handle the login form submission
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // If "Remember Me" is checked, save the email in localStorage
  if (rememberMe) {
    localStorage.setItem("userEmail", email);
  } else {
    localStorage.removeItem("userEmail"); // Remove the saved email if "Remember Me" is not checked
  }

  // Proceed with the login logic (you will likely send the email/password to the backend)
  // For now, we'll redirect to the dashboard page
  window.location.href = "dashboard.html"; // Update this as per your flow
}
.then(data => {
  if (data.success) {
    localStorage.setItem("userEmail", data.email); // Store user email
    localStorage.setItem("token", data.token); // Store auth token if needed
    window.location.href = "dashboard.html";
  } else {
    alert(data.message);
  }
});

// ========== DEPOSIT MANAGEMENT (Admin Panel) ==========
function openAdminModal() {
  document.getElementById("adminDepositModal").style.display = "block";
  loadDepositsToTable();
}

function closeAdminModal() {
  document.getElementById("adminDepositModal").style.display = "none";
}

function loadDepositsToTable() {
  const tableBody = document.getElementById("depositTableBody");
  tableBody.innerHTML = "";

  const savedDeposits = JSON.parse(localStorage.getItem("momoDeposits") || "[]");

  if (savedDeposits.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:15px;">No deposits yet.</td></tr>`;
    return;
  }

  savedDeposits.forEach((deposit, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${deposit.amount}</td>
      <td>${deposit.method}</td>
      <td>${deposit.txId}</td>
      <td><span class="status">${deposit.status}</span></td>
      <td><button onclick="approveDeposit(${index})">Approve</button></td>
      <td><button onclick="rejectDeposit(${index})">Reject</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function approveDeposit(index) {
  alert("Deposit approved!");
  // Handle deposit approval logic
}

function rejectDeposit(index) {
  alert("Deposit rejected!");
  // Handle deposit rejection logic
}
