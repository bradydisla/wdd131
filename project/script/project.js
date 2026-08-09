/* ==========================================================================
   CoinBest — shared script.js
   Runs on every page; each feature checks for its own DOM hooks before
   doing anything, so one file can safely serve Home, Buy, Sell, and About.
   ========================================================================== */

/* ---------------------------------------------------------------------
   Catalog data — a single source of truth (array of coin objects)
   used by both the Home "new arrivals" strip and the full Buy catalog.
--------------------------------------------------------------------- */
const catalog = [
  { id: "ol-atle", name: "Olympic Commemorative — Athletics", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-63", price: 45, stock: 5, image: "images/coin-atle.jpg" },
  { id: "ol-basket", name: "Olympic Commemorative — Basketball", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-64", price: 42, stock: 4, image: "images/coin-basket.jpg" },
  { id: "ol-cuba", name: "Coin-National Emblem", country: "Cuba", year: 1980, category: "historica", grade: "MS-65", price: 50, stock: 3, image: "images/coin-cuba.jpg" },
  { id: "ol-flag", name: "Olympic Commemorative — Flag", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-62", price: 38, stock: 6, image: "images/coin-flag.jpg" },
  { id: "ol-fut", name: "Olympic Commemorative — Football", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-63", price: 44, stock: 4, image: "images/coin-fut.jpg" },
  { id: "ol-golf", name: "Olympic Commemorative — Golf", country: "Cuba", year: 1980, category: "olimpica", grade: "AU-58", price: 40, stock: 5, image: "images/coin-golf.jpg" },
  { id: "ol-mex", name: "Mexico-68 Commemorative", country: "Mexico", year: 1968, category: "historica", grade: "AU-55", price: 60, stock: 3, image: "images/coin-mex.jpg" },
  { id: "ol-para", name: "Olympic Commemorative — Paralympics", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-64", price: 46, stock: 2, image: "images/coin-para.jpg" },
  { id: "ol-rugby", name: "Olympic Commemorative — Rugby", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-63", price: 43, stock: 3, image: "images/coin-rugby.jpg" },
  { id: "ol-volley", name: "Olympic Commemorative — Volleyball", country: "Brasil", year: 1980, category: "olimpica", grade: "MS-65", price: 48, stock: 4, image: "images/coin-volley.jpg" },
  { id: "hi-1877dr", name: "DR Commemorative Coin, 1877", country: "Dominican Republic", year: 1877, category: "historica", grade: "VF-30", price: 130, stock: 2, image: "images/coin-1877dr.jpg" },
  { id: "hi-1937dr", name: "Silver Coin, 1937", country: "Dominican Republic", year: 1937, category: "historica", grade: "XF-40", price: 95, stock: 3, image: "images/coin-1937dr.jpg" },
];

/* Rare/featured picks shown on the Home page — an array method (filter)
   selecting a subset of the catalog rather than duplicating data. */
function getFeaturedCoins() {
  return catalog.filter((coin) => coin.stock <= 3).slice(0, 3);
}

function formatCurrency(amount) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ---------------------------------------------------------------------
   Cart (localStorage-backed)
--------------------------------------------------------------------- */
const CART_KEY = "coinbest_cart";

function readCart() {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(coinId) {
  const coin = catalog.find((item) => item.id === coinId);
  if (!coin) return;

  const cart = readCart();
  const existing = cart.find((line) => line.id === coinId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: coin.id, name: coin.name, price: coin.price, qty: 1 });
  }

  writeCart(cart);
  refreshCartDisplays();
}

function removeFromCart(coinId) {
  const cart = readCart().filter((line) => line.id !== coinId);
  writeCart(cart);
  refreshCartDisplays();
}

function clearCart() {
  writeCart([]);
  refreshCartDisplays();
}

function cartTotals(cart) {
  return cart.reduce(
    (totals, line) => {
      totals.items += line.qty;
      totals.cost += line.qty * line.price;
      return totals;
    },
    { items: 0, cost: 0 }
  );
}

function refreshCartDisplays() {
  const cart = readCart();
  const totals = cartTotals(cart);

  const cartCountEls = document.querySelectorAll("[data-cart-count]");
  cartCountEls.forEach((el) => {
    el.textContent = `${totals.items}`;
  });

  const cartStrip = document.querySelector("[data-cart-strip]");
  if (cartStrip) {
    if (totals.items === 0) {
      cartStrip.innerHTML = `<span>Your cart is empty — add a coin to request it.</span>`;
    } else {
      const lineItems = cart
        .map((line) => `${line.qty}\u00d7 ${line.name}`)
        .join(", ");
      cartStrip.innerHTML = `
        <span><strong>${totals.items}</strong> item${totals.items === 1 ? "" : "s"} — ${lineItems}</span>
        <span>${formatCurrency(totals.cost)}</span>
        <button type="button" class="btn btn-sm btn-outline cart-clear" data-cart-clear>Clear cart</button>
      `;
      const clearBtn = cartStrip.querySelector("[data-cart-clear]");
      clearBtn.addEventListener("click", clearCart);
    }
  }
}

/* ---------------------------------------------------------------------
   Coin card rendering — used by both Home (featured) and Buy (catalog)
--------------------------------------------------------------------- */
function coinCardMarkup(coin) {
  const stockLabel = coin.stock <= 2 ? "low" : "";
  const stockText =
    coin.stock === 0
      ? "Out of stock"
      : coin.stock <= 2
      ? `Only ${coin.stock} left`
      : `${coin.stock} in stock`;
  const eraLabel = coin.year < 0 ? `${Math.abs(coin.year)} BC` : `${coin.year} AD`;

  return `
    <article class="coin-card" data-coin-id="${coin.id}">
      <div class="slab-window">
        <img src="${coin.image}" alt="${coin.name}, ${coin.country}, graded ${coin.grade}" loading="lazy" width="150" height="150" style="max-width:150px;">
      </div>
      <div class="slab-label">
        <span>CERT ${coin.id.toUpperCase()}</span>
        <span>${coin.grade}</span>
      </div>
      <div class="card-body">
        <h3>${coin.name}</h3>
        <p class="card-meta">${coin.country} &middot; ${eraLabel}</p>
        <p class="card-price">${formatCurrency(coin.price)}</p>
        <p class="stock-flag ${stockLabel}">${stockText}</p>
        <div class="card-actions">
          <button type="button" class="btn btn-primary btn-sm" data-add-to-cart="${coin.id}" ${coin.stock === 0 ? "disabled" : ""}>Add to cart</button>
        </div>
      </div>
    </article>
  `;
}

function renderCoinGrid(container, coins) {
  if (coins.length === 0) {
    container.innerHTML = `<p class="empty-state">No coins match that filter yet — check back soon or try another category.</p>`;
    return;
  }
  container.innerHTML = coins.map((coin) => coinCardMarkup(coin)).join("");
  container.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      addToCart(event.currentTarget.dataset.addToCart);
      const original = event.currentTarget.textContent;
      event.currentTarget.textContent = "Added \u2713";
      setTimeout(() => {
        event.currentTarget.textContent = original;
      }, 1200);
    });
  });
}

function initFeaturedStrip() {
  const container = document.querySelector("[data-featured-grid]");
  if (!container) return;
  renderCoinGrid(container, getFeaturedCoins());
}

function initCatalog() {
  const container = document.querySelector("[data-catalog-grid]");
  if (!container) return;

  const filterBar = document.querySelector("[data-filter-bar]");
  const meta = document.querySelector("[data-catalog-meta]");

  function applyFilter(category) {
    const filtered =
      category === "all" ? catalog : catalog.filter((coin) => coin.category === category);
    renderCoinGrid(container, filtered);
    if (meta) {
      meta.textContent = `Showing ${filtered.length} of ${catalog.length} listings`;
    }
  }

  if (filterBar) {
    filterBar.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        filterBar.querySelectorAll("[data-filter]").forEach((b) => b.setAttribute("aria-pressed", "false"));
        event.currentTarget.setAttribute("aria-pressed", "true");
        applyFilter(event.currentTarget.dataset.filter);
      });
    });
  }

  applyFilter("all");
}

