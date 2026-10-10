(() => {
  const UPI_ID = "vastrakar.rahul@ybl";
  const PAYEE = "Confused RV";
  let amount = 101;
  const amountLabel = document.getElementById("chosenAmount");
  const notice = document.getElementById("notice");
  const qr = document.getElementById("upiQr");
  const custom = document.getElementById("customAmount");
  const money = n => "₹" + Number(n).toLocaleString("en-IN");
  function validAmount(n) { return Number.isFinite(n) && n >= 1 && n <= 100000 && Number.isInteger(n); }
  function upiLink() {
    const p = new URLSearchParams({pa:UPI_ID,pn:PAYEE,am:amount.toFixed(2),cu:"INR",tn:"Support Confused RV"});
    return "upi://pay?" + p.toString();
  }
  function updateAmount(n) {
    if (!validAmount(n)) { notice.textContent = "Enter a whole amount between ₹1 and ₹1,00,000."; return false; }
    amount = n;
    amountLabel.textContent = money(amount);
    document.querySelectorAll(".amount").forEach(b => b.classList.toggle("selected", Number(b.dataset.amount) === amount));
    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=8&data=" + encodeURIComponent(upiLink());
    notice.textContent = "";
    return true;
  }
  document.querySelectorAll(".amount").forEach(b => b.addEventListener("click", () => {
    custom.value = Number(b.dataset.amount);
    updateAmount(Number(b.dataset.amount));
  }));
  document.getElementById("applyAmount").addEventListener("click", () => updateAmount(Number(custom.value)));
  custom.addEventListener("keydown", e => { if (e.key === "Enter") document.getElementById("applyAmount").click(); });
  document.getElementById("copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      notice.textContent = "UPI ID copied. Open your UPI app to pay.";
    } catch {
      const el = document.createElement("textarea"); el.value = UPI_ID; el.style.position = "fixed"; el.style.opacity = "0"; document.body.appendChild(el); el.select();
      try { document.execCommand("copy"); notice.textContent = "UPI ID copied. Open your UPI app to pay."; } catch { notice.textContent = "UPI ID: " + UPI_ID; }
      el.remove();
    }
  });
  document.querySelectorAll(".app, .other-app").forEach(b => b.addEventListener("click", () => {
    window.location.href = upiLink();
    notice.textContent = "If your UPI app did not open, copy the UPI ID and enter the amount manually.";
  }));
  updateAmount(amount);
})();