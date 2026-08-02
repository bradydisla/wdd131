/* ---------------------------------------------------------
   Product data source.
   In a real application this would come from an external
   API or database. Here it is hard-coded so the select
   options can be built dynamically in the DOM.
   --------------------------------------------------------- */
const products = [
  { id: "p101", name: "Aurora Robot Vacuum" },
  { id: "p102", name: "Zenith Portable Monitor" },
  { id: "p103", name: "NimbusFit Wireless Earbuds" },
  { id: "p104", name: "SmartLift Standing Desk" },
  { id: "p105", name: "PureAir HEPA Purifier" },
  { id: "p106", name: "Meridian Collector Coin" }
];

/* Build the Product Name <select> options from the array above.
   The array's `name` is used for the visible option text and
   the array's `id` is used for the option's value attribute. */
function populateProductOptions() {
  const select = document.getElementById("product");
  if (!select) return;

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    select.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", populateProductOptions);

/* Fills in the footer's "Last Modification" date on every page
   that includes this script, using the file's own last-modified
   header instead of an inline script block. */
document.addEventListener("DOMContentLoaded", () => {
  const lastModifiedEl = document.getElementById("last-modified");
  if (lastModifiedEl) lastModifiedEl.textContent = document.lastModified;
});