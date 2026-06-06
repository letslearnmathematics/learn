document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("yearModal");
    const yearGrid = document.getElementById("yearGrid");
    const closeModal = document.querySelector(".close-modal");

    if (!modal || !yearGrid || !closeModal) {
        console.error("PASSCO modal elements not found.");
        return;
    }

    const testLinks = {
        "2026": "./math-jhs/passco/bece-2026",
        "2025": "./math-jhs/passco/bece-2025",
        "2024": "./math-jhs/passco/bece-2024",
        "2023": "./math-jhs/passco/bece-2023",
        "2022": "./math-jhs/passco/bece-2022",
        "2021": "./math-jhs/passco/bece-2021",
        "2020": "./math-jhs/passco/bece-2020",
        "2019": "./math-jhs/passco/bece-2019",
        "2018": "./math-jhs/passco/bece-2018",
        "2017": "./math-jhs/passco/bece-2017",
        "2016": "./math-jhs/passco/bece-2016",
        "2015": "./math-jhs/passco/bece-2015",
        "2014": "./math-jhs/passco/bece-2014",
        "2013": "./math-jhs/passco/bece-2013",
        "2012": "./math-jhs/passco/bece-2012",
        "2011": "./math-jhs/passco/bece-2011",
        "2010": "./math-jhs/passco/bece-2010",
        "2009": "./math-jhs/passco/bece-2009",
        "2008": "./math-jhs/passco/bece-2008",
        "2007": "./math-jhs/passco/bece-2007",
        "2006": "./math-jhs/passco/bece-2006",
        "2005": "./math-jhs/passco/bece-2005",
        "2004": "./math-jhs/passco/bece-2004",
        "2003": "./math-jhs/passco/bece-2003",
        "2002b": "./math-jhs/passco/bece-2002b",
        "2002a": "./math-jhs/passco/bece-2002a",
        "2001": "./math-jhs/passco/bece-2001",
        "2000": "./math-jhs/passco/bece-2000",
        "1999": "./math-jhs/passco/bece-1999",
        "1998": "./math-jhs/passco/bece-1998",
        "1997": "./math-jhs/passco/bece-1997",
        "1996": "./math-jhs/passco/bece-1996",
        "1995": "./math-jhs/passco/bece-1995",
        "1994": "./math-jhs/passco/bece-1994",
        "1993": "./math-jhs/passco/bece-1993",
        "1992": "./math-jhs/passco/bece-1992",
        "1991": "./math-jhs/passco/bece-1991",
        "1990": "./math-jhs/passco/bece-1990"
    };

    // Generate Year Buttons
    yearGrid.innerHTML = "";

    Object.keys(testLinks)
        .sort((a, b) => parseInt(b) - parseInt(a))
        .forEach(year => {

            const yearBtn = document.createElement("a");

            yearBtn.className = "year-btn";
            yearBtn.href = testLinks[year];
            yearBtn.textContent = year;

            yearGrid.appendChild(yearBtn);
        });

    // Open Modal
    document.querySelectorAll("[data-passco-modal]").forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            // If your CSS uses an active class
            modal.classList.add("active");

            // Fallback
            modal.style.display = "flex";

            document.body.style.overflow = "hidden";
        });

    });

    // Close Modal Button
    closeModal.addEventListener("click", function () {

        modal.classList.remove("active");
        modal.style.display = "none";

        document.body.style.overflow = "auto";
    });

    // Close When Clicking Background
    window.addEventListener("click", function (e) {

        if (e.target === modal) {

            modal.classList.remove("active");
            modal.style.display = "none";

            document.body.style.overflow = "auto";
        }

    });

    // Close With ESC Key
    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            modal.classList.remove("active");
            modal.style.display = "none";

            document.body.style.overflow = "auto";
        }

    });

});