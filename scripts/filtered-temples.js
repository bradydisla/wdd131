// ============================
// TEMPLE DATA
// ============================
const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Salvador Brazil",
    location: "Salvador, Bahia, Brazil",
    dedicated: "2024, October, 20",
    area: 29963,
    imageUrl: "images/salvador-brazil-temple.jpg"
  },
  {
    templeName: "Santo Domingo Dominican Republic",
    location: "Santo Domingo, Dominican Republic",
    dedicated: "2000, September, 17",
    area: 67000,
    imageUrl: "images/santo-domingo-temple.jpg"
  },
  {
    templeName: "Suva Fiji",
    location: "Suva, Fiji",
    dedicated: "2000, June, 18",
    area: 9000,
    imageUrl: "images/suva-fiji-temple.jpg"
  }
];

// ============================
// RENDER TEMPLE CARDS
// ============================
const templeGrid = document.querySelector("#templeGrid");

function renderTemples(templeList) {
  templeGrid.innerHTML = "";

  templeList.forEach((temple) => {
    const figure = document.createElement("figure");
    figure.className = "temple-card";

    figure.innerHTML = `
      <img
        src="${temple.imageUrl}"
        alt="${temple.templeName} Temple"
        loading="lazy"
        width="400"
        height="250"
      />
      <figcaption>
        <h2>${temple.templeName}</h2>
        <p><strong>Location:</strong> ${temple.location}</p>
        <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
        <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
      </figcaption>
    `;

    templeGrid.appendChild(figure);
  });
}

// ============================
// FILTER LOGIC
// ============================
function getDedicatedYear(temple) {
  return parseInt(temple.dedicated.split(",")[0], 10);
}

function filterTemples(filter) {
  switch (filter) {
    case "old":
      return temples.filter((temple) => getDedicatedYear(temple) < 1900);
    case "new":
      return temples.filter((temple) => getDedicatedYear(temple) > 2000);
    case "large":
      return temples.filter((temple) => temple.area > 90000);
    case "small":
      return temples.filter((temple) => temple.area < 10000);
    case "home":
    default:
      return temples;
  }
}

const pageHeading = document.querySelector("#pageHeading");
const filterLinks = document.querySelectorAll("nav a[data-filter]");

const headingText = {
  home: "Home",
  old: "Old",
  new: "New",
  large: "Large",
  small: "Small"
};

filterLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const filter = link.dataset.filter;

    // Update the active nav link styling
    filterLinks.forEach((otherLink) => otherLink.classList.remove("active"));
    link.classList.add("active");

    // Update heading and grid contents
    pageHeading.textContent = headingText[filter];
    renderTemples(filterTemples(filter));

    // Close the mobile menu after a selection
    document.querySelector(".navigation").classList.remove("show");
    document.querySelector("#menu").classList.remove("show");
  });
});

// Initial render: show all temples on page load
renderTemples(temples);

// ============================
// FOOTER
// ============================
const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = currentYear;

document.getElementById("lastModified").textContent =
  "Last Modified: " + document.lastModified;

// ============================
// HAMBURGER BUTTON
// ============================
const mainnav = document.querySelector(".navigation");
const hambutton = document.querySelector("#menu");

hambutton.addEventListener("click", () => {
  mainnav.classList.toggle("show");
  hambutton.classList.toggle("show");
});