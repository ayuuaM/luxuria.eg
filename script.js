/* LUXURIA — luxuriaeg.eg */

const WHATSAPP_NUMBER = "201154178640";
const CURRENCY = "EGP";

/* PRODUCTS — each piece is one-of-a-kind (single size, single item). To add a piece: drop photos in /images and add a line here. */
const PRODUCTS = [
  { id: "dg-loafers", name: "Dolce & Gabbana loafers", category: "Shoes", size: "44", price: 9500, italy: true,
    images: ["images/dg-loafers-1.jpg", "images/dg-loafers-2.jpg"] },
  { id: "gucci-shoes", name: "Gucci shoes", category: "Shoes", size: "45", price: 30000, italy: true,
    images: ["images/gucci-shoes-1.jpg", "images/gucci-shoes-2.jpg", "images/gucci-shoes-3.jpg"] },
  { id: "diesel-jacket", name: "Diesel jacket", category: "Clothing", size: "L", price: 9000, italy: false,
    images: ["images/diesel-jacket-1.jpg", "images/diesel-jacket-2.jpg"] },
  { id: "navy-puffer", name: "Navy puffer jacket", category: "Clothing", size: "L", price: 8000, italy: false,
    images: ["images/navy-puffer-1.jpg", "images/navy-puffer-2.jpg"] },
  { id: "fendi-tshirt", name: "Fendi t-shirt", category: "Clothing", size: "L", price: 9500, italy: true,
    images: ["images/fendi-tshirt-1.jpg", "images/fendi-tshirt-2.jpg", "images/fendi-tshirt-3.jpg"] },
  { id: "versace-boots", name: "Versace half boots, real leather", category: "Shoes", size: "44", price: 15000, italy: true,
    images: ["images/versace-boots-1.jpg", "images/versace-boots-2.jpg", "images/versace-boots-3.jpg", "images/versace-boots-4.jpg"] },
  { id: "dior-tshirt", name: "Dior t-shirt", category: "Clothing", size: "L", price: 15000, italy: true,
    images: ["images/dior-tshirt-1.jpg", "images/dior-tshirt-2.jpg", "images/dior-tshirt-3.jpg"] },
  { id: "versace-blazer", name: "Versace collection blazer", category: "Clothing", size: "50", price: 36500, italy: true,
    images: ["images/versace-blazer-1.jpg", "images/versace-blazer-2.jpg", "images/versace-blazer-3.jpg", "images/versace-blazer-4.jpg"] },
  { id: "armani-loafers", name: "Emporio Armani loafers", category: "Shoes", size: "44", price: 9500, italy: false,
    images: ["images/armani-loafers-1.jpg", "images/armani-loafers-2.jpg", "images/armani-loafers-3.jpg"] },
  { id: "balenciaga-tracks", name: "Balenciaga Tracks", category: "Shoes", size: "43", price: 7500, italy: false,
    images: ["images/balenciaga-tracks-1.jpg", "images/balenciaga-tracks-2.jpg", "images/balenciaga-tracks-3.jpg", "images/balenciaga-tracks-4.jpg"] }
];

/* ------------------------------------------------------------------ */

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => `${n.toLocaleString("en-US")} ${CURRENCY}`;

let activeCategory = "All";
let cart = loadCart();

function loadCart() {
  try { return JSON.parse(localStorage.getItem("luxuria-cart")) || []; }
  catch { return []; }
}
function saveCart() {
  try { localStorage.setItem("luxuria-cart", JSON.stringify(cart)); } catch {}
}

/* Filters */
function renderChips() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
  $("#chips").innerHTML = cats
    .map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${c === activeCategory}">${c}</button>`)
    .join("");
}
$("#chips").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCategory = btn.dataset.cat;
  renderChips();
  renderGrid();
});

/* Grid */
function renderGrid() {
  const list = PRODUCTS.filter((p) => activeCategory === "All" || p.category === activeCategory);
  $("#grid").innerHTML = list.map((p) => {
    const inCart = cart.some((l) => l.id === p.id);
    return `
    <article class="card" data-id="${p.id}">
      <div class="shot">
        <div class="slides" tabindex="0" aria-label="${p.name} photos">
          ${p.images.map((src, k) => `<img src="${src}" alt="${p.name}, photo ${k + 1}" loading="lazy">`).join("")}
        </div>
      </div>
      ${p.images.length > 1 ? `<div class="dots" aria-hidden="true">${p.images.map((_, k) => `<i${k ? "" : ' class="on"'}></i>`).join("")}</div>` : ""}
      <div class="card-top">
        <div>
          <h3>${p.name}</h3>
          <p class="brand">Size ${p.size}${p.italy ? " · Made in Italy" : ""}</p>
        </div>
        <span class="price">${fmt(p.price)}</span>
      </div>
      <button class="add${inCart ? " done" : ""}" ${inCart ? "disabled" : ""}>${inCart ? "In your order list" : "Add to order list"}</button>
    </article>`;
  }).join("");

  document.querySelectorAll(".slides").forEach((el) => {
    const dots = el.closest(".card").querySelectorAll(".dots i");
    el.addEventListener("scroll", () => {
      const k = Math.round(el.scrollLeft / el.clientWidth);
      dots.forEach((d, j) => d.classList.toggle("on", j === k));
    });
  });
}

$("#grid").addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn || btn.disabled) return;
  addToCart(btn.closest(".card").dataset.id);
  openDrawer();
});

/* Cart — every piece is one-of-a-kind, so each can be added once */
function addToCart(id) {
  if (!cart.some((l) => l.id === id)) cart.push({ id });
  saveCart(); renderCart(); renderGrid();
}
function removeFromCart(id) {
  cart = cart.filter((l) => l.id !== id);
  saveCart(); renderCart(); renderGrid();
}

function renderCart() {
  const items = cart.map((l) => PRODUCTS.find((p) => p.id === l.id)).filter(Boolean);
  const total = items.reduce((n, p) => n + p.price, 0);

  $("#bagCount").textContent = items.length;
  $("#total").textContent = fmt(total);
  $("#empty").hidden = items.length > 0;
  $("#lines").innerHTML = items.map((p) => `
    <li class="line">
      <div>
        <p>${p.name}</p>
        <p class="meta">Size ${p.size}</p>
      </div>
      <strong>${fmt(p.price)}</strong>
      <button class="link-btn rm" data-id="${p.id}">Remove</button>
    </li>`).join("");

  const wa = $("#sendWa");
  wa.classList.toggle("disabled", items.length === 0);
  if (items.length) {
    const lines = items.map((p) => `• ${p.name}, size ${p.size} — ${fmt(p.price)}`);
    const msg = `Hello LUXURIA, I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${fmt(total)}`;
    wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  } else {
    wa.removeAttribute("href");
  }
}

$("#lines").addEventListener("click", (e) => {
  const b = e.target.closest(".rm");
  if (b) removeFromCart(b.dataset.id);
});
$("#clearBag").addEventListener("click", () => { cart = []; saveCart(); renderCart(); renderGrid(); });

/* Drawer */
const drawer = $("#drawer"), scrim = $("#scrim");
function openDrawer() {
  drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false;
  $("#closeBag").focus();
}
function closeDrawer() {
  drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
  $("#openBag").focus();
}
$("#openBag").addEventListener("click", openDrawer);
$("#closeBag").addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer(); });

/* Start */
renderChips();
renderGrid();
renderCart();
