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



// Fix local .html links when opening files directly
if (window.location.protocol === 'file:') {
    document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('a[href]:not([href^="http"])');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href.includes('.') && !href.endsWith('/')) {
                link.href = href + '.html';  // Add .html locally
            }
        });
    });
}