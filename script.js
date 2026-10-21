// LUXURY.EG — front-end shopping bag demo
document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("cart-count");
  const summaryCount = document.getElementById("summary-count");
  const totalEl = document.getElementById("cart-total");
  const messageEl = document.getElementById("cart-message");
  const clearButton = document.getElementById("clear-cart");

  let cart = [];

  const money = (amount) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0
    }).format(amount);

  function renderCart() {
    const count = cart.length;
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    if (countEl) countEl.textContent = count;
    if (summaryCount) summaryCount.textContent = count;
    if (totalEl) totalEl.textContent = money(total);
  }

  document.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => {
      const name = button.dataset.product || "Product";
      const price = Number(button.dataset.price || 0);

      cart.push({ name, price });
      renderCart();

      if (messageEl) {
        messageEl.textContent = `${name} added to your bag.`;
      }

      const oldText = button.innerHTML;
      button.innerHTML = "ADDED ✓";
      button.disabled = true;
      window.setTimeout(() => {
        button.innerHTML = oldText;
        button.disabled = false;
      }, 900);
    });
  });

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      cart = [];
      renderCart();
      if (messageEl) messageEl.textContent = "Your bag is now empty.";
    });
  }

  renderCart();
  console.log("LUXURY.EG is ready.");
});
