document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-list');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active state in sidebar
                if (targetId !== '#') {
                    document.querySelectorAll('.topic-menu a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Solution Toggle
    document.querySelectorAll('.solution-toggle').forEach(button => {
        button.addEventListener('click', function() {
            const solution = this.nextElementSibling;
            const isHidden = solution.style.display === 'none' || !solution.style.display;
            
            solution.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? 'Hide Solution' : 'Show Solution';
        });
    });
    
    // Highlight current section in sidebar
    const sections = document.querySelectorAll('.lesson-section');
    const navLinks = document.querySelectorAll('.topic-menu a');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // MathJax configuration
    MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        }
    };

    // PASSCO Year Selection Modal with actual links
    const passcoLink = document.querySelector('.quick-link[href="../../../passco"]');
    
    // Create modal if it doesn't exist
    if (!document.getElementById('yearModal')) {
        const modal = document.createElement('div');
        modal.id = 'yearModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3><i class="fas fa-file-pdf"></i> Select BECE Year</h3>
                <p>Choose a year to view its past questions:</p>
                <div class="year-grid"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Define your test links by year
    const testLinks = {
        "2024": {
            url: "../../math-jhs/passco/bece-2024",
            type: "web" // can be "web" or "pdf"
        },
        "2023": {
            url: "../../math-jhs/passco/bece-2023",
            type: "web"
        },
        "2022": {
            url: "../../math-jhs/passco/bece-2022",
            type: "web"
        },
        "2021": {
            url: "../../math-jhs/passco/bece-2021",
            type: "web"
        },
        "2020": {
            url: "../../math-jhs/passco/bece-2020",
            type: "web"
        },
        "2019": {
            url: "../../math-jhs/passco/bece-2019",
            type: "web"
        },
        "2018": {
            url: "../../math-jhs/passco/bece-2018",
            type: "web"
        },
        "2017": {
            url: "../../math-jhs/passco/bece-2017",
            type: "web"
        },
        "2016": {
            url: "../../math-jhs/passco/bece-2016",
            type: "web"
        },
        "2015": {
            url: "../../math-jhs/passco/bece-2015",
            type: "web"
        },
        "2014": {
            url: "../../math-jhs/passco/bece-2014",
            type: "web"
        },
        "2013": {
            url: "../../math-jhs/passco/bece-2013",
            type: "web"
        },
        "2012": {
            url: "../../math-jhs/passco/bece-2012",
            type: "web"
        },
        "2011": {
            url: "../../math-jhs/passco/bece-2011",
            type: "web"
        },
        "2010": {
            url: "../../math-jhs/passco/bece-2010",
            type: "web"
        },
        "2009": {
            url: "../../math-jhs/passco/bece-2009",
            type: "web"
        },
        "2008": {
            url: "../../math-jhs/passco/bece-2008",
            type: "web"
        },
        "2007": {
            url: "../../math-jhs/passco/bece-2007",
            type: "web"
        },
        "2006": {
            url: "../../math-jhs/passco/bece-2006",
            type: "web"
        },
        "2005": {
            url: "../../math-jhs/passco/bece-2005",
            type: "web"
        },
        "2004": {
            url: "../../math-jhs/passco/bece-2004",
            type: "web"
        },
        "2003": {
            url: "../../math-jhs/passco/bece-2003",
            type: "web"
        },
        "2002": {
            url: "../../math-jhs/passco/bece-2002",
            type: "web"
        },
        "2001": {
            url: "../../math-jhs/passco/bece-2001",
            type: "web"
        },
        "2000": {
            url: "../../math-jhs/passco/bece-2000",
            type: "web"
        },
        "1999": {
            url: "../../math-jhs/passco/bece-1999",
            type: "web"
        },
        "1998": {
            url: "../../math-jhs/passco/bece-1998",
            type: "web"
        },
        "1997": {
            url: "../../math-jhs/passco/bece-1997",
            type: "web"
        },
        "1996": {
            url: "../../math-jhs/passco/bece-1996",
            type: "web"
        },
        "1995": {
            url: "../../math-jhs/passco/bece-1995",
            type: "web"
        },
        "1994": {
            url: "../../math-jhs/passco/bece-1994",
            type: "web"
        },
        "1993": {
            url: "../../math-jhs/passco/bece-1993",
            type: "web"
        },
        "1992": {
            url: "../../math-jhs/passco/bece-1992",
            type: "web"
        },
        "1991": {
            url: "../../math-jhs/passco/bece-1991",
            type: "web"
        },
        "1990": {
            url: "../../math-jhs/passco/bece-1990",
            type: "web"
        }
        // Add more years as needed
        // For PDF files:
        /*"2018": {
            url: "../../pdfs/bece-2018.pdf",
            type: "pdf"
        },*/
        // Add older years...
    };
    
    // Generate year buttons
    const yearGrid = document.querySelector('.year-grid');
    const currentYear = new Date().getFullYear();
    
    // Clear existing buttons
    yearGrid.innerHTML = '';
    
    // Create buttons for each available year
    Object.keys(testLinks).sort((a, b) => b - a).forEach(year => {
        const yearBtn = document.createElement('a');
        yearBtn.className = 'year-btn';
        yearBtn.href = testLinks[year].url;
        
        // Mark recent years (last 5 years)
        if (parseInt(year) >= currentYear - 5) {
            yearBtn.classList.add('recent');
        }
        
        yearBtn.innerHTML = year;
        
        // Add badge for format
        const formatBadge = document.createElement('span');
        formatBadge.className = `format-badge ${testLinks[year].type}-badge`;
        formatBadge.textContent = testLinks[year].type === 'pdf' ? 'PDF' : 'WEB';
        yearBtn.appendChild(formatBadge);
        
        // Open PDFs in new tab
        if (testLinks[year].type === 'pdf') {
            yearBtn.target = '_blank';
            yearBtn.rel = 'noopener noreferrer';
        }
        
        yearGrid.appendChild(yearBtn);
    });
    
    // Modal controls
    const modal = document.getElementById('yearModal');
    const closeModal = document.querySelector('.close-modal');
    
    // When user clicks PASSCO link, show modal instead of navigating
    if (passcoLink) {
        passcoLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        });
    }
    
    // When user clicks close button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    }
    
    // When user clicks anywhere outside modal, close it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Update footer year
    document.getElementById('year').textContent = currentYear;
});