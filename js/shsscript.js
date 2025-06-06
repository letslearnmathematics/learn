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
    if (selectedValue === 'shs1') {
        link1.href = 'shs1s1ss1.html';
        link2.href = 'shs1s1ss2.html';
        link3.href = 'shs1s1ss3.html';
        link4.href = 'shs1s1ss4.html';
        link5.href = 'shs1s2ss1.html';
        link6.href = 'shs1s2ss2.html';
        link7.href = 'shs1s2ss3.html';
        link8.href = 'shs1s3ss1.html';
        link9.href = 'shs1s3ss2.html';
        link10.href = 'shs1s3ss3.html';
        link11.href = 'shs1s4ss1.html';
        link12.href = 'shs1s4ss2.html';
    } else if (selectedValue === 'shs2') {
        link1.href = 'shs2s1ss1.html';
        link2.href = 'shs2s1ss2.html';
        link3.href = 'shs2s1ss3.html';
        link4.href = 'shs2s1ss4.html';
        link5.href = 'shs2s2ss1.html';
        link6.href = 'shs2s2ss2.html';
        link7.href = 'shs2s2ss3.html';
        link8.href = 'shs2s3ss1.html';
        link9.href = 'shs2s3ss2.html';
        link10.href = 'shs2s3ss3.html';
        link11.href = 'shs2s4ss1.html';
        link12.href = 'shs2s4ss2.html';
    } else if (selectedValue === 'shs3') {
        link1.href = 'shs3s1ss1.html';
        link2.href = 'shs3s1ss2.html';
        link3.href = 'shs3s1ss3.html';
        link4.href = 'shs3s1ss4.html';
        link5.href = 'shs3s2ss1.html';
        link6.href = 'shs3s2ss2.html';
        link7.href = 'shs3s2ss3.html';
        link8.href = 'shs3s3ss1.html';
        link9.href = 'shs3s3ss2.html';
        link10.href = 'shs3s3ss3.html';
        link11.href = 'shs3s4ss1.html';
        link12.href = 'shs3s4ss2.html';
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


