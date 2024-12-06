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

// JavaScript to handle selection changes
const selectElement = document.getElementById('basics');

selectElement.addEventListener('change', function () {
    const selectedValue = this.value;
    if (selectedValue) {
        // Redirect to the selected page
        window.location.href = selectedValue;
    }
});



