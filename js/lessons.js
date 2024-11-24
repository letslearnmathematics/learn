/*---------This is for the hamburger menu-----------*/
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
})

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}))


document.addEventListener("DOMContentLoaded", () => {
    const accordions = document.querySelectorAll(".accordion");

    accordions.forEach((accordion) => {
        accordion.addEventListener("click", () => {
            const panel = accordion.nextElementSibling;
            const isOpen = panel.style.display === "block";
            
            panel.style.display = isOpen ? "none" : "block";
            accordion.textContent = isOpen ? "Show Solution" : "Hide Solution";
        });
    });
});
