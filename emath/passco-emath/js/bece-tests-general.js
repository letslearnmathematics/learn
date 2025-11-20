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

    // PASSCO Year Selection Modal
    const passcoLink = document.querySelector('a[href="../../../../passco-jhs"]');
    
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
        "2025": { url: "../../math-jhs/passco/bece-2025", type: "web" },
        "2024": { url: "../../math-jhs/passco/bece-2024", type: "web" },
        "2023": { url: "../../math-jhs/passco/bece-2023", type: "web" },
        "2022": { url: "../../math-jhs/passco/bece-2022", type: "web" },
        "2021": { url: "../../math-jhs/passco/bece-2021", type: "web" },
        "2020": { url: "../../math-jhs/passco/bece-2020", type: "web" },
        "2019": { url: "../../math-jhs/passco/bece-2019", type: "web" },
        "2018": { url: "../../math-jhs/passco/bece-2018", type: "web" },
        "2017": { url: "../../math-jhs/passco/bece-2017", type: "web" },
        "2016": { url: "../../math-jhs/passco/bece-2016", type: "web" },
        "2015": { url: "../../math-jhs/passco/bece-2015", type: "web" },
        "2014": { url: "../../math-jhs/passco/bece-2014", type: "web" },
        "2013": { url: "../../math-jhs/passco/bece-2013", type: "web" },
        "2012": { url: "../../math-jhs/passco/bece-2012", type: "web" },
        "2011": { url: "../../math-jhs/passco/bece-2011", type: "web" },
        "2010": { url: "../../math-jhs/passco/bece-2010", type: "web" },
        "2009": { url: "../../math-jhs/passco/bece-2009", type: "web" },
        "2008": { url: "../../math-jhs/passco/bece-2008", type: "web" },
        "2007": { url: "../../math-jhs/passco/bece-2007", type: "web" },
        "2006": { url: "../../math-jhs/passco/bece-2006", type: "web" },
        "2005": { url: "../../math-jhs/passco/bece-2005", type: "web" },
        "2004": { url: "../../math-jhs/passco/bece-2004", type: "web" },
        "2003": { url: "../../math-jhs/passco/bece-2003", type: "web" },
        "2002 B": { url: "../../math-jhs/passco/bece-2002b", type: "web" },
        "2002 A": { url: "../../math-jhs/passco/bece-2002a", type: "web" },
        "2001": { url: "../../math-jhs/passco/bece-2001", type: "web" },
        "2000": { url: "../../math-jhs/passco/bece-2000", type: "web" },
        "1999": { url: "../../math-jhs/passco/bece-1999", type: "web" },
        "1998": { url: "../../math-jhs/passco/bece-1998", type: "web" },
        "1997": { url: "../../math-jhs/passco/bece-1997", type: "web" },
        "1996": { url: "../../math-jhs/passco/bece-1996", type: "web" },
        "1995": { url: "../../math-jhs/passco/bece-1995", type: "web" },
        "1994": { url: "../../math-jhs/passco/bece-1994", type: "web" },
        "1993": { url: "../../math-jhs/passco/bece-1993", type: "web" },
        "1992": { url: "../../math-jhs/passco/bece-1992", type: "web" },
        "1991": { url: "../../math-jhs/passco/bece-1991", type: "web" },
        "1990": { url: "../../math-jhs/passco/bece-1990", type: "web" }
    };
    
    // Generate year buttons
    const yearGrid = document.querySelector('.year-grid');
    const currentYear = new Date().getFullYear();
    yearGrid.innerHTML = '';
    
    Object.keys(testLinks).sort((a, b) => b - a).forEach(year => {
        const yearBtn = document.createElement('a');
        yearBtn.className = 'year-btn';
        yearBtn.href = testLinks[year].url;
        
        if (parseInt(year) >= currentYear - 5) {
            yearBtn.classList.add('recent');
        }
        
        yearBtn.innerHTML = year;
        
        const formatBadge = document.createElement('span');
        formatBadge.className = `format-badge ${testLinks[year].type}-badge`;
        formatBadge.textContent = testLinks[year].type === 'pdf' ? 'PDF' : 'WEB';
        yearBtn.appendChild(formatBadge);
        
        if (testLinks[year].type === 'pdf') {
            yearBtn.target = '_blank';
            yearBtn.rel = 'noopener noreferrer';
        }
        
        yearGrid.appendChild(yearBtn);
    });
    
    // Modal controls
    const modal = document.getElementById('yearModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (passcoLink) {
        passcoLink.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Update footer year
    document.getElementById('year').textContent = currentYear;
});

