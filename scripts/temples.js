// FOOTER: 
const currentYear = new Date().getFullYear();
document.getElementById("currentyear").textContent = currentYear;

document.getElementById("lastModified").textContent =
  "Last Modified: " + document.lastModified;

//HAMBURGER BUTTON:

const mainnav = document.querySelector('.navigation');
const hambutton = document.querySelector('#menu');
 
hambutton.addEventListener('click', () => {
	mainnav.classList.toggle('show');
	hambutton.classList.toggle('show');
});
 
