/* ---------------------------------------------------------
   review.html logic
   1) Reads the submitted form values from the URL query
      string (the form uses method="get") and displays a
      short confirmation summary.
   2) Uses localStorage to keep a running count of how many
      reviews have been completed, incrementing it every
      time this page loads after a successful submission.
   --------------------------------------------------------- */

const REVIEW_COUNT_KEY = "productReviewCount";

function formatDate(isoDate) {
  if (!isoDate) return "Not provided";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${month}/${day}/${year}`;
}

function incrementReviewCount() {
  const current = parseInt(localStorage.getItem(REVIEW_COUNT_KEY), 10) || 0;
  const next = current + 1;
  localStorage.setItem(REVIEW_COUNT_KEY, String(next));
  return next;
}

function renderSummary() {
  const params = new URLSearchParams(window.location.search);

  // Only treat this as a real submission if the required
  // fields are present in the query string.
  const hasSubmission = params.has("product") && params.has("rating") && params.has("installDate");

  const totalCount = hasSubmission ? incrementReviewCount() : (parseInt(localStorage.getItem(REVIEW_COUNT_KEY), 10) || 0);

  const countEl = document.getElementById("review-count");
  if (countEl) countEl.textContent = totalCount;

  const productName = products?.find((p) => p.id === params.get("product"))?.name || params.get("product");

  const summaryData = {
    "Product": productName || "Not provided",
    "Overall Rating": params.has("rating") ? `${params.get("rating")} / 5 stars` : "Not provided",
    "Date of Installation": formatDate(params.get("installDate")),
    "Useful Features": params.getAll("features").length ? params.getAll("features").join(", ") : "None selected",
    "Reviewer": params.get("username") ? params.get("username") : "Anonymous"
  };

  const summaryEl = document.getElementById("summary-list");
  if (summaryEl) {
    summaryEl.innerHTML = "";
    Object.entries(summaryData).forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "summary-row";
      row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
      summaryEl.appendChild(row);
    });
  }

  const heading = document.getElementById("confirm-heading");
  if (heading && !hasSubmission) {
    heading.textContent = "No review received yet";
    const lede = document.getElementById("confirm-lede");
    if (lede) lede.textContent = "Fill out the review form to see your confirmation here.";
  }
}

document.addEventListener("DOMContentLoaded", renderSummary);