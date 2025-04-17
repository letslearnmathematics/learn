// emath.js - Elective Mathematics Page Functionality
document.addEventListener("DOMContentLoaded", function() {
    // ========== TAB SYSTEM FUNCTIONALITY ==========
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Show first tab by default
    if (tabContents.length > 0) {
        tabContents[0].style.display = 'block';
        tabButtons[0].classList.add('active');
    }

    // Tab switching function
    function openClass(evt, classId) {
        // Hide all tab content
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Remove active class from all buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Show the current tab and mark button as active
        document.getElementById(classId).style.display = 'block';
        evt.currentTarget.classList.add('active');

        // Save the active tab to localStorage
        localStorage.setItem('lastActiveTab', classId);
    }

    // Add click event to all tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const classId = this.textContent.toLowerCase().replace(' ', '');
            openClass(e, classId);
        });
    });

    // Check for saved tab preference
    const lastActiveTab = localStorage.getItem('lastActiveTab');
    if (lastActiveTab) {
        const tabToActivate = document.getElementById(lastActiveTab);
        const buttonToActivate = Array.from(tabButtons).find(button => 
            button.textContent.toLowerCase().replace(' ', '') === lastActiveTab
        );
        
        if (tabToActivate && buttonToActivate) {
            tabContents.forEach(content => content.style.display = 'none');
            tabButtons.forEach(button => button.classList.remove('active'));
            
            tabToActivate.style.display = 'block';
            buttonToActivate.classList.add('active');
        }
    }

    // ========== PROGRESS TRACKING SYSTEM ==========
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-tracker p');
    
    // Load progress from localStorage or initialize
    function loadProgress() {
        const savedProgress = localStorage.getItem('emathProgress') || '0';
        const progressPercentage = Math.min(Math.max(parseInt(savedProgress), 0), 100);
        
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `${progressPercentage}% of SHS 1 completed`;
        
        return progressPercentage;
    }
    
    // Initialize progress
    let userProgress = loadProgress();
    
    // Simulate progress update (in a real app, this would come from user activity)
    function simulateProgressUpdate() {
        // This is just for demonstration - replace with actual progress tracking
        const randomIncrement = Math.floor(Math.random() * 5) + 1;
        userProgress = Math.min(userProgress + randomIncrement, 100);
        
        progressBar.style.width = `${userProgress}%`;
        progressText.textContent = `${userProgress}% of SHS 1 completed`;
        localStorage.setItem('emathProgress', userProgress.toString());
        
        // Visual feedback
        progressBar.style.transition = 'width 0.5s ease';
        setTimeout(() => {
            progressBar.style.transition = '';
        }, 500);
        
        // Check if completed
        if (userProgress === 100) {
            progressText.innerHTML += ' <span class="congrats">🎉 Congratulations!</span>';
        }
    }
    
    // For demo purposes - attach to topic links
    document.querySelectorAll('.topic-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!this.classList.contains('disabled')) {
                e.preventDefault();
                simulateProgressUpdate();
                
                // Show loading feedback
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                // Simulate loading delay
                setTimeout(() => {
                    this.innerHTML = originalText;
                    window.location.href = this.getAttribute('href');
                }, 1000);
            }
        });
    });

    // ========== QUICK NAVIGATION ==========
    const quickLinks = document.querySelectorAll('.quick-links a');
    
    quickLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Highlight the section temporarily
                targetElement.style.boxShadow = '0 0 0 2px ' + getComputedStyle(document.documentElement)
                    .getPropertyValue('--emath-accent');
                
                setTimeout(() => {
                    targetElement.style.boxShadow = 'none';
                }, 2000);
            }
        });
    });

    // ========== TOPIC SEARCH FUNCTIONALITY ==========
    const searchBox = document.createElement('div');
    searchBox.className = 'search-box';
    searchBox.innerHTML = `
        <input type="text" placeholder="Search topics..." class="search-input">
        <button class="search-button"><i class="fas fa-search"></i></button>
    `;
    
    // Insert search box after the subject intro
    const subjectIntro = document.querySelector('.subject-intro');
    if (subjectIntro) {
        subjectIntro.insertAdjacentElement('afterend', searchBox);
        
        const searchInput = searchBox.querySelector('.search-input');
        const searchButton = searchBox.querySelector('.search-button');
        
        function performSearch() {
            const searchTerm = searchInput.value.toLowerCase();
            const topicCards = document.querySelectorAll('.topic-card');
            let foundResults = false;
            
            topicCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                    foundResults = true;
                    
                    // Highlight matching text
                    const titleElement = card.querySelector('h3');
                    const descElement = card.querySelector('p');
                    
                    highlightText(titleElement, searchTerm);
                    highlightText(descElement, searchTerm);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show message if no results
            const resultsMessage = document.querySelector('.results-message');
            if (!foundResults) {
                if (!resultsMessage) {
                    const message = document.createElement('p');
                    message.className = 'results-message';
                    message.textContent = 'No matching topics found.';
                    searchBox.insertAdjacentElement('afterend', message);
                }
            } else if (resultsMessage) {
                resultsMessage.remove();
            }
        }
        
        function highlightText(element, term) {
            if (!term) return;
            
            const text = element.textContent;
            const highlightedText = text.replace(new RegExp(term, 'gi'), 
                match => `<span class="highlight">${match}</span>`);
            
            element.innerHTML = highlightedText;
        }
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // ========== PRINTABLE MATERIALS ==========
    const printButtons = document.createElement('div');
    printButtons.className = 'print-actions';
    printButtons.innerHTML = `
        <button class="print-button"><i class="fas fa-print"></i> Print This Page</button>
        <button class="print-topic-button"><i class="fas fa-file-pdf"></i> PDF Version</button>
    `;
    
    /*// Insert print buttons before the footer
    const mainContent = document.querySelector('.page-narative');
    if (mainContent) {
        mainContent.insertAdjacentElement('beforeend', printButtons);
        
        document.querySelector('.print-button').addEventListener('click', function() {
            window.print();
        });
        
        document.querySelector('.print-topic-button').addEventListener('click', function() {
            alert('PDF generation would be implemented with a proper library or backend service');
            // In a real implementation, this would generate a PDF version
        });
    }*/
});

// ========== ANIMATIONS ==========
// Add subtle animations when elements come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.topic-card, .resource-card, .exam-card').forEach(card => {
    observer.observe(card);
});