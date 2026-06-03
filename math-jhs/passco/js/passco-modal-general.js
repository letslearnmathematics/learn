document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("yearModal");
    const yearGrid = document.getElementById("yearGrid");
    const closeModal = document.querySelector(".close-modal");
    const examToggleBtns = document.querySelectorAll(".exam-toggle-btn");
    const modalEyebrow = document.getElementById("modalEyebrow");

    if (!modal || !yearGrid || !closeModal) {
        console.error("PASSCO modal elements not found.");
        return;
    }

    // State management tracking which exam path is selected
    let currentExamType = "bece"; 

    // Configuration map for paths and available years
    const examConfigs = {
        bece: {
            eyebrowText: "JHS Mathematics",
            basePath: "../passco/bece-",
            // Array containing special alpha-numeric keys directly
            years: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", 
                    "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", 
                    "2006", "2005", "2004", "2003", "2002b", "2002a", "2001", "2000", "1999", "1998", 
                    "1997", "1996", "1995", "1994", "1993", "1992", "1991", "1990"]
        },
        /*
        wassce: {
            eyebrowText: "SHS Core Mathematics",
            basePath: "../emath/passco-emath/emath-", // Adjust tracking root paths as preferred
            // Populate years currently built or building in the background
            years: ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", 
                    "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", 
                    "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", 
                    "1997", "1996", "1995", "1994", "1993"]
        },*/
        wassceAdd: {
            eyebrowText: "SHS Additional Mathematics",
            basePath: "../../emath/passco-emath/emath-", // Adjust tracking root paths as preferred
            // Populate years currently built or building in the background
            years: [/*"2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", 
                    "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", 
                    "2006", "2005", "2004", "2003", "2002", "2001", "2000", "1999", "1998", 
                    "1997", "1996", "1995", "1994",*/ "1993"]
        }
    };

    // Generate Dynamic Year Buttons based on active configs
    function renderYearGrid() {
        yearGrid.innerHTML = "";
        const activeConfig = examConfigs[currentExamType];
        
        // Update browser modal context dynamically
        modalEyebrow.textContent = activeConfig.eyebrowText;

        activeConfig.years
            .sort((a, b) => parseInt(b) - parseInt(a)) // Sort numeric values descending
            .forEach(year => {
                const yearBtn = document.createElement("a");
                yearBtn.className = "year-btn";
                
                // Produces e.g., ./math-jhs/passco/bece-2026 or ./coremath/passco/wassce-2026
                yearBtn.href = `${activeConfig.basePath}${year}`;
                yearBtn.textContent = year;

                yearGrid.appendChild(yearBtn);
            });
    }

    // Toggle click listeners handling configuration switches
    examToggleBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            if (this.classList.contains("active")) return;

            examToggleBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            currentExamType = this.getAttribute("data-exam-type");
            renderYearGrid();
        });
    });

    // Initial load setup 
    renderYearGrid();

    /* ================= Modal Controls ================= */
    // Open Modal
    document.querySelectorAll("[data-passco-modal]").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            modal.classList.add("active");
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        });
    });

    // Universal helper function to clean up visibility changes
    function closeModalWindow() {
        modal.classList.remove("active");
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    closeModal.addEventListener("click", closeModalWindow);
    
    window.addEventListener("click", function (e) {
        if (e.target === modal) closeModalWindow();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModalWindow();
    });
});