/* ---------------------------------------------------------------------
   Spot price ticker (Home + sticky header) — simulated fluctuation
--------------------------------------------------------------------- */
function initSpotTicker() {
  const ticker = document.querySelector("[data-spot-ticker]");
  if (!ticker) return;

  const metals = [
    { symbol: "XAU", name: "Gold", base: 2380.4 },
    { symbol: "XAG", name: "Silver", base: 28.65 },
    { symbol: "XCU", name: "Copper", base: 0.42 },
  ];

  function renderTicker() {
    const rows = metals.map((metal) => {
      const wobble = (Math.random() - 0.5) * (metal.base * 0.004);
      const price = metal.base + wobble;
      const direction = wobble >= 0 ? "up" : "down";
      const arrow = wobble >= 0 ? "\u25B2" : "\u25BC";
      return `
        <span class="metal">
          <span class="metal-name">${metal.symbol}</span>
          <span>${formatCurrency(price)}</span>
          <span class="metal-delta ${direction}">${arrow} ${Math.abs(wobble).toFixed(2)}</span>
        </span>
      `;
    });
    ticker.innerHTML = `${rows.join("")}<span class="ticker-note">Simulated spot prices, refreshed every few seconds</span>`;
  }

  renderTicker();
  setInterval(renderTicker, 4000);
}

