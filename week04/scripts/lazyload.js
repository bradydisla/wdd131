// Add the "loaded" class to each image once it actually finishes loading.
// Combined with native loading="lazy", this means the fade-from-black
// animation plays right as an image comes into view and finishes downloading.
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("main img");

  images.forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => {
        img.classList.add("loaded");
      });
    }
  });

  document.querySelector("#lastModified").textContent = document.lastModified;
});