// Google Forms Timed Test Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Test Configuration
    const testDuration = 60 * 60; // 60 minutes in seconds
    let timeLeft = testDuration;
    let timerInterval;
    let testStarted = false;

    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const startButton = document.getElementById('start-timed-test');
    const formContainer = document.getElementById('google-form-container');
    const formIframe = document.getElementById('google-form-iframe');
    const testWarning = document.getElementById('test-warning');
    const submitMessage = document.getElementById('form-submit-message');
    
    // Map of year to Google Form IDs
    const formIds = {
        "2024": "1FAIpQLScW_R6p9fvYcpOhQ4e99gnBD6KJoNFjCPBS79ZH_X7tOgZ-Lg",
        "2023": "1FAIpQLScqTZSjnVVUBDgbZDrbLV3K5d21Mh6Qm1LVs8vGZbXwfWdxAw",
        "2022": "1FAIpQLScqTZSjnVVUBDgbZDrbLV3K5d21Mh6Qm1LVs8vGZbXwfWdxAw",
        "2021": "1FAIpQLSf5mLYH88MpPGBDajJ-RWbX4K63zRUhwVQzoFiHwwLzs20SDA",
        "2020": "1FAIpQLSdaNfmydD37GEo6F-Qw_4qWMcjmcREsoFrlgMlJ4GFsnoYiMQ",
        "2019": "1FAIpQLSexS-9vsNxmmu4oQb9ZeE7x0-8koF-QT--VDIdVQEpB9_dHXA",
        "2018": "1FAIpQLSeiceGt-ETfytUsAhAwALsb2mLTf08uAvIy6l4trc8McrhV1g",
        "2017": "1FAIpQLScDnFNWr5bT5YThsvyLzHovHFkuIl6LV4U4wnwoaYZ9MSGrKg",
        "2016": "1FAIpQLScBA_g-bwew5UMf808xvxs0OKmDYIyYfc8X11Nzv3aQOHd-HQ",
        "2015": "1FAIpQLSdpZnqL_8wrsLsmQrKICC6MVCX02RQGykTOzx9cwa4QvQJ2Gg",
        "2014": "1FAIpQLSd7A8dvt_LK5xa8juzyUVNh0aRnOgL5hLJdRYdJFZlxJVV5jQ",
        "2013": "1FAIpQLSccG4gNWfq7AuLfCRdAtgg9l3xGh7xIe9lzeueBiEEAdaNnkg",
        "2012": "1FAIpQLSeFkFu0UWu--h87L1z-5XkN1CJ6A8jhYPOG7xNSSOX9GA4CFg",
        "2011": "1FAIpQLSf9S_V9ndM1yqvTQ712BdTg_dv_8QD7cQwr4Mq76NZ6pDa5mg",
        "2010": "1FAIpQLSed7XjMP93WWU9h8zXA8yL_LzexGZywRUWiCik1Y1mLbbdnFg",
        "2009": "1FAIpQLSfuFV9J0zayRJlGL9GsSSQmD2M9IaGAhdZBp-q2-KAByXgl4A",
        "2008": "1FAIpQLScb6wyDixgtCQj3IZIe3PmFL777Ugv5EuacrZn5C6NbgNV9pA",
        "2007": "1FAIpQLSdojUHiOqMVdjUmREs30z-8gSMTSSG24cRsadr9T-7cXx_x0Q",
        "2006": "1FAIpQLScyBFE8ES2VnL6rYlpIs_A0dvCSMLZmfLR_lM4wNshlKX6H6A",
        "2005": "1FAIpQLSfyc3URSWC-YJWWsaOa6sT3-0tWyufyhbUdusI6vtSyP93F-Q",
        "2004": "1FAIpQLSda5xWgXbHKhQIjyLMDbOSr79I62yE7rvvByRZq80k280Gsog",
        "2003": "1FAIpQLSdOShYqX34Lkmtnkt6EfZzFM2-QS4j-ScVa2ZQ09uYc_XeUzg",
        "2002B": "1FAIpQLSftBdzvjF8jWWm4-1VzIpTX1Q6DYkGIcEM1pLCBHTpt1znQLw",
        "2002A": "1FAIpQLSdqBMpLtfIEiE1gyVVmqQKFGe_EHdbIMkAy6XB8leSMvySMjg",
        "2001": "1FAIpQLSdw0q1_ZQUmNiphzwZUIfB0o1FYsyeOx0Fv7Rvx_rhVWI6pyw",
        "2000": "1FAIpQLSfmVV6iNvw1QRJsJBUHVyWdGykJsgomIJjXwBI7e1r8dQT1tQ",
        "1999": "1FAIpQLSe7_nelGuz2HA9f67LmJlnsz8JvdWloa2mNdbilWOzbFH1O-A",
        "1998": "1FAIpQLSc-rlfiRRzn1-enn_ryBAku1rsfhVnx6Sn731WXDFiiD8s_Yw",
        "1997": "1FAIpQLSdo4o4bBfxrfwJZSCTroVENURZXJQ-1tTUdclDe_syZjq6nFA",
        "1996": "1FAIpQLSeIPiAwxvFWWo4xIE5oBLJfthLNjmd9yN9xRYDK5ZrkPq3Egg",
        "1995": "1FAIpQLSee2Ihz4T_tk_UI6CzsKuKKNkS359gOaVT7SJDyF7M2ROYUfQ",
        "1994": "1FAIpQLScUG8ePsmJr0vB1KUB025cCvajr4__ujlFNq2qpV3WZIzuQuQ",
        "1993": "1FAIpQLScFJbqqWcggJBbEn6naym5Gq7jJjflxkoV2yBqPzaedmc_x5g",
        "1992": "1FAIpQLSeAZbT_VM_4yt1dRXoSgTF3uLy6lLc1giWhA1n3QIvsQJ12lg",
        "1991": "1FAIpQLScPP2oOG5cfZWRnEyLnNIrsMqUTmEjUI3Gg6xvYTsnR9KAnog",
        "1990": "1FAIpQLScbpEmymcXNRegpW08cjyR1ibRfVbp8m8b0JO-BAKN-5sj5uw"
    };
    
    // Function to get current year from URL path
    function getCurrentYearFromUrl() {
        const path = window.location.pathname;
        const yearMatch = path.match(/bece-(\d{4})/);
        return yearMatch ? yearMatch[1] : null;
    }
    
    // Get the appropriate form ID
    const currentYear = getCurrentYearFromUrl() || "2024"; // default to 2024
    const formId = formIds[currentYear];
    
    if (!formId) {
        console.error("No form ID found for year:", currentYear);
        return;
    }
    
    const googleFormUrl = `https://docs.google.com/forms/d/e/${formId}/viewform?embedded=true`;
    
    // Start the test
    startButton.addEventListener('click', function() {
        if (testStarted) return;
        
        testStarted = true;
        startButton.disabled = true;
        testWarning.style.display = 'block';
        formContainer.style.display = 'block';
        submitMessage.style.display = 'block';
        
        // Load the Google Form
        formIframe.src = googleFormUrl;
        
        // Start timer
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimer();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert("Time's up! Please submit your form now.");
            }
        }, 1000);
        
        // Prevent navigation away
        window.addEventListener('beforeunload', function(e) {
            if (testStarted && timeLeft > 0) {
                e.preventDefault();
                e.returnValue = 'You have a test in progress. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    });
    
    // Timer display
    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        const progressPercent = (timeLeft / testDuration) * 100;
        document.querySelector('.progress-fill').style.width = `${progressPercent}%`;
        
        if (timeLeft <= 300) {
            timerDisplay.classList.add('timer-warning');
            testWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Time is running out! Only 5 minutes remaining.';
        }
        if (timeLeft <= 60) {
            timerDisplay.classList.add('timer-critical');
            testWarning.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Hurry! Less than 1 minute remaining!';
        }
    }
});