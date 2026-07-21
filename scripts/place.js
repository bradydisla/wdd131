// ======================================
// Footer
// ======================================

document.getElementById("year").textContent = new Date().getFullYear();

document.getElementById("last-modified").textContent = document.lastModified;

// ======================================
// Weather - Wind Chill Calculation
// ======================================

// Get values from the HTML
const temperature = Number(
  document.getElementById("temperature").textContent
);

const windSpeed = Number(
  document.getElementById("wind-speed").textContent
);

const windChillElement = document.getElementById("wind-chill");

// Calculate Wind Chill (Metric Formula)
function calculateWindChill(temp, speed) { return (13.12 + 0.6215 * temp - 11.37 * Math.pow(speed, 0.16) + 0.3965 * temp * Math.pow(speed, 0.16)).toFixed(1); }

// Display result only if the official conditions are met
if (temperature <= 10 && windSpeed > 4.8) {
  windChillElement.textContent = `${calculateWindChill(
    temperature,
    windSpeed
  )} °C`;
} else {
  windChillElement.textContent = "N/A";
}