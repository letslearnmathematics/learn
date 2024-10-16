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


document.getElementById('basics').addEventListener('change', function() {
    const selectedValue = this.value; // Get the selected value from the select element

    // Get references to the links
    const link1 = document.getElementById('link1');
    const link2 = document.getElementById('link2');
    const link3 = document.getElementById('link3');
    const link4 = document.getElementById('link4');
    const link5 = document.getElementById('link5');
    const link6 = document.getElementById('link6');
    const link7 = document.getElementById('link7');
    const link8 = document.getElementById('link8');
    const link9 = document.getElementById('link9');
    const link10 = document.getElementById('link10');
    const link11 = document.getElementById('link11');
    const link12 = document.getElementById('link12');

    // Based on the selected value, change the href attributes of the links
    if (selectedValue === 'basic4') {
        link1.href = 'pri4s1ss1.html';
        link2.href = 'pri4s1ss2.html';
        link3.href = 'pri4s1ss3.html';
        link4.href = 'pri4s1ss4.html';
        link5.href = 'pri4s2ss1.html';
        link6.href = 'pri4s2ss2.html';
        link7.href = 'pri4s2ss3.html';
        link8.href = 'pri4s3ss1.html';
        link9.href = 'pri4s3ss2.html';
        link10.href = 'pri4s3ss3.html';
        link11.href = 'pri4s4ss1.html';
        link12.href = 'pri4s4ss2.html';
    } else if (selectedValue === 'basic5') {
        link1.href = 'pri5s1ss1.html';
        link2.href = 'pri5s1ss2.html';
        link3.href = 'pri5s1ss3.html';
        link4.href = 'pri5s1ss4.html';
        link5.href = 'pri5s2ss1.html';
        link6.href = 'pri5s2ss2.html';
        link7.href = 'pri5s2ss3.html';
        link8.href = 'pri5s3ss1.html';
        link9.href = 'pri5s3ss2.html';
        link10.href = 'pri5s3ss3.html';
        link11.href = 'pri5s4ss1.html';
        link12.href = 'pri5s4ss2.html';
    } else if (selectedValue === 'basic6') {
        link1.href = 'pri6s1ss1.html';
        link2.href = 'pri6s1ss2.html';
        link3.href = 'pri6s1ss3.html';
        link4.href = 'pri6s1ss4.html';
        link5.href = 'pri6s2ss1.html';
        link6.href = 'pri6s2ss2.html';
        link7.href = 'pri6s2ss3.html';
        link8.href = 'pri6s3ss1.html';
        link9.href = 'pri6s3ss2.html';
        link10.href = 'pri6s3ss3.html';
        link11.href = 'pri6s4ss1.html';
        link12.href = 'pri6s4ss2.html';
    } else {
        // If the default "none" option is selected, reset the links
        
        link1.href = '#';
        link2.href = '#';
        link3.href = '#';
        link4.href = '#';
        link5.href = '#';
        link6.href = '#';
        link7.href = '#';
        link8.href = '#';
        link9.href = '#';
        link10.href = '#';
        link11.href = '#';
        link12.href = '#';
    }
});


