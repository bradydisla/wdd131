// ======================================
// Footer
// ======================================

document.getElementById("year").textContent =
  new Date().getFullYear();

document.getElementById("last-modified").textContent =
  document.lastModified;

// ======================================
// Weather - Wind Chill Calculation
// ======================================

const temperature = 27; // °C
const windSpeed = 15; // km/h

function calculateWindChill(temp, speed) {
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(speed, 0.16) +
    0.3965 * temp * Math.pow(speed, 0.16)
  ).toFixed(1);
}

const windChillElement = document.getElementById("wind-chill");

if (temperature <= 10 && windSpeed > 4.8) {
  windChillElement.textContent =
    `${calculateWindChill(temperature, windSpeed)} °C`;
} else {
  windChillElement.textContent = "N/A";
}