/* ---------------------------------------------------------------------
   Navigation toggle (mobile)
--------------------------------------------------------------------- */
function initNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    toggle.textContent = isOpen ? "Close" : "Menu";
  });
}

/* ---------------------------------------------------------------------
   Sell page — quote calculator + submission history
--------------------------------------------------------------------- */
const QUOTE_KEY = "coinbest_quote_requests";

function estimateQuote({ category, condition, era }) {
  /* Base value by category (object lookup) */
  const categoryBase = {
    olimpica: 45,
    historica: 110,
    otra: 60,
  };

  const conditionMultiplier = {
    poor: 0.5,
    good: 0.8,
    fine: 1,
    "very-fine": 1.3,
    "extremely-fine": 1.7,
    uncirculated: 2.4,
  };

  let base = categoryBase[category] ?? 60;
  const multiplier = conditionMultiplier[condition] ?? 1;

  /* Conditional branching: older eras carry a premium */
  if (era === "pre-1800") {
    base *= 1.6;
  } else if (era === "1800-1900") {
    base *= 1.25;
  } else if (era === "1900-1965") {
    base *= 1.05;
  }

  const low = Math.round(base * multiplier * 0.85);
  const high = Math.round(base * multiplier * 1.15);
  return { low, high };
}

function readQuoteRequests() {
  const raw = localStorage.getItem(QUOTE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeQuoteRequests(list) {
  localStorage.setItem(QUOTE_KEY, JSON.stringify(list));
}

function renderQuoteHistory() {
  const list = document.querySelector("[data-quote-history]");
  if (!list) return;

  const requests = readQuoteRequests();
  if (requests.length === 0) {
    list.innerHTML = `<li>No requests submitted yet on this device.</li>`;
    return;
  }

  list.innerHTML = requests
    .slice()
    .reverse()
    .map(
      (req) => `
        <li>
          <span>${req.coinName} &middot; ${req.condition}</span>
          <span>${formatCurrency(req.low)}&ndash;${formatCurrency(req.high)}</span>
        </li>
      `
    )
    .join("");
}

function initSellForm() {
  const form = document.querySelector("[data-sell-form]");
  if (!form) return;

  const quoteResult = document.querySelector("[data-quote-result]");
  const errorEl = document.querySelector("[data-form-error]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const coinName = formData.get("coinName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const category = formData.get("category")?.toString();
    const condition = formData.get("condition")?.toString();
    const era = formData.get("era")?.toString();

    if (!coinName || !email || !category || !condition || !era) {
      errorEl.textContent = "Please complete every field before requesting a quote.";
      return;
    }
    errorEl.textContent = "";

    const { low, high } = estimateQuote({ category, condition, era });

    if (quoteResult) {
      quoteResult.classList.add("show");
      quoteResult.innerHTML = `
        <p>Estimated buy offer for <strong>${coinName}</strong>:</p>
        <p class="quote-amount">${formatCurrency(low)} &ndash; ${formatCurrency(high)}</p>
        <p>A CoinBest appraiser will confirm this after reviewing your photos, typically within two business days.</p>
      `;
    }

    const requests = readQuoteRequests();
    requests.push({ coinName, condition, low, high, submittedAt: new Date().toISOString() });
    writeQuoteRequests(requests);
    renderQuoteHistory();

    form.reset();
  });
}

/* ---------------------------------------------------------------------
   Init
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initSpotTicker();
  initFeaturedStrip();
  initCatalog();
  initSellForm();
  renderQuoteHistory();
  refreshCartDisplays();
});