(function () {
  "use strict";

  // ---------------- state ----------------

  const state = {
    balance: 102201.09,
    hidden: false,
    transactions: [
      { id: 1, name: "Figma premium", time: "2:34 am", amount: -75, initials: "F", bg: "#3a2a5c", fg: "#b794f6" },
      { id: 2, name: "Spotify premium", time: "2:34 am", amount: -12, initials: "S", bg: "#123a1f", fg: "#3ddc6f" },
      { id: 3, name: "Jennifer Watkings", time: "12:34 am", amount: 50000, initials: "JW", bg: "#3a2323", fg: "#e79a9a" },
      { id: 4, name: "Mercy Estate", time: "12:34 am", amount: 70000, initials: "ME", bg: "#233a38", fg: "#7ad9cf" },
      { id: 5, name: "Adebayo smart", time: "12:34 am", amount: 56, initials: "AS", bg: "#3a3323", fg: "#e0c97a" },
    ],
    amount: "1200.00",
  };

  const RECIPIENT = { account: "3267882399", name: "Jennifer Watkings" };

  const money = (n) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // ---------------- element refs ----------------

  const homeScreen = document.getElementById("home-screen");
  const sendScreen = document.getElementById("send-screen");
  const balanceDisplay = document.getElementById("balance-display");
  const eyeBtn = document.getElementById("eye-btn");
  const eyeIcon = document.getElementById("eye-icon");
  const txList = document.getElementById("tx-list");
  const toastEl = document.getElementById("toast");
  const amountValue = document.getElementById("amount-value");
  const availableBalanceText = document.getElementById("available-balance-text");
  const swipeTrack = document.getElementById("swipe-track");
  const swipeKnob = document.getElementById("swipe-knob");
  const swipeLabel = document.getElementById("swipe-label");

  let toastTimer = null;

  // ---------------- toast ----------------

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  // ---------------- rendering ----------------

  function renderBalance() {
    balanceDisplay.textContent = state.hidden ? "$••••••.••" : `$${money(state.balance)}`;
    eyeIcon.innerHTML = state.hidden
      ? '<path d="m2 2 20 20"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><path d="M6.61 6.61C2.85 8.9 1 12 1 12s4 8 11 8a9.26 9.26 0 0 0 5.39-1.61"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/><circle cx="12" cy="12" r="3"/>';
  }

  function renderTransactions() {
    txList.innerHTML = "";
    state.transactions.forEach((t) => {
      const row = document.createElement("div");
      row.className = "tx-row";
      const isNeg = t.amount < 0;
      row.innerHTML = `
        <div class="tx-left">
          <div class="avatar tx-avatar" style="background:${t.bg};color:${t.fg}">${t.initials}</div>
          <div>
            <div class="tx-name">${t.name}</div>
            <div class="tx-time">${t.time}</div>
          </div>
        </div>
        <div class="tx-amount ${isNeg ? "neg" : "pos"}">${isNeg ? "-" : "+"} $${money(Math.abs(t.amount))}</div>
      `;
      txList.appendChild(row);
    });
  }

  function renderAmount() {
    amountValue.textContent = state.amount;
    availableBalanceText.textContent = `Available balance $${money(state.balance)}`;
  }

  // ---------------- navigation ----------------

  function goTo(screen) {
    if (screen === "send") {
      state.amount = "1200.00";
      renderAmount();
      resetSwipe();
      homeScreen.classList.add("hidden");
      sendScreen.classList.remove("hidden");
    } else {
      sendScreen.classList.add("hidden");
      homeScreen.classList.remove("hidden");
    }
  }

  // ---------------- home interactions ----------------

  document.getElementById("send-btn").addEventListener("click", () => goTo("send"));
  document.getElementById("receive-btn").addEventListener("click", () => showToast("Receive coming soon"));
  document.getElementById("swap-btn").addEventListener("click", () => showToast("Swap coming soon"));
  document.getElementById("bell-btn").addEventListener("click", () => showToast("No new notifications"));
  document.getElementById("wallet-btn").addEventListener("click", () => showToast("Only USD wallet available"));
  document.getElementById("see-all-btn").addEventListener("click", () => showToast("Full history coming soon"));

  eyeBtn.addEventListener("click", () => {
    state.hidden = !state.hidden;
    renderBalance();
  });

  document.querySelectorAll(".quickpay-btn").forEach((btn) => {
    btn.addEventListener("click", () => showToast(`${btn.dataset.label} coming soon`));
  });

  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.nav === "Home") return;
      showToast(`${btn.dataset.nav} coming soon`);
    });
  });

  // ---------------- send screen interactions ----------------

  document.getElementById("back-btn").addEventListener("click", () => goTo("home"));
  document.getElementById("clear-recipient-btn").addEventListener("click", () => goTo("home"));
  document.getElementById("scan-btn").addEventListener("click", () => showToast("Scan coming soon"));

  document.getElementById("keypad").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const key = btn.dataset.key;
    pressKey(key);
  });

  function pressKey(key) {
    let val = state.amount;
    if (key === "back") {
      val = val.length > 1 ? val.slice(0, -1) : "0";
    } else if (key === "." ) {
      if (!val.includes(".")) val += ".";
    } else {
      if (val === "0") {
        val = key;
      } else if (val.length <= 12) {
        val += key;
      }
    }
    state.amount = val;
    renderAmount();
  }

  document.getElementById("quick-amounts").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const v = parseFloat(btn.dataset.amount);
    state.amount = v.toFixed(2);
    renderAmount();
  });

  // ---------------- swipe to send ----------------

  const KNOB_SIZE = 50;
  const TRACK_PAD = 4;
  let dragging = false;
  let dragX = 0;
  let sent = false;

  function maxDrag() {
    return swipeTrack.offsetWidth - KNOB_SIZE - TRACK_PAD * 2;
  }

  function resetSwipe() {
    dragging = false;
    dragX = 0;
    sent = false;
    swipeKnob.style.left = TRACK_PAD + "px";
    swipeKnob.style.transition = "left 0.25s ease";
    swipeTrack.classList.remove("sent");
    swipeLabel.textContent = "Swipe to send  »  »";
    swipeLabel.style.opacity = 1;
  }

  function setKnobPosition(x, animate) {
    swipeKnob.style.transition = animate ? "left 0.25s ease" : "none";
    swipeKnob.style.left = TRACK_PAD + x + "px";
    const md = maxDrag();
    swipeLabel.style.opacity = md > 0 ? Math.max(0, 1 - x / md) : 1;
  }

  function startDrag(e) {
    if (sent) return;
    dragging = true;
    swipeKnob.style.cursor = "grabbing";
  }

  function moveDrag(e) {
    if (!dragging || sent) return;
    const rect = swipeTrack.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let x = clientX - rect.left - TRACK_PAD - KNOB_SIZE / 2;
    const md = maxDrag();
    x = Math.max(0, Math.min(x, md));
    dragX = x;
    setKnobPosition(x, false);
    if (e.cancelable) e.preventDefault();
  }

  function endDrag() {
    if (!dragging || sent) return;
    dragging = false;
    swipeKnob.style.cursor = "grab";
    const md = maxDrag();

    if (md > 0 && dragX >= md * 0.85) {
      const amt = parseFloat(state.amount || "0");
      if (amt <= 0) {
        showToast("Enter an amount");
        setKnobPosition(0, true);
        return;
      }
      if (amt > state.balance) {
        showToast("Insufficient balance");
        setKnobPosition(0, true);
        return;
      }
      sent = true;
      setKnobPosition(md, true);
      swipeTrack.classList.add("sent");
      swipeLabel.textContent = "Sent!";
      swipeLabel.style.opacity = 1;
      setTimeout(() => confirmSend(amt), 550);
    } else {
      setKnobPosition(0, true);
    }
  }

  function confirmSend(amt) {
    state.balance -= amt;
    state.transactions.unshift({
      id: Date.now(),
      name: RECIPIENT.name,
      time: "just now",
      amount: -amt,
      initials: "JW",
      bg: "#3a2323",
      fg: "#e79a9a",
    });
    renderBalance();
    renderTransactions();
    goTo("home");
    showToast(`Sent $${money(amt)} to ${RECIPIENT.name}`);
  }

  swipeKnob.addEventListener("mousedown", startDrag);
  swipeKnob.addEventListener("touchstart", startDrag, { passive: true });
  document.addEventListener("mousemove", moveDrag);
  document.addEventListener("touchmove", moveDrag, { passive: false });
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);

  // ---------------- init ----------------

  renderBalance();
  renderTransactions();
  renderAmount();
  resetSwipe();
